namespace GuessX.Server.Entities;

public partial class Anime
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public string Name { get; set; } = null!;

    public ICollection<Genre> Genres { get; set; } = new List<Genre>();

    public ICollection<CharacterOfTheDay> AnimeOfTheDays { get; set; } = new List<CharacterOfTheDay>();

    public int? MalId { get; set; } // this value is used for jikan api

    public ICollection<SplashOfTheDay> SplashOfTheDays { get; set; } = new List<SplashOfTheDay>();


}