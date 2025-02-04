using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ProyectoWebAgro.Models
{
    public class User
    {

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "The first name is required.")]
        [MaxLength(24, ErrorMessage = "The name cannot exceed 24 characters.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "The last name is required.")]
        [MaxLength(24, ErrorMessage = "The last name cannot exceed 24 characters.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "The email is required.")]
        [EmailAddress(ErrorMessage = "The email format is invalid.")]
        [MaxLength (64, ErrorMessage = "The email cannot exceed 64 characters.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "The password is required.")]
        public string PasswordHash { get; set; }

        [Phone(ErrorMessage = "The phone number format is invalid.")]
        [MaxLength(15, ErrorMessage = "The phone number cannot exceed 15 characters.")]
        public string Phone { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime LastUpdatedDate { get; set; } = DateTime.UtcNow;

    }
}
