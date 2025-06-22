import React, { useEffect, useRef, useState, useCallback } from 'react';
import './OceanView.css';
import Plankton from '../classes/Plankton';

const OceanView = () => {
  const canvasRef = useRef(null);
  const [entities, setEntities] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [initialCount, setInitialCount] = useState(50);
  const [stats, setStats] = useState({ total: 0, born: 0, died: 0 });
  const animationRef = useRef();
  const lastUpdateRef = useRef(0);

  // Инициализация планктона
  const resetSimulation = useCallback(() => {
    const newEntities = Array.from({ length: initialCount }, () => (
      new Plankton(Math.random() * 780 + 10, Math.random() * 580 + 10)
    ));
    setEntities(newEntities);
    setStats({ total: initialCount, born: 0, died: 0 });
  }, [initialCount]);

  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

  // Обновление сущностей с учётом скорости
  const updateEntities = useCallback(() => {
    setEntities(prevEntities => {
      const newEntities = [];
      let bornCount = 0;
      let diedCount = 0;

      const aliveEntities = prevEntities.filter(entity => {
        // Обновляем с учётом скорости
        for (let i = 0; i < speed; i++) {
          entity.update();
        }

        // Размножение с учётом скорости
        if (entity.reproduce && Math.random() < 0.0009 * speed) {
          const offspring = entity.reproduce();
          if (offspring) {
            newEntities.push(offspring);
            bornCount++;
          }
        }

        if (!entity.isAlive) diedCount++;
        return entity.isAlive;
      });

      setStats(s => ({
        total: aliveEntities.length + newEntities.length,
        born: s.born + bornCount,
        died: s.died + diedCount
      }));

      return [...aliveEntities, ...newEntities];
    });
  }, [speed]);

  // Анимация
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = (timestamp) => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Обновляем с учётом скорости
      if (timestamp - lastUpdateRef.current > 1000 / 60) { // 60 FPS
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        entities.forEach(entity => {
          if (entity.isAlive) entity.render(ctx);
        });

        updateEntities();
        lastUpdateRef.current = timestamp;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, entities, updateEntities]);

  return (
    <div className="simulation-container">
      <div className="ocean-wrapper">
        <canvas ref={canvasRef} className="ocean" width={800} height={600} />
      </div>
      
      <div className="control-panel">
        <h2>Управление симуляцией</h2>
        
        <div className="buttons-group">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? '⏸ Пауза' : '▶ Старт'}
          </button>
          <button onClick={() => setSpeed(2)} className={speed === 2 ? 'active' : ''}>
            ⏩ Ускорить 2x
          </button>
          <button onClick={() => setSpeed(1)} className={speed === 1 ? 'active' : ''}>
            ⏵ Нормальная скорость
          </button>
          <button onClick={resetSimulation} className="reset-btn">
            ⟳ Сбросить
          </button>
        </div>
        
        <div className="stats-panel">
          <h3>Статистика:</h3>
          <p>Скорость: <strong>{speed}x</strong></p>
          <p>Всего планктона: <strong>{stats.total}</strong></p>
          <p>Родилось: <strong>{stats.born}</strong></p>
          <p>Погибло: <strong>{stats.died}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default OceanView;