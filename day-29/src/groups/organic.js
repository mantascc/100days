// Group 2: Organic Forms - Blob-like, flowing, breathing animations

const organicLoaders = [
  // 1. Breathing blob - soft circular breathing
  (ctx, t) => {
    const n = loop(t);
    const points = 8;
    const baseRadius = 6;

    ctx.save();
    ctx.translate(12, 12);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = Math.sin(angle * 3 + n * Math.PI * 2) * 0.3;
      const radius = baseRadius + noise * baseRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 2. Wave morph - undulating shape
  (ctx, t) => {
    const n = loop(t);
    const points = 12;

    ctx.save();
    ctx.translate(12, 12);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const wave = Math.sin(angle * 2 + n * Math.PI * 4) * 2;
      const radius = 5 + wave;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 3. Amoeba - organic crawling motion
  (ctx, t) => {
    const n = loop(t);
    const points = 6;

    ctx.save();
    ctx.translate(12, 12);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const offset1 = Math.sin(angle * 2 + n * Math.PI * 2) * 1.5;
      const offset2 = Math.cos(angle * 3 - n * Math.PI * 2) * 1;
      const radius = 5 + offset1 + offset2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 4. Pulsing blob - expanding/contracting
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.7 + Math.sin(n * Math.PI * 2) * 0.3;
    const points = 8;

    ctx.save();
    ctx.translate(12, 12);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const wobble = Math.sin(angle * 4) * 0.2;
      const radius = (6 + wobble) * scale;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 5. Flowing circle - liquid motion
  (ctx, t) => {
    const n = loop(t);
    const points = 16;

    ctx.save();
    ctx.translate(12, 12);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const flow = Math.sin(angle * 5 - n * Math.PI * 3) * 1.2;
      const radius = 5.5 + flow;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 6. Cell division - splitting and merging
  (ctx, t) => {
    const n = loop(t);
    const split = Math.sin(n * Math.PI * 2);
    const offset = split * 3;

    ctx.beginPath();
    ctx.arc(12 - offset / 2, 12, 4 - Math.abs(split) * 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(12 + offset / 2, 12, 4 - Math.abs(split) * 1, 0, Math.PI * 2);
    ctx.fill();
  },

  // 7. Squash and stretch
  (ctx, t) => {
    const n = loop(t);
    const phase = Math.sin(n * Math.PI * 2);
    const scaleX = 1 + phase * 0.5;
    const scaleY = 1 - phase * 0.5;

    ctx.save();
    ctx.translate(12, 12);
    ctx.scale(scaleX, scaleY);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  // 8. Blob rotation - rotating organic shape
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const points = 5;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2;
      const distortion = Math.sin(a * 2) * 2;
      const radius = 5 + distortion;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  // 9. Ripple blob - concentric organic waves
  (ctx, t) => {
    const n = loop(t);

    for (let r = 0; r < 3; r++) {
      const phase = (n + r * 0.33) % 1;
      const points = 8;
      const baseRadius = 3 + phase * 6;
      const alpha = 1 - phase;

      ctx.globalAlpha = alpha;
      ctx.beginPath();

      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wobble = Math.sin(angle * 3) * 0.5;
        const radius = baseRadius + wobble;
        const x = 12 + Math.cos(angle) * radius;
        const y = 12 + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  },

  // 10. Elastic bounce - bouncing blob
  (ctx, t) => {
    const n = loop(t);
    const bounce = Math.abs(Math.sin(n * Math.PI * 2));
    const squish = ease.out(bounce);

    ctx.save();
    ctx.translate(12, 12 + (1 - squish) * 3);

    const scaleX = 1 + (1 - squish) * 0.3;
    const scaleY = 0.7 + squish * 0.3;

    ctx.scale(scaleX, scaleY);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
];
