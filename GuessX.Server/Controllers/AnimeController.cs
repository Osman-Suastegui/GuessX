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
        private readonly GetPictureByImageUrlService _getPictureByImageUrlService;
        private readonly SearchPictureService _searchPictureService;


        public AnimeController(CreatePictureService createPictureService, EditPictureService editPictureService, GetPictureByImageUrlService getPictureByImageIdService, SearchPictureService searchPictureService)
        {
            _createPictureService = createPictureService;
            _editPictureService = editPictureService;
            _getPictureByImageUrlService = getPictureByImageIdService;
            _searchPictureService = searchPictureService;
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

        [HttpGet("getPictureByImageUrl")]
        public async Task<IActionResult> getAnimePictureByImageUrl(string imageUrl)
        {
            
            var picture = await _getPictureByImageUrlService.GetPictureByImageUrlAsync(imageUrl);
            if (picture == null)
            {
                return NotFound("Picture not found.");
            }
            return Ok(picture);

        }
        [HttpGet("SearchPictureBy")]
        public async Task<IActionResult> SearchPictureByTitleName(string titleName,int limit = 20)
        {
            
            var titles = await _searchPictureService.SearchPicturesAsync(titleName,limit);
         
            return Ok(titles);
        }

        //[HttpGet]("get")
    }
}
