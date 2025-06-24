import { Entity } from './Entity';

export class Fish extends Entity {
  constructor(x, y) {
    super(x, y);
    this.direction = Math.random() * Math.PI * 2;
    this.changeDirectionChance = 0.02;
  }

  update() {
    super.update();
    if (!this.isAlive) return;

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    if (Math.random() < this.changeDirectionChance) {
      this.direction = Math.random() * Math.PI * 2;
    }

    this.x = Math.max(0, Math.min(800 - this.width, this.x));
    this.y = Math.max(0, Math.min(600 - this.height, this.y));
  }

  reproduce() {
    if (!this.isAlive) return null;
    return new this.constructor(
      this.x + (Math.random() * 30 - 15),
      this.y + (Math.random() * 30 - 15)
    );
  }
}