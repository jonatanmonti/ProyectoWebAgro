using Microsoft.AspNetCore.Mvc;
using ProyectoWebAgro.Models;
using Microsoft.EntityFrameworkCore;
using ProyectoWebAgro.Data;
using System.Text.Json;

namespace ProyectoWebAgro.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // --- REGISTRO DE USUARIO ---
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest(new { message = "El email ya está registrado." });

            // La contraseña ya viene hasheada desde el frontend, no es necesario volver a encriptarla
            user.CreatedDate = DateTime.UtcNow;
            user.LastUpdatedDate = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado exitosamente." });
        }

        // --- INICIO DE SESIÓN ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] JsonElement loginData)
        {
            // Verificar que el JSON recibido tiene los campos requeridos
            if (!loginData.TryGetProperty("email", out JsonElement emailElement) ||
                !loginData.TryGetProperty("passwordHash", out JsonElement passwordElement))
            {
                return BadRequest(new { message = "El email y la contraseña son obligatorios." });
            }

            string email = emailElement.GetString() ?? string.Empty;
            string passwordHash = passwordElement.GetString() ?? string.Empty;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(passwordHash))
            {
                return BadRequest(new { message = "El email y la contraseña son obligatorios." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || passwordHash != user.PasswordHash) // Comparar directamente los hashes
            {
                return Unauthorized(new { message = "Credenciales incorrectas." });
            }

            return Ok(new
            {
                message = "Inicio de sesión exitoso.",
                userId = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email
            });
        }
    }
}
