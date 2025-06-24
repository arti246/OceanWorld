import { SmallFish } from "../classes/SmallFish";
import { BigFish } from "../classes/BigFish";

export class OceanRenderer {
  constructor(canvasRef, model) {
    this.canvas = canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.model = model;
    this.showVisionRadius = false;
  }

  toggleVisionRadius() {
    this.showVisionRadius = !this.showVisionRadius;
  }

  draw() {
    const { width, height } = this.model.paramsRef.current;
    
    // Очистка и фон
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = '#1a6fc9';
    this.ctx.fillRect(0, 0, width, height);

    // Отрисовка существ
    this.model.entities.forEach(entity => {
      if (!entity.isAlive) return;
      
      // Основное тело
      this.ctx.fillStyle = entity.color;
      this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
      
      // Для рыб - добавляем глаза
      if (entity instanceof SmallFish || entity instanceof BigFish) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(entity.x + 2, entity.y + 1, 2, 2);
      }
      
      // Радиус зрения (если включено)
      if (this.showVisionRadius && entity.visionRadius) {
        this.ctx.beginPath();
        this.ctx.arc(
          entity.x + entity.width/2,
          entity.y + entity.height/2,
          entity.visionRadius,
          0,
          Math.PI * 2
        );
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.stroke();
      }
    });
  }
}