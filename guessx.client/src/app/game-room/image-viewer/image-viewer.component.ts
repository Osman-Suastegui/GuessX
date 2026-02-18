import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GameSignalRService } from '../../services/game-signal-r.service';
import { RoomState } from '../room.model';

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
  @Input() showSquareAt: { row: number; col: number } | null = null;

  @Input() currentHint: number = 1;
  @Input() maxHints: number = 3;
  public animeImageSrc: string = '';
  public isTheWholeAnimeRevealed: boolean = false;

  @ViewChild('imgEl', { static: true }) imgRef!: ElementRef<HTMLImageElement>;
  @ViewChild('maskCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private displayW = 0; // canvas or image width size
  private displayH = 0; // canvas or image height size

  // gridRows and gridCols determine how many fragments the image will be divided into. For example, if gridRows=5 and gridCols=3,
  // the image will be divided into 15 fragments (5 rows x 3 columns).
  // Each hint will reveal one of these fragments
  private gridRows = 2;
  private gridCols = 2;

  constructor(public gameSignalRService: GameSignalRService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animeInformation']) {
      console.log('Anime information changed:', this.animeInformation);
      this.setUpImageViewer();
      this.isTheWholeAnimeRevealed = false;
    }

    if (changes['showSquareAt'] && this.showSquareAt) {
      this.revealSquareAt(this.showSquareAt.row, this.showSquareAt.col);
    }

    if (changes['currentHint'] && this.isMaximunHintsReached()) {
      this.revealTheWholeAnime();
    }
  }

  ngAfterViewInit() {
    this.setUpImageViewer();
  }

  setUpImageViewer() {
    const img = this.imgRef.nativeElement;
    img.onload = () => {
      this.setupCanvas();
    };
    // If already loaded
    if (img.complete) {
      this.setupCanvas();
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
  revealSquareAt(row: number, col: number) {
    if (!this.ctx) return;

    const x = col * (this.displayW / this.gridCols);
    const y = row * (this.displayH / this.gridRows);

    // clear a rectangle in that position to reveal part of the image
    this.ctx.clearRect(x, y, this.displayW / this.gridCols, this.displayH / this.gridRows);
  }

  handleSkip(): void {
    console.log('Usuario presionó skip');
  }

  isMaximunHintsReached(): boolean {
    return this.currentHint >= this.maxHints;
  }

  revealTheWholeAnime() {
    this.ctx.clearRect(0, 0, this.displayW, this.displayH);
    this.isTheWholeAnimeRevealed = true;
  }
}
