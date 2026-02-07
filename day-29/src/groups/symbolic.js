// Group 6: Symbolic - Icons, metaphors, recognizable loading concepts

const symbolicLoaders = [
  // 1. Hourglass - sand falling
  (ctx, t) => {
    const n = loop(t);

    // Hourglass outline
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(6, 4);
    ctx.lineTo(18, 4);
    ctx.lineTo(15, 12);
    ctx.lineTo(18, 20);
    ctx.lineTo(6, 20);
    ctx.lineTo(9, 12);
    ctx.closePath();
    ctx.stroke();

    // Sand level
    const sandLevel = n * 12;
    ctx.fillRect(10, 8 + (12 - sandLevel), 4, sandLevel);
  },

  // 2. Clock hand - rotating clock
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2 - Math.PI / 2;

    // Clock circle
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(12, 12, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Clock hand
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(12 + Math.cos(angle) * 6, 12 + Math.sin(angle) * 6);
    ctx.stroke();
  },

  // 3. Progress bar - filling bar
  (ctx, t) => {
    const n = loop(t);

    // Outline
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 10, 16, 4);

    // Fill
    const width = 16 * n;
    ctx.fillRect(4, 10, width, 4);
  },

  // 4. Download arrow - bouncing arrow
  (ctx, t) => {
    const n = loop(t);
    const bounce = Math.sin(n * Math.PI * 2) * 3;
    const y = 10 + bounce;

    ctx.lineWidth = 2;

    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(12, 4);
    ctx.lineTo(12, y + 4);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(12, y + 8);
    ctx.lineTo(9, y + 4);
    ctx.lineTo(15, y + 4);
    ctx.closePath();
    ctx.fill();
  },

  // 5. Refresh/Sync - rotating arrows
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate(angle);
    ctx.lineWidth = 2;

    // Circular arrows
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 1.5);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-4, -2);
    ctx.lineTo(-4, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  // 6. Upload - rising bars
  (ctx, t) => {
    const n = loop(t);
    const bars = 4;

    for (let i = 0; i < bars; i++) {
      const phase = (n + i * 0.25) % 1;
      const height = 12 * (1 - phase);
      const alpha = 1 - phase;

      ctx.globalAlpha = alpha;
      ctx.fillRect(4 + i * 5, 18 - height, 3, height);
    }
    ctx.globalAlpha = 1;
  },

  // 7. Signal strength - animated bars
  (ctx, t) => {
    const n = loop(t);
    const bars = 4;

    for (let i = 0; i < bars; i++) {
      const height = (i + 1) * 4;
      const phase = (n + i * 0.2) % 1;
      const alpha = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;

      ctx.globalAlpha = alpha;
      ctx.fillRect(4 + i * 5, 18 - height, 3, height);
    }
    ctx.globalAlpha = 1;
  },

  // 8. Battery charging - filling battery
  (ctx, t) => {
    const n = loop(t);

    // Battery outline
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 10, 12, 6);
    ctx.fillRect(17, 12, 2, 2); // Terminal

    // Fill level
    const fillWidth = 10 * n;
    ctx.fillRect(6, 11, fillWidth, 4);
  },

  // 9. Magnifying glass - searching
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const offset = Math.sin(angle) * 2;

    // Glass circle
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(10 + offset, 10, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Handle
    ctx.beginPath();
    ctx.moveTo(14 + offset, 14);
    ctx.lineTo(18, 18);
    ctx.stroke();
  },

  // 10. Heart beat - pulsing heart
  (ctx, t) => {
    const n = loop(t);
    const scale = 0.8 + Math.sin(n * Math.PI * 4) * 0.2;

    ctx.save();
    ctx.translate(12, 12);
    ctx.scale(scale, scale);

    // Heart shape
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(-3, -2, -6, 0, 0, 6);
    ctx.bezierCurveTo(6, 0, 3, -2, 0, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
];
