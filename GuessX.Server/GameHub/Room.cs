using GuessX.Server.Application.Dtos;

namespace GuessX.Server.GameHub
{
    public class Room
    {
        public string CurrentEndPoint { get; set; } = "";
        public string RoomId { get; init; }
        public string HostConnectionId { get; set; } // optional host
        //public List<UserInfo> Users { get; } = new();
        public List<CreateTitleDto> Images { get; init; } = new();
        public string Owner { get; init; } = "";
        public int CurrentImageIndex { get; set; } = 0;
        public List<UserRoom> Users { get; set; } = new List<UserRoom>();

        public int GridRows { get; set; } = 3; // default value
        public int GridCols { get; set; } = 3; // default value
        public List<Square> AvailableSquares { get; set; } = new();

        public List<int> RevealedSquares { get; set; } = new(); // list of revealed square indices

        public int currentSquareToShowIndex { get; set; } = 0; // index to track which square to reveal next

        //public List<ChatMessage> RecentChat { get; } = new();
        //public object Lock = new object();

        public Room(string roomId, string owner, int gridRows = 3, int gridCols = 3)
        {
            RoomId = roomId;
            Owner = owner;
            GridRows = gridRows;
            GridCols = gridCols;
            InitAvailableSquares();
        }

        public void InitAvailableSquares()
        {
            AvailableSquares = new List<Square>();
            for (int r = 0; r < GridRows; r++)
            {
                for (int c = 0; c < GridCols; c++)
                {
                    AvailableSquares.Add(new Square { row = r, col = c });
                }
            }
        }

        public class Square
        {
            public int row { get; set; }
            public int col { get; set; }
        }

        public override string ToString()
        {
            return $"RoomId: {RoomId}, Owner: {Owner}, CurrentImageIndex: {CurrentImageIndex}";
        }

    }

}
