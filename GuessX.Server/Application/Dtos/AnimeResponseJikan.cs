using System.Text.Json;
namespace GuessX.Server.Application.Dtos;

public class AnimeResponseJikan
{
    public string Name { get; }
    public string ImageUrl { get; }

    public AnimeResponseJikan(string json)
    {
        using var doc = JsonDocument.Parse(json);

        var root = doc.RootElement;

        Name = root
            .GetProperty("data")
            .GetProperty("title")
            .GetString() ?? string.Empty;

        ImageUrl = root
            .GetProperty("data")
            .GetProperty("images")
            .GetProperty("jpg")
            .GetProperty("image_url")
            .GetString() ?? string.Empty;
    }
}