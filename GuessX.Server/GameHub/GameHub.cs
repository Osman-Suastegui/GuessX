using System.Numerics;
using Microsoft.AspNetCore.SignalR;

namespace GuessX.Server.GameHub
{
    public class GameHub: Hub
    {


        public async Task JoinRoom(string roomId, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync("NewUser", $"{userName} entró al canal");


        }

    }
}
