using GuessX.Server.Data;
using GuessX.Server.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Application.Dtos;

namespace GuessX.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]  // This will map to /api/characters

    public class CharactersController : ControllerBase
    {

        private readonly AppDbContext _dbContext;

        public CharactersController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> SearchByName([FromQuery] string name, [FromQuery] int limit = 10)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name parameter is required.");
            }

            if (limit <= 0)
            {
                return BadRequest("Limit must be greater than 0.");
            }

            try
            {
                var characters = await _dbContext.Characters
                    .AsNoTracking()
                    .Where(c => EF.Functions.Like(c.Name, $"%{name}%"))
                    .Take(limit)
                    .Select(c => new CharacterDto
                    {
                        Id = c.Id,
                        GameId = c.GameId,
                        Name = c.Name,
                        Metadata = c.Metadata,
                    })
                    .ToListAsync();

                return Ok(characters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while searching for characters: {ex.Message}");
            }
        }

        [HttpGet("characterOfTheDay")]
        public async Task<ActionResult<CharacterDto>> GetCharacterOfTheDay([FromQuery] int gameId)
        {

            // last from the field date, where gameId is the same as the query parameter
            var characterOfTheDay = await _dbContext.CharacterOfTheDays
                .AsNoTracking()
                .Where(c => c.GameId == gameId)
                .OrderByDescending(c => c.Date)
                .Select(c =>
              new CharacterDto
              {
                  Id = c.Character.Id,
                  GameId = c.Character.GameId,
                  Name = c.Character.Name,
                  Metadata = c.Character.Metadata,
              })
                .FirstOrDefaultAsync();
            Console.Write(characterOfTheDay.ToString());
            if (characterOfTheDay == null)
            {
                return NotFound("Character of the day not found.");
            }

            return Ok(characterOfTheDay);
        }
        [HttpGet("splashOfTheDay")]
        public async Task<ActionResult<SplashOfTheDayDto>> GetSplashOfTheDay([FromQuery] int gameId)
        {
            var splashOfTheDay = await _dbContext.SplashOfTheDays
                .AsNoTracking()
                .Where(s => s.GameId == gameId)
                .Include(s => s.Game)
                .Include(s => s.Character)
                .OrderByDescending(s => s.Date)
                .Select(s =>
              new SplashOfTheDayDto
              {
                  Id = s.Id,
                  GameName = s.Game.TitleName,
                  Name = s.Character.Name,
                  Date = s.Date,
                  SplashImageUrl = s.SplashImageUrl
              })
                .FirstOrDefaultAsync();

            if (splashOfTheDay == null)
            {
                return NotFound("Splash of the day not found.");
            }

            return Ok(splashOfTheDay);
        }

    }



}