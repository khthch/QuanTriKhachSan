using HotelManagement.Application.DTOs;
using HotelManagement.Application.Models;
using System.Threading.Tasks;

namespace HotelManagement.Application.Services
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(string email, string password);
        Task<AuthResult> RegisterAsync(RegisterDto registerDto);
        Task<AuthResult> RefreshTokenAsync(string token);
    }
}
