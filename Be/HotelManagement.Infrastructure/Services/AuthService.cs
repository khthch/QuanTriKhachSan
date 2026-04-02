using System;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using HotelManagement.Application.DTOs;
using HotelManagement.Application.Interfaces;
using HotelManagement.Application.Models;
using HotelManagement.Application.Services;
using HotelManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthService(IApplicationDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            var user = await _dbContext.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new InvalidOperationException("Invalid credentials");

            var role = user.Role?.Name ?? "Guest";
            var token = _jwtService.GenerateToken(user.Id, user.Email, role);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // TODO: store refreshToken in DB along with expiry, user

            return new AuthResult
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(8),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Phone = user.Phone,
                    Status = user.Status,
                    Role = role
                }
            };
        }

        public async Task<AuthResult> RegisterAsync(RegisterDto registerDto)
        {
            var existing = await _dbContext.Users.AnyAsync(u => u.Email == registerDto.Email);
            if (existing)
                throw new InvalidOperationException("Email already registered");

            var guestRoleId = await _dbContext.Roles
                .Where(r => r.Name == "Guest")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            if (guestRoleId == 0)
                throw new InvalidOperationException("Guest role is not configured");

            var user = new User
            {
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                Phone = registerDto.Phone ?? string.Empty,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Status = true,
                RoleId = guestRoleId,
                CreatedAt = DateTime.UtcNow
            };

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync(default);

            return await LoginAsync(registerDto.Email, registerDto.Password);
        }

        public async Task<AuthResult> RefreshTokenAsync(string token)
        {
            // TODO: verify refresh token from database
            throw new NotImplementedException();
        }
    }
}
