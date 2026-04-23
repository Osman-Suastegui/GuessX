using System;

namespace GuessX.Server.Entities;

public partial class CharacterOfTheDay
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public int? CharacterId { get; set; }

    public DateOnly Date { get; set; }

    public Character? Character { get; set; }

    public TitlePictureGallery Game { get; set; } = null!;

    public Anime? Anime { get; set; }

    public int? AnimeId { get; set; }
}
