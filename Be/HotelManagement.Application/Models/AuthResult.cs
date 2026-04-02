using System;
using HotelManagement.Application.DTOs;

namespace HotelManagement.Application.Models
{
    public class AuthResult
    {
        public string Token { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }
}
