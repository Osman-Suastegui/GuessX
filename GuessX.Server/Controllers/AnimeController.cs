using System.Net.Http;
using System.Text.Json;
using GuessX.Server.Data;
using GuessX.Server.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GuessX.Server.Application.Services;
using GuessX.Server.Application.Dtos;

namespace GuessX.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]  // This will map to /api/anime
    public class AnimeController : ControllerBase
    {
        private readonly AnimeService _animeService;
        public AnimeController(AnimeService animeService)
        {
            _animeService = animeService;
        }

        [HttpGet("generateSplashOfTheDay")]
        public async Task<ActionResult<AnimeResponseJikan>> GenerateSplashOfTheDay()
        {
            var splash = await _animeService.GenerateSplashOfTheDay();
            return Ok(splash);
        }

        [HttpGet("getSplashOfTheDay")]
        public async Task<ActionResult<SplashOfTheDayDto>> GetSplashOfTheDay()
        {
            var splash = await _animeService.GetSplashOfTheDay();
            return Ok(splash);
        }
        [HttpGet("search")]
        public async Task<ActionResult<AnimeDto[]>> SearchAnimes([FromQuery] string name)
        {
            var animes = await _animeService.SearchAnimes(name);
            return Ok(animes);
        }
    }
}
