namespace GuessX.Server.GameHub
{
    public class Room
    {
        public string RoomId { get; init; }
        public string HostConnectionId { get; set; } // optional host
        //public List<UserInfo> Users { get; } = new();
        //public List<ImageItem> Images { get; } = new();
        //public int CurrentImageIndex { get; set; } = 0;
        //public List<ChatMessage> RecentChat { get; } = new();
        //public object Lock = new object();
    }
}
