
using GuessX.Server.Data;
using GuessX.Server.Entities;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Application.Dtos;
namespace GuessX.Server.Application.Services;

// this class is responsible for population each day a single record
// for the tables CharacterOfTheDay and splashofTheDay specifically from league of legends
public class LeagueOfLegends
{
    private readonly AppDbContext _context;

    public LeagueOfLegends(AppDbContext context)
    {
        _context = context;
    }


    public async Task<CharacterOfTheDayResponseDto> GenerateCharacterOfTheDay()
    {

        var count = await _context.Characters
       .Where(c => c.GameId == 1)
       .CountAsync();

        if(count == 0)
        {
            throw new InvalidOperationException("No characters found for the specified game.");
        }

        var randomIndex = Random.Shared.Next(count);

        Character? randomCharacter = await _context.Characters
            .Where(c => c.GameId == 1)
            .Skip(randomIndex)
            .FirstOrDefaultAsync();
        
        if (randomCharacter == null)
        {
            throw new InvalidOperationException("Failed to retrieve a random character.");

        }


        var characterOfTheDay  = new CharacterOfTheDay
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


       
}