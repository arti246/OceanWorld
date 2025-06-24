import { Fish } from './Fish';

export class SmallFish extends Fish {
  constructor(x, y) {
    super(x, y);
    this.width = 10;
    this.height = 6;
    this.color = "#0dd9d9";
    this.speed = Math.random() * 2 + 0.5;
    this.visionRadius = 50;
    this.reproductionChance = 0.0003;
    this.maxAge = Math.random() * 5000 + 3000;
  }
}