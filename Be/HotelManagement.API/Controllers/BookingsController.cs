using System;
using System.Linq;
using System.Threading.Tasks;
using HotelManagement.Application.DTOs;
using HotelManagement.Application.Interfaces;
using HotelManagement.Application.Services;
using HotelManagement.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IApplicationDbContext _db;
        private readonly IRoomAvailabilityService _roomAvailabilityService;

        public BookingsController(IApplicationDbContext db, IRoomAvailabilityService roomAvailabilityService)
        {
            _db = db;
            _roomAvailabilityService = roomAvailabilityService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingRequestDto request)
        {
            if (request == null || request.BookingDetails == null || !request.BookingDetails.Any())
                return BadRequest("Booking details required.");

            if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Guest full name and email are required.");

            var booking = new Booking
            {
                GuestName = request.FullName.Trim(),
                GuestEmail = request.Email.Trim(),
                GuestPhone = request.PhoneNumber?.Trim() ?? string.Empty,
                Notes = request.Notes,
                BookingDetails = request.BookingDetails.Select(d => new BookingDetail
                {
                    RoomTypeId = d.RoomTypeId,
                    NumberOfRooms = d.NumberOfRooms,
                    CheckInDate = d.CheckInDate,
                    CheckOutDate = d.CheckOutDate,
                    PricePerNight = d.PricePerNight
                }).ToList()
            };

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var claimedUserId))
            {
                booking.UserId = claimedUserId;
            }
            else
            {
                var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == booking.GuestEmail);
                if (existingUser != null)
                {
                    booking.UserId = existingUser.Id;
                }
                else
                {
                    var guestRoleId = await _db.Roles
                        .Where(r => r.Name == "Guest")
                        .Select(r => (int?)r.Id)
                        .FirstOrDefaultAsync();

                    if (!guestRoleId.HasValue)
                    {
                        return BadRequest("Guest role is not configured.");
                    }

                    var guestUser = new User
                    {
                        Email = booking.GuestEmail,
                        FullName = booking.GuestName,
                        Phone = booking.GuestPhone,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(System.Guid.NewGuid().ToString("N")),
                        Status = true,
                        RoleId = guestRoleId.Value,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _db.Users.AddAsync(guestUser);
                    booking.UserId = guestUser.Id;
                }
            }

            if (booking.BookingDetails.Any(d => d.CheckInDate >= d.CheckOutDate))
                return BadRequest("Check-in date must be before check-out date.");

            if (booking.BookingDetails.Any(d => d.CheckInDate.Date < DateTime.UtcNow.Date))
                return BadRequest("Check-in date must be today or later.");

            // Validate availability per room detail
            foreach (var detail in booking.BookingDetails)
            {
                var effectiveAvailableRooms = await _roomAvailabilityService.GetAvailableRoomCountByTypeAsync(
                    detail.RoomTypeId,
                    detail.CheckInDate,
                    detail.CheckOutDate);

                if (detail.NumberOfRooms <= 0) detail.NumberOfRooms = 1;
                if (effectiveAvailableRooms < detail.NumberOfRooms)
                    return BadRequest($"Not enough available rooms for room type {detail.RoomTypeId}. Available: {effectiveAvailableRooms}");

                detail.PricePerNight = detail.PricePerNight <= 0 ? (await _db.RoomTypes.FindAsync(detail.RoomTypeId))?.BasePrice ?? 0 : detail.PricePerNight;
            }

            // Voucher validation
            decimal discountAmount = 0;
            if (!string.IsNullOrWhiteSpace(request.VoucherCode))
            {
                var code = request.VoucherCode.Trim();
                var voucher = await _db.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
                if (voucher == null || !voucher.IsActive || voucher.ValidFrom > DateTime.UtcNow || voucher.ValidTo < DateTime.UtcNow || voucher.UsedCount >= voucher.UsageLimit)
                    return BadRequest("Voucher is invalid or expired.");

                booking.VoucherId = voucher.Id;
                booking.Voucher = voucher;
            }

            // calculate estimated amount
            decimal totalRoom = 0;
            foreach (var detail in booking.BookingDetails)
            {
                var nights = (detail.CheckOutDate.Date - detail.CheckInDate.Date).Days;
                totalRoom += nights * detail.PricePerNight * detail.NumberOfRooms;
            }

            if (booking.Voucher != null)
            {
                var v = booking.Voucher;
                if (totalRoom < v.MinBookingValue) return BadRequest("Booking value below voucher minimum.");
                if (v.DiscountType == "PERCENT")
                {
                    discountAmount = Math.Min(totalRoom * (v.DiscountValue / 100m), v.DiscountValue);
                }
                else
                {
                    discountAmount = v.DiscountValue;
                }
                v.UsedCount++;
            }

            booking.TotalEstimatedAmount = totalRoom - discountAmount;
            booking.DepositAmount = booking.TotalEstimatedAmount * 0.3m;
            booking.CreatedAt = DateTime.UtcNow;
            booking.BookingCode = string.IsNullOrEmpty(booking.BookingCode) ? $"BKG-{System.Guid.NewGuid():N}" : booking.BookingCode;
            booking.Status = "Pending";

            foreach (var detail in booking.BookingDetails)
            {
                detail.BookingId = booking.Id;
            }

            booking.BookingHolds = booking.BookingDetails.Select(detail => new BookingHold
            {
                RoomTypeId = detail.RoomTypeId,
                CheckInDate = detail.CheckInDate,
                CheckOutDate = detail.CheckOutDate,
                Quantity = detail.NumberOfRooms,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                Status = BookingHoldStatus.Active,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _db.Bookings.AddAsync(booking);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
        }

        [Authorize(Roles = "Admin,Reception")]
        [HttpGet("holds/active")]
        public async Task<IActionResult> GetActiveHolds()
        {
            var now = DateTime.UtcNow;
            var holds = await _db.BookingHolds
                .Where(h => h.Status == BookingHoldStatus.Active && h.ExpiresAt > now)
                .OrderBy(h => h.ExpiresAt)
                .Select(h => new
                {
                    h.Id,
                    h.BookingId,
                    h.RoomTypeId,
                    h.CheckInDate,
                    h.CheckOutDate,
                    h.Quantity,
                    h.ExpiresAt,
                    h.Status
                })
                .ToListAsync();

            return Ok(holds);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var role = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value ?? "";
            if (role == "Admin" || role == "Reception")
            {
                var list = await _db.Bookings.Include(b => b.BookingDetails).ToListAsync();
                return Ok(list);
            }

            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userId == null) return Unauthorized();
            var userIdInt = int.Parse(userId);
            var listUser = await _db.Bookings.Where(b => b.UserId == userIdInt).Include(b => b.BookingDetails).ToListAsync();
            return Ok(listUser);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _db.Bookings.Include(b => b.BookingDetails).FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpPut("{id:int}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var activeHolds = await _db.BookingHolds
                .Where(h => h.BookingId == id && h.Status == BookingHoldStatus.Active)
                .ToListAsync();

            if (activeHolds.Count > 0)
            {
                var now = DateTime.UtcNow;
                foreach (var hold in activeHolds)
                {
                    hold.Status = BookingHoldStatus.Cancelled;
                    hold.UpdatedAt = now;
                }
                _db.BookingHolds.UpdateRange(activeHolds);
            }

            booking.Status = "Cancelled";
            booking.UpdatedAt = DateTime.UtcNow;
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }

        [Authorize(Roles = "Reception")]
        [HttpPut("{id:int}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            var activeHolds = await _db.BookingHolds
                .Where(h => h.BookingId == id && h.Status == BookingHoldStatus.Active)
                .ToListAsync();

            if (activeHolds.Count > 0)
            {
                var now = DateTime.UtcNow;
                foreach (var hold in activeHolds)
                {
                    hold.Status = BookingHoldStatus.Converted;
                    hold.UpdatedAt = now;
                }
                _db.BookingHolds.UpdateRange(activeHolds);
            }

            booking.Status = "Confirmed";
            booking.UpdatedAt = DateTime.UtcNow;
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }

        [Authorize(Roles = "Admin,Reception")]
        [HttpPut("{id:int}/holds/cancel")]
        public async Task<IActionResult> CancelActiveHolds(int id)
        {
            var bookingExists = await _db.Bookings.AnyAsync(b => b.Id == id);
            if (!bookingExists) return NotFound();

            var activeHolds = await _db.BookingHolds
                .Where(h => h.BookingId == id && h.Status == BookingHoldStatus.Active)
                .ToListAsync();

            if (activeHolds.Count == 0)
            {
                return NoContent();
            }

            var now = DateTime.UtcNow;
            foreach (var hold in activeHolds)
            {
                hold.Status = BookingHoldStatus.Cancelled;
                hold.UpdatedAt = now;
            }

            _db.BookingHolds.UpdateRange(activeHolds);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }

        [Authorize(Roles = "Admin,Reception")]
        [HttpPut("{id:int}/holds/extend")]
        public async Task<IActionResult> ExtendActiveHolds(int id, [FromQuery] int minutes = 5)
        {
            if (minutes < 1 || minutes > 15)
            {
                return BadRequest("Extension minutes must be between 1 and 15.");
            }

            var bookingExists = await _db.Bookings.AnyAsync(b => b.Id == id);
            if (!bookingExists) return NotFound();

            var now = DateTime.UtcNow;
            var activeHolds = await _db.BookingHolds
                .Where(h => h.BookingId == id && h.Status == BookingHoldStatus.Active && h.ExpiresAt > now)
                .ToListAsync();

            if (activeHolds.Count == 0)
            {
                return BadRequest("No active hold found to extend.");
            }

            foreach (var hold in activeHolds)
            {
                var maxExpiresAt = hold.CreatedAt.AddMinutes(30);
                var nextExpiresAt = hold.ExpiresAt.AddMinutes(minutes);
                hold.ExpiresAt = nextExpiresAt <= maxExpiresAt ? nextExpiresAt : maxExpiresAt;
                hold.UpdatedAt = now;
            }

            _db.BookingHolds.UpdateRange(activeHolds);
            await _db.SaveChangesAsync(default);

            return Ok(activeHolds.Select(h => new
            {
                h.Id,
                h.BookingId,
                h.ExpiresAt,
                h.Status
            }));
        }
    }
}
