namespace GuessX.Server.Entities;

public partial class SplashOfTheDay
{
    public SplashOfTheDay()
    {
        Date = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public int Id { get; set; }

    public int GameId { get; set; }

    public DateOnly Date { get; set; }

    public TitlePictureGallery Game { get; set; } = null!;

    public Character? Character { get; set; } = null!;

    public int? CharacterId { get; set; }

    public string SplashImageUrl { get; set; } = null!;

    public Anime? Anime { get; set; }

    public int? AnimeId { get; set; }
}
