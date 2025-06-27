import { Fish } from "../classes/Fish";
import { Plankton } from "../classes/Plankton";

export class OceanRenderer {
  constructor(canvasRef, model) {
    this.canvas = canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.model = model;
    this.showVisionRadius = false;

    document.addEventListener('reproduction', (e) => {
      this.addReproductionAnimation(e.detail.x, e.detail.y, e.detail.duration || 1000);
  });
    this.animations = new Map();
  }

  toggleVisionRadius() {
    this.showVisionRadius = !this.showVisionRadius;
  }

  drawFish(entity) {
    const ctx = this.ctx;
    const width = entity.width;
    const height = entity.height;
    
    // Сохраняем контекст
    ctx.save();
    ctx.translate(entity.x + width/2, entity.y + height/2);
    ctx.rotate(entity.direction);
    
    // Тело рыбы
    ctx.fillStyle = entity.getDisplayColor();
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Хвост
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.lineTo(-width, -height/2);
    ctx.lineTo(-width, height/2);
    ctx.closePath();
    ctx.fill();
    
    // Глаз
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(width/4, -height/4, height/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Зрачок
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(width/4 + 1, -height/4, height/8, 0, Math.PI * 2);
    ctx.fill();
    
    // Полосы на теле (для большей детализации)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, width/2 - i, height/2 - i/2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  drawPlankton(plankton) {
    this.ctx.fillStyle = plankton.color;
    this.ctx.beginPath();
    this.ctx.arc(
      plankton.x + plankton.width/2,
      plankton.y + plankton.height/2,
      plankton.width/2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Свечение планктона
    const gradient = this.ctx.createRadialGradient(
      plankton.x + plankton.width/2,
      plankton.y + plankton.height/2,
      0,
      plankton.x + plankton.width/2,
      plankton.y + plankton.height/2,
      plankton.width
    );
    gradient.addColorStop(0, plankton.color);
    gradient.addColorStop(1, 'rgba(25, 242, 5, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  draw() {
    const { width, height } = this.model.paramsRef.current;
    
    // Очистка и фон
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = '#1a6fc9';
    this.ctx.fillRect(0, 0, width, height);

    // Сначала рисуем планктон
    this.model.entities.forEach(entity => {
      if (entity instanceof Plankton && entity.isAlive) {
        this.drawPlankton(entity);
      }
    });

    // Затем рыб (чтобы они были поверх планктона)
    this.model.entities.forEach(entity => {
      if (!entity.isAlive) return;
      
      if (entity instanceof Fish) {
        this.drawFish(entity);
        
        // Подсветка целей
        if (entity.hasActiveTarget()) {
          this.drawTargetHighlight(entity.target);
        }

        if (this.showVisionRadius) this.drawVisionRadius(entity);
      }
    });

    // Отрисовка анимаций размножения
    this.drawReproductionAnimations();

    // Затем рисуем подсветку целей поверх всех
    this.model.entities.forEach(entity => {
      if (entity instanceof Fish && 
          entity.hasActiveTarget && 
          entity.hasActiveTarget() && 
          entity.target && 
          entity.target.isAlive) {
        this.drawTargetHighlight(entity.target);
      }
    });
  }

  drawVisionRadius(entity) {
  if (!this.showVisionRadius) return;

  this.ctx.beginPath();
  this.ctx.arc(
    entity.x + entity.width / 2,
    entity.y + entity.height / 2,
    entity.visionRadius,
    0,
    Math.PI * 2
  );
  this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
  this.ctx.lineWidth = 1;
  this.ctx.stroke();
}

  drawTargetHighlight(target) {
    // Жёлтый ореол вокруг цели
    this.ctx.beginPath();
    this.ctx.arc(
      target.x + target.width/2,
      target.y + target.height/2,
      Math.max(target.width, target.height) * 1.3,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
    this.ctx.fill();
  }

  drawReproductionAnimations() {
    const now = performance.now();
    
    this.animations.forEach((anim, id) => {
        const progress = (now - anim.startTime) / anim.duration;
        if (progress >= 1) return;

        // Рисуем пульсирующий круг
        this.ctx.beginPath();
        this.ctx.arc(
            anim.x,
            anim.y,
            15 * progress, // Растущий радиус
            0,
            Math.PI * 2
        );
        this.ctx.strokeStyle = `rgba(255, 105, 180, ${1 - progress})`; // Розовый цвет
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    });
  }

  addReproductionAnimation(x, y, duration) {
    const id = Date.now(); // Уникальный ID анимации
    this.animations.set(id, {
      x, y,
      progress: 0,
      duration,
      startTime: performance.now()
    });

    // Автоматическое удаление после завершения
    setTimeout(() => {
      this.animations.delete(id);
    }, duration);
  }
}