using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using GuessX.Server.Application.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.ObjectPool;
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
        public async Task<string> CreateRoom(string owner, int numberOfPictures, int gridRows, int gridCols)
        {
            Console.WriteLine("number of pictures" + numberOfPictures);
            var titles = await this._createPictureService.GetAllTitlesAsync(numberOfPictures);
            var room = _rooms.CreateRoom(titles, owner, gridRows, gridCols);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            return room.RoomId; // caller builds share link: /room/{roomId}
        }

        public async Task<Room> JoinRoom(string roomId, string userName)
        {
            Room room;
            try
            {

                room = _rooms.GetRoom(roomId);
                room.CurrentEndPoint = "JoinRoom";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error joining room: {ex.Message}");
                throw new Exception($"Room with ID {roomId} not found.");
            }

            if (!room.Users.Any(u => u.name == userName))
            {
                room.Users.Add(new UserRoom { name = userName, score = 0 });
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).SendAsync("UserJoined", userName);

            await Clients.Group(roomId).SendAsync("roomUpdated", room);

            await SendMessage(roomId, $"{userName} has joined!", "system");
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

            if (foundAnswer != null)
            {
                _rooms.UpdateUserScore(roomId, userName, 1);
                room.CurrentImageIndex++;
                Console.WriteLine($"Room: {room.ToString()}");
                await Clients.Group(roomId).SendAsync("roomUpdated", room);
            }

        }

        public async Task ShowNextPicture(string roomId)
        {
            Console.WriteLine("Show next picture signal received for room: " + roomId);
            Room room = _rooms.GetRoom(roomId);
            room.CurrentEndPoint = "ShowNextPicture";
            if (room.CurrentImageIndex < room.Images.Count - 1)
            {
                room.InitAvailableSquares(); // reset available squares for the new image
                room.RevealedSquares.Clear(); // clear revealed squares for the new image
                room.CurrentImageIndex++;
                Console.WriteLine($"Room: {room.ToString()}");
                await Clients.Group(roomId).SendAsync("roomUpdated", room);
            }
        }

        // reaveal next hint
        public async Task RevealNextHint(string roomId)
        {
            Console.WriteLine("Reveal next hint signal received for room: " + roomId);
            Room room = _rooms.GetRoom(roomId);
            room.CurrentEndPoint = "RevealNextHint";
            // take random available square
            do
            {
                int randomIndex = Random.Shared.Next(0, room.AvailableSquares.Count);
                room.currentSquareToShowIndex = randomIndex;

            } while (room.RevealedSquares.Contains(room.currentSquareToShowIndex));
            Console.WriteLine(room.AvailableSquares);
            room.RevealedSquares.Add(room.currentSquareToShowIndex);

            await Clients.Group(roomId).SendAsync("roomUpdated", room);
        }

    }
}
