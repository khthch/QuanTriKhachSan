using System.Text;
using System.Data;
using HotelManagement.Application.Interfaces;
using HotelManagement.Application.Services;
using HotelManagement.Infrastructure.Middleware;
using HotelManagement.Infrastructure.Persistence;
using HotelManagement.Infrastructure.Repositories;
using HotelManagement.Infrastructure.Services;
using HotelManagement.Infrastructure.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HotelManagement API",
        Version = "v1"
    });

    var bearerScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Input JWT token in this format: Bearer {token}"
    };

    options.AddSecurityDefinition("Bearer", bearerScheme);
    options.AddSecurityRequirement(_ => new OpenApiSecurityRequirement
    {
        { new OpenApiSecuritySchemeReference("Bearer", null, null), new List<string>() }
    });
});

builder.Services.AddAutoMapper(typeof(HotelManagement.Application.Mappings.AutoMapperProfile));

builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IRoomAvailabilityService, RoomAvailabilityService>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddHostedService<BookingHoldCleanupService>();

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is missing.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(defaultConnection));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var jwtSecret = jwtSettings.GetValue<string>("Secret")
    ?? throw new InvalidOperationException("JwtSettings:Secret is missing.");
var key = Encoding.UTF8.GetBytes(jwtSecret);
var frontendUrls = builder.Configuration.GetSection("FrontendUrls").Get<string[]>()
    ?? Array.Empty<string>();

if (frontendUrls.Length == 0)
{
    var singleFrontendUrl = builder.Configuration.GetValue<string>("FrontendUrl")
        ?? throw new InvalidOperationException("FrontendUrl or FrontendUrls is missing.");
    frontendUrls = new[] { singleFrontendUrl };
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(frontendUrls)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var connection = context.Database.GetDbConnection();
    if (connection.State != ConnectionState.Open)
    {
        connection.Open();
    }

    using (var command = connection.CreateCommand())
    {
        command.CommandText = "SELECT to_regclass('public.\"Roles\"')::text;";
        var rolesTable = command.ExecuteScalar()?.ToString();

        if (string.IsNullOrWhiteSpace(rolesTable))
        {
            var createScript = context.Database.GenerateCreateScript();
            context.Database.ExecuteSqlRaw(createScript);
        }
    }

    if (connection.State == ConnectionState.Open)
    {
        connection.Close();
    }

    HotelManagement.Infrastructure.Seed.DatabaseSeeder.Seed(context);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseAuditLog();

app.MapControllers();

// Basic health endpoints
app.MapGet("/", () => Results.Ok("HotelManagement API is running"));

app.Run();

