using GuessX.Server.Entities;

namespace GuessX.Server.Application.Dtos;

public class SplashOfTheDayDto
{
    public int Id { get; set; }

    public string GameName { get; set; } = null!;
    public DateOnly Date { get; set; }

    public string Name { get; set; } = null!;

    public string SplashImageUrl { get; set; } = null!;


}