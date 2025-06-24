import { Fish } from './Fish';

export class BigFish extends Fish {
  constructor(x, y) {
    super(x, y);
    this.width = 20;
    this.height = 12;
    this.color = "#eb0c0c";
    this.speed = Math.random() * 1 + 0.3;
    this.visionRadius = 80;
    this.reproductionChance = 0.0001;
    this.maxAge = Math.random() * 8000 + 5000;
  }
}