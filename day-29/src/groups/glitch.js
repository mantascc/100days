// Group 8: Glitch/Digital - Scan lines, pixelation, data streams, errors

const glitchLoaders = [
  // 1. Scan lines - CRT scan effect
  (ctx, t) => {
    const n = loop(t);
    const scanY = n * 24;

    // Full screen with scanline
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, 24, 24);
    ctx.globalAlpha = 1;

    // Bright scanline
    ctx.fillRect(0, scanY, 24, 2);
  },

  // 2. Pixel corruption - random pixels appearing
  (ctx, t) => {
    const n = loop(t);
    const seed = Math.floor(n * 100);

    for (let i = 0; i < 20; i++) {
      const x = ((seed + i * 7) % 24);
      const y = ((seed + i * 13) % 24);
      const alpha = ((seed + i) % 10) / 10;

      ctx.globalAlpha = alpha;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
  },

  // 3. Bit shift - horizontal displacement
  (ctx, t) => {
    const n = loop(t);
    const rows = 8;

    for (let i = 0; i < rows; i++) {
      const offset = Math.sin(n * Math.PI * 2 + i) * 4;
      const y = i * 3;
      ctx.fillRect(8 + offset, y, 8, 2);
    }
  },

  // 4. Data stream - falling binary-like blocks
  (ctx, t) => {
    const n = loop(t);
    const cols = 6;

    for (let i = 0; i < cols; i++) {
      const speed = 1 + (i % 3) * 0.5;
      const y = ((n * speed * 24) % 30) - 6;
      const length = 4 + (i % 2) * 2;

      for (let j = 0; j < length; j++) {
        const alpha = 1 - (j / length);
        ctx.globalAlpha = alpha;
        ctx.fillRect(i * 4, y + j * 2, 2, 1);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 5. RGB split - chromatic aberration
  (ctx, t) => {
    const n = loop(t);
    const offset = Math.sin(n * Math.PI * 2) * 2;

    // Center square with RGB split effect (simplified)
    ctx.globalAlpha = 0.5;
    ctx.fillRect(10 - offset, 10, 4, 4);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(10 + offset, 10, 4, 4);
    ctx.globalAlpha = 1;
    ctx.fillRect(10, 10, 4, 4);
  },

  // 6. Screen tear - horizontal displacement
  (ctx, t) => {
    const n = loop(t);
    const segments = 6;

    for (let i = 0; i < segments; i++) {
      const y = i * 4;
      const offset = Math.sin(n * Math.PI * 2 + i * 0.5) * 3;
      ctx.fillRect(6 + offset, y, 12, 3);
    }
  },

  // 7. Noise static - random noise
  (ctx, t) => {
    const n = loop(t);
    const density = 30;
    const seed = Math.floor(n * 60);

    for (let i = 0; i < density; i++) {
      const x = ((seed + i * 17) % 24);
      const y = ((seed + i * 23) % 24);
      const size = ((seed + i * 3) % 2) + 1;

      ctx.fillRect(x, y, size, size);
    }
  },

  // 8. Digital dissolve - pixelated transition
  (ctx, t) => {
    const n = loop(t);
    const size = 4;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const delay = (x + y * size) / (size * size);
        const phase = (n - delay + 1) % 1;
        const alpha = phase > 0.5 ? 1 : 0;

        ctx.globalAlpha = alpha;
        ctx.fillRect(x * 6, y * 6, 6, 6);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 9. Buffer loading - filling buffer blocks
  (ctx, t) => {
    const n = loop(t);
    const blocks = 16;

    for (let i = 0; i < blocks; i++) {
      const filled = i < n * blocks;
      const x = (i % 4) * 6;
      const y = Math.floor(i / 4) * 6;

      if (filled) {
        ctx.fillRect(x, y, 5, 5);
      } else {
        ctx.strokeStyle = FG;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 5, 5);
      }
    }
  },

  // 10. Transmission error - flickering segments
  (ctx, t) => {
    const n = loop(t);
    const seed = Math.floor(n * 20);
    const segments = 8;

    for (let i = 0; i < segments; i++) {
      const show = ((seed + i * 3) % 7) > 2;
      if (show) {
        const y = i * 3;
        ctx.fillRect(4, y, 16, 2);
      }
    }
  }
];
