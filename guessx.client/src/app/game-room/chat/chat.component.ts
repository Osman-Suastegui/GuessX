import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GameSignalRService } from '../../services/game-signal-r.service';
import { StorageService } from '../../services/storage.service';
import { ChatMessage } from '../room.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() roomId: string = '';
  @Input() animeInformation: any = {
    name: '',
    src: '',
    answers: [],
  };

  // Chat Messages, mockup data, system messages, and user messages
  messages: ChatMessage[] = [{ id: 1, text: 'Welcome to the game!', sender: 'system', timestamp: new Date(), ownMessage: false }];

  answerFormControl = new FormControl('');
  type: FormControl = new FormControl('');

  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLElement>;

  private messageSubscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    public gameSignalRService: GameSignalRService,
    private storageService: StorageService,
  ) {}

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
    const playerName: string = this.storageService.getPlayerName() || '';
    const message = this.type.value?.trim();

    if (!message || message.length === 0) {
      return;
    }

    this.gameSignalRService.invoke('SendMessage', this.roomId, message, playerName);

    this.type.setValue('');
    this.cdr.detectChanges();
    this.scrollToBottom();
  }
}
