// Group 7: Optical/Physics - Orbits, gravity, springs, pendulums

const physicsLoaders = [
  // 1. Pendulum - swinging pendulum
  (ctx, t) => {
    const n = loop(t);
    const angle = Math.sin(n * Math.PI * 2) * 0.6;
    const length = 8;

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, 6);
    const x = 12 + Math.sin(angle) * length;
    const y = 6 + Math.cos(angle) * length;
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  },

  // 2. Orbit - planet orbiting
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    // Center star
    ctx.beginPath();
    ctx.arc(12, 12, 2, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting planet
    const x = 12 + Math.cos(angle) * 7;
    const y = 12 + Math.sin(angle) * 7;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Orbit path
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(12, 12, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  },

  // 3. Spring bounce - bouncing spring
  (ctx, t) => {
    const n = loop(t);
    const bounce = Math.abs(Math.sin(n * Math.PI * 2));
    const y = 6 + bounce * 10;
    const stretch = 1 - bounce * 0.3;

    ctx.save();
    ctx.translate(12, y);
    ctx.scale(1, stretch);

    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // 4. Double pendulum - chaotic motion
  (ctx, t) => {
    const n = loop(t);
    const a1 = Math.sin(n * Math.PI * 2) * 0.8;
    const a2 = Math.sin(n * Math.PI * 3) * 0.6;

    ctx.lineWidth = 1.5;

    // First arm
    const x1 = 12 + Math.sin(a1) * 5;
    const y1 = 8 + Math.cos(a1) * 5;
    ctx.beginPath();
    ctx.moveTo(12, 8);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Second arm
    const x2 = x1 + Math.sin(a1 + a2) * 4;
    const y2 = y1 + Math.cos(a1 + a2) * 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  },

  // 5. Gravity fall - falling and resetting
  (ctx, t) => {
    const n = loop(t);
    const fall = ease.inOut(n);
    const y = 4 + fall * 14;

    ctx.beginPath();
    ctx.arc(12, y, 2, 0, Math.PI * 2);
    ctx.fill();
  },

  // 6. Centripetal force - circular motion with trail
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    // Trail
    for (let i = 0; i < 5; i++) {
      const trailPhase = n - i * 0.1;
      if (trailPhase < 0) continue;
      const ta = trailPhase * Math.PI * 2;
      const alpha = 1 - i * 0.2;
      const x = 12 + Math.cos(ta) * 7;
      const y = 12 + Math.sin(ta) * 7;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // 7. Wave interference - intersecting waves
  (ctx, t) => {
    const n = loop(t);
    const points = 5;

    for (let i = 0; i < points; i++) {
      for (let j = 0; j < points; j++) {
        const x = 4 + i * 4;
        const y = 4 + j * 4;
        const dist = Math.sqrt(Math.pow(x - 12, 2) + Math.pow(y - 12, 2));
        const wave = Math.sin(dist - n * Math.PI * 4) * 0.5 + 0.5;

        ctx.globalAlpha = wave;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    ctx.globalAlpha = 1;
  },

  // 8. Elliptical orbit - ellipse motion
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const x = 12 + Math.cos(angle) * 8;
    const y = 12 + Math.sin(angle) * 4;

    // Orbit path
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(12, 12, 8, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Object
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  },

  // 9. Magnetic attraction - particles attracted to center
  (ctx, t) => {
    const n = loop(t);
    const particles = 6;

    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2;
      const phase = (n + i * 0.1) % 1;
      const distance = 10 - phase * 8;
      const x = 12 + Math.cos(angle) * distance;
      const y = 12 + Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // 10. Resonance - oscillating at different frequencies
  (ctx, t) => {
    const n = loop(t);
    const oscillators = 3;

    for (let i = 0; i < oscillators; i++) {
      const freq = (i + 1) * 2;
      const offset = Math.sin(n * Math.PI * freq) * 4;
      const y = 8 + i * 4;
      const x = 12 + offset;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
];
