export default class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.color = 'transparent';
    this.isAlive = true;
    this.age = 0;
    this.maxAge = Math.random() * 5000 + 3000; // Случайный срок жизни от 3000 до 8000 "тиков"
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.age++;
    if (this.age >= this.maxAge) {
      this.isAlive = false; // Существо умирает, когда достигает максимального возраста
    }
  }
}