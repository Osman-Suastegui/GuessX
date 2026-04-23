using System;
using System.Collections.Generic;

namespace GuessX.Server.Entities;

// this is used for searching
public partial class Character
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public string Name { get; set; } = null!;

    public string? Metadata { get; set; }

    public TitlePictureGallery Game { get; set; } = null!;
    
    public ICollection<CharacterOfTheDay> CharacterOfTheDays { get; set; } = new List<CharacterOfTheDay>();

    public int? MalId { get; set; } // this value is used for jikan api

}
