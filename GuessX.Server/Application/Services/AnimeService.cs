
using GuessX.Server.Application.Dtos;
using GuessX.Server.Data;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Entities;
namespace GuessX.Server.Application.Services;

public class AnimeService
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public AnimeService(AppDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<SplashOfTheDayDto> GetSplashOfTheDay()
    {
        var splash = await _context.SplashOfTheDays
            .Where(s => s.GameId == 3002)
            .Include(s => s.Anime)
            .Include(s => s.Game)
            .OrderByDescending(s => s.Date)
            .FirstOrDefaultAsync();
        if (splash == null)
        {
            throw new InvalidOperationException("No splash of the day found for the specified game.");
        }
        return new SplashOfTheDayDto
        {
            Id = splash.Id,
            SplashImageUrl = splash?.SplashImageUrl ?? string.Empty,
            Name = splash?.Anime?.Name ?? string.Empty,
            Date = splash?.Date ?? DateOnly.FromDateTime(DateTime.UtcNow),
            GameName = splash?.Game.TitleName ?? string.Empty
        };
    }

    public async Task<AnimeResponseJikan> GenerateSplashOfTheDay()
    {
        var count = await _context.Animes
       .CountAsync();

        if (count == 0)
        {
            throw new InvalidOperationException("No anime found for the specified game.");
        }

        Anime anime = await _context.Animes
             .Skip(Random.Shared.Next(count))
             .FirstOrDefaultAsync() ?? throw new InvalidOperationException("No anime found for the specified game.");


        int malId = anime.MalId ?? throw new InvalidOperationException("Anime does not have a MAL ID.");

        var httpClient = _httpClientFactory.CreateClient();
        var response = await httpClient.GetAsync($"https://api.jikan.moe/v4/anime/{malId}/full");

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Jikan request failed for MAL ID {malId}. Status code: {(int)response.StatusCode}.");
        }

        var content = await response.Content.ReadAsStringAsync();

        var animeResponseJikan = new AnimeResponseJikan(content);

        await _context.SplashOfTheDays.AddAsync(new SplashOfTheDay
        {
            GameId = 3002,
            Date = DateOnly.FromDateTime(DateTime.UtcNow),
            SplashImageUrl = animeResponseJikan.ImageUrl,
            AnimeId = anime.Id
        });

        await _context.SaveChangesAsync();

        return animeResponseJikan;

    }

    public async Task<AnimeDto[]> SearchAnimes(string name)
    {
        var animes = await _context.Animes
            .Where(a => a.Name.Contains(name))
            .Take(10)
            .Select(a => new AnimeDto
            {
                Id = a.Id,
                GameId = a.GameId,
                Name = a.Name,
            })
            .ToArrayAsync();
        return animes;
    }
}