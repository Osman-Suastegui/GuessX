import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface GameConfig {
  rounds: number;
  categories: string[];
  speed: number;
  speedLabel: string;
  speedSeconds: number;
}

@Component({
  selector: 'app-room-configurator',
  standalone: true,
  imports: [],
  templateUrl: './room-configurator.component.html',
  styleUrls: ['./room-configurator.component.css'],
})
export class RoomConfigurator {
  @Input() visible: boolean = true;
  @Output() startGame = new EventEmitter<GameConfig>();

  rounds: number = 10;
  categories: string[] = ['SHONEN'];
  speed: number = 2; // 1: slow, 2: normal, 3: turbo

  categoryOptions = ['RANDOM', 'ACTION', 'SHONEN', 'ROMANCE', 'SCI-FI', 'FANTASY', 'HORROR'];

  get speedLabel() {
    return this.speed === 1 ? 'SLOW' : this.speed === 2 ? 'NORMAL' : 'TURBO';
  }
  get speedSeconds() {
    return this.speed === 1 ? 15 : this.speed === 2 ? 10 : 5;
  }

  toggleCategory(cat: string) {
    if (this.categories.includes(cat)) {
      this.categories = this.categories.filter((c) => c !== cat);
    } else {
      this.categories = [...this.categories, cat];
    }
  }

  setRounds(event: any) {
    this.rounds = event.target.value;
  }

  setSpeed(event: any) {
    this.speed = event.target.value;
  }

  emitConfig() {
    this.startGame.emit({
      rounds: this.rounds,
      categories: this.categories,
      speed: this.speed,
      speedLabel: this.speedLabel,
      speedSeconds: this.speedSeconds,
    });
  }

  applyTemplate(template: string) {
    if (template === 'NORMAL') {
      this.rounds = 10;
      this.categories = this.shuffleCategories();
      this.speed = 2;
    } else if (template === 'FAST') {
      this.rounds = 5;
      this.categories = this.shuffleCategories();
      this.speed = 3;
    } else if (template === 'SLOW') {
      this.rounds = 15;
      this.categories = this.shuffleCategories();
      this.speed = 1;
    }
  }

  shuffleCategories() {
    // Devuelve 2-3 categorías aleatorias
    const shuffled = [...this.categoryOptions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}
