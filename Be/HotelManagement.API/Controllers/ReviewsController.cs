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
    [Route("api/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly IApplicationDbContext _db;

        public ReviewsController(IApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        [Authorize(Roles = "Guest,Admin")]
        public async Task<IActionResult> Create([FromBody] Review review)
        {
            if (review == null) return BadRequest();

            var booking = await _db.Bookings.Include(b => b.BookingDetails).FirstOrDefaultAsync(b => b.Id == review.BookingId);
            if (booking == null) return BadRequest("Invalid booking.");
            if (booking.Status != "Checked_out") return BadRequest("Only checked-out bookings can be reviewed.");

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            if (booking.UserId != userId) return Forbid();
            if (await _db.Reviews.AnyAsync(r => r.BookingId == review.BookingId && r.UserId == userId)) return BadRequest("A review already exists for this booking.");

            review.UserId = userId;
            review.IsApproved = false;
            review.CreatedAt = DateTime.UtcNow;

            await _db.Reviews.AddAsync(review);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var review = await _db.Reviews.FindAsync(id);
            if (review == null) return NotFound();
            return Ok(review);
        }

        [HttpGet]
        public async Task<IActionResult> GetList(int page = 1, int pageSize = 10)
        {
            var reviews = await _db.Reviews.Where(r => r.IsApproved).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return Ok(reviews);
        }

        [HttpPut("{id:int}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(int id, [FromBody] bool approved)
        {
            var review = await _db.Reviews.FindAsync(id);
            if (review == null) return NotFound();
            review.IsApproved = approved;
            review.UpdatedAt = DateTime.UtcNow;
            _db.Reviews.Update(review);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }
    }
}
