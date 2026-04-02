using HotelManagement.Application.Interfaces;
using HotelManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<RolePermission> RolePermissions { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        public DbSet<RoomType> RoomTypes { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Amenity> Amenities { get; set; } = null!;
        public DbSet<RoomTypeAmenity> RoomTypeAmenities { get; set; } = null!;
        public DbSet<RoomImage> RoomImages { get; set; } = null!;
        public DbSet<RoomInventory> RoomInventory { get; set; } = null!;

        public DbSet<Voucher> Vouchers { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<BookingDetail> BookingDetails { get; set; } = null!;
        public DbSet<BookingHold> BookingHolds { get; set; } = null!;
        public DbSet<Membership> Memberships { get; set; } = null!;

        public DbSet<ServiceCategory> ServiceCategories { get; set; } = null!;
        public DbSet<Service> Services { get; set; } = null!;
        public DbSet<OrderService> OrderServices { get; set; } = null!;
        public DbSet<OrderServiceDetail> OrderServiceDetails { get; set; } = null!;
        public DbSet<LossAndDamage> LossAndDamages { get; set; } = null!;

        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;

        public DbSet<ArticleCategory> ArticleCategories { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public DbSet<Attraction> Attractions { get; set; } = null!;

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Voucher>().HasIndex(v => v.Code).IsUnique();
            modelBuilder.Entity<Room>().HasIndex(r => r.RoomNumber).IsUnique();
            modelBuilder.Entity<Room>().Property(r => r.Status).HasConversion<string>();
            modelBuilder.Entity<BookingHold>().Property(h => h.Status).HasConversion<string>();
            modelBuilder.Entity<RoomType>().HasIndex(rt => rt.Slug).IsUnique();
            modelBuilder.Entity<ArticleCategory>().HasIndex(ac => ac.Slug).IsUnique();
            modelBuilder.Entity<BookingHold>().HasIndex(h => h.ExpiresAt);
            modelBuilder.Entity<BookingHold>().HasIndex(h => new { h.RoomTypeId, h.CheckInDate, h.CheckOutDate, h.Status });

            modelBuilder.Entity<Attraction>().Property(x => x.DistanceKm).HasPrecision(10, 2);
            modelBuilder.Entity<Booking>().Property(x => x.TotalEstimatedAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Booking>().Property(x => x.DepositAmount).HasPrecision(18, 2);
            modelBuilder.Entity<BookingDetail>().Property(x => x.PricePerNight).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.TotalRoomAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.TotalServiceAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.TotalDamageAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(x => x.FinalTotal).HasPrecision(18, 2);
            modelBuilder.Entity<LossAndDamage>().Property(x => x.FineAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Membership>().Property(x => x.DiscountPercent).HasPrecision(5, 2);
            modelBuilder.Entity<OrderServiceDetail>().Property(x => x.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<Payment>().Property(x => x.AmountPaid).HasPrecision(18, 2);
            modelBuilder.Entity<RoomInventory>().Property(x => x.PriceIfLost).HasPrecision(18, 2);
            modelBuilder.Entity<RoomType>().Property(x => x.BasePrice).HasPrecision(18, 2);
            modelBuilder.Entity<Service>().Property(x => x.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Voucher>().Property(x => x.DiscountValue).HasPrecision(18, 2);
            modelBuilder.Entity<Voucher>().Property(x => x.MinBookingValue).HasPrecision(18, 2);

            modelBuilder.Entity<RolePermission>().HasOne(rp => rp.Role).WithMany(r => r.RolePermissions).HasForeignKey(rp => rp.RoleId);
            modelBuilder.Entity<RolePermission>().HasOne(rp => rp.Permission).WithMany(p => p.RolePermissions).HasForeignKey(rp => rp.PermissionId);
            modelBuilder.Entity<RoomTypeAmenity>().HasOne(rta => rta.RoomType).WithMany(rt => rt.RoomTypeAmenities).HasForeignKey(rta => rta.RoomTypeId);
            modelBuilder.Entity<RoomTypeAmenity>().HasOne(rta => rta.Amenity).WithMany(a => a.RoomTypeAmenities).HasForeignKey(rta => rta.AmenityId);

            modelBuilder.Entity<Room>().HasOne(r => r.RoomType).WithMany(rt => rt.Rooms).HasForeignKey(r => r.RoomTypeId);
            modelBuilder.Entity<RoomInventory>().HasOne(ri => ri.Room).WithMany(r => r.RoomInventory).HasForeignKey(ri => ri.RoomId);

            modelBuilder.Entity<Booking>().HasOne(b => b.User).WithMany(u => u.Bookings).HasForeignKey(b => b.UserId);
            modelBuilder.Entity<Booking>().HasOne(b => b.Voucher).WithMany().HasForeignKey(b => b.VoucherId);

            modelBuilder.Entity<BookingDetail>().HasOne(bd => bd.Booking).WithMany(b => b.BookingDetails).HasForeignKey(bd => bd.BookingId);
            modelBuilder.Entity<BookingDetail>().HasOne(bd => bd.RoomType).WithMany(rt => rt.BookingDetails).HasForeignKey(bd => bd.RoomTypeId);
            modelBuilder.Entity<BookingDetail>().HasOne(bd => bd.Room).WithMany(r => r.BookingDetails).HasForeignKey(bd => bd.RoomId).IsRequired(false);

            modelBuilder.Entity<BookingHold>().HasOne(h => h.Booking).WithMany(b => b.BookingHolds).HasForeignKey(h => h.BookingId);
            modelBuilder.Entity<BookingHold>().HasOne(h => h.RoomType).WithMany(rt => rt.BookingHolds).HasForeignKey(h => h.RoomTypeId);

            modelBuilder.Entity<OrderService>().HasOne(os => os.Booking).WithMany(b => b.OrderServices).HasForeignKey(os => os.BookingId);
            modelBuilder.Entity<OrderServiceDetail>().HasOne(osd => osd.OrderService).WithMany(os => os.OrderServiceDetails).HasForeignKey(osd => osd.OrderServiceId);
            modelBuilder.Entity<OrderServiceDetail>().HasOne(osd => osd.Service).WithMany().HasForeignKey(osd => osd.ServiceId);

            modelBuilder.Entity<LossAndDamage>().HasOne(ld => ld.Booking).WithMany(b => b.LossAndDamages).HasForeignKey(ld => ld.BookingId);
            modelBuilder.Entity<LossAndDamage>().HasOne(ld => ld.Room).WithMany(r => r.LossAndDamages).HasForeignKey(ld => ld.RoomId);
            modelBuilder.Entity<LossAndDamage>().HasOne(ld => ld.Reporter).WithMany().HasForeignKey(ld => ld.ReportedBy).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Invoice>().HasOne(i => i.Booking).WithOne(b => b.Invoice).HasForeignKey<Invoice>(i => i.BookingId);
            modelBuilder.Entity<Payment>().HasOne(p => p.Invoice).WithMany(i => i.Payments).HasForeignKey(p => p.InvoiceId);

            modelBuilder.Entity<Review>().HasOne(r => r.User).WithMany(u => u.Reviews).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Review>().HasOne(r => r.Booking).WithMany(b => b.Reviews).HasForeignKey(r => r.BookingId);

            modelBuilder.Entity<Article>().HasOne(a => a.Category).WithMany(c => c.Articles).HasForeignKey(a => a.CategoryId);
            modelBuilder.Entity<Article>().HasOne(a => a.Author).WithMany().HasForeignKey(a => a.AuthorId).OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<AuditLog>().HasOne(a => a.User).WithMany().HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
