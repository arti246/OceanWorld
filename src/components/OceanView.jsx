import React, { useState, useEffect, useRef } from 'react';
import { OceanModel } from './OceanModel';
import { OceanRenderer } from './OceanRenderer';
import { SimulationControls } from './SimulationControls';
import './OceanView.css';

const OceanView = () => {
  const [params, setParams] = useState({
    planktonCount: 40,
    smallFishCount: 16,
    bigFishCount: 0,
    width: 800,
    height: 600,
    simulationSpeed: 1
  });

  const paramsRef = useRef(params);
  const [stats, setStats] = useState({
    plankton: { total: 0, born: 0, died: 0 },
    smallFish: { total: 0, born: 0, died: 0 },
    bigFish: { total: 0, born: 0, died: 0 }
  });

  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [currentSpeed, setCurrentSpeed] = useState(1);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    modelRef.current = new OceanModel(paramsRef);
    rendererRef.current = new OceanRenderer(canvasRef, modelRef.current);
    controlsRef.current = new SimulationControls(
      modelRef.current,
      rendererRef.current,
      setStats
    );
    controlsRef.current.setSpeed(params.simulationSpeed);
    controlsRef.current.reset();

    return () => controlsRef.current.stop();
  }, [params.simulationSpeed]);

  const updateParam = (name, value) => {
    setParams(prev => ({ ...prev, [name]: value }));
    if (name === 'simulationSpeed') {
      controlsRef.current?.setSpeed(value);
    }
  };

  const StatsColumn = ({ title, data, color }) => (
    <div className="stats-column" style={{ borderTop: `3px solid ${color}` }}>
      <h4>{title}</h4>
      <p><span>Всего:</span> <strong>{data.total}</strong></p>
      <p><span>Родилось:</span> <strong>{data.born}</strong></p>
      <p><span>Погибло:</span> <strong>{data.died}</strong></p>
    </div>
  );

  return (
    <div className="simulation-container">
      <div className="ocean-wrapper">
        <canvas ref={canvasRef} width={params.width} height={params.height} className="ocean"/>
      </div>
      
      <div className="control-panel">
        <h2>Управление симуляцией</h2>
        
        <div className="buttons-group">
          <button onClick={() => controlsRef.current.start()}>Старт</button>
          <button onClick={() => controlsRef.current.stop()}>Пауза</button>
          <button onClick={() => controlsRef.current.reset()}>Сбросить</button>
          <button onClick={() => rendererRef.current.toggleVisionRadius()}>
            Видимость
          </button>
        </div>

        <div className="speed-controls">
          <button
            className={`speed-btn ${currentSpeed === 0.5 ? 'active' : ''}`}
            onClick={() => {
              controlsRef.current.setSpeed(0.5);
              setCurrentSpeed(0.5);
            }}
          >
            ×0.5
          </button>
          <button
            className={`speed-btn ${currentSpeed === 1 ? 'active' : ''}`}
            onClick={() => {
              controlsRef.current.setSpeed(1);
              setCurrentSpeed(1);
            }}
          >
            ×1
          </button>
          <button
            className={`speed-btn ${currentSpeed === 2 ? 'active' : ''}`}
            onClick={() => {
              controlsRef.current.setSpeed(2);
              setCurrentSpeed(2);
            }}
          >
            ×2
          </button>
        </div>
        
        <div className="settings">
          <h3>Настройки</h3>
          <div className="param">
            <label>Планктон:</label>
            <input
              type="number"
              min="1"
              max="500"
              value={params.planktonCount}
              onChange={e => updateParam('planktonCount', parseInt(e.target.value))}
            />
          </div>
          <div className="param">
            <label>Мал. рыбы:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={params.smallFishCount}
              onChange={e => updateParam('smallFishCount', parseInt(e.target.value))}
            />
          </div>
          <div className="param">
            <label>Бол. рыбы:</label>
            <input
              type="number"
              min="0"
              max="50"
              value={params.bigFishCount}
              onChange={e => updateParam('bigFishCount', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="stats-panel">
          <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>Статистика популяции</h3>
          <div className="stats-row">
            <StatsColumn 
              title="Планктон" 
              data={stats.plankton} 
              color="#19f205" 
            />
            <StatsColumn 
              title="Рыбки" 
              data={stats.smallFish} 
              color="#0dd9d9" 
            />
            <StatsColumn 
              title="Рыбы" 
              data={stats.bigFish} 
              color="#eb0c0c" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OceanView;