using System;
using System.Collections.Generic;

namespace GuessX.Server.Entities;

public partial class Character
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public string Name { get; set; } = null!;

    public string? Metadata { get; set; }

    public TitlePictureGallery Game { get; set; } = null!;
    
    public ICollection<CharacterOfTheDay> CharacterOfTheDays { get; set; } = new List<CharacterOfTheDay>();

}
