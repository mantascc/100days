// Group 9: Minimalist Reduction - Single pixel journeys, morse code, extreme simplicity

const minimalistLoaders = [
  // 1. Single pixel orbit - one pixel orbiting
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;
    const x = 12 + Math.cos(angle) * 8;
    const y = 12 + Math.sin(angle) * 8;

    ctx.fillRect(x, y, 1, 1);
  },

  // 2. Blinking dot - simple blink
  (ctx, t) => {
    const n = loop(t);
    const show = Math.sin(n * Math.PI * 4) > 0;

    if (show) {
      ctx.fillRect(11, 11, 2, 2);
    }
  },

  // 3. Horizontal sweep - single pixel moving
  (ctx, t) => {
    const n = loop(t);
    const x = n * 24;

    ctx.fillRect(x, 12, 1, 1);
  },

  // 4. Morse code - dot dash pattern
  (ctx, t) => {
    const n = loop(t);
    const pattern = [1, 0, 1, 0, 1, 1, 1, 0]; // S.O.S simplified
    const index = Math.floor(n * pattern.length);
    const show = pattern[index] === 1;

    if (show) {
      ctx.fillRect(10, 11, 4, 2);
    }
  },

  // 5. Breathing pixel - size changing
  (ctx, t) => {
    const n = loop(t);
    const size = 1 + Math.sin(n * Math.PI * 2) * 2;

    ctx.fillRect(12 - size / 2, 12 - size / 2, size, size);
  },

  // 6. Corner sequence - pixel moving corner to corner
  (ctx, t) => {
    const n = loop(t);
    const corners = [
      [4, 4],
      [20, 4],
      [20, 20],
      [4, 20]
    ];
    const index = Math.floor(n * 4);
    const nextIndex = (index + 1) % 4;
    const progress = (n * 4) % 1;

    const x = corners[index][0] + (corners[nextIndex][0] - corners[index][0]) * progress;
    const y = corners[index][1] + (corners[nextIndex][1] - corners[index][1]) * progress;

    ctx.fillRect(x, y, 2, 2);
  },

  // 7. Fade in/out - single element fading
  (ctx, t) => {
    const n = loop(t);
    const alpha = Math.sin(n * Math.PI * 2) * 0.5 + 0.5;

    ctx.globalAlpha = alpha;
    ctx.fillRect(10, 10, 4, 4);
    ctx.globalAlpha = 1;
  },

  // 8. Minimal arc - tiny arc rotating
  (ctx, t) => {
    const n = loop(t);
    const angle = n * Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(12, 12, 6, angle, angle + Math.PI / 2);
    ctx.stroke();
  },

  // 9. Two pixels - minimal conversation
  (ctx, t) => {
    const n = loop(t);
    const distance = Math.sin(n * Math.PI * 2) * 4;

    ctx.fillRect(12 - 2 - distance, 12, 1, 1);
    ctx.fillRect(12 + 2 + distance, 12, 1, 1);
  },

  // 10. Vertical line scan - minimal line moving
  (ctx, t) => {
    const n = loop(t);
    const x = n * 24;

    ctx.fillRect(x, 0, 1, 24);
  }
];
