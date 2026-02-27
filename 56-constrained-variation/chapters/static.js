const PINK   = [244, 160, 160];
const YELLOW = [244, 216, 122];
const CORAL  = [240, 112,  96];
const CREAM  = [255, 243, 224];

function lerp(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ];
}

function clamp(v, lo = 0, hi = 255) { return Math.max(lo, Math.min(hi, v)); }
function noise() { return (Math.random() - 0.5) * 2; }

function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    const W = cell.offsetWidth, H = cell.offsetHeight;
    canvas.width = W; canvas.height = H;
    return { canvas, ctx: canvas.getContext('2d'), W, H };
}

function drawDither(cv) {
    const { ctx, W, H } = cv;
    const img   = ctx.createImageData(W, H);
    const bayer = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const t         = x / W;
            const col       = lerp(PINK, YELLOW, t);
            const threshold = (bayer[y % 4][x % 4] / 16) * 60 - 30;
            const i         = (y * W + x) * 4;
            img.data[i]     = clamp(col[0] + threshold);
            img.data[i + 1] = clamp(col[1] + threshold);
            img.data[i + 2] = clamp(col[2] + threshold);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawPixelNoise(cv) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const t    = x / W;
            const col  = lerp(PINK, YELLOW, t);
            const n    = noise() * 80;
            const snap = Math.random() < 0.04;
            const i    = (y * W + x) * 4;
            if (snap) {
                const pick  = Math.random() < 0.5 ? CORAL : CREAM;
                img.data[i] = pick[0]; img.data[i+1] = pick[1]; img.data[i+2] = pick[2];
            } else {
                img.data[i] = clamp(col[0] + n); img.data[i+1] = clamp(col[1] + n); img.data[i+2] = clamp(col[2] + n);
            }
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawScanlines(cv) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        const dim = (y % 3 === 0) ? 0.3 : 1.0;
        for (let x = 0; x < W; x++) {
            const t = x / W;
            const col = lerp(PINK, CORAL, t);
            const i   = (y * W + x) * 4;
            img.data[i]     = clamp(col[0] * dim);
            img.data[i + 1] = clamp(col[1] * dim);
            img.data[i + 2] = clamp(col[2] * dim);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawBitCrush(cv) {
    const { ctx, W, H } = cv;
    const img    = ctx.createImageData(W, H);
    const levels = 8;
    const step   = 256 / levels;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const t   = (x + y * 0.3) / (W + H * 0.3);
            const col = lerp(PINK, YELLOW, t);
            const i   = (y * W + x) * 4;
            img.data[i]     = Math.round(col[0] / step) * step;
            img.data[i + 1] = Math.round(col[1] / step) * step;
            img.data[i + 2] = Math.round(col[2] / step) * step;
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawChannelShift(cv) {
    const { ctx, W, H } = cv;
    const img   = ctx.createImageData(W, H);
    const shift = 12;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const tR = clamp(x - shift, 0, W - 1) / W;
            const tG = x / W;
            const tB = clamp(x + shift, 0, W - 1) / W;
            const r  = lerp(PINK, YELLOW, tR);
            const g  = lerp(PINK, YELLOW, tG);
            const b  = lerp(PINK, YELLOW, tB);
            const i  = (y * W + x) * 4;
            img.data[i]     = clamp(r[0]);
            img.data[i + 1] = clamp(g[1]);
            img.data[i + 2] = clamp(b[2]);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawLowRes(cv) {
    const BLOCK = 10;
    const { ctx, W, H } = cv;
    const cols = Math.ceil(W / BLOCK);
    const rows = Math.ceil(H / BLOCK);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const t      = col / cols;
            const jitter = (Math.random() - 0.5) * 0.15;
            const c      = lerp(PINK, YELLOW, clamp(t + jitter, 0, 1));
            ctx.fillStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
            ctx.fillRect(col * BLOCK, row * BLOCK, BLOCK, BLOCK);
        }
    }
}

function drawInterference(cv) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const t     = x / W;
            const wave1 = Math.sin(x * 0.15) * Math.sin(y * 0.1);
            const wave2 = Math.sin((x + y) * 0.12);
            const inter = (wave1 + wave2) * 0.5;
            const col   = lerp(CORAL, YELLOW, (inter + 1) / 2);
            const base  = lerp(PINK, YELLOW, t);
            const i     = (y * W + x) * 4;
            img.data[i]     = clamp(base[0] * 0.5 + col[0] * 0.5);
            img.data[i + 1] = clamp(base[1] * 0.5 + col[1] * 0.5);
            img.data[i + 2] = clamp(base[2] * 0.5 + col[2] * 0.5);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

function drawCorrupt(cv) {
    const { ctx, W, H } = cv;
    const img  = ctx.createImageData(W, H);
    const base = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const col = lerp(PINK, YELLOW, x / W);
            const i   = (y * W + x) * 4;
            base[i] = col[0]; base[i+1] = col[1]; base[i+2] = col[2]; base[i+3] = 255;
        }
    }
    for (let y = 0; y < H; y++) {
        const corrupt = Math.random() < 0.15;
        const offset  = corrupt ? Math.floor((Math.random() - 0.5) * W * 0.3) : 0;
        for (let x = 0; x < W; x++) {
            const srcX = clamp(x - offset, 0, W - 1);
            const src  = (y * W + srcX) * 4;
            const dst  = (y * W + x) * 4;
            img.data[dst]     = base[src];
            img.data[dst + 1] = base[src + 1];
            img.data[dst + 2] = base[src + 2];
            if (corrupt && Math.random() < 0.3) img.data[dst] = 255;
            img.data[dst + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

export default {
    labels:   ['dither', 'pixel noise', 'scanlines', 'bit crush', 'channel shift', 'low res', 'interference', 'corrupt'],
    dt:       0,
    setup,
    drawFns:  [drawDither, drawPixelNoise, drawScanlines, drawBitCrush, drawChannelShift, drawLowRes, drawInterference, drawCorrupt],
};
