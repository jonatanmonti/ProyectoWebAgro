using Microsoft.AspNetCore.Mvc;
using ProyectoWebAgro.Data;
using ProyectoWebAgro.Models;
using Microsoft.EntityFrameworkCore;

namespace ProyectoWebAgro.Controllers
{
    [Route("api/products")]
    [ApiController]
       
    public class ProductsController : ControllerBase  
    {   
        private readonly AppDbContext _context;
   
        public ProductsController(AppDbContext context)
           
        {
              
            _context = context;
          
        }
        [HttpGet]  
        public async Task<ActionResult<IEnumerable<AgriculturalProduct>>> GetProducts()  
        {
          
            return await _context.AgriculturalProducts.ToListAsync();
         
        }

        [HttpPut("{id}/updateStock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockRequest request)
        {
            var product = await _context.AgriculturalProducts.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            if (request == null || request.AvailableStock < 0)
            {
                return BadRequest(new { message = "Invalid request: availableStock is required and must be positive." });
            }

            product.AvailableStock = request.AvailableStock;
            product.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stock updated successfully", newStock = product.AvailableStock });
        }

    }
}
