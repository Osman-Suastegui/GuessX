using GuessX.Server.Application.Dtos;

namespace GuessX.Server.GameHub
{
    public class Room
    {
        public string RoomId { get; init; }
        public string HostConnectionId { get; set; } // optional host
        //public List<UserInfo> Users { get; } = new();
        public List<CreateTitleDto> Images { get; init; } = new();
        public string Owner { get; init; } = "";
        public int CurrentImageIndex { get; set; } = 0;
        public List<UserRoom> Users { get; set; } = new List<UserRoom>();


        //public List<ChatMessage> RecentChat { get; } = new();
        //public object Lock = new object();

        public override string ToString()
        {
            return $"RoomId: {RoomId}, Owner: {Owner}, CurrentImageIndex: {CurrentImageIndex}";
        }

    }

}
