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
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly CreatePictureService _createPictureService;
        private readonly EditPictureService _editPictureService;


        public AnimeController(CreatePictureService createPictureService, EditPictureService editPictureService)
        {
            _createPictureService = createPictureService;
            this._editPictureService = editPictureService;
        }

        // GET: api/anime
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("test"); // Returns a successful response with "test" as the body
        }


// CREATE PICTURE 
        [HttpPost]
        public async Task<IActionResult> CreateTitleAsync([FromBody] CreateTitleDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }
            try
            {
                var titleId = await _createPictureService.CreateTitleAsync(dto);
                return Ok(new { Id = titleId }); // <-- Use Ok to avoid the route error
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditTitleAsync([FromBody] CreateTitleDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            try
            {
                var updated = await _editPictureService.EditTitleAsync(dto);
                if (!updated)
                    return NotFound();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
