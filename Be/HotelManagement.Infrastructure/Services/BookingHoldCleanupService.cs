using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotelManagement.Domain.Entities;
using HotelManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HotelManagement.Infrastructure.Services
{
    public class BookingHoldCleanupService : BackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromMinutes(1);
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BookingHoldCleanupService> _logger;

        public BookingHoldCleanupService(IServiceScopeFactory scopeFactory, ILogger<BookingHoldCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var now = DateTime.UtcNow;

                    var expiredHolds = await db.BookingHolds
                        .Where(h => h.Status == BookingHoldStatus.Active && h.ExpiresAt <= now)
                        .ToListAsync(stoppingToken);

                    if (expiredHolds.Count > 0)
                    {
                        foreach (var hold in expiredHolds)
                        {
                            hold.Status = BookingHoldStatus.Expired;
                            hold.UpdatedAt = now;
                        }

                        await db.SaveChangesAsync(stoppingToken);
                        _logger.LogInformation("Expired {Count} booking holds", expiredHolds.Count);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Booking hold cleanup failed");
                }

                await Task.Delay(Interval, stoppingToken);
            }
        }
    }
}
