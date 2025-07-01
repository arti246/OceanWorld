import { Entity } from './Entity';

export class Fish extends Entity {
  constructor(x, y, width = 10, height = 6) {
    super(x, y, width, height);
    this.changeDirectionChance = 0.02;
    this.hunger = Math.random() * 10 + 90;
    this.hungerDifference = 0.03; // Базовое значение уменьшения голода
    this.target = null;
    this.hungerThreshold = 50; // Порог, при котором начинаем искать еду
    this.eatingDistance = 10; // Дистанция для "поедания"

    this.reproductionLevel = Math.random() * 5;
    this.gender = Math.random() > 0.5 ? 'male' : 'female'; // Случайный пол
    this.partner = null;
    this.reproductionRate = 0.1; // Скорость роста готовности к размножению
    this.isReproducing = false; // Флаг размножения
    this.reproductionTimer = 0; // Таймер анимации
  }

  update(entities) {
    super.update();
    if (!this.isAlive) return;

    this.checkBoundaries();

    if (this.isReproducing) {
      this.reproductionTimer--;
      if (this.reproductionTimer <= 0) {
        this.isReproducing = false;
      }
      return null; // Пропускаем обновление на время анимации
    }

    // Уменьшаем сытость
    this.hunger -= this.hungerDifference;

    // Обновляем готовность к размножению
    if (this.reproductionLevel > 100) {
      this.reproductionLevel = 100;
    } else {
      this.reproductionLevel += this.reproductionRate;
    }

    // Поиск партнера
    if (!this.partner && this.reproductionLevel >= 100 && this.hunger > 60) {
      this.findPartner(entities);
    }

    // Движение к партнеру
    if (this.partner) {
      this.target = null;
      const reproductionResult = this.moveToPartner();
    if (reproductionResult) return reproductionResult;
    }

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

    return null;
  }

  findFood(entities) {}

  moveToTarget() {
    if (!this.target) return;
    this.moveTo(this.target, this.target === this.partner ? 0.5 : 1.0);
  }

  isTargetReached() {
    if (!this.target) return false;
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    return Math.sqrt(dx*dx + dy*dy) < this.eatingDistance;
  }

  eat() {
    this.hunger += 40; // Полное насыщение
    if (this.target) {
      this.target.isAlive = false; // "Съедаем" цель
    }
    this.target = null;
  }

  moveRandomly() {
    if (Math.random() < this.changeDirectionChance) {
      this.direction = Math.random() * Math.PI * 2;
    }
    this.move();
  }

  reproduce() {
    if (!this.isAlive) return null;
    return new this.constructor(
      this.x + (Math.random() * 30 - 15),
      this.y + (Math.random() * 30 - 15)
    );
  }

  getDisplayColor() {
    // Если есть партнёр - красный цвет
    if (this.partner) return "#ff0000"; 
    
    // Если голодны - чёрный (уже было)
    if (this.hunger < this.hungerThreshold) return "#000000"; 
    
    // Обычный цвет (из конструктора)
    return this.color;
  }

  hasActiveTarget() {
    return this.target && this.target.isAlive && this.hunger < this.hungerThreshold;
  }

  findPartner(entities) {
    let bestPartner = null;
    let minDistance = 800;

    for (const entity of entities) {
      if (entity === this || !(entity instanceof this.constructor)) continue;
      
      if (entity.gender !== this.gender && 
          !entity.partner && 
          entity.reproductionLevel >= 100 &&
          entity.hunger > 60) {
        
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < minDistance && distance < this.visionRadius * 4) {
          minDistance = distance;
          bestPartner = entity;
        }
      }
    }

    if (bestPartner) {
      this.partner = bestPartner;
      bestPartner.partner = this; // Взаимная связь
    }
  }

  moveToPartner() {
    if (!this.partner || !this.partner.isAlive) {
      this.partner = null;
      return;
    }

    const dx = this.partner.x - this.x;
    const dy = this.partner.y - this.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    // Если достигли партнера
    if (distance < this.eatingDistance * 2) {
      return this.reproduceWithPartner();
    }

    // Движение к партнеру
    this.direction = Math.atan2(dy, dx);
    this.x += Math.cos(this.direction) * this.speed * 0.1; // Медленнее чем при охоте
    this.y += Math.sin(this.direction) * this.speed * 0.1;

    return null;
  }

  reproduceWithPartner() {
    if (!this.partner) return null;

    this.isReproducing = true;
    this.reproductionTimer = 60; 
    this.partner.isReproducing = true;
    this.partner.reproductionTimer = 60;

    // Анимация
    document.dispatchEvent(new CustomEvent('reproduction', {
      detail: {
          x: (this.x + this.partner.x) / 2,
          y: (this.y + this.partner.y) / 2,
          duration: 1000 // 1 секунда
      }
  }));

    // Сбрасываем параметры размножения
    this.reproductionLevel = 0;
    this.partner.reproductionLevel = 0;

    // Создаём потомка (сохраняем ссылку перед сбросом партнёра)
    const offspring = new this.constructor(
      (this.x + this.partner.x) / 2,
      (this.y + this.partner.y) / 2
    );
    
    // Освобождаем партнеров
    const partner = this.partner;
    this.partner = null;
    partner.partner = null;

    // Возвращаем потомка для добавления в модель
    return offspring;
  }
}