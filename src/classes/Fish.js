import { Entity } from './Entity';

export class Fish extends Entity {
  constructor(x, y) {
    super(x, y);
    this.direction = Math.random() * Math.PI * 2;
    this.changeDirectionChance = 0.02;
    this.hunger = 60;
    this.hungerDifference = 0.03; // Базовое значение уменьшения голода
    this.target = null;
    this.hungerThreshold = 50; // Порог, при котором начинаем искать еду
    this.eatingDistance = 10; // Дистанция для "поедания"
  }

  update(entities) {
    super.update();
    if (!this.isAlive) return;

    // Уменьшаем сытость
    this.hunger -= this.hungerDifference;

    // Если голодны и нет цели - ищем еду
    if (this.hunger < this.hungerThreshold && !this.target) {
      this.findFood(entities);
    }

    // Если есть цель
    if (this.target) {
      this.moveToTarget();
      
      // Проверяем, достигли ли цели
      if (this.isTargetReached()) {
        this.eat();
      }
    } else {
      // Случайное движение, если нет цели
      this.moveRandomly();
    }

    // Ограничиваем положение в границах океана
    this.x = Math.max(0, Math.min(800 - this.width, this.x));
    this.y = Math.max(0, Math.min(600 - this.height, this.y));
  }

  findFood(entities) {}

  moveToTarget() {
    if (!this.target || !this.target.isAlive) {
      this.target = null;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;

    const targetAngle = Math.atan2(dy, dx);
    const angleDiff = ((targetAngle - this.direction + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    this.direction += angleDiff * 0.1; // Коэффициент плавности поворота

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
  }

  isTargetReached() {
    if (!this.target) return false;
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    return Math.sqrt(dx*dx + dy*dy) < this.eatingDistance;
  }

  eat() {
    this.hunger = 100; // Полное насыщение
    if (this.target) {
      this.target.isAlive = false; // "Съедаем" цель
    }
    this.target = null;
  }

  moveRandomly() {
    if (Math.random() < this.changeDirectionChance) {
      this.direction = Math.random() * Math.PI * 2;
    }
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
  }

  reproduce() {
    if (!this.isAlive) return null;
    return new this.constructor(
      this.x + (Math.random() * 30 - 15),
      this.y + (Math.random() * 30 - 15)
    );
  }

  getDisplayColor() {
    return this.hunger < this.hungerThreshold ? "#000000" : this.color;
  }

  hasActiveTarget() {
    return this.target && this.target.isAlive && this.hunger < this.hungerThreshold;
  }
}