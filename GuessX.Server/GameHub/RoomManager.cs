using GuessX.Server.Application.Dtos;
using System.Collections.Concurrent;

namespace GuessX.Server.GameHub
{
    public class RoomManager
    {
        private readonly ConcurrentDictionary<string, Room> _rooms = new();

        public Room CreateRoom(List<CreateTitleDto> titles, string owner)
        {
            var id = Guid.NewGuid().ToString("N");
            Room room = new Room
            {
                RoomId = id,
                Images = titles,
                Owner = owner
            };
            _rooms[id] = room;
            return room;
        }

        public void AddUser(string roomId, string user)
        {
            Console.WriteLine($"User {user} added to room {roomId}");
        }

        public Room GetRoom(string roomId)
        {
            return this._rooms[roomId];
        }

        public void UpdateUserScore(string roomId, string userName, int score)
        {
            Room room = this._rooms[roomId];
            UserRoom? userRoom = room.Users.Find(u => u.name == userName);
            if (userRoom != null)
            {
                userRoom.score = score;
            }
        }
    }
}
