using HotelManagement.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace HotelManagement.Infrastructure.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<User> Users { get; }
        IGenericRepository<Role> Roles { get; }
        IGenericRepository<Permission> Permissions { get; }
        IGenericRepository<Booking> Bookings { get; }
        IGenericRepository<Room> Rooms { get; }
        // add other repos as needed
        Task<int> CommitAsync();
    }
}
