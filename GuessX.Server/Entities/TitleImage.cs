using System;
using System.Collections.Generic;

namespace GuessX.Server.Entities;

public partial class TitleImage
{
    public int Id { get; set; }

    public int TitleId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string? ImageType { get; set; }

    public virtual TitlePictureGallery Title { get; set; } = null!;
}
