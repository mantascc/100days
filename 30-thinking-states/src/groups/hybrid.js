// Group 10: Hybrid Behaviors - Combinations, transitions, emergent complexity

const hybridLoaders = [
  // 1. Shape morph cycle - cycling through shapes
  (ctx, t) => {
    const n = loop(t);
    const phase = Math.floor(n * 3);
    const progress = (n * 3) % 1;

    ctx.save();
    ctx.translate(12, 12);

    if (phase === 0) {
      // Circle to square
      const corners = progress * 4;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = progress;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.globalAlpha = 1;
    } else if (phase === 1) {
      // Square to triangle
      ctx.globalAlpha = 1 - progress;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(6, 5);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.globalAlpha = progress;
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      // Triangle to circle
      ctx.globalAlpha = 1 - progress;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(6, 5);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.globalAlpha = progress;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  },

  // 2. Orbit + pulse - orbiting while pulsing
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const scale = 0.7 + Math.sin(n * Math.PI * 4) * 0.3;
    const x = 12 + Math.cos(angle) * 7;
    const y = 12 + Math.sin(angle) * 7;

    ctx.beginPath();
    ctx.arc(x, y, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  },

  // 3. Particle to shape - particles forming shape
  (ctx, t) => {
    const n = loop(t);
    const particles = 8;

    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2;
      const targetX = 12 + Math.cos(angle) * 6;
      const targetY = 12 + Math.sin(angle) * 6;
      const scatterX = 12 + Math.cos(angle + n * Math.PI) * 12;
      const scatterY = 12 + Math.sin(angle + n * Math.PI) * 12;

      const x = scatterX + (targetX - scatterX) * ease.inOut(n);
      const y = scatterY + (targetY - scatterY) * ease.inOut(n);

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 4. Grid to spiral - grid transforming to spiral
  (ctx, t) => {
    const n = loop(t);
    const points = 16;

    for (let i = 0; i < points; i++) {
      const gridX = (i % 4) * 5 + 4;
      const gridY = Math.floor(i / 4) * 5 + 4;

      const spiralAngle = (i / points) * Math.PI * 4;
      const spiralR = (i / points) * 8;
      const spiralX = 12 + Math.cos(spiralAngle) * spiralR;
      const spiralY = 12 + Math.sin(spiralAngle) * spiralR;

      const x = gridX + (spiralX - gridX) * n;
      const y = gridY + (spiralY - gridY) * n;

      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  },

  // 5. Wave + rotate - rotating wave
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const points = 8;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);

    for (let i = 0; i < points; i++) {
      const x = -8 + (i / points) * 16;
      const y = Math.sin(i + n * Math.PI * 4) * 3;

      ctx.fillRect(x, y, 2, 2);
    }

    ctx.restore();
  },

  // 6. Bounce + spin - bouncing spinning square
  (ctx, t) => {
    const n = loop(t);
    const bounce = Math.abs(Math.sin(n * Math.PI * 2));
    const y = 6 + (1 - bounce) * 10;
    const angle = n * Math.PI * 4;

    ctx.save();
    ctx.translate(12, y);
    ctx.rotate(angle);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
  },

  // 7. Divide + pulse - dividing cells pulsing
  (ctx, t) => {
    const n = loop(t);
    const split = Math.sin(n * Math.PI * 2);
    const offset = split * 4;
    const scale = 0.8 + Math.sin(n * Math.PI * 4) * 0.2;

    ctx.beginPath();
    ctx.arc(12 - offset / 2, 12, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(12 + offset / 2, 12, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  },

  // 8. Trail + morph - morphing shape with trail
  (ctx, t) => {
    const n = loop(t);

    for (let i = 0; i < 4; i++) {
      const trailN = (n - i * 0.15 + 1) % 1;
      const angle = trailN * Math.PI * 2;
      const x = 12 + Math.cos(angle) * 7;
      const y = 12 + Math.sin(angle) * 7;
      const alpha = 1 - i * 0.25;
      const morph = Math.sin(trailN * Math.PI * 4);
      const size = 2 + morph;

      ctx.globalAlpha = alpha;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  },

  // 9. Layer stack - multiple layers with different behaviors
  (ctx, t) => {
    const n = loop(t);

    // Layer 1: Rotating ring
    ctx.globalAlpha = 0.5;
    const angle1 = n * Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(12, 12, 8, angle1, angle1 + Math.PI);
    ctx.stroke();

    // Layer 2: Pulsing center
    const scale = 0.6 + Math.sin(n * Math.PI * 4) * 0.4;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(12, 12, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  },

  // 10. Emergence - complex pattern from simple rules
  (ctx, t) => {
    const n = loop(t);
    const agents = 12;

    for (let i = 0; i < agents; i++) {
      const baseAngle = (i / agents) * Math.PI * 2;
      const orbit = 6 + Math.sin(n * Math.PI * 2 + i) * 2;
      const rotation = n * Math.PI * 2 * (1 + i * 0.1);

      const x = 12 + Math.cos(baseAngle + rotation) * orbit;
      const y = 12 + Math.sin(baseAngle + rotation) * orbit;

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
];
