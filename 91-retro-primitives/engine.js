// Shared engine for retro-primitives variants.
// Reads `window.VARIANT`, then renders the 4 canvases with variant-specific
// palette + animation. Every variant runs the same tube pipeline (bloom → subject
// → chromatic nudge → readout → vignette → grain → gloss).

(function () {
  const V = window.VARIANT;
  if (!V) { console.error('VARIANT not set'); return; }

  const CSS_SIZE = 260;
  const SCALE = Math.min(window.devicePixelRatio || 1, 2);
  const SIZE = CSS_SIZE * SCALE;
  const TWO_PI = Math.PI * 2;

  const shapes = ['circle', 'square', 'triangle', 'ellipse'];

  // ---------- fills ----------

  function warmSun(ctx) {
    const g = ctx.createRadialGradient(130, 108, 8, 130, 130, 118);
    g.addColorStop(0.00, V.fillStops[0]);
    g.addColorStop(0.14, V.fillStops[1]);
    g.addColorStop(0.55, V.fillStops[2]);
    g.addColorStop(1.00, V.fillStops[3]);
    return g;
  }

  function coldIce(ctx) {
    const g = ctx.createRadialGradient(130, 130, 4, 130, 130, 122);
    g.addColorStop(0.00, V.fillStops[0]);
    g.addColorStop(0.22, V.fillStops[1]);
    g.addColorStop(0.66, V.fillStops[2]);
    g.addColorStop(1.00, V.fillStops[3]);
    return g;
  }

  function signalFill(ctx, t) {
    // subtle vertical banding for signal-loss vibe
    const g = ctx.createLinearGradient(0, -110, 0, 110);
    const drift = Math.sin(t * 0.6) * 0.05;
    g.addColorStop(0.00, V.fillStops[0]);
    g.addColorStop(0.35 + drift, V.fillStops[1]);
    g.addColorStop(0.75 - drift, V.fillStops[2]);
    g.addColorStop(1.00, V.fillStops[3]);
    return g;
  }

  function pickFill(ctx, t) {
    if (V.fillMode === 'none') return null;
    if (V.fillMode === 'ice') return coldIce(ctx);
    if (V.fillMode === 'signal') return signalFill(ctx, t);
    return warmSun(ctx);
  }

  // ---------- rings ----------

  function ringStroke(ctx, path, width, bright) {
    ctx.save();
    ctx.strokeStyle = V.ringOuter;
    ctx.lineWidth = width + 3;
    ctx.globalAlpha = 0.5;
    ctx.stroke(path);
    ctx.strokeStyle = V.ringInner;
    ctx.lineWidth = width;
    ctx.globalAlpha = bright ? 1 : 0.9;
    ctx.stroke(path);
    ctx.restore();
  }

  // ---------- shapes ----------

  function drawCircle(ctx, t) {
    const r = 74;
    ctx.save();
    ctx.translate(130, 130);

    const disc = new Path2D();
    disc.arc(0, 0, r, 0, TWO_PI);
    const fill = pickFill(ctx, t);
    if (fill) { ctx.fillStyle = fill; ctx.fill(disc); }

    // 3 hoops — in 'spin' mode rotate around a horizontal axis (phase sweeps)
    if (V.animation === 'spin') {
      const phase = t * 0.9;
      for (let i = 0; i < 5; i++) {
        const p = phase + (i / 5) * Math.PI * 2;
        const y = Math.sin(p) * r * 0.92;
        const ry = Math.abs(Math.cos(p)) * 12 + 1.5;
        const w = Math.sqrt(Math.max(0, r * r - y * y));
        if (w < 4) continue;
        const path = new Path2D();
        path.ellipse(0, y, w, ry, 0, 0, TWO_PI);
        ringStroke(ctx, path, 1.6, i === 2);
      }
    } else {
      const hoops = [
        { y: -r * 0.62, ry: 8,  bright: false },
        { y:  0,        ry: 10, bright: true  },
        { y:  r * 0.55, ry: 9,  bright: false }
      ];
      for (const h of hoops) {
        const w = Math.sqrt(Math.max(0, r * r - h.y * h.y));
        const path = new Path2D();
        path.ellipse(0, h.y, w, h.ry, 0, 0, TWO_PI);
        ringStroke(ctx, path, h.bright ? 2.2 : 1.6, h.bright);
      }
    }

    ringStroke(ctx, disc, 2, false);
    ctx.restore();
  }

  function drawSquare(ctx, t) {
    const s = 132;
    ctx.save();
    ctx.translate(130, 132);
    const r = 10;
    const path = new Path2D();
    path.moveTo(-s/2 + r, -s/2);
    path.arcTo( s/2, -s/2,  s/2, -s/2 + r, r);
    path.arcTo( s/2,  s/2,  s/2 - r,  s/2, r);
    path.arcTo(-s/2,  s/2, -s/2,  s/2 - r, r);
    path.arcTo(-s/2, -s/2, -s/2 + r, -s/2, r);
    path.closePath();

    const fill = pickFill(ctx, t);
    if (fill) { ctx.fillStyle = fill; ctx.fill(path); }
    ringStroke(ctx, path, 2, false);

    if (V.animation === 'spin') {
      // 3 bars scanning down and wrapping
      for (let i = 0; i < 3; i++) {
        const y = ((t * 22 + i * (s / 3)) % s) - s / 2;
        const bar = new Path2D();
        bar.moveTo(-s/2, y); bar.lineTo(s/2, y);
        ringStroke(ctx, bar, i === 1 ? 2 : 1.5, i === 1);
      }
    } else {
      for (const yy of [-s * 0.24, s * 0.24]) {
        const bar = new Path2D();
        bar.moveTo(-s/2, yy);
        bar.lineTo( s/2, yy);
        ringStroke(ctx, bar, yy < 0 ? 1.6 : 2, yy >= 0);
      }
    }
    ctx.restore();
  }

  function drawTriangle(ctx, t) {
    const h = 148, w = 156;
    ctx.save();
    ctx.translate(130, 138);
    const path = new Path2D();
    path.moveTo(0, -h/2);
    path.lineTo( w/2, h/2);
    path.lineTo(-w/2, h/2);
    path.closePath();

    const fill = pickFill(ctx, t);
    if (fill) { ctx.fillStyle = fill; ctx.fill(path); }
    ringStroke(ctx, path, 2, false);

    if (V.animation === 'spin') {
      for (let i = 0; i < 4; i++) {
        const phase = ((t * 0.55 + i / 4) % 1);   // 0..1 top→bottom
        const y = -h/2 + phase * h;
        const span = w * phase * 0.94;
        if (span < 6) continue;
        const bar = new Path2D();
        bar.moveTo(-span/2, y); bar.lineTo(span/2, y);
        ringStroke(ctx, bar, i === 1 ? 2 : 1.5, i === 1);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const p = (i + 1) / 4;
        const y = -h/2 + h * p;
        const span = w * p * 0.94;
        const bar = new Path2D();
        bar.moveTo(-span/2, y);
        bar.lineTo( span/2, y);
        ringStroke(ctx, bar, i === 1 ? 2 : 1.5, i === 1);
      }
    }
    ctx.restore();
  }

  function drawEllipse(ctx, t) {
    const rx = 88, ry = 62;
    ctx.save();
    ctx.translate(130, 130);
    const path = new Path2D();
    path.ellipse(0, 0, rx, ry, 0, 0, TWO_PI);

    const fill = pickFill(ctx, t);
    if (fill) { ctx.fillStyle = fill; ctx.fill(path); }
    ringStroke(ctx, path, 2, false);

    if (V.animation === 'spin') {
      const phase = t * 0.9;
      for (let i = 0; i < 5; i++) {
        const p = phase + (i / 5) * Math.PI * 2;
        const yy = Math.sin(p) * ry * 0.92;
        const w = Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry))) * rx;
        if (w < 4) continue;
        const bar = new Path2D();
        bar.moveTo(-w, yy); bar.lineTo(w, yy);
        ringStroke(ctx, bar, i === 2 ? 2.2 : 1.6, i === 2);
      }
    } else {
      for (const yy of [-ry * 0.55, 0, ry * 0.55]) {
        const wid = Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry))) * rx;
        const bar = new Path2D();
        bar.moveTo(-wid, yy);
        bar.lineTo( wid, yy);
        ringStroke(ctx, bar, yy === 0 ? 2.2 : 1.6, yy === 0);
      }
    }
    ctx.restore();
  }

  const drawers = { circle: drawCircle, square: drawSquare, triangle: drawTriangle, ellipse: drawEllipse };

  // ---------- setup ----------

  const items = shapes.map((name, i) => {
    const canvas = document.querySelector(`canvas[data-shape="${name}"]`);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = SIZE;
    canvas.height = SIZE;
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    return {
      canvas, ctx,
      draw: drawers[name],
      offset: i * 1.3,
      // per-cell glitch state
      glitchUntil: 0,
      glitchOffset: 0,
      glitchY: 0,
      glitchH: 0,
      nextGlitchAt: 1 + Math.random() * 3
    };
  }).filter(Boolean);

  const buffer = document.createElement('canvas');
  buffer.width = SIZE;
  buffer.height = SIZE;
  const bctx = buffer.getContext('2d');
  bctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = CSS_SIZE;
  grainCanvas.height = CSS_SIZE;
  const grainCtx = grainCanvas.getContext('2d');
  const grainImage = grainCtx.createImageData(CSS_SIZE, CSS_SIZE);
  const [gr, gg, gb] = V.grainRGB || [180, 255, 220];

  function regenGrain() {
    const d = grainImage.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random();
      const shown = v > 0.86 ? (v - 0.86) * 720 : 0;
      d[i] = gr; d[i+1] = gg; d[i+2] = gb;
      d[i+3] = shown;
    }
    grainCtx.putImageData(grainImage, 0, 0);
  }
  regenGrain();
  let grainTick = 0;

  // ---------- overlays ----------

  function drawReadout(ctx) {
    ctx.save();
    ctx.translate(130, 232);
    const w = 42, h = 3;
    ctx.fillStyle = V.readoutDim;
    ctx.fillRect(-w/2, -h/2 - 4, w, h);
    ctx.fillStyle = V.readoutBright;
    ctx.fillRect(-w/2, -h/2 + 4, w, h);
    ctx.restore();
  }

  function drawVignette(ctx) {
    const g = ctx.createRadialGradient(130, 122, 20, 130, 130, 178);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CSS_SIZE, CSS_SIZE);
  }

  function drawSweep(ctx, t, offset) {
    // A bright horizontal bar traveling top to bottom every ~3.6s
    const period = 3.6;
    const phase = ((t + offset * 0.4) % period) / period; // 0..1
    if (phase > 1) return;
    const y = phase * (CSS_SIZE + 40) - 20;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createLinearGradient(0, y - 18, 0, y + 18);
    g.addColorStop(0.0, 'rgba(0,0,0,0)');
    g.addColorStop(0.5, V.sweepColor);
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 18, CSS_SIZE, 36);
    ctx.restore();
  }

  function updateGlitch(item, t) {
    if (t > item.nextGlitchAt) {
      item.glitchUntil = t + 0.09 + Math.random() * 0.12;
      item.glitchOffset = (Math.random() - 0.5) * 24;
      item.glitchY = Math.random() * CSS_SIZE;
      item.glitchH = 8 + Math.random() * 22;
      item.nextGlitchAt = t + 0.9 + Math.random() * 3;
    }
  }

  function drawGlitch(ctx, item, t) {
    if (t > item.glitchUntil) return;
    // Cut a horizontal slice of the buffer, offset it, screen over
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.85;
    ctx.drawImage(
      buffer,
      0, item.glitchY * SCALE, SIZE, item.glitchH * SCALE,
      item.glitchOffset, item.glitchY, CSS_SIZE, item.glitchH
    );
    ctx.restore();
    // color-fringe echo
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = V.sweepColor;
    ctx.fillRect(0, item.glitchY, CSS_SIZE, 1);
    ctx.restore();
  }

  // ---------- frame ----------

  function draw(item, now) {
    const t = now * 0.001 + item.offset;
    const { ctx } = item;

    const dx = Math.sin(t * 0.35) * 0.6;
    const dy = Math.cos(t * 0.27) * 0.5;
    const breathe = 1 + Math.sin(t * 0.5) * 0.012;

    if (V.animation === 'glitch') updateGlitch(item, t);

    // clear main
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CSS_SIZE, CSS_SIZE);

    // subject → buffer
    bctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    bctx.clearRect(0, 0, CSS_SIZE, CSS_SIZE);
    bctx.save();
    bctx.translate(dx, dy);
    bctx.translate(CSS_SIZE/2, CSS_SIZE/2);
    bctx.scale(breathe, breathe);
    bctx.translate(-CSS_SIZE/2, -CSS_SIZE/2);
    item.draw(bctx, t);
    bctx.restore();

    // bloom 1
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'blur(22px)';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(buffer, 0, 0, CSS_SIZE, CSS_SIZE);
    ctx.restore();

    // bloom 2
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'blur(7px)';
    ctx.globalAlpha = 0.7;
    ctx.drawImage(buffer, 0, 0, CSS_SIZE, CSS_SIZE);
    ctx.restore();

    // subject
    ctx.save();
    ctx.filter = 'blur(0.7px)';
    ctx.drawImage(buffer, 0, 0, CSS_SIZE, CSS_SIZE);
    ctx.restore();

    // chroma nudge
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.22;
    ctx.filter = 'blur(1.2px)';
    ctx.drawImage(buffer, -0.8, 0.4, CSS_SIZE, CSS_SIZE);
    ctx.restore();

    // sweep (cryo)
    if (V.animation === 'sweep') drawSweep(ctx, t, item.offset);
    // glitch (signal)
    if (V.animation === 'glitch') drawGlitch(ctx, item, t);

    drawReadout(ctx);
    drawVignette(ctx);

    // grain
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = V.grainAlpha ?? 0.55;
    ctx.drawImage(grainCanvas, 0, 0, CSS_SIZE, CSS_SIZE);
    ctx.restore();

    // top gloss
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const gloss = ctx.createLinearGradient(0, 0, 0, CSS_SIZE * 0.5);
    gloss.addColorStop(0, V.glossColor);
    gloss.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, CSS_SIZE, CSS_SIZE * 0.5);
    ctx.restore();
  }

  function frame(now) {
    grainTick = (grainTick + 1) % 3;
    if (grainTick === 0) regenGrain();
    for (const item of items) draw(item, now);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
