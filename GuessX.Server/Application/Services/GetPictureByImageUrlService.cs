using GuessX.Server.Data;
using GuessX.Server.Application.Dtos;
using Microsoft.EntityFrameworkCore;
namespace GuessX.Server.Application.Services
{
    public class GetPictureByImageUrlService
    {
        private readonly AppDbContext _context;

        public GetPictureByImageUrlService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<GetPictureByImageUrlDto?> GetPictureByImageUrlAsync(string imageUrl)
        {
            // Fetch the title by using the titleImages model
            var titleImage = await _context.TitleImages
            .Include(ti => ti.Title)
             .ThenInclude(tpg => tpg.TitleAnswers)
            .Include(ti => ti.Title)
                .ThenInclude(tpg => tpg.TitleImages)
            .Include(ti => ti.Title)
                .ThenInclude(tpg => tpg.Genres)
            .FirstOrDefaultAsync(ti => ti.ImageUrl == imageUrl);

            if (titleImage == null)
            {
                return null;
            }
            // Map the result to CreateTitleDto
            List<TitleImageDto> titleImages = titleImage.Title.TitleImages
            .Select(ti => new TitleImageDto
            {
                Id = ti.Id,
                ImageUrl = ti.ImageUrl,
                ImageType = ti.ImageType
            })
            .ToList();

            List<TitleAnswersDto> pictureAnswer = titleImage.Title.TitleAnswers
            .Select(ti => new TitleAnswersDto
            {
                Id = ti.Id,
                Answer = ti.Answer
            })
            .ToList();


            return new GetPictureByImageUrlDto
            {
                Id = titleImage.Title.Id,
                TitleName = titleImage.Title.TitleName,
                Category = titleImage.Title.Category,
                TitleAnswers = pictureAnswer,
                Genres = titleImage.Title.Genres.Select(g => g.Name).ToList(),
                TitleImages = titleImages
            };
        }
    }
}
