import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SIGNAL_CONST } from '../../const/signal.const';
import { GameSignalRService } from '../../services/game-signal-r.service';
import { StorageService } from '../../services/storage.service';
import { RoomState } from '../room.model';
import { TimeBarComponent } from '../time-bar/time-bar.component';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.css',
})
export class ImageViewerComponent implements AfterViewInit, OnChanges {
  /** Size of each reveal window (in CSS px) */
  @Input() fragWidth = 100;
  @Input() fragHeight = 100;
  @Input() totalPlayers: number = 0;
  @Input() animeInformation: any = {
    name: '',
    src: '',
    answers: [],
  };
  @Input() roomState: RoomState | null = null;

  public currentHint: number = 1;
  public maxHints: number = 3;
  public animeImageSrc: string = '';
  public isTheWholeAnimeRevealed: boolean = false;
  public roundDuration: number = 3; // duration of each round in seconds

  @ViewChild(TimeBarComponent, { static: true }) timerBar!: TimeBarComponent;
  @ViewChild('imgEl', { static: true }) imgRef!: ElementRef<HTMLImageElement>;
  @ViewChild('maskCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private displayW = 0; // canvas or image width size
  private displayH = 0; // canvas or image height size
  private availableSquares: { r: number; c: number }[] = [];

  // gridRows and gridCols determine how many fragments the image will be divided into. For example, if gridRows=5 and gridCols=3,
  // the image will be divided into 15 fragments (5 rows x 3 columns).
  // Each hint will reveal one of these fragments
  private gridRows = 5;
  private gridCols = 3;

  constructor(
    public gameSignalRService: GameSignalRService,
    private storageService: StorageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animeInformation']) {
      this.initAvailableSquares();
      this.currentHint = 0;
      this.restartTimer();
      this.setUpImageViewer();
      this.isTheWholeAnimeRevealed = false;
    }
  }

  ngAfterViewInit() {
    this.setUpImageViewer();
  }

  setUpImageViewer() {
    const img = this.imgRef.nativeElement;
    img.onload = () => {
      this.setupCanvas();
      // this is for show the first hint immediately, if the image is not already loaded
      this.revealHint();
    };
    // If already loaded
    if (img.complete) {
      this.setupCanvas();
    }
  }

  initAvailableSquares() {
    this.availableSquares = [];
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        this.availableSquares.push({ r, c });
      }
    }
  }

  private setupCanvas() {
    const img = this.imgRef.nativeElement;
    // measure actual display size
    this.displayW = img.clientWidth;
    this.displayH = img.clientHeight;

    const canvas = this.canvasRef.nativeElement;

    // // size the canvas backing store
    canvas.width = this.displayW;
    canvas.height = this.displayH;

    this.ctx = canvas.getContext('2d')!;

    // fill entire canvas with semi-opaque mask
    this.ctx.fillStyle = 'rgba(0,0,0,1)';
    this.ctx.fillRect(0, 0, this.displayW, this.displayH);
    this.animeImageSrc = this.animeInformation.src;
  }

  /** Call this to clear one more random hole */
  nextFragment() {
    if (!this.ctx) return;

    // pick a random available square
    const randomIndex = Math.floor(Math.random() * this.availableSquares.length);

    const { r, c } = this.availableSquares[randomIndex];
    // remove that square from the available ones so we dont repeat it
    this.availableSquares.splice(randomIndex, 1);

    const x = c * (this.displayW / this.gridCols);
    const y = r * (this.displayH / this.gridRows);

    // clear a rectangle in that position to reveal part of the image
    this.ctx.clearRect(x, y, this.displayW / this.gridCols, this.displayH / this.gridRows);
  }

  restartTimer(): void {
    this.timerBar.restartTimer();
  }

  handleSkip(): void {
    console.log('Usuario presionó skip');
  }

  handleTimeEnd(): void {
    // Maximum hints reached, reveal the whole image
    if (this.isMaximunHintsReached()) {
      console.log('Maximum hints reached. Revealing the whole anime...');
      this.revealTheWholeAnime();
      // after we reveal the whole anime we should show the next one after a few seconds, for example 5 seconds
      setTimeout(() => {
        // we send a signal to the server to show the next anime
        // only the owner of the room should send this signal,
        // because if we send it from multiple clients,
        // it could cause showing the next picture multiple times
        if (this.roomState?.owner === this.storageService.getPlayerName()) {
          // SHOW NEXT PICTURE
          this.gameSignalRService.invoke(SIGNAL_CONST.SHOW_NEXT_PICTURE, this.roomState?.roomId);
        }
      }, 2000);
      return;
    }
    // Reveal a hint
    this.revealHint();
  }

  revealHint() {
    // RELEAL NEXT HINT
    this.gameSignalRService.invoke(SIGNAL_CONST.REVEAL_NEXT_HINT, this.roomState?.roomId);
    this.nextFragment();
    this.timerBar.resetTimer();
    this.currentHint++;
  }

  isMaximunHintsReached(): boolean {
    return this.currentHint >= this.maxHints;
  }

  revealTheWholeAnime() {
    this.ctx.clearRect(0, 0, this.displayW, this.displayH);
    this.isTheWholeAnimeRevealed = true;
  }
}
