export class SimulationControls {
  constructor(model, renderer, setStats) {
    this.model = model;
    this.renderer = renderer;
    this.setStats = setStats;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.baseFps = 60; // Базовая скорость (1x)
    this.fpsInterval = 1000 / this.baseFps;
    this.speedMultiplier = 1; // 0.5, 1 или 2
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    this.fpsInterval = 1000 / (this.baseFps * multiplier); // Пересчитываем интервал
    this.lastTime = performance.now(); // Сбрасываем время, чтобы избежать "скачков"
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.run();
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.stop();
    this.model.initialize();
    this.renderer.draw();
    this.setStats(this.model.stats);
  }

  run(currentTime = 0) {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame((time) => this.run(time));
    const elapsed = currentTime - this.lastTime;

    // Сколько раз нужно обновить модель (если множитель > 1)
    const updatesNeeded = Math.floor(elapsed / this.fpsInterval);

    if (updatesNeeded > 0) {
      this.lastTime = currentTime - (elapsed % this.fpsInterval);

      // Обновляем модель N раз (для ускорения ×2, ×3 и т.д.)
      for (let i = 0; i < updatesNeeded; i++) {
        this.model.update();
      }

      this.renderer.draw();
      this.setStats(this.model.stats);
    }
  }
}