using HotelManagement.Domain.Entities;
using HotelManagement.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace HotelManagement.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new GenericRepository<User>(_context);
            Roles = new GenericRepository<Role>(_context);
            Permissions = new GenericRepository<Permission>(_context);
            Bookings = new GenericRepository<Booking>(_context);
            Rooms = new GenericRepository<Room>(_context);
        }

        public IGenericRepository<User> Users { get; }
        public IGenericRepository<Role> Roles { get; }
        public IGenericRepository<Permission> Permissions { get; }
        public IGenericRepository<Booking> Bookings { get; }
        public IGenericRepository<Room> Rooms { get; }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync(default);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
