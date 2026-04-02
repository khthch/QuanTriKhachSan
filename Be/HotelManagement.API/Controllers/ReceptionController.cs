using System.Linq;
using System.Threading.Tasks;
using HotelManagement.Application.Interfaces;
using HotelManagement.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/reception")]
    [Authorize(Roles = "Reception,Admin")]
    public class ReceptionController : ControllerBase
    {
        private readonly IApplicationDbContext _db;

        public ReceptionController(IApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("checkin/{bookingCode}")]
        public async Task<IActionResult> GetCheckInInfo(string bookingCode)
        {
            var booking = await _db.Bookings.Include(b => b.BookingDetails).FirstOrDefaultAsync(b => b.BookingCode == bookingCode);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn([FromBody] int bookingId)
        {
            var booking = await _db.Bookings.Include(b => b.BookingDetails).FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) return NotFound();

            if (booking.Status != "Confirmed") return BadRequest("Booking must be confirmed");

            foreach (var detail in booking.BookingDetails)
            {
                if (detail.RoomId.HasValue)
                {
                    var room = await _db.Rooms.FindAsync(detail.RoomId.Value);
                    if (room != null)
                    {
                        room.Status = RoomStatus.Occupied;
                        room.UpdatedAt = DateTime.UtcNow;
                        _db.Rooms.Update(room);
                    }
                }
            }

            booking.Status = "Checked_in";
            booking.UpdatedAt = DateTime.UtcNow;
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync(default);

            return Ok(booking);
        }

        [HttpPost("checkout/{bookingId:int}")]
        public async Task<IActionResult> CheckOut(int bookingId)
        {
            var booking = await _db.Bookings.Include(b => b.BookingDetails).FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) return NotFound();
            if (booking.Status != "Checked_in") return BadRequest("Booking is not checked in");

            foreach (var detail in booking.BookingDetails)
            {
                if (detail.RoomId.HasValue)
                {
                    var room = await _db.Rooms.FindAsync(detail.RoomId.Value);
                    if (room != null)
                    {
                        room.Status = RoomStatus.Cleaning;
                        room.UpdatedAt = DateTime.UtcNow;
                        _db.Rooms.Update(room);
                    }
                }
            }

            booking.Status = "Checked_out";
            booking.UpdatedAt = DateTime.UtcNow;
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync(default);

            return Ok(booking);
        }

        [HttpGet("eta")]
        public async Task<IActionResult> GetEta()
        {
            var upcoming = await _db.Bookings
                .Where(b => b.Status == "Confirmed" && b.BookingDetails.Any(d => d.CheckInDate >= DateTime.UtcNow && d.CheckInDate <= DateTime.UtcNow.AddDays(1)))
                .ToListAsync();
            return Ok(upcoming);
        }
    }
}
