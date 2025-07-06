import { Fish } from './Fish';
import { Plankton } from './Plankton';
import { BigFish } from './BigFish';

export class SmallFish extends Fish {
  constructor(x, y, width = 10, height = 6) {
    super(x, y, width, height);
    this.color = "#0dd9d9";
    this.speed = Math.random() * 0.5 + 0.3;
    this.visionRadius = 50;
    this.maxAge = Math.random() * 5000 + 3000;
    this.hungerDifference = 0.05; // Маленькие рыбы голодают быстрее
    this.eatingDistance = 8; // Дистанция для поедания планктона
    this.panicSpeed = this.speed * 1.5; // Ускорение при панике
    this.panicMode = false;
    this.energyLoss = 0.1; // Тратим энергию при панике

    this.reproductionRate = 0.05; // Быстрее размножаются
  }

  update(entities) {
    // Проверяем наличие хищников перед основным поведением
    this.checkPredators(entities);
    return super.update(entities);
  }

  findFood(entities) {
    const food = this.findEntitiesInRange(entities, {
      filter: e => e instanceof Plankton,
      maxDistance: this.visionRadius
    });
    
    this.target = food[0] || null;
  }

  checkPredators(entities) {
    this.panicMode = false;
    
    for (const entity of entities) {
      if (entity instanceof BigFish && entity.isAlive) {
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < this.visionRadius * 1.2) { // Увеличенный радиус опасности
          this.panicMode = true;
          // Убегаем в противоположном направлении
          this.direction = Math.atan2(-dy, -dx);
          const speedSafe = this.speed;
          this.speed = this.panicSpeed;
          this.panicSpeed = speedSafe;
          this.target = null; // Отменяем текущую цель
          this.partner = null;
          break;
        }
      }
    }
    
    if (!this.panicMode) {
      this.speed = this.panicSpeed; // Возвращаем нормальную скорость
    }
  }
}