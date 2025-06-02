
using GuessX.Server.Application.Dtos;
using GuessX.Server.Data;
using Microsoft.EntityFrameworkCore;
namespace GuessX.Server.Application.Services
{
    public class SearchPictureService
    {
        private readonly AppDbContext _context;
        public SearchPictureService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GetPictureByImageIdDto>> SearchPicturesAsync(string searchTerm,int limit = 20 )
        {
            var results = await _context.TitlePictureGalleries
                .Where(t => EF.Functions.Like(t.TitleName, $"%{searchTerm}%"))
                .Select(title => new GetPictureByImageIdDto
                {
                    Id = title.Id,
                    TitleName = title.TitleName,
                    Category = title.Category, // assuming TitlePictureGallery has a Category property

                    Genres = title.Genres
                        .Select(g => g.Name)
                        .ToList(),

                    TitleImages = title.TitleImages
                        .Select(ti => new TitleImageDto
                        {
                            Id = ti.Id,
                            ImageUrl = ti.ImageUrl,
                            ImageType = ti.ImageType
                        })
                        .ToList(),

                    TitleAnswers = title.TitleAnswers
                        .Select(ta => new TitleAnswersDto
                        {
                            Id = ta.Id,
                            Answer = ta.Answer
                        })
                        .ToList()
                })
                .Take(limit)
                .ToListAsync();

            return results;
        }
    }
}
