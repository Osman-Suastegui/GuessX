namespace GuessX.Server.GameHub
{
    public class GameConfig
    {
        public int Rounds { get; set; }
        public string[] Categories { get; set; }
        public int Speed { get; set; }
        public string SpeedLabel { get; set; }
        int SpeedSeconds { get; set; }
    }
}