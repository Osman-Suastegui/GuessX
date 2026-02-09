import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GameSignalRService } from '../../services/game-signal-r.service';
import { ChatMessage } from '../room.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLElement>;
  @Input() roomId: string = "";
  @Input() animeInformation: any = {
    name: "",
    src: "",
    answers: []
  }
  constructor(
    private cdr: ChangeDetectorRef,
    public gameSignalRService: GameSignalRService) { }

  answerFormControl = new FormControl('')

  type: FormControl = new FormControl("");

  private messageSubscription?: Subscription;

  // Chat Messages, mockup data, system messages, and user messages
  messages: ChatMessage[] = [
    { id: 1, text: 'Welcome to the game!', sender: 'system', timestamp: new Date(), ownMessage: false },
  ];

  ngOnInit(): void {
    // Subscribe to incoming messages
    this.messageSubscription = this.gameSignalRService.messages$.subscribe((message: ChatMessage) => {
      // New message from another user or system
      message.id = this.messages.length + 1;
      this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  private scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  onMessageSend(event: Event) {
    event.preventDefault(); // ❌ Previene la recarga
    const playerName: string = localStorage.getItem("playerName") || ""
    const message = this.type.value?.trim();

    if (!message || message.length === 0) {
      return;
    }

    this.gameSignalRService.invoke("SendMessage", this.roomId, message, playerName);

    this.type.setValue('');
    this.cdr.detectChanges();
    this.scrollToBottom()
  }

}
