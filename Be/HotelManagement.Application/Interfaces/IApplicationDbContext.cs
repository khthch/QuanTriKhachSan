using HotelManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace HotelManagement.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Role> Roles { get; }
        DbSet<Permission> Permissions { get; }
        DbSet<RolePermission> RolePermissions { get; }
        DbSet<User> Users { get; }
        DbSet<AuditLog> AuditLogs { get; }

        DbSet<RoomType> RoomTypes { get; }
        DbSet<Room> Rooms { get; }
        DbSet<Amenity> Amenities { get; }
        DbSet<RoomTypeAmenity> RoomTypeAmenities { get; }
        DbSet<RoomImage> RoomImages { get; }
        DbSet<RoomInventory> RoomInventory { get; }

        DbSet<Voucher> Vouchers { get; }
        DbSet<Booking> Bookings { get; }
        DbSet<BookingDetail> BookingDetails { get; }
        DbSet<BookingHold> BookingHolds { get; }
        DbSet<Membership> Memberships { get; }

        DbSet<ServiceCategory> ServiceCategories { get; }
        DbSet<Service> Services { get; }
        DbSet<OrderService> OrderServices { get; }
        DbSet<OrderServiceDetail> OrderServiceDetails { get; }
        DbSet<LossAndDamage> LossAndDamages { get; }

        DbSet<Invoice> Invoices { get; }
        DbSet<Payment> Payments { get; }
        DbSet<Review> Reviews { get; }

        DbSet<ArticleCategory> ArticleCategories { get; }
        DbSet<Article> Articles { get; }
        DbSet<Attraction> Attractions { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
