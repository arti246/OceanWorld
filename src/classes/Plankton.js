import { Entity } from './Entity';

export class Plankton extends Entity {
  constructor(x, y) {
    super(x, y);
    this.width = 5;
    this.height = 5;
    this.color = "#19f205";
    this.speed = Math.random() * 0.5 + 0.1;
    this.direction = Math.random() * Math.PI * 2;
    this.reproductionChance = 0.0006;
    this.maxAge = Math.random() * 500 + 2000;
  }

  update() {
    super.update();
    if (!this.isAlive) return;

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    if (Math.random() < 0.02) {
      this.direction = Math.random() * Math.PI * 2;
    }

    this.x = Math.max(0, Math.min(800 - this.width, this.x));
    this.y = Math.max(0, Math.min(600 - this.height, this.y));
  }

  reproduce() {
    if (!this.isAlive) return null;
    return new Plankton(
      this.x + (Math.random() * 20 - 10),
      this.y + (Math.random() * 20 - 10)
    );
  }
}