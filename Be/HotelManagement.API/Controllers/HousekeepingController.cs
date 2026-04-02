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
    [Route("api/housekeeping")]
    [Authorize(Roles = "Housekeeping,Admin")]
    public class HousekeepingController : ControllerBase
    {
        private readonly IApplicationDbContext _db;

        public HousekeepingController(IApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("tasks")]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _db.Rooms.Where(r => r.Status == RoomStatus.Cleaning || r.Status == RoomStatus.Maintenance).ToListAsync();
            return Ok(tasks);
        }

        [HttpPut("tasks/{roomId:int}/complete")]
        public async Task<IActionResult> CompleteCleaning(int roomId)
        {
            var room = await _db.Rooms.FindAsync(roomId);
            if (room == null) return NotFound();
            room.Status = RoomStatus.Available;
            room.UpdatedAt = DateTime.UtcNow;
            _db.Rooms.Update(room);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }

        [HttpPost("damages")]
        public async Task<IActionResult> ReportDamage(LossAndDamage damage)
        {
            damage.CreatedAt = DateTime.UtcNow;
            await _db.LossAndDamages.AddAsync(damage);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(null, damage);
        }
    }
}
