namespace GuessX.Server.Application.Dtos;

public class CharacterDto
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Metadata { get; set; }

    public override string ToString()
    {
        return $"Id: {Id}, GameId: {GameId}, Name: {Name}, Metadata: {Metadata}";
    }
}

public class CharacterOfTheDayResponseDto
{
    public int Id { get; set; }

    public int GameId { get; set; }

    public int CharacterId { get; set; }

    public DateOnly Date { get; set; }

    public CharacterDto Character { get; set; } = new();
}
