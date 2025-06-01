using GuessX.Server.Data;
using GuessX.Server.Entities;
using GuessX.Server.Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GuessX.Server.Application.Services
{
    public class EditPictureService
    {
        private readonly AppDbContext _context;

        public EditPictureService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> EditTitleAsync(CreateTitleDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var title = await _context.TitlePictureGalleries
                    .Include(t => t.TitleAnswers)
                    .Include(t => t.TitleImages)
                    .Include(t => t.Genres)
                    .FirstOrDefaultAsync(t => t.Id == dto.Id);

                if (title == null)
                    return false;

                // Update title name and category
                title.TitleName = dto.TitleName;
                title.Category = dto.Category;

                // --- Update Answers ---
                if (dto.TitleAnswers != null)
                {
                    _context.TitleAnswers.RemoveRange(title.TitleAnswers);
                    foreach (var answer in dto.TitleAnswers)
                    {
                        title.TitleAnswers.Add(new TitleAnswer
                        {
                            Answer = answer,
                            TitleId = title.Id
                        });
                    }
                }

                //// --- Update Genres ---
                //if (dto.Genres != null)
                //{
                //    var uniqueGenreNames = dto.Genres.Distinct().ToList();
                //    var existingGenres = await _context.Genres
                //        .Where(g => uniqueGenreNames.Contains(g.Name))
                //        .ToListAsync();

                //    var newGenreNames = uniqueGenreNames
                //        .Except(existingGenres.Select(g => g.Name))
                //        .ToList();

                //    foreach (var genreName in newGenreNames)
                //    {
                //        var newGenre = new Genre { Name = genreName };
                //        _context.Genres.Add(newGenre);
                //        existingGenres.Add(newGenre);
                //    }

                //    if (newGenreNames.Any())
                //        await _context.SaveChangesAsync();

                //    title.Genres.Clear();
                //    foreach (var genre in existingGenres)
                //        title.Genres.Add(genre);
                //}

                // --- Synchronize Images ---
                if (dto.TitleImages != null)
                {
                    // Remove images not in the new list
                    var dtoImageIds = dto.TitleImages.Select(i => i.Id).ToHashSet();
                    var imagesToRemove = title.TitleImages
                        .Where(img => !dtoImageIds.Contains(img.Id))
                        .ToList();
                    _context.TitleImages.RemoveRange(imagesToRemove);

                    // Add or update images
                    foreach (var imgDto in dto.TitleImages)
                    {
                        var existingImg = title.TitleImages.FirstOrDefault(i => i.Id == imgDto.Id);
                        if (existingImg != null)
                        {
                            existingImg.ImageUrl = imgDto.ImageUrl;
                            existingImg.ImageType = imgDto.ImageType;
                        }
                        else
                        {
                            title.TitleImages.Add(new TitleImage
                            {
                                ImageUrl = imgDto.ImageUrl,
                                ImageType = imgDto.ImageType,
                                TitleId = title.Id
                            });
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

    }
}
