// Group 1: Geometric Primitives - Basic shapes with fundamental transformations

const geometricLoaders = [
  // 1. Rotating square
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();
  },

  // 2. Pulsing circle
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.5 + Math.sin(n * Math.PI * 2) * 0.3;
    const radius = 6 * scale;

    ctx.beginPath();
    ctx.arc(12, 12, radius, 0, Math.PI * 2);
    ctx.fill();
  },

  // 3. Triangle spin
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(5, 4);
    ctx.lineTo(-5, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 4. Square scale
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.3 + ease.inOut(n) * 0.7;
    const size = 8 * scale;

    ctx.fillRect(12 - size / 2, 12 - size / 2, size, size);
  },

  // 5. Pentagon rotate
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const sides = 5;
    const radius = 6;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 6. Hexagon pulse
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.6 + Math.sin(n * Math.PI * 2) * 0.4;
    const sides = 6;
    const radius = 6 * scale;

    ctx.save();
    ctx.translate(12, 12);

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 7. Double square
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.save();
    ctx.translate(12, 12);

    // Outer square
    ctx.rotate(angle);
    ctx.strokeStyle = FG;
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -6, 12, 12);

    // Inner square
    ctx.rotate(-angle * 2);
    ctx.fillRect(-3, -3, 6, 6);

    ctx.restore();
  },

  // 8. Diamond morph
  (ctx, t) => {
    const n = loop(t);
    const morph = Math.sin(n * Math.PI * 2);
    const size = 6;

    ctx.save();
    ctx.translate(12, 12);

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * (1 + morph * 0.5), 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * (1 + morph * 0.5), 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 9. Ring expand
  (ctx, t) => {
    const n = loop(t);
    const radius = 2 + n * 8;
    const alpha = 1 - n;

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = FG;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(12, 12, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  },

  // 10. Star twinkle
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.5 + Math.sin(n * Math.PI * 4) * 0.5;
    const points = 5;
    const outerRadius = 7 * scale;
    const innerRadius = 3 * scale;

    ctx.save();
    ctx.translate(12, 12);

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
];
