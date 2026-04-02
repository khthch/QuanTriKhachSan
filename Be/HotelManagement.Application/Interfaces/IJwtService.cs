namespace HotelManagement.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string email, string role);
        string GenerateRefreshToken();
    }
}
