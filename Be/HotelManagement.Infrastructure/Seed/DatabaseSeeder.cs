using System;
using System.Collections.Generic;
using System.Linq;
using HotelManagement.Domain.Entities;
using HotelManagement.Infrastructure.Persistence;

namespace HotelManagement.Infrastructure.Seed
{
    public static class DatabaseSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            var roles = new Dictionary<string, Role>();

            if (!context.Roles.Any())
            {
                var roleList = new[]
                {
                    new Role { Name = "Admin", Description = "Administrator", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Reception", Description = "Reception staff", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Housekeeping", Description = "Housekeeping staff", CreatedAt = DateTime.UtcNow },
                    new Role { Name = "Guest", Description = "Guest user", CreatedAt = DateTime.UtcNow }
                };
                context.Roles.AddRange(roleList);
                foreach (var role in roleList)
                    roles[role.Name] = role;
            }
            else
            {
                foreach (var role in context.Roles)
                    roles[role.Name] = role;
            }

            if (!context.Permissions.Any())
            {
                var permissions = new[]
                {
                    new Permission { PermissionCode = "rooms.read", ModuleName = "Rooms", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "rooms.write", ModuleName = "Rooms", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "bookings.create", ModuleName = "Bookings", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "bookings.manage", ModuleName = "Bookings", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "checkin", ModuleName = "Reception", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "checkout", ModuleName = "Reception", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "housekeeping.update", ModuleName = "Housekeeping", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "reports.view", ModuleName = "Admin", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "audit.view", ModuleName = "Admin", CreatedAt = DateTime.UtcNow },
                    new Permission { PermissionCode = "cms.manage", ModuleName = "CMS", CreatedAt = DateTime.UtcNow }
                };
                context.Permissions.AddRange(permissions);
            }

            // Save roles and permissions before using them in other relationships
            context.SaveChanges();

            var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
            var guestRole = context.Roles.FirstOrDefault(r => r.Name == "Guest");
            var receptionRole = context.Roles.FirstOrDefault(r => r.Name == "Reception");
            var housekeepingRole = context.Roles.FirstOrDefault(r => r.Name == "Housekeeping");

            if (!context.Users.Any(u => u.Email == "admin@hotel.com") && adminRole != null)
            {
                context.Users.Add(new User
                {
                    Email = "admin@hotel.com",
                    FullName = "Admin User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Status = true,
                    RoleId = adminRole.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!context.Users.Any(u => u.Email == "guest@hotel.com") && guestRole != null)
            {
                context.Users.Add(new User
                {
                    Email = "guest@hotel.com",
                    FullName = "Guest User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Guest@123"),
                    Status = true,
                    RoleId = guestRole.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!context.Users.Any(u => u.Email == "reception@hotel.com") && receptionRole != null)
            {
                context.Users.Add(new User
                {
                    Email = "reception@hotel.com",
                    FullName = "Reception User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Reception@123"),
                    Status = true,
                    RoleId = receptionRole.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!context.Users.Any(u => u.Email == "housekeeping@hotel.com") && housekeepingRole != null)
            {
                context.Users.Add(new User
                {
                    Email = "housekeeping@hotel.com",
                    FullName = "Housekeeping User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Housekeeping@123"),
                    Status = true,
                    RoleId = housekeepingRole.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!context.RolePermissions.Any())
            {
                var perms = context.Permissions.ToList();
                if (adminRole != null)
                {
                    foreach (var p in perms)
                    {
                        context.RolePermissions.Add(new RolePermission { RoleId = adminRole.Id, PermissionId = p.Id });
                    }
                }

                if (receptionRole != null)
                {
                    var receptionPerms = perms.Where(p => p.PermissionCode == "bookings.manage" || p.PermissionCode == "checkin" || p.PermissionCode == "checkout" || p.PermissionCode == "reports.view").ToList();
                    foreach (var p in receptionPerms)
                        context.RolePermissions.Add(new RolePermission { RoleId = receptionRole.Id, PermissionId = p.Id });
                }

                if (housekeepingRole != null)
                {
                    var hkPerms = perms.Where(p => p.PermissionCode == "housekeeping.update").ToList();
                    foreach (var p in hkPerms)
                        context.RolePermissions.Add(new RolePermission { RoleId = housekeepingRole.Id, PermissionId = p.Id });
                }

                if (guestRole != null)
                {
                    var guestPerms = perms.Where(p => p.PermissionCode == "rooms.read" || p.PermissionCode == "bookings.create" || p.PermissionCode == "cms.manage").ToList();
                    foreach (var p in guestPerms)
                        context.RolePermissions.Add(new RolePermission { RoleId = guestRole.Id, PermissionId = p.Id });
                }
            }

            context.SaveChanges();
            if (!context.RoomTypes.Any())
            {
                var roomTypes = new[]
                {
                    new RoomType { Name = "Standard", Slug = "standard", BasePrice = 600000, CapacityAdults = 2, CapacityChildren = 1, TotalRooms = 20, CreatedAt = DateTime.UtcNow },
                    new RoomType { Name = "Deluxe", Slug = "deluxe", BasePrice = 1200000, CapacityAdults = 2, CapacityChildren = 2, TotalRooms = 15, CreatedAt = DateTime.UtcNow }
                };
                context.RoomTypes.AddRange(roomTypes);
            }

            if (!context.Amenities.Any())
            {
                var amenities = new[]
                {
                    new Amenity { Name = "Free WiFi", CreatedAt = DateTime.UtcNow },
                    new Amenity { Name = "Breakfast", CreatedAt = DateTime.UtcNow }
                };
                context.Amenities.AddRange(amenities);
            }

            if (!context.Services.Any())
            {
                var category = context.ServiceCategories.FirstOrDefault();
                if (category == null)
                {
                    category = new ServiceCategory { Name = "Room Service", CreatedAt = DateTime.UtcNow };
                    context.ServiceCategories.Add(category);
                    context.SaveChanges();
                }

                var services = new[]
                {
                    new Service { CategoryId = category.Id, Name = "Laundry", Price = 100000, Unit = "item", CreatedAt = DateTime.UtcNow },
                    new Service { CategoryId = category.Id, Name = "Spa", Price = 300000, Unit = "session", CreatedAt = DateTime.UtcNow }
                };
                context.Services.AddRange(services);
            }

            context.SaveChanges();
        }
    }
}
