using Microsoft.AspNetCore.Mvc;
using ProyectoWebAgro.Models;
using Microsoft.EntityFrameworkCore;
using ProyectoWebAgro.Data;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
using System.Net.Mail;

namespace ProyectoWebAgro.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest(new { message = "El email ya está registrado." });

            user.CreatedDate = DateTime.UtcNow;
            user.LastUpdatedDate = DateTime.UtcNow;
            user.IsVerified = false;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateVerificationToken(user.Email);

            SendVerificationEmail(user.Email, token);

            return Ok(new { message = "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico." });
        }

        private string GenerateVerificationToken(string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SendVerificationEmail(string email, string token)
        {
            var verificationLink = $"https://tuapp.com/verify?token={token}";
            var subject = "Verifica tu email";
            var body = $"Haz clic en el siguiente enlace para verificar tu email: <a href='{verificationLink}'>Verificar Email</a>";

            var smtp = new SmtpClient
            {
                Host = _configuration["EmailSettings:SmtpServer"],
                Port = int.Parse(_configuration["EmailSettings:Port"]),
                EnableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]),
                Credentials = new NetworkCredential(_configuration["EmailSettings:FromEmail"], _configuration["EmailSettings:Password"])
            };

            var message = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:FromEmail"], "Soporte AgroByte"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(email);
            smtp.Send(message);
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            var principal = ValidateVerificationToken(token);
            if (principal == null)
                return BadRequest(new { message = "Token inválido o expirado." });

            var email = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound(new { message = "Usuario no encontrado." });

            user.IsVerified = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tu cuenta ha sido verificada exitosamente." });
        }

        private ClaimsPrincipal ValidateVerificationToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);

                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                return tokenHandler.ValidateToken(token, parameters, out _);
            }
            catch
            {
                return null;
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] JsonElement loginData)
        {
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
            if (user == null || passwordHash != user.PasswordHash)
            {
                return Unauthorized(new { message = "Credenciales incorrectas." });
            }

            if (!user.IsVerified)
            {
                return Unauthorized(new { message = "Por favor, verifica tu email antes de iniciar sesión." });
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
