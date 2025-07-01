import { Fish } from './Fish';
import { SmallFish } from './SmallFish';

export class BigFish extends Fish {
  constructor(x, y, width = 20, height = 12) {
    super(x, y, width, height);
    this.color = "#eb0c0c";
    this.baseSpeed = Math.random() * 0.5 + 0.3; // Базовая скорость
    this.speed = this.baseSpeed;
    this.huntingSpeed = this.baseSpeed * 2.5; // Скорость при охоте
    this.visionRadius = 80;
    this.maxAge = Math.random() * 8000 + 5000;
    this.hungerDifference = 0.02; // Большие рыбы голодают медленнее
    this.eatingDistance = 20; // Дистанция для поедания маленьких рыб

    this.reproductionRate = 0.01; // Медленнее размножаются 0.01
  }

  update(entities) {
    // Сбрасываем цель если она мертва или сбежала
    if (this.target && (!this.target.isAlive || 
        this.getDistanceTo(this.target) > this.visionRadius * 1.5)) {
      this.target = null;
    }

    super.update(entities);
  }

  findFood(entities) {
    const prey = this.findEntitiesInRange(entities, {
      filter: e => e instanceof SmallFish,
      maxDistance: this.visionRadius
    });
  
    this.target = prey[0] || null;
    this.speed = this.target ? this.huntingSpeed : this.baseSpeed;
  }
}