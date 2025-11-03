using GuessX.Server.Application.Services;
using Microsoft.AspNetCore.SignalR;

namespace GuessX.Server.GameHub
{
    public class GameHub : Hub
    {
        private readonly RoomManager _rooms;
        private readonly CreatePictureService _createPictureService;

        public GameHub(RoomManager rooms, CreatePictureService createPictureService)
        {
            _rooms = rooms;
            _createPictureService = createPictureService;
        }

        public async Task<string> CreateRoom(string owner)
        {

            var titles = await this._createPictureService.GetAllTitlesAsync();
            var room = _rooms.CreateRoom(titles, owner);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            return room.RoomId; // caller builds share link: /room/{roomId}
        }

        public async Task<Room> JoinRoom(string roomId, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync("UserJoined", userName);

            return _rooms.GetRoom(roomId);

        }
        // Send chat only to this room
        public void SendMessage(string roomId, string message, string userName)
        {
            Room room = _rooms.GetRoom(roomId);
            List<string> answers = room.Images[room.CurrentImageIndex].TitleAnswers;

            string foundAnswer = answers.Find(answer => answer.ToLower() == message.ToLower());

            Clients.Group(roomId).SendAsync("MessageReceived", new
            {
                User = userName,
                Text = message,
                isAnswer = foundAnswer
            });
        }

    }
}
