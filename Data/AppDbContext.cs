using Microsoft.EntityFrameworkCore;
using ProyectoWebAgro.Models;

namespace ProyectoWebAgro.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<AgriculturalProduct> AgriculturalProducts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();
        }

        public static void Initialize(AppDbContext context)
        {
            if (!context.AgriculturalProducts.Any())
            {
                context.AgriculturalProducts.AddRange(
                    new AgriculturalProduct { Name = "soy", Description = "legumes", PricePerTon = 300, AvailableStock = 50, Category = "legumes", ImageUrl = "/assets/Items/soja.jpg" },
                    new AgriculturalProduct { Name = "potato", Description = "legumes", PricePerTon = 300, AvailableStock = 50, Category = "legumes", ImageUrl = "/assets/Items/papa.jpg" },
                    new AgriculturalProduct { Name = "Corn", Description = "Premium corn", PricePerTon = 250, AvailableStock = 40, Category = "Cereals", ImageUrl = "/assets/Items/maiz.jpg" }
                );
                context.SaveChanges();
            }
        }
    }
}
