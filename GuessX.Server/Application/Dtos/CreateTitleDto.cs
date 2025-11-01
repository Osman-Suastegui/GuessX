namespace GuessX.Server.Application.Dtos;


public class CreateTitleDto
{
    public int? Id { get; set; }
    public string TitleName { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public List<string>? Genres { get; set; }
    public List<TitleImageDto>? TitleImages { get; set; }
    public List<string>? TitleAnswers { get; set; }
}

public class TitleImageDto
{
    public int? Id { get; set; }

    public string ImageUrl { get; set; }
    public string ImageType { get; set; }
}
