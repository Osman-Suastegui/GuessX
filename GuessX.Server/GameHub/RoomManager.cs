using System.Collections.Concurrent;

namespace GuessX.Server.GameHub
{
    public class RoomManager
    {
        private readonly ConcurrentDictionary<string, Room> _rooms = new();

        public Room CreateRoom()
        {
            var id = Guid.NewGuid().ToString("N");
            var room = new Room
            {
                RoomId = id,
            };
            _rooms[id] = room;
            return room;
        }

        public void AddUser(string roomId, string user)
        {
            Console.WriteLine($"User {user} added to room {roomId}");
        }
    }
}
