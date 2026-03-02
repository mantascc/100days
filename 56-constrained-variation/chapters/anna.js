const PINK   = [244, 160, 160];
const YELLOW = [244, 216, 122];
const DEEP   = [ 26,  15,  10];

function lerp(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ];
}

function clamp(v, lo = 0, hi = 255) { return Math.max(lo, Math.min(hi, v)); }

function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    canvas.width  = cell.offsetWidth;
    canvas.height = cell.offsetHeight;
    return { canvas, ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height };
}

// 1. still — eyelids heavy, barely-there warmth in the dark, slow breath
function drawStill(cv, t) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    const breathe = Math.sin(t * 0.25) * 0.04 + 0.09;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const dx = x / W - 0.5;
            const dy = y / H - 0.55;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const glow = Math.max(0, 1 - dist * 3.5) * breathe;
            const n = (Math.random() - 0.5) * 3;
            const col = lerp(DEEP, PINK, glow);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0] + n);
            img.data[i+1] = clamp(col[1] + n);
            img.data[i+2] = clamp(col[2] + n);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 2. exhale — sparse warm dust motes drifting lazily upward
function drawExhale(cv, t) {
    const { ctx, W, H } = cv;
    ctx.fillStyle = `rgb(${DEEP[0]},${DEEP[1]},${DEEP[2]})`;
    ctx.fillRect(0, 0, W, H);
    const N = 38;
    for (let k = 0; k < N; k++) {
        const h     = ((k * 2654435761) >>> 0) % 1000 / 1000;
        const bx    = ((k * 1234567891) >>> 0) % W;
        const speed = 0.018 + h * 0.012;
        const phase = h * Math.PI * 2;
        const size  = 0.6 + h * 1.4;
        const alpha = 0.10 + h * 0.20;
        const x     = bx + Math.sin(t * 0.12 + phase) * 10;
        const y     = ((H - (t * speed * H + h * H)) % H + H) % H;
        const col   = lerp(PINK, YELLOW, h);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
        ctx.fill();
    }
}

// 3. steam — a warm column rising from below, narrowing at source, wavering at top
function drawSteam(cv, t) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const dx       = x / W - 0.5;
            const progress = 1 - y / H;              // 1 at bottom, 0 at top
            const rise     = 1 - progress;            // 0 at bottom, 1 at top
            const width    = 0.04 + rise * 0.11;     // narrow at base, wide at top
            const waver    = Math.sin(t * 0.35 + progress * 5) * 0.06 * rise;
            const inBand   = Math.max(0, 1 - Math.abs(dx - waver) / width);
            const fade     = Math.pow(progress, 0.5) * 0.75 + Math.sin(t * 0.45) * 0.05;
            const glow     = inBand * fade;
            const col = lerp(DEEP, lerp(YELLOW, PINK, rise * 0.5), glow);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0]);
            img.data[i+1] = clamp(col[1]);
            img.data[i+2] = clamp(col[2]);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 4. grain — warm film grain across the whole frame, low energy, slow breathing
function drawGrain(cv, t) {
    const { ctx, W, H } = cv;
    const img    = ctx.createImageData(W, H);
    const bright = Math.sin(t * 0.18) * 0.04 + 0.33;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const tX    = x / W;
            const base  = lerp(PINK, YELLOW, tX);
            const grain = (Math.random() - 0.5) * 55;
            const col   = lerp(DEEP, base, bright);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0] + grain * 0.5);
            img.data[i+1] = clamp(col[1] + grain * 0.35);
            img.data[i+2] = clamp(col[2] + grain * 0.25);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 5. pulse — radial glow breathing outward from center, slow rhythm
function drawPulse(cv, t) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    const env = (Math.sin(t * 0.55) + 1) / 2;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const dx   = x / W - 0.5;
            const dy   = y / H - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const wave = Math.sin(dist * 14 - t * 0.9 + env * 2) * 0.5 + 0.5;
            const ring = wave * Math.exp(-dist * 3.5) * (0.35 + env * 0.5);
            const tCol = Math.max(0, 1 - dist * 2);
            const col  = lerp(DEEP, lerp(PINK, YELLOW, tCol), ring);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0]);
            img.data[i+1] = clamp(col[1]);
            img.data[i+2] = clamp(col[2]);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 6. rays — diagonal morning light shafts, soft edges, drifting slowly
function drawRays(cv, t) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    const NUM = 5;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const tX      = x / W;
            const tY      = y / H;
            const shifted = (tX + tY * 0.32 + t * 0.011) * NUM;
            const band    = shifted % 1;
            const inBand  = Math.pow(Math.sin(band * Math.PI), 2.5);
            const fade    = Math.pow(1 - tY, 0.65) * 0.8;
            const glow    = inBand * fade;
            const col = lerp(DEEP, lerp(PINK, YELLOW, tX * 0.35 + 0.65), glow);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0]);
            img.data[i+1] = clamp(col[1]);
            img.data[i+2] = clamp(col[2]);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 7. sharp — crisp horizontal bands, hard edges, fully present, slow scroll
function drawSharp(cv, t) {
    const { ctx, W, H } = cv;
    const img   = ctx.createImageData(W, H);
    const BANDS = 7;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const tX   = x / W;
            const band = (y / H * BANDS + t * 0.07) % 1;
            const edge = Math.abs(band - 0.5) < 0.018;
            const lit  = band < 0.5;
            const b    = edge ? 1 : (lit ? 0.74 : 0.04);
            const col  = lerp(DEEP, lerp(PINK, YELLOW, tX), b);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0]);
            img.data[i+1] = clamp(col[1]);
            img.data[i+2] = clamp(col[2]);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// 8. bloom — light catches the cup at just the right angle, single source with flare
function drawBloom(cv, t) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    const sx  = 0.32 + Math.sin(t * 0.12) * 0.025;
    const sy  = 0.63 + Math.cos(t * 0.09) * 0.015;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const dx    = x / W - sx;
            const dy    = y / H - sy;
            const dist  = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const glow  = Math.exp(-dist * 6) * 0.95;
            const flare = Math.exp(-dist * 2.5) * Math.pow(Math.max(0, Math.cos(angle + Math.PI * 0.28)), 6) * 0.75;
            const total = Math.min(1, glow + flare);
            const col   = lerp(DEEP, lerp(PINK, YELLOW, Math.min(1, total * 1.3)), total);
            const i = (y * W + x) * 4;
            img.data[i]   = clamp(col[0]);
            img.data[i+1] = clamp(col[1]);
            img.data[i+2] = clamp(col[2]);
            img.data[i+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

export default {
    labels:  ['still', 'exhale', 'steam', 'grain', 'pulse', 'rays', 'sharp', 'bloom'],
    dt:      0.02,
    setup,
    drawFns: [drawStill, drawExhale, drawSteam, drawGrain, drawPulse, drawRays, drawSharp, drawBloom],
};
