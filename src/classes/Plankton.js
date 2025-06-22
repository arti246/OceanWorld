import Entity from './Entity';

export default class Plankton extends Entity {
  constructor(x, y) {
    super(x, y);
    this.width = 5;
    this.height = 5;
    this.color = `hsl(${Math.random() * 60 + 100}, 100%, 50%)`; // Зеленоватые оттенки
    this.speed = Math.random() * 0.5 + 0.1;
    this.direction = Math.random() * Math.PI * 2;
    this.reproductionChance = 0.0006; // Шанс размножения в каждом кадре
    this.maxAge = Math.random() * 3500 + 2000; // Более короткая жизнь, чем у других существ
  }

  update() {
    super.update(); // Вызываем родительский метод для обновления возраста
    
    if (!this.isAlive) return;
    
    // Движение
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // Случайное изменение направления
    if (Math.random() < 0.02) {
      this.direction = Math.random() * Math.PI * 2;
    }

    // Границы океана
    this.x = Math.max(0, Math.min(800 - this.width, this.x));
    this.y = Math.max(0, Math.min(600 - this.height, this.y));

    // Изменение цвета с возрастом
    const ageRatio = this.age / this.maxAge;
    this.color = `hsl(${100 + ageRatio * 20}, ${100 - ageRatio * 50}%, ${50 + ageRatio * 20}%)`;
  }

  // Метод для размножения (возвращает нового планктона или null)
  reproduce() {
    if (!this.isAlive) return null;
    return new Plankton(
      this.x + (Math.random() * 20 - 10),
      this.y + (Math.random() * 20 - 10)
    );
  }
}