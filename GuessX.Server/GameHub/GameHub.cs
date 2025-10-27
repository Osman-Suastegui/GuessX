using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;

namespace GuessX.Server.GameHub
{
    public class GameHub: Hub
    {
        private readonly RoomManager _rooms;
        public GameHub(RoomManager rooms) { _rooms = rooms; }

        public async Task<string> CreateRoom()
        {
            var room = _rooms.CreateRoom();
            // Optionally add caller as host
            _rooms.AddUser(room.RoomId, "OSMAN");
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            return room.RoomId; // caller builds share link: /room/{roomId}
        }

        public async Task JoinRoom(string roomId, string userName)
        {
            Console.WriteLine("user name " + userName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
           
            await Clients.Group(roomId).SendAsync("UserJoined", userName);


        }

    }
}
