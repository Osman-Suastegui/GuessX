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

        // the variable numberOfPictures tell us how many pictures the game will show in the current game
        // the owner variable is for tracking who created the room,so we can give the owner specifics permissions
        public async Task<string> CreateRoom(string owner,int numberOfPictures)
        {
            Console.WriteLine("number of pictures" + numberOfPictures);
            var titles = await this._createPictureService.GetAllTitlesAsync(numberOfPictures);
            var room = _rooms.CreateRoom(titles, owner);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            return room.RoomId; // caller builds share link: /room/{roomId}
        }

        public async Task<Room> JoinRoom(string roomId, string userName)
        {
            Room room = _rooms.GetRoom(roomId);

            if (!room.Users.Any(u => u.name == userName))
            {
                room.Users.Add(new UserRoom { name = userName, score = 0 });
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync("UserJoined", userName);

            await Clients.Group(roomId).SendAsync("roomUpdated", room);

            await SendMessage(roomId,$"{userName} has joined!","system");
            return _rooms.GetRoom(roomId);

        }
        // Send chat only to this room
        public async Task SendMessage(string roomId, string message, string userName)
        {
            Room room = _rooms.GetRoom(roomId);
            List<string> answers = room.Images[room.CurrentImageIndex].TitleAnswers;

            string foundAnswer = answers.Find(answer => answer.ToLower() == message.ToLower());
            await Clients.Group(roomId).SendAsync("MessageReceived", new
            {
                User = userName,
                Text = message,
                isAnswer = foundAnswer
            });

            if (foundAnswer != null){
                _rooms.UpdateUserScore(roomId, userName, 1);
                room.CurrentImageIndex++;
                Console.WriteLine($"Room: {room.ToString()}");
                await Clients.Group(roomId).SendAsync("roomUpdated", room);
            }


        }

    }
}
