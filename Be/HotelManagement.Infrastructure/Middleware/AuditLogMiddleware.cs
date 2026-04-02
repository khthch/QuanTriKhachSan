using HotelManagement.Application.Interfaces;
using HotelManagement.Domain.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HotelManagement.Infrastructure.Middleware
{
    public class AuditLogMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuditLogMiddleware> _logger;

        public AuditLogMiddleware(RequestDelegate next, ILogger<AuditLogMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext)
        {
            var method = context.Request.Method;
            if (method != HttpMethods.Post && method != HttpMethods.Put && method != HttpMethods.Delete)
            {
                await _next(context);
                return;
            }

            string body = string.Empty;
            context.Request.EnableBuffering();
            using (var reader = new StreamReader(context.Request.Body, leaveOpen: true))
            {
                body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
            }

            await _next(context);

            var userId = context.User.FindFirst("id")?.Value;
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return;
            }

            var userExists = await dbContext.Users.AnyAsync(u => u.Id == parsedUserId);
            if (!userExists)
            {
                return;
            }

            var auditLog = new AuditLog
            {
                UserId = parsedUserId,
                Action = method,
                TableName = context.Request.Path,
                RecordId = 0,
                OldValue = null,
                NewValue = body,
                IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                CreatedAt = DateTime.UtcNow
            };

            dbContext.AuditLogs.Add(auditLog);
            await dbContext.SaveChangesAsync(default);

            _logger.LogInformation("Audit log saved for {Path}", context.Request.Path);
        }
    }

    public static class AuditLogMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuditLog(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuditLogMiddleware>();
        }
    }
}
