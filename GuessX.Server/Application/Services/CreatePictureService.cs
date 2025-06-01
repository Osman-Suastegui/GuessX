using GuessX.Server.Data;
using GuessX.Server.Entities;
using GuessX.Server.Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GuessX.Server.Application.Services
{


public class CreatePictureService
{
    private readonly AppDbContext _context;

    public CreatePictureService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> CreateTitleAsync(CreateTitleDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var title = new TitlePictureGallery
            {
                Id = dto.Id,
                TitleName = dto.TitleName,
                Category = dto.Category,
                Genres = new List<Genre>(),
                TitleImages = new List<TitleImage>(),
                TitleAnswers = new List<TitleAnswer>()
            };

                if (dto.Genres != null)
                {
                    var uniqueGenreNames = dto.Genres.Distinct().ToList();

                    // Get existing genres from the database
                    var existingGenres = await _context.Genres
                        .Where(g => uniqueGenreNames.Contains(g.Name))
                        .ToListAsync();

                    // Find genre names that do not exist yet
                    var newGenreNames = uniqueGenreNames
                        .Except(existingGenres.Select(g => g.Name))
                        .ToList();

                    // Add new genres to the context
                    foreach (var genreName in newGenreNames)
                    {
                        _context.Genres.Add(new Genre { Name = genreName });
                    }

                    // Save all new genres at once
                    if (newGenreNames.Any())
                        await _context.SaveChangesAsync();

                    // Get all genres again (now including the new ones)
                    var allGenres = await _context.Genres
                        .Where(g => uniqueGenreNames.Contains(g.Name))
                        .ToListAsync();

                    title.Genres = allGenres;
                }

                // Handle title images
                if (dto.TitleImages != null)
            {
                foreach (var img in dto.TitleImages)
                {
                    title.TitleImages.Add(new TitleImage
                    {
                        Id = img.Id,
                        ImageUrl = img.ImageUrl,
                        ImageType = img.ImageType,
                        Title = title
                    });
                }
            }

            // Handle title answers
            if (dto.TitleAnswers != null)
            {
                foreach (var answer in dto.TitleAnswers)
                {
                    title.TitleAnswers.Add(new TitleAnswer
                    {
                        Answer = answer,
                        Title = title
                    });
                }
            }

            _context.TitlePictureGalleries.Add(title);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return title.Id;

        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

    }
}
}
