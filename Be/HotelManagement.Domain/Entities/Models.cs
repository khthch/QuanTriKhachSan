using System;
using System.Collections.Generic;

namespace HotelManagement.Domain.Entities
{
    public enum RoomStatus
    {
        Available,
        Occupied,
        Cleaning,
        Maintenance
    }

    public enum BookingHoldStatus
    {
        Active,
        Expired,
        Converted,
        Cancelled
    }

    public class Role : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }

    public class Permission : BaseEntity
    {
        public string PermissionCode { get; set; } = null!;
        public string ModuleName { get; set; } = null!;
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }

    public class RolePermission : BaseEntity
    {
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public int PermissionId { get; set; }
        public Permission Permission { get; set; } = null!;
    }

    public class User : BaseEntity
    {
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public int? MembershipId { get; set; }
        public Membership? Membership { get; set; }
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Phone { get; set; } = string.Empty;
        public bool Status { get; set; } = true;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

    public class AuditLog : BaseEntity
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string TableName { get; set; } = null!;
        public int RecordId { get; set; }
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string? IpAddress { get; set; }
    }

    public class RoomType : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public decimal BasePrice { get; set; }
        public int CapacityAdults { get; set; }
        public int CapacityChildren { get; set; }
        public int TotalRooms { get; set; }

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<RoomTypeAmenity> RoomTypeAmenities { get; set; } = new List<RoomTypeAmenity>();
        public ICollection<RoomImage> RoomImages { get; set; } = new List<RoomImage>();
        public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
        public ICollection<BookingHold> BookingHolds { get; set; } = new List<BookingHold>();
    }

    public class Room : BaseEntity
    {
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;
        public string RoomNumber { get; set; } = null!;
        public int FloorNumber { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Available;

        public ICollection<RoomInventory> RoomInventory { get; set; } = new List<RoomInventory>();
        public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
        public ICollection<LossAndDamage> LossAndDamages { get; set; } = new List<LossAndDamage>();
    }

    public class Amenity : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? IconUrl { get; set; }
        public ICollection<RoomTypeAmenity> RoomTypeAmenities { get; set; } = new List<RoomTypeAmenity>();
    }

    public class RoomTypeAmenity : BaseEntity
    {
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;
        public int AmenityId { get; set; }
        public Amenity Amenity { get; set; } = null!;
    }

    public class RoomImage : BaseEntity
    {
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public bool IsPrimary { get; set; }
    }

    public class RoomInventory : BaseEntity
    {
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal PriceIfLost { get; set; }
    }

    public class Voucher : BaseEntity
    {
        public string Code { get; set; } = null!;
        public string DiscountType { get; set; } = "PERCENT";
        public decimal DiscountValue { get; set; }
        public decimal MinBookingValue { get; set; }
        public int UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Booking : BaseEntity
    {
        public int? UserId { get; set; }
        public User? User { get; set; }
        public string BookingCode { get; set; } = null!;
        public int? VoucherId { get; set; }
        public Voucher? Voucher { get; set; }
        public decimal TotalEstimatedAmount { get; set; }
        public decimal DepositAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestPhone { get; set; }
        public string? Notes { get; set; }

        public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
        public ICollection<OrderService> OrderServices { get; set; } = new List<OrderService>();
        public ICollection<LossAndDamage> LossAndDamages { get; set; } = new List<LossAndDamage>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<BookingHold> BookingHolds { get; set; } = new List<BookingHold>();
        public Invoice? Invoice { get; set; }
    }

    public class BookingHold : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Quantity { get; set; } = 1;
        public DateTime ExpiresAt { get; set; }
        public BookingHoldStatus Status { get; set; } = BookingHoldStatus.Active;
    }

    public class BookingDetail : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;
        public int? RoomId { get; set; }
        public Room? Room { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
        public int NumberOfRooms { get; set; } = 1;
    }

    public class Membership : BaseEntity
    {
        public string TierName { get; set; } = null!;
        public int MinPoints { get; set; }
        public decimal DiscountPercent { get; set; }
    }

    public class ServiceCategory : BaseEntity
    {
        public string Name { get; set; } = null!;
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }

    public class Service : BaseEntity
    {
        public int CategoryId { get; set; }
        public ServiceCategory Category { get; set; } = null!;
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Unit { get; set; } = null!;
    }

    public class OrderService : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public DateTime OrderedAt { get; set; }
        public string Status { get; set; } = "Pending";
        public ICollection<OrderServiceDetail> OrderServiceDetails { get; set; } = new List<OrderServiceDetail>();
    }

    public class OrderServiceDetail : BaseEntity
    {
        public int OrderServiceId { get; set; }
        public OrderService OrderService { get; set; } = null!;
        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class LossAndDamage : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public string ItemName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal FineAmount { get; set; }
        public int ReportedBy { get; set; }
        public User Reporter { get; set; } = null!;
    }

    public class Invoice : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public decimal TotalRoomAmount { get; set; }
        public decimal TotalServiceAmount { get; set; }
        public decimal TotalDamageAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal FinalTotal { get; set; }
        public string Status { get; set; } = "Unpaid";
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class Payment : BaseEntity
    {
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;
        public string PaymentType { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public decimal AmountPaid { get; set; }
        public string? TransactionCode { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class Review : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public bool IsApproved { get; set; }
    }

    public class ArticleCategory : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public ICollection<Article> Articles { get; set; } = new List<Article>();
    }

    public class Article : BaseEntity
    {
        public int CategoryId { get; set; }
        public ArticleCategory Category { get; set; } = null!;
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? ThumbnailUrl { get; set; }
        public DateTime? PublishedAt { get; set; }
    }

    public class Attraction : BaseEntity
    {
        public string Name { get; set; } = null!;
        public decimal DistanceKm { get; set; }
        public string? Description { get; set; }
        public string? MapEmbedLink { get; set; }
        public string? ImageUrl { get; set; }
    }
}
