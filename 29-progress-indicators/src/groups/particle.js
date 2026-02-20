// Group 3: Particle Systems - Multiple elements: dots, pixels, particles in motion

const particleLoaders = [
  // 1. Orbiting dots - 3 dots orbiting center
  (ctx, t) => {
    const n = loop(t);
    const count = 3;

    for (let i = 0; i < count; i++) {
      const angle = n * Math.PI * 2 + (i / count) * Math.PI * 2;
      const x = 12 + Math.cos(angle) * 7;
      const y = 12 + Math.sin(angle) * 7;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 2. Wave dots - dots moving in wave pattern
  (ctx, t) => {
    const n = loop(t);
    const count = 5;

    for (let i = 0; i < count; i++) {
      const x = 4 + i * 4;
      const offset = Math.sin(n * Math.PI * 2 + i * 0.5) * 4;
      const y = 12 + offset;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 3. Expanding particles - particles radiating outward
  (ctx, t) => {
    const n = loop(t);
    const count = 8;
    const radius = n * 10;
    const alpha = 1 - n;

    ctx.globalAlpha = alpha;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = 12 + Math.cos(angle) * radius;
      const y = 12 + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // 4. Circular chain - connected dots rotating
  (ctx, t) => {
    const n = loop(t);
    const count = 6;
    const angle = n * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const a = angle + (i / count) * Math.PI * 2;
      const x = 12 + Math.cos(a) * 6;
      const y = 12 + Math.sin(a) * 6;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 5. Bouncing dots - dots bouncing up and down
  (ctx, t) => {
    const n = loop(t);
    const count = 4;

    for (let i = 0; i < count; i++) {
      const phase = (n + i * 0.25) % 1;
      const bounce = Math.abs(Math.sin(phase * Math.PI));
      const x = 5 + i * 4.5;
      const y = 18 - bounce * 10;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 6. Spiral particles - spiral motion
  (ctx, t) => {
    const n = loop(t);
    const count = 8;

    for (let i = 0; i < count; i++) {
      const phase = (n + i / count) % 1;
      const angle = phase * Math.PI * 4;
      const radius = phase * 8;
      const x = 12 + Math.cos(angle) * radius;
      const y = 12 + Math.sin(angle) * radius;
      const alpha = 1 - phase;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // 7. Grid dots - grid of pulsing dots
  (ctx, t) => {
    const n = loop(t);
    const size = 3;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const phase = (n + (x + y) * 0.1) % 1;
        const scale = 0.5 + Math.sin(phase * Math.PI * 2) * 0.5;
        const px = 6 + x * 6;
        const py = 6 + y * 6;

        ctx.beginPath();
        ctx.arc(px, py, 1 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 8. Chase particles - particles chasing each other
  (ctx, t) => {
    const n = loop(t);
    const count = 4;

    for (let i = 0; i < count; i++) {
      const offset = (i / count);
      const phase = (n + offset) % 1;
      const angle = phase * Math.PI * 2;
      const x = 12 + Math.cos(angle) * 7;
      const y = 12 + Math.sin(angle) * 7;
      const size = 1 + (1 - Math.abs(offset - 0.5) * 2) * 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 9. Converging dots - dots moving to center
  (ctx, t) => {
    const n = loop(t);
    const count = 6;
    const phase = Math.sin(n * Math.PI * 2) * 0.5 + 0.5;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 * (1 - phase * 0.7);
      const x = 12 + Math.cos(angle) * radius;
      const y = 12 + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 10. Random scatter - particles scattering
  (ctx, t) => {
    const n = loop(t);
    const count = 8;
    const seed = [0.2, 0.5, 0.8, 0.3, 0.9, 0.1, 0.6, 0.4];

    for (let i = 0; i < count; i++) {
      const phase = (n + seed[i]) % 1;
      const angle = seed[i] * Math.PI * 2;
      const radius = phase * 10;
      const x = 12 + Math.cos(angle) * radius;
      const y = 12 + Math.sin(angle) * radius;
      const alpha = 1 - phase;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
];
