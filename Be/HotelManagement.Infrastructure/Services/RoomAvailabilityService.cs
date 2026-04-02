using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManagement.Application.Interfaces;
using HotelManagement.Application.Services;
using HotelManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.Services
{
    public class RoomAvailabilityService : IRoomAvailabilityService
    {
        private readonly IApplicationDbContext _db;

        public RoomAvailabilityService(IApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyCollection<Room>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut, int quantity)
        {
            checkIn = ToUtc(checkIn);
            checkOut = ToUtc(checkOut);

            var now = DateTime.UtcNow;
            var requestedQuantity = quantity > 0 ? quantity : 1;

            var bookedRoomIds = await _db.BookingDetails
                .Where(d => !(d.CheckOutDate <= checkIn || d.CheckInDate >= checkOut))
                .Select(d => d.RoomId)
                .Distinct()
                .ToListAsync();

            var holdByRoomType = await _db.BookingHolds
                .Where(h => h.Status == BookingHoldStatus.Active
                            && h.ExpiresAt > now
                            && !(h.CheckOutDate <= checkIn || h.CheckInDate >= checkOut))
                .GroupBy(h => h.RoomTypeId)
                .Select(g => new { RoomTypeId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToDictionaryAsync(x => x.RoomTypeId, x => x.Quantity);

            var candidateRooms = await _db.Rooms
                .Where(r => !bookedRoomIds.Contains(r.Id)
                            && r.Status == RoomStatus.Available)
                .Include(r => r.RoomType)
                .ToListAsync();

            var availableRooms = new List<Room>();
            foreach (var roomGroup in candidateRooms.GroupBy(r => r.RoomTypeId))
            {
                holdByRoomType.TryGetValue(roomGroup.Key, out var heldQuantity);
                var freeSlots = Math.Max(roomGroup.Count() - heldQuantity, 0);
                if (freeSlots == 0)
                {
                    continue;
                }

                availableRooms.AddRange(roomGroup.Take(freeSlots));
                if (availableRooms.Count >= requestedQuantity)
                {
                    break;
                }
            }

            return availableRooms.Take(requestedQuantity).ToList();
        }

        public async Task<int> GetAvailableRoomCountByTypeAsync(int roomTypeId, DateTime checkIn, DateTime checkOut)
        {
            checkIn = ToUtc(checkIn);
            checkOut = ToUtc(checkOut);

            var now = DateTime.UtcNow;

            var availableRooms = await _db.Rooms
                .Where(r => r.RoomTypeId == roomTypeId && r.Status == RoomStatus.Available)
                .Where(r => !_db.BookingDetails
                    .Where(bd => !(bd.CheckOutDate <= checkIn || bd.CheckInDate >= checkOut))
                    .Select(bd => bd.RoomId)
                    .Contains(r.Id))
                .CountAsync();

            var heldQuantity = await _db.BookingHolds
                .Where(h => h.RoomTypeId == roomTypeId
                            && h.Status == BookingHoldStatus.Active
                            && h.ExpiresAt > now
                            && !(h.CheckOutDate <= checkIn || h.CheckInDate >= checkOut))
                .SumAsync(h => (int?)h.Quantity) ?? 0;

            return Math.Max(availableRooms - heldQuantity, 0);
        }

        private static DateTime ToUtc(DateTime value)
        {
            return value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };
        }
    }
}
