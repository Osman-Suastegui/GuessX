import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrl: './time-bar.component.css',
})
export class TimeBarComponent implements OnChanges, OnDestroy, OnInit {
  @Input() roundDuration!: number;
  @Input() currentHint!: number;
  @Input() maxHints!: number;
  @Output() skip = new EventEmitter<void>();
  @Output() timeEnded = new EventEmitter<void>();

  timeLeft!: number;
  tempDuration: number = this.roundDuration;

  progress: number = 100;
  progress2: number = 0;
  private intervalId: any;
  private startTime!: number;
  private endTime!: number;
  private timerEnded: boolean = false;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roundDuration'] && !changes['roundDuration'].firstChange) {
      this.restartTimer();
      this.tempDuration = this.roundDuration;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private startTimer(): void {
    this.timerEnded = false;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.roundDuration * 1000;

    // THIS FUNCTION IS EXECUTING INFINITELY EVERY 50 MS
    // TODO: STOP EXECUTING WHEN  THE REMAINING IS 0
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(this.endTime - now, 0);
      this.timeLeft = Math.ceil(remaining / 1000);
      this.progress = (remaining / (this.roundDuration * 1000)) * 100;
      this.progress2 = 100 - (remaining / (this.roundDuration * 1000)) * 100;

      if (remaining <= 0 && !this.timerEnded) {
        this.timerEnded = true;
        this.clearTimer();
        this.timeEnded.emit();
      }
    }, 50); // actualiza cada 50ms (20 veces por segundo)
  }

  public restartTimer(): void {
    this.clearTimer();
    this.startTimer();
  }

  private clearTimer(): void {
    if (this.intervalId !== null && this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onSkip(): void {
    this.skip.emit();
    this.clearTimer(); // Detener al hacer skip (opcional)
  }

  resetTimer(): void {
    this.restartTimer();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  get progressColor(): string {
    if (this.progress > 66) {
      return 'bg-green-500';
    } else if (this.progress > 33) {
      return 'bg-yellow-400';
    } else {
      return 'bg-rose-500';
    }
  }
}
