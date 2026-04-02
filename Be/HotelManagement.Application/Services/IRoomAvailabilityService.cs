using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelManagement.Domain.Entities;

namespace HotelManagement.Application.Services
{
    public interface IRoomAvailabilityService
    {
        Task<IReadOnlyCollection<Room>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut, int quantity);
        Task<int> GetAvailableRoomCountByTypeAsync(int roomTypeId, DateTime checkIn, DateTime checkOut);
    }
}
