// Group 5: Grid Distortions - Systematic deformations, cellular patterns

const gridLoaders = [
  // 1. Pixel wave - pixels moving in wave
  (ctx, t) => {
    const n = loop(t);
    const size = 4;
    const pixelSize = 3;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const phase = (n + (x + y) * 0.1) % 1;
        const alpha = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;

        ctx.globalAlpha = alpha;
        ctx.fillRect(3 + x * 5, 3 + y * 5, pixelSize, pixelSize);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 2. Scanning lines - horizontal scan effect
  (ctx, t) => {
    const n = loop(t);
    const lineCount = 8;
    const activeLines = 3;

    ctx.lineWidth = 2;
    for (let i = 0; i < lineCount; i++) {
      const y = 3 + i * 3;
      const linePhase = (n * lineCount + i) % lineCount;
      const alpha = linePhase < activeLines ? 1 - (linePhase / activeLines) : 0;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(4, y);
      ctx.lineTo(20, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },

  // 3. Cellular pulse - cells pulsing
  (ctx, t) => {
    const n = loop(t);
    const gridSize = 3;
    const cellSize = 6;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const phase = (n + (x + y * gridSize) * 0.1) % 1;
        const scale = 0.3 + Math.sin(phase * Math.PI * 2) * 0.7;
        const size = cellSize * scale;
        const px = 4 + x * 7 + (cellSize - size) / 2;
        const py = 4 + y * 7 + (cellSize - size) / 2;

        ctx.fillRect(px, py, size, size);
      }
    }
  },

  // 4. Cascading blocks - blocks falling
  (ctx, t) => {
    const n = loop(t);
    const cols = 4;
    const rows = 5;

    for (let x = 0; x < cols; x++) {
      const colPhase = (n + x * 0.2) % 1;
      const activeRow = Math.floor(colPhase * rows);

      for (let y = 0; y <= activeRow && y < rows; y++) {
        const alpha = y === activeRow ? (1 - (colPhase * rows - activeRow)) : 1;
        ctx.globalAlpha = alpha;
        ctx.fillRect(2 + x * 5, 2 + y * 4, 4, 3);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 5. Rotating cells - cells rotating individually
  (ctx, t) => {
    const n = loop(t);
    const gridSize = 3;
    const cellSize = 5;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const phase = n + (x + y) * 0.15;
        const angle = phase * Math.PI * 2;
        const cx = 5 + x * 7;
        const cy = 5 + y * 7;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize);
        ctx.restore();
      }
    }
  },

  // 6. Wave distortion - grid warping
  (ctx, t) => {
    const n = loop(t);
    const rows = 6;
    const cols = 6;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const offset = Math.sin(n * Math.PI * 2 + x * 0.5 + y * 0.3) * 1;
        const px = 2 + x * 4 + offset;
        const py = 2 + y * 4;

        ctx.fillRect(px, py, 2, 2);
      }
    }
  },

  // 7. Checkerboard flip - alternating pattern
  (ctx, t) => {
    const n = loop(t);
    const gridSize = 4;
    const cellSize = 5;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const isEven = (x + y) % 2 === 0;
        const phase = isEven ? n : 1 - n;
        const alpha = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;

        ctx.globalAlpha = alpha;
        ctx.fillRect(2 + x * 5, 2 + y * 5, cellSize, cellSize);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 8. Radial grid - expanding from center
  (ctx, t) => {
    const n = loop(t);
    const rings = 4;
    const segments = 8;

    for (let r = 0; r < rings; r++) {
      const ringPhase = (n + r * 0.2) % 1;
      const radius = 2 + r * 2 + ringPhase * 2;

      for (let s = 0; s < segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        const x = 12 + Math.cos(angle) * radius;
        const y = 12 + Math.sin(angle) * radius;

        ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
      }
    }
  },

  // 9. Breathing grid - grid scaling
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.7 + Math.sin(n * Math.PI * 2) * 0.3;
    const gridSize = 4;
    const spacing = 5 * scale;

    ctx.save();
    ctx.translate(12, 12);

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        ctx.fillRect(x * spacing - 1, y * spacing - 1, 2, 2);
      }
    }

    ctx.restore();
  },

  // 10. Diagonal sweep - sweeping diagonal pattern
  (ctx, t) => {
    const n = loop(t);
    const gridSize = 6;
    const cellSize = 3;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const distance = x + y;
        const phase = (n * gridSize * 2 - distance) / gridSize;
        const alpha = phase > 0 && phase < 1 ? 1 - phase : 0;

        ctx.globalAlpha = alpha;
        ctx.fillRect(1 + x * 4, 1 + y * 4, cellSize, cellSize);
      }
    }
    ctx.globalAlpha = 1;
  }
];
