using GuessX.Server.Controllers;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Data;
using GuessX.Server.Application.Services;
using GuessX.Server.GameHub;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());
builder.Services.AddScoped<CreatePictureService>();
builder.Services.AddScoped<EditPictureService>();
builder.Services.AddScoped<GetPictureByImageUrlService>();
builder.Services.AddScoped<SearchPictureService>();
builder.Services.AddSignalR();

builder.Services.AddSingleton<RoomManager>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policyBuilder => policyBuilder
            .WithOrigins("*") // Permite solicitudes desde este origen
            .AllowAnyHeader()
            .AllowAnyMethod()
            );

    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(// frontend origin
           "https://localhost:53328",
           "https://127.0.0.1:53328"
        ) 
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); // important for SignalR
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
//app.UseCors("AllowSpecificOrigin");
app.UseCors("AllowAngular");

app.MapHub<GameHub>("/gamehub");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
//app.MapHub<GameHub>("/hubs/game");

app.MapFallbackToFile("/index.html");

app.Run();
