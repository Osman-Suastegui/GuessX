using System;
using System.Collections.Generic;

namespace GuessX.Server.Entities;

public partial class Genre
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<TitlePictureGallery> Titles { get; set; } = new List<TitlePictureGallery>();
}
