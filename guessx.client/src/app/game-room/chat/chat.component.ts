import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  players = [
    { id: 1, name: 'Player One', score: 1500, correct: 12, avatar: 'P1' },
    { id: 2, name: 'Player Two', score: 1400, correct: 11, avatar: 'P2' },
    { id: 3, name: 'Player Three', score: 0, correct: 10, avatar: 'P3' },

    // ...otros jugadores
  ];

  // Chat Messages, mockup data, system messages, and user messages
  messages = [
    { id: 1, text: 'Welcome to the game!', sender: 'system', timestamp: new Date() },
    { id: 2, text: 'Player One has joined the game.', sender: 'system', timestamp: new Date() },
    { id: 3, text: 'Player Two has joined the game.', sender: 'system', timestamp: new Date() },
    { id: 4, text: 'Player Three has joined the game.', sender: 'system', timestamp: new Date() },
    { id: 5, text: 'Player One: Hello everyone!', sender: 'user', timestamp: new Date() },
    { id: 6, text: 'Player Two: Ready to play!', sender: 'user', timestamp: new Date() },
    { id: 7, text: 'Player Three: Let\'s do this!', sender: 'user', timestamp: new Date() }
  ];

}
