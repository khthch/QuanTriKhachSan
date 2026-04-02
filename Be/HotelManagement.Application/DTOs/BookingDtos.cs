using System;
using System.Collections.Generic;

namespace HotelManagement.Application.DTOs
{
    public class CreateBookingRequestDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public string? VoucherCode { get; set; }
        public ICollection<CreateBookingDetailDto> BookingDetails { get; set; } = new List<CreateBookingDetailDto>();
    }

    public class CreateBookingDetailDto
    {
        public int RoomTypeId { get; set; }
        public int NumberOfRooms { get; set; } = 1;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
    }
}
