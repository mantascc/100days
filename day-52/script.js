// ── Gray-Scott Reaction-Diffusion ────────────────────────────────────────────
// Two chemicals U and V react and diffuse across a grid.
// Simple local rules produce coral, labyrinths, spots, dendrites.

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const W = 400;
const H = 400;
const SIZE = W * H;

// Diffusion constants
const Du = 0.2097;
const Dv = 0.105;
const dt = 1.0;

// Feed / kill — modified by UI
let f = 0.055;
let k = 0.062;

// Double-buffered Float32 grids
let uCurr = new Float32Array(SIZE);
let vCurr = new Float32Array(SIZE);
let uNext = new Float32Array(SIZE);
let vNext = new Float32Array(SIZE);

// Persistent ImageData (avoid re-allocating every frame)
const imageData = ctx.createImageData(W, H);
const pixels = imageData.data;

// ── Color lookup table ───────────────────────────────────────────────────────
// Maps V ∈ [0,1] → RGB via 5 color stops:
//   0.0  →  #050810  (near-black)
//   0.2  →  #1a0a3a  (deep indigo)
//   0.5  →  #0a4a6e  (teal-blue)
//   0.8  →  #00d4ff  (electric cyan)
//   1.0  →  #ffd700  (gold)

const colorStops = [
  { t: 0.0, r: 0, g: 0, b: 0 },
  { t: 0.2, r: 40, g: 40, b: 40 },
  { t: 0.5, r: 100, g: 100, b: 100 },
  { t: 0.8, r: 200, g: 200, b: 200 },
  { t: 1.0, r: 255, g: 255, b: 255 },
];

const colorLUT = new Uint8Array(256 * 3);

for (let i = 0; i < 256; i++) {
  const t = i / 255;
  let r = 5, g = 8, b = 16;
  for (let s = 0; s < colorStops.length - 1; s++) {
    const c0 = colorStops[s];
    const c1 = colorStops[s + 1];
    if (t >= c0.t && t <= c1.t) {
      const a = (t - c0.t) / (c1.t - c0.t);
      r = c0.r + (c1.r - c0.r) * a;
      g = c0.g + (c1.g - c0.g) * a;
      b = c0.b + (c1.b - c0.b) * a;
      break;
    }
  }
  colorLUT[i * 3] = Math.round(r);
  colorLUT[i * 3 + 1] = Math.round(g);
  colorLUT[i * 3 + 2] = Math.round(b);
}

// ── Initialization ───────────────────────────────────────────────────────────

function init() {
  // U = 1 (food), V = 0 (activator) everywhere
  uCurr.fill(1.0);
  vCurr.fill(0.0);

  // Seed ~200 random 5×5 patches to kick off pattern formation
  for (let s = 0; s < 200; s++) {
    const cx = Math.floor(Math.random() * W);
    const cy = Math.floor(Math.random() * H);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = ((cx + dx) % W + W) % W;
        const ny = ((cy + dy) % H + H) % H;
        const idx = ny * W + nx;
        uCurr[idx] = 0.5;
        vCurr[idx] = 0.25;
      }
    }
  }
}

// ── Simulation step ──────────────────────────────────────────────────────────
// 9-point Laplacian: center = -1, NSEW = 0.2, diagonals = 0.05
// (sums to 0: -1 + 4×0.2 + 4×0.05 = 0)

function step() {
  for (let y = 0; y < H; y++) {
    const yOff = y * W;
    const yNOff = (y === 0 ? H - 1 : y - 1) * W;
    const yPOff = (y === H - 1 ? 0 : y + 1) * W;

    for (let x = 0; x < W; x++) {
      const xN = x === 0 ? W - 1 : x - 1;
      const xP = x === W - 1 ? 0 : x + 1;
      const idx = yOff + x;

      const u = uCurr[idx];
      const v = vCurr[idx];

      const lapU =
        -u
        + 0.2 * (uCurr[yNOff + x] + uCurr[yPOff + x] + uCurr[yOff + xN] + uCurr[yOff + xP])
        + 0.05 * (uCurr[yNOff + xN] + uCurr[yNOff + xP] + uCurr[yPOff + xN] + uCurr[yPOff + xP]);

      const lapV =
        -v
        + 0.2 * (vCurr[yNOff + x] + vCurr[yPOff + x] + vCurr[yOff + xN] + vCurr[yOff + xP])
        + 0.05 * (vCurr[yNOff + xN] + vCurr[yNOff + xP] + vCurr[yPOff + xN] + vCurr[yPOff + xP]);

      const uvv = u * v * v;

      let nu = u + (Du * lapU - uvv + f * (1 - u)) * dt;
      let nv = v + (Dv * lapV + uvv - (k + f) * v) * dt;

      uNext[idx] = nu < 0 ? 0 : nu > 1 ? 1 : nu;
      vNext[idx] = nv < 0 ? 0 : nv > 1 ? 1 : nv;
    }
  }

  // Swap buffers (no allocation — just swap references)
  let tmp;
  tmp = uCurr; uCurr = uNext; uNext = tmp;
  tmp = vCurr; vCurr = vNext; vNext = tmp;
}

// ── Render ───────────────────────────────────────────────────────────────────

function render() {
  for (let i = 0; i < SIZE; i++) {
    const v = vCurr[i];
    const lutIdx = (v <= 0 ? 0 : v >= 1 ? 255 : (v * 255) | 0) * 3;
    const p = i << 2;  // i * 4
    pixels[p] = colorLUT[lutIdx];
    pixels[p + 1] = colorLUT[lutIdx + 1];
    pixels[p + 2] = colorLUT[lutIdx + 2];
    pixels[p + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

// ── Animation loop ───────────────────────────────────────────────────────────

const STEPS_PER_FRAME = 8;

function animate() {
  for (let s = 0; s < STEPS_PER_FRAME; s++) step();
  render();
  requestAnimationFrame(animate);
}

// ── Mouse / touch interaction ────────────────────────────────────────────────

let isDrawing = false;
const BRUSH_R = 8; // radius in grid cells
const BRUSH_R2 = BRUSH_R * BRUSH_R;

function paintAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const gx = ((clientX - rect.left) * scaleX) | 0;
  const gy = ((clientY - rect.top) * scaleY) | 0;

  for (let dy = -BRUSH_R; dy <= BRUSH_R; dy++) {
    for (let dx = -BRUSH_R; dx <= BRUSH_R; dx++) {
      if (dx * dx + dy * dy <= BRUSH_R2) {
        const nx = ((gx + dx) % W + W) % W;
        const ny = ((gy + dy) % H + H) % H;
        const idx = ny * W + nx;
        vCurr[idx] = 1.0;
        uCurr[idx] = 0.0;
      }
    }
  }
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; paintAt(e.clientX, e.clientY); });
canvas.addEventListener('mousemove', (e) => { if (isDrawing) paintAt(e.clientX, e.clientY); });
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; paintAt(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) paintAt(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
canvas.addEventListener('touchend', () => { isDrawing = false; });

// ── UI controls ──────────────────────────────────────────────────────────────

const fSlider = document.getElementById('f-slider');
const kSlider = document.getElementById('k-slider');
const fVal = document.getElementById('f-val');
const kVal = document.getElementById('k-val');

fSlider.addEventListener('input', () => {
  f = parseFloat(fSlider.value);
  fVal.textContent = f.toFixed(4);
});

kSlider.addEventListener('input', () => {
  k = parseFloat(kSlider.value);
  kVal.textContent = k.toFixed(4);
});

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    f = parseFloat(btn.dataset.f);
    k = parseFloat(btn.dataset.k);
    fSlider.value = f;
    kSlider.value = k;
    fVal.textContent = f.toFixed(4);
    kVal.textContent = k.toFixed(4);

    // Highlight active preset
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  init();
});

// ── Start ─────────────────────────────────────────────────────────────────────

init();
animate();
