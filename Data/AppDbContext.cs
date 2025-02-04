using Microsoft.EntityFrameworkCore;
using ProyectoWebAgro.Models;

namespace ProyectoWebAgro.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();
        }
    }
}
