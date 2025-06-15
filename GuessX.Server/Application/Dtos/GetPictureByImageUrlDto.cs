namespace GuessX.Server.Application.Dtos
{
    public class GetPictureByImageUrlDto
    {
        public int Id { get; set; }
        public string TitleName { get; set; }
        public string? Category { get; set; }
        public List<string>? Genres { get; set; }
        public List<TitleImageDto>? TitleImages { get; set; }
        public List<TitleAnswersDto>? TitleAnswers { get; set; }
    }

    public class TitleAnswersDto
    {
        public int Id { get; set; }
        public string? Answer { get; set; }
    }


}
