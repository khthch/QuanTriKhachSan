using System;
using System.Threading.Tasks;
using HotelManagement.Application.Interfaces;
using HotelManagement.Application.Services;
using HotelManagement.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly IApplicationDbContext _db;
        private readonly IRoomAvailabilityService _roomAvailabilityService;

        public RoomsController(IApplicationDbContext db, IRoomAvailabilityService roomAvailabilityService)
        {
            _db = db;
            _roomAvailabilityService = roomAvailabilityService;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable(DateTime checkIn, DateTime checkOut, int adults = 1, int children = 0, int quantity = 1)
        {
            var availableRooms = await _roomAvailabilityService.GetAvailableRoomsAsync(checkIn, checkOut, quantity);
            return Ok(availableRooms);
        }

        [Authorize(Roles = "Admin,Reception")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Rooms.Include(r => r.RoomType).ToListAsync();
            return Ok(list);
        }

        [Authorize(Roles = "Admin,Reception")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var room = await _db.Rooms.Include(r => r.RoomType).FirstOrDefaultAsync(r => r.Id == id);
            if (room == null) return NotFound();
            return Ok(room);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Room room)
        {
            if (room == null) return BadRequest();
            room.CreatedAt = DateTime.UtcNow;
            await _db.Rooms.AddAsync(room);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Room updated)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.RoomNumber = updated.RoomNumber;
            room.FloorNumber = updated.FloorNumber;
            room.Status = updated.Status;
            room.RoomTypeId = updated.RoomTypeId;
            room.UpdatedAt = DateTime.UtcNow;

            _db.Rooms.Update(room);
            await _db.SaveChangesAsync(default);

            return NoContent();
        }

        [Authorize(Roles = "Housekeeping")]
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] RoomStatus status)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();
            room.Status = status;
            room.UpdatedAt = DateTime.UtcNow;
            _db.Rooms.Update(room);
            await _db.SaveChangesAsync(default);
            return NoContent();
        }
    }
}
