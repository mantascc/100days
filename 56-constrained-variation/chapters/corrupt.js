const PINK   = [244, 160, 160];
const YELLOW = [244, 216, 122];

function lerp(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ];
}

function clamp01(v)        { return Math.max(0, Math.min(1, v)); }
function clampPx(v, max)   { return Math.max(0, Math.min(max - 1, v)); }

function h(a, b = 0) {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
    return n - Math.floor(n);
}

function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    canvas.width  = cell.offsetWidth;
    canvas.height = cell.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');

    const base = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const c = lerp(PINK, YELLOW, x / W);
            const i = (y * W + x) * 4;
            base[i] = c[0]; base[i+1] = c[1]; base[i+2] = c[2]; base[i+3] = 255;
        }
    }

    const B     = 12;
    const bBase = new Uint8ClampedArray(W * H * 4);
    const bCols = Math.ceil(W / B), bRows = Math.ceil(H / B);
    for (let br = 0; br < bRows; br++) {
        for (let bc = 0; bc < bCols; bc++) {
            const jitter = (h(br * 31 + bc * 17) - 0.5) * 0.14;
            const c = lerp(PINK, YELLOW, clamp01(bc / bCols + jitter));
            for (let dy = 0; dy < B && br * B + dy < H; dy++) {
                for (let dx = 0; dx < B && bc * B + dx < W; dx++) {
                    const i = ((br * B + dy) * W + (bc * B + dx)) * 4;
                    bBase[i] = c[0]; bBase[i+1] = c[1]; bBase[i+2] = c[2]; bBase[i+3] = 255;
                }
            }
        }
    }

    return { canvas, ctx, W, H, base, bBase };
}

// ── 1 · Chunk — thick slabs snap to large x-offsets at slow glitch rate ──────
function drawChunk(cv, t) {
    const { ctx, W, H, base } = cv;
    const gf    = Math.floor(t * 3);
    const img   = ctx.createImageData(W, H);
    const bandH = Math.ceil(H / 5);
    for (let y = 0; y < H; y++) {
        const band   = Math.floor(y / bandH);
        const active = h(band * 11, gf) < 0.35;
        const offset = active ? Math.round((h(band, gf) - 0.5) * W * 0.75) : 0;
        for (let x = 0; x < W; x++) {
            const srcX = clampPx(x - offset, W);
            const s = (y * W + srcX) * 4, d = (y * W + x) * 4;
            img.data[d] = base[s]; img.data[d+1] = base[s+1];
            img.data[d+2] = base[s+2]; img.data[d+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 2 · Dissolve — Bayer 4×4 ordered dither, threshold pulses 0→1→0 ─────────
function drawDissolve(cv, t) {
    const { ctx, W, H, base } = cv;
    const bayer  = [0,8,2,10, 12,4,14,6, 3,11,1,9, 15,7,13,5];
    const thresh = (Math.sin(t * 0.5) + 1) / 2;
    const img    = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const b = bayer[(y & 3) * 4 + (x & 3)] / 16;
            const i = (y * W + x) * 4;
            if (b > thresh) {
                img.data[i] = base[i]; img.data[i+1] = base[i+1];
                img.data[i+2] = base[i+2]; img.data[i+3] = 255;
            } else {
                img.data[i] = 26; img.data[i+1] = 15;
                img.data[i+2] = 10; img.data[i+3] = 255;
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 3 · Melt — sine wave distortion, amplitude grows toward bottom ────────────
function drawMelt(cv, t) {
    const { ctx, W, H, base } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        const amp    = (y / H) * 24 * (0.5 + 0.5 * Math.sin(t * 0.4));
        const offset = Math.round(Math.sin(y / H * Math.PI * 5 - t * 1.5) * amp);
        for (let x = 0; x < W; x++) {
            const srcX = clampPx(x - offset, W);
            const s = (y * W + srcX) * 4, d = (y * W + x) * 4;
            img.data[d] = base[s]; img.data[d+1] = base[s+1];
            img.data[d+2] = base[s+2]; img.data[d+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 4 · Warp — two overlapping sine waves, complex horizontal undulation ──────
function drawWarp(cv, t) {
    const { ctx, W, H, base } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        const o1     = Math.sin(y / H * Math.PI * 3 + t * 0.8) * 30;
        const o2     = Math.sin(y / H * Math.PI * 7 - t * 1.3) * 12;
        const offset = Math.round(o1 + o2);
        for (let x = 0; x < W; x++) {
            const srcX = clampPx(x - offset, W);
            const s = (y * W + srcX) * 4, d = (y * W + x) * 4;
            img.data[d] = base[s]; img.data[d+1] = base[s+1];
            img.data[d+2] = base[s+2]; img.data[d+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 5 · Skip — two moving tape-tear lines, zones accumulate x-offsets ────────
function drawSkip(cv, t) {
    const { ctx, W, H, base } = cv;
    const gf  = Math.floor(t * 5);
    const img = ctx.createImageData(W, H);
    const t1  = Math.round(H * (0.30 + Math.sin(t * 0.7) * 0.14));
    const t2  = Math.round(H * (0.65 + Math.cos(t * 0.5) * 0.10));
    const o1  = h(1, gf) < 0.45 ? Math.round((h(11, gf) - 0.5) * W * 0.55) : 0;
    const o2  = h(2, gf) < 0.45 ? Math.round((h(22, gf) - 0.5) * W * 0.45) : 0;
    for (let y = 0; y < H; y++) {
        const offset = (y >= t1 ? o1 : 0) + (y >= t2 ? o2 : 0);
        for (let x = 0; x < W; x++) {
            const srcX = clampPx(x - offset, W);
            const s = (y * W + srcX) * 4, d = (y * W + x) * 4;
            img.data[d] = base[s]; img.data[d+1] = base[s+1];
            img.data[d+2] = base[s+2]; img.data[d+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 6 · Mirror — vertical strips randomly flip horizontally ───────────────────
function drawMirror(cv, t) {
    const { ctx, W, H, base } = cv;
    const gf  = Math.floor(t * 3);
    const img = ctx.createImageData(W, H);
    const nB  = 5;
    const bW  = Math.ceil(W / nB);
    for (let y = 0; y < H; y++) {
        for (let bi = 0; bi < nB; bi++) {
            const x0      = bi * bW, x1 = Math.min(x0 + bW, W);
            const flipped = h(bi * 7, gf) < 0.4;
            for (let x = x0; x < x1; x++) {
                const srcX = flipped ? (x0 + x1 - 1 - x) : x;
                const s = (y * W + clampPx(srcX, W)) * 4, d = (y * W + x) * 4;
                img.data[d] = base[s]; img.data[d+1] = base[s+1];
                img.data[d+2] = base[s+2]; img.data[d+3] = 255;
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 7 · Scatter — pixels randomly displaced, density pulses ───────────────────
function drawScatter(cv, t) {
    const { ctx, W, H, base } = cv;
    const gf      = Math.floor(t * 12);
    const img     = ctx.createImageData(W, H);
    const density = 0.20 + Math.sin(t * 0.6) * 0.12;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            if (h(x * 3 + y * 7, gf) < density) {
                const dx   = Math.round((h(x + y * 13, gf) - 0.5) * 42);
                const dy   = Math.round((h(x * 2 + y * 5, gf) - 0.5) * 10);
                const srcX = clampPx(x + dx, W);
                const srcY = Math.max(0, Math.min(H - 1, y + dy));
                const s    = (srcY * W + srcX) * 4;
                img.data[i] = base[s]; img.data[i+1] = base[s+1];
                img.data[i+2] = base[s+2]; img.data[i+3] = 255;
            } else {
                img.data[i] = base[i]; img.data[i+1] = base[i+1];
                img.data[i+2] = base[i+2]; img.data[i+3] = 255;
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 8 · Tile — blocks randomly swap to a neighbor's color ─────────────────────
function drawTile(cv, t) {
    const { ctx, W, H } = cv;
    const B     = 14;
    const gf    = Math.floor(t * 8);
    const bCols = Math.ceil(W / B), bRows = Math.ceil(H / B);
    for (let br = 0; br < bRows; br++) {
        for (let bc = 0; bc < bCols; bc++) {
            const corrupt = h(br * 23 + bc * 17, gf) < 0.14;
            const shift   = corrupt ? Math.round((h(br + bc * 2, gf) - 0.5) * 5) : 0;
            const srcBc   = Math.max(0, Math.min(bCols - 1, bc + shift));
            const jitter  = (h(br * 7 + bc * 13) - 0.5) * 0.06;
            const c = lerp(PINK, YELLOW, clamp01(srcBc / bCols + jitter));
            ctx.fillStyle = `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
            ctx.fillRect(bc * B, br * B, B, B);
        }
    }
}

export default {
    labels:  ['chunk', 'dissolve', 'melt', 'warp', 'skip', 'mirror', 'scatter', 'tile'],
    dt:      0.025,
    setup,
    drawFns: [drawChunk, drawDissolve, drawMelt, drawWarp, drawSkip, drawMirror, drawScatter, drawTile],
};
