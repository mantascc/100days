// Group 4: Line Art - Single stroke, spirals, continuous paths

const lineartLoaders = [
  // 1. Rotating line - simple rotating line
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(12 + Math.cos(angle) * 8, 12 + Math.sin(angle) * 8);
    ctx.stroke();
  },

  // 2. Drawing circle - circle being drawn
  (ctx, t) => {
    const n = loop(t);
    const endAngle = n * Math.PI * 2;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(12, 12, 7, 0, endAngle);
    ctx.stroke();
  },

  // 3. Spiral - expanding spiral
  (ctx, t) => {
    const n = loop(t);
    const points = 30;

    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < points * n; i++) {
      const progress = i / points;
      const angle = progress * Math.PI * 4;
      const radius = progress * 8;
      const x = 12 + Math.cos(angle) * radius;
      const y = 12 + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 4. Sine wave - traveling wave
  (ctx, t) => {
    const n = loop(t);
    const points = 20;

    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < points; i++) {
      const x = (i / points) * 24;
      const y = 12 + Math.sin(i * 0.5 + n * Math.PI * 2) * 4;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 5. Cross lines - rotating cross
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 6);
    ctx.stroke();

    ctx.restore();
  },

  // 6. Square spiral - drawing square spiral
  (ctx, t) => {
    const n = loop(t);
    const size = 14;

    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const centerX = 12;
    const centerY = 12;
    let x = centerX;
    let y = centerY;
    const steps = 4;
    const totalSteps = steps * 4 * n;

    ctx.moveTo(x, y);

    for (let i = 0; i < totalSteps; i++) {
      const step = Math.floor(i / 4);
      const distance = (step + 1) * 2;
      const dir = i % 4;

      if (dir === 0) x += distance;
      else if (dir === 1) y -= distance;
      else if (dir === 2) x -= distance;
      else y += distance;

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 7. Zigzag - animated zigzag
  (ctx, t) => {
    const n = loop(t);
    const segments = 6;

    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 20 + 2;
      const offset = Math.sin(n * Math.PI * 2 + i * 0.8) * 4;
      const y = 12 + offset;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 8. Sweeping arc - arc sweeping around
  (ctx, t) => {
    const n = loop(t);
    const startAngle = n * Math.PI * 2;
    const endAngle = startAngle + Math.PI;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(12, 12, 7, startAngle, endAngle);
    ctx.stroke();
  },

  // 9. Infinity symbol - drawing infinity
  (ctx, t) => {
    const n = loop(t);
    const points = 50;

    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < points * n; i++) {
      const progress = i / points;
      const angle = progress * Math.PI * 2;
      const scale = Math.sin(angle);
      const x = 12 + scale * Math.cos(angle) * 7;
      const y = 12 + Math.sin(angle * 2) * 4;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 10. Oscillating lines - multiple oscillating lines
  (ctx, t) => {
    const n = loop(t);
    const lines = 3;

    ctx.lineWidth = 1;

    for (let l = 0; l < lines; l++) {
      const offset = (l / lines) * Math.PI * 2;
      const phase = Math.sin(n * Math.PI * 2 + offset);
      const y = 8 + l * 4;
      const len = 8 + phase * 4;

      ctx.beginPath();
      ctx.moveTo(12 - len / 2, y);
      ctx.lineTo(12 + len / 2, y);
      ctx.stroke();
    }
  }
];
