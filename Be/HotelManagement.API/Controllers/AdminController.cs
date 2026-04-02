using System;
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
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IApplicationDbContext _db;
        
        public AdminController(IApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("reports/revenue")]
        public async Task<IActionResult> GetRevenueReport(DateTime? from = null, DateTime? to = null)
        {
            var query = _db.Invoices.AsQueryable();
            if (from.HasValue) query = query.Where(i => i.CreatedAt >= from.Value);
            if (to.HasValue) query = query.Where(i => i.CreatedAt <= to.Value);
            var total = await query.SumAsync(i => i.FinalTotal);
            return Ok(new { total });
        }

        [HttpGet("reports/occupancy")]
        public async Task<IActionResult> GetOccupancyReport()
        {
            var totalRooms = await _db.Rooms.CountAsync();
            var occupied = await _db.Rooms.CountAsync(r => r.Status == RoomStatus.Occupied);
            return Ok(new { totalRooms, occupied, rate = totalRooms > 0 ? (decimal)occupied / totalRooms : 0 });
        }

        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _db.AuditLogs.OrderByDescending(l => l.CreatedAt).Take(100).ToListAsync();
            return Ok(logs);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(await _db.Users.ToListAsync());
        }

        [HttpPost("roles")]
        public async Task<IActionResult> CreateRole(Role role)
        {
            role.CreatedAt = DateTime.UtcNow;
            await _db.Roles.AddAsync(role);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(nameof(GetUsers), new { id = role.Id }, role);
        }

        [HttpPost("permissions")]
        public async Task<IActionResult> CreatePermission(Permission permission)
        {
            permission.CreatedAt = DateTime.UtcNow;
            await _db.Permissions.AddAsync(permission);
            await _db.SaveChangesAsync(default);
            return CreatedAtAction(nameof(GetUsers), new { id = permission.Id }, permission);
        }
    }
}
