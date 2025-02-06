using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using ProyectoWebAgro.Data;
using Microsoft.EntityFrameworkCore;

namespace ProyectoWebAgro.Services
{
    public class UnverifiedUserCleanupService : BackgroundService
    {

        private readonly IServiceScopeFactory _scopeFactory;

        public UnverifiedUserCleanupService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var expirationTime = DateTime.UtcNow.AddMinutes(-1);
                    var expiredUsers = await context.Users
                        .Where(u => !u.IsVerified && u.CreatedDate < expirationTime)
                        .ToListAsync();

                    if (expiredUsers.Any())
                    {
                        context.Users.RemoveRange(expiredUsers);
                        await context.SaveChangesAsync();
                        Console.WriteLine($"🚀 Eliminados {expiredUsers.Count} usuarios no verificados.");
                    }
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

    }
}
