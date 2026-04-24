
using GuessX.Server.Data;
using GuessX.Server.Entities;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Application.Dtos;
using System.Text.Json;
using GuessX.Server.Application.Exceptions;
namespace GuessX.Server.Application.Services;
// this class is responsible for population each day a single record
// for the tables CharacterOfTheDay and splashofTheDay specifically from league of legends
public class LeagueOfLegends
{
    private readonly AppDbContext _context;
    private readonly HttpClient _http;

    public LeagueOfLegends(AppDbContext context,HttpClient http)
    {
        _context = context;
        _http = http;
    }


    public async Task<CharacterOfTheDayResponseDto> GenerateCharacterOfTheDay()
    {

        var count = await _context.Characters
       .Where(c => c.GameId == 1)
       .CountAsync();

        if (count == 0)
        {
            throw new NotFoundException("No characters found for the specified game.");
        }

        var randomIndex = Random.Shared.Next(count);

        Character? randomCharacter = await _context.Characters
            .Where(c => c.GameId == 1)
            .Skip(randomIndex)
            .FirstOrDefaultAsync();

        if (randomCharacter == null)
        {
            throw new NotFoundException("Failed to retrieve a random character.");

        }


        var characterOfTheDay = new CharacterOfTheDay
        {
            GameId = 1,
            CharacterId = randomCharacter.Id,
            Date = DateOnly.FromDateTime(DateTime.UtcNow)
        };
        _context.CharacterOfTheDays.Add(characterOfTheDay);

        await _context.SaveChangesAsync();
        var characterOfTheDayResponse = new CharacterOfTheDayResponseDto
        {
            GameId = characterOfTheDay.GameId,
            CharacterId = (int)characterOfTheDay.CharacterId,
            Date = characterOfTheDay.Date,
            Character = new CharacterDto
            {
                Id = randomCharacter.Id,
                GameId = randomCharacter.GameId,
                Name = randomCharacter.Name,
                Metadata = randomCharacter.Metadata
            }
        };

        return characterOfTheDayResponse;
    }

    public async Task<SplashOfTheDayDto> GenerateSplashOfTheDay()
    {
        var count = await _context.Characters
      .CountAsync();

        if (count == 0)
        {
            throw new NotFoundException("No character found for the specified game.");
        }
        Character character = await _context.Characters
                   .Skip(Random.Shared.Next(count))
                   .FirstOrDefaultAsync() ?? throw new NotFoundException("No character found for the specified game.");

        _http.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

        var url = $"https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion/{character.Name}.json";
        var json = await _http.GetStringAsync(url);

        var jsonDoc = JsonDocument.Parse(json);

        // data → Ahri → skins
        var root = jsonDoc.RootElement
            .GetProperty("data")
            .EnumerateObject()
            .First()
            .Value;

        var skins = root.GetProperty("skins");

        var skinList = skins.EnumerateArray().ToList();

        // pick random
        var randomSkin = skinList[Random.Shared.Next(skinList.Count)];

        var num = randomSkin.GetProperty("num").GetInt32();

        var splashUrl = $"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{character.Name}_{num}.jpg";

        var splashOfTheDay = new SplashOfTheDay
        {
            GameId = 1,
            CharacterId = character.Id,
            Date = DateOnly.FromDateTime(DateTime.UtcNow),
            SplashImageUrl = splashUrl
        };
        _context.SplashOfTheDays.Add(splashOfTheDay);
        await _context.SaveChangesAsync();

        return new SplashOfTheDayDto
        {
            GameName = "League of Legends",
            Name = character.Name,
            Date = DateOnly.FromDateTime(DateTime.UtcNow),
            SplashImageUrl = splashUrl
        };

    }
}