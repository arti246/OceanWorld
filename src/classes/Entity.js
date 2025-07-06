export class Entity {
  constructor(x, y, width = 5, height = 5, color = "#ffffff") {
    this.x = x;
    this.y = y;
    this.isAlive = true;
    this.age = 0;
    this.maxAge = 10000;
    this.baseSpeed = 0.1;
    this.speed = 0.1;
    this.width = width;
    this.height = height;
    this.color = color;
    this.direction = Math.random() * Math.PI * 2;
  }

  update() {
    this.age++;
    if (this.age >= this.maxAge) {
      this.isAlive = false;
    }
  }

  getDistanceTo(entity) {
    const dx = entity.x - this.x;
    const dy = entity.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  checkBoundaries() {
    const margin = 5;
    const worldWidth = 800;
    const worldHeight = 600;
    let directionChanged = false;

    // Горизонтальные границы (левый/правый край)
    if (this.x <= margin) {
      this.direction = Math.PI - this.direction;
      this.x = margin; // Фиксируем позицию у границы
      directionChanged = true;
    } 
    else if (this.x >= worldWidth - margin - this.width) {
      this.direction = Math.PI - this.direction;
      this.x = worldWidth - margin - this.width;
      directionChanged = true;
    }

    // Вертикальные границы (верхний/нижний край)
    if (this.y <= margin) {
      this.direction = -this.direction;
      this.y = margin;
      directionChanged = true;
    } 
    else if (this.y >= worldHeight - margin - this.height) {
      this.direction = -this.direction;
      this.y = worldHeight - margin - this.height;
      directionChanged = true;
    }

    if (directionChanged && Math.random() < 0.3) {
      this.direction += (Math.random() - 0.5) * Math.PI/8;
    }

    this.direction = (this.direction + 2 * Math.PI) % (2 * Math.PI);
  }

  move(speedMultiplier = 1.0) {
    this.x += Math.cos(this.direction) * this.speed * speedMultiplier;
    this.y += Math.sin(this.direction) * this.speed * speedMultiplier;
    this.checkBoundaries();
  }

  // Поворот к цели
  turnTo(target, turnSpeed = 0.1) {
    if (!target) return;
    
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const targetAngle = Math.atan2(dy, dx);
    
    // Плавный поворот
    const turnIntensity = Math.min(1, this.speed * 0.5); // Чем быстрее, тем резче поворот
    let angleDiff = ((targetAngle - this.direction + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    this.direction += angleDiff * turnSpeed * turnIntensity;
  }

  // Движение к цели
  moveTo(target, speedMultiplier = 1.0) {
    this.turnTo(target);
    this.move(speedMultiplier);
  }

  // Обобщенный метод поиска
  findEntitiesInRange(entities, {
    filter = () => true,
    maxDistance = Infinity,
    sortByDistance = true,
    limit = Infinity
  } = {}) {
    const result = [];
    
    for (const entity of entities) {
      if (entity === this || !entity.isAlive) continue;
      
      const distance = this.getDistanceTo(entity);
      if (distance > maxDistance) continue;
      
      if (filter(entity)) {
        result.push({ entity, distance });
      }
    }
    
    if (sortByDistance) {
      result.sort((a, b) => a.distance - b.distance);
    }
    
    return result.slice(0, limit).map(item => item.entity);
  }
}