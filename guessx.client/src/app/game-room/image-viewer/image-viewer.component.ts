import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TimeBarComponent } from '../time-bar/time-bar.component';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.css'
})
export class ImageViewerComponent {

  @ViewChild(TimeBarComponent) timerBar!: TimeBarComponent;
  /** Size of each reveal window (in CSS px) */
  @Input() fragWidth = 100;
  @Input() fragHeight = 100;

  @ViewChild('imgEl', { static: true }) imgRef!: ElementRef<HTMLImageElement>;
  @ViewChild('maskCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private displayW = 0;
  private displayH = 0;

  public currentHint: number = 1;
  public maxHints: number = 5;
  public animeInformation: any = {
    name: "Demon Slayer",
    src: "../../../assets/demon_slayer.webp",
  }
  public animeImageSrc: string = '';

  ngAfterViewInit() {
    const img = this.imgRef.nativeElement;
    img.onload = () => this.setupCanvas();
    // If already loaded
    if (img.complete) {
      this.setupCanvas();
    }
  }

  private setupCanvas() {
    const img = this.imgRef.nativeElement;
    console.log('Image loaded', img.clientWidth, img.clientHeight);
    // measure actual display size
    this.displayW = img.clientWidth;
    this.displayH = img.clientHeight;

    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;

    // size the canvas backing store
    canvas.width = this.displayW * dpr;
    canvas.height = this.displayH * dpr;
    // keep CSS size
    canvas.style.width = `${this.displayW}px`;
    canvas.style.height = `${this.displayH}px`;

    this.ctx = canvas.getContext('2d')!;
    // scale so drawing commands use CSS px
    this.ctx.scale(dpr, dpr);

    // fill entire canvas with semi-opaque mask
    this.ctx.fillStyle = 'rgba(0,0,0,1)';
    this.ctx.fillRect(0, 0, this.displayW, this.displayH);
    this.animeImageSrc = this.animeInformation.src;
  }

  /** Call this to clear one more random hole */
  nextFragment() {
    if (!this.ctx) return;

    // pick a random top-left so the window stays inside image
    const maxX = this.displayW - this.fragWidth;
    const maxY = this.displayH - this.fragHeight;
    const x = Math.floor(Math.random() * (maxX + 1));
    const y = Math.floor(Math.random() * (maxY + 1));

    // clear that rectangle—leaving previous holes intact
    this.ctx.clearRect(x, y, this.fragWidth, this.fragHeight);
  }

  reiniciarTemporizador(): void {
    this.timerBar.resetTimer();
  }

  handleSkip(): void {
    console.log('Usuario presionó skip');
  }

  handleTimeEnd(): void {
    // Maximum hints reached, reveal the whole image
    if (this.isMaximunHintsReached()) {
      this.revealTheWholeAnime();
      return;
    }
    // Reveal a hint
    this.revealHint();
  }

  revealHint() {
    this.nextFragment();
    this.timerBar.resetTimer();
    this.currentHint++;
  }

  isMaximunHintsReached(): boolean {
    return this.currentHint >= this.maxHints;
  }

  revealTheWholeAnime() {
    this.ctx.clearRect(0, 0, this.displayW, this.displayH);
  }

}
