export class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.age = 0;
    this.maxAge = 10000; // Значение по умолчанию
  }

  update() {
    this.age++;
    if (this.age >= this.maxAge) {
      this.isAlive = false;
    }
  }
}