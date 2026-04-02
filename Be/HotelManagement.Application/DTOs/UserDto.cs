using System;

namespace HotelManagement.Application.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = "Guest";
        public string? Phone { get; set; }
        public bool Status { get; set; }
    }
}
