import { Plankton } from '../classes/Plankton';
import { SmallFish } from '../classes/SmallFish';
import { BigFish } from '../classes/BigFish';
import { Fish } from '../classes/Fish';

export class OceanModel {
  constructor(paramsRef) {
    this.paramsRef = paramsRef;
    this.entities = [];
    this.frameCount = 0;
    this.stats = {
      plankton: { total: 0, born: 0, died: 0 },
      smallFish: { total: 0, born: 0, died: 0 },
      bigFish: { total: 0, born: 0, died: 0 }
    };
  }

  initialize() {
    this.entities = [];
    const { planktonCount, smallFishCount, bigFishCount, width, height } = this.paramsRef.current;

    // Создание планктона
    for (let i = 0; i < planktonCount; i++) {
      this.entities.push(new Plankton(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // Создание рыб
    for (let i = 0; i < smallFishCount; i++) {
      this.entities.push(new SmallFish(
        Math.random() * width,
        Math.random() * height
      ));
    }

    for (let i = 0; i < bigFishCount; i++) {
      this.entities.push(new BigFish(
        Math.random() * width,
        Math.random() * height
      ));
    }

    this.stats = {
      plankton: { total: planktonCount, born: 0, died: 0 , eaten: 0},
      smallFish: { total: smallFishCount, born: 0, died: 0 },
      bigFish: { total: bigFishCount, born: 0, died: 0 }
    };
    this.frameCount = 0;
  }

  update() {
    this.frameCount++;
    
    // Обновление и размножение
    const newEntities = [];
    this.entities.forEach(entity => {
      if (entity instanceof Fish) {
        const offspring = entity.update(this.entities);
        if (offspring) {
          this.entities.push(offspring);
          // Обновляем статистику
          if (offspring instanceof SmallFish) this.stats.smallFish.born++;
          else if (offspring instanceof BigFish) this.stats.bigFish.born++;
        }
      } else {
        entity.update();
      }
      if (entity instanceof Plankton && Math.random() < entity.reproductionChance) {
        const offspring = entity.reproduce();
        if (offspring) {
          newEntities.push(offspring);
          this.stats.plankton.born++;
        }
      }
    });

    // Добавляем новых особей
    this.entities.push(...newEntities);

    // Удаление умерших
    const prevCounts = {
      plankton: this.stats.plankton.total,
      smallFish: this.stats.smallFish.total,
      bigFish: this.stats.bigFish.total
    };

    this.entities = this.entities.filter(e => e.isAlive);
    this.updateStats();

    // Подсчёт смертей
    this.stats.plankton.died += Math.max(0, prevCounts.plankton - this.stats.plankton.total);
    this.stats.smallFish.died += Math.max(0, prevCounts.smallFish - this.stats.smallFish.total);
    this.stats.bigFish.died += Math.max(0, prevCounts.bigFish - this.stats.bigFish.total);
  }

  updateStats() {
    this.stats = {
      plankton: { total: 0, born: this.stats.plankton.born, died: this.stats.plankton.died },
      smallFish: { total: 0, born: this.stats.smallFish.born, died: this.stats.smallFish.died },
      bigFish: { total: 0, born: this.stats.bigFish.born, died: this.stats.bigFish.died }
    };

    this.entities.forEach(entity => {
      if (entity instanceof Plankton) this.stats.plankton.total++;
      else if (entity instanceof SmallFish) this.stats.smallFish.total++;
      else if (entity instanceof BigFish) this.stats.bigFish.total++;
    });
  }
}