import { Fish } from './Fish';
import { SmallFish } from './SmallFish';

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
    this.hungerDifference = 0.02; // Большие рыбы голодают медленнее
    this.hungerThreshold = 40; // Начинают охотиться раньше
    this.eatingDistance = 20; // Дистанция для поедания маленьких рыб
  }

  findFood(entities) {
    let minDist = Infinity;
    
    for (const entity of entities) {
      if (entity instanceof SmallFish && entity.isAlive) {
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < minDist && dist < this.visionRadius) {
          minDist = dist;
          this.target = entity;
        }
      }
    }
  }
}