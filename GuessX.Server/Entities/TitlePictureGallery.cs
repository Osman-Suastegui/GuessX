using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GuessX.Server.Entities;

public partial class TitlePictureGallery
{
    public int Id { get; set; }

    public string TitleName { get; set; } = null!;

    public string? Category { get; set; }

    [Column("status")] // Para indicar el nombre exacto de la prop
    public string Status { get; set; } = "Active";

    public virtual ICollection<TitleAnswer> TitleAnswers { get; set; } = new List<TitleAnswer>();

    public virtual ICollection<TitleImage> TitleImages { get; set; } = new List<TitleImage>();

    public virtual ICollection<Genre> Genres { get; set; } = new List<Genre>();
}
