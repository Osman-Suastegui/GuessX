using System;
using System.Collections.Generic;

namespace GuessX.Server.Entities;

public partial class TitleAnswer
{
    public int Id { get; set; }

    public int TitleId { get; set; }

    public string Answer { get; set; } = null!;

    public virtual TitlePictureGallery Title { get; set; } = null!;
}
