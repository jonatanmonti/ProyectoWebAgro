using System.ComponentModel.DataAnnotations;

namespace ProyectoWebAgro.Models
{
    public class AgriculturalProduct
    {

        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public decimal PricePerTon { get; set; }

        [Required]
        public int AvailableStock { get; set; }

        [Required, MaxLength(50)]
        public string Category { get; set; }

        public string ImageUrl { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    }
}
