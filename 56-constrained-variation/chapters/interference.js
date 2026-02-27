const PINK   = [244, 160, 160];
const YELLOW = [244, 216, 122];
const CORAL  = [240, 112,  96];
const CREAM  = [255, 243, 224];
const DEEP   = [ 26,  15,  10];

const SCALE  = 3;

function lerp(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ];
}

function waveToColor(v) {
    const u = (Math.max(-1, Math.min(1, v)) + 1) / 2;
    if (u < 0.33) return lerp(CORAL,  PINK,   u / 0.33);
    if (u < 0.66) return lerp(PINK,   YELLOW, (u - 0.33) / 0.33);
    return             lerp(YELLOW, CREAM,  (u - 0.66) / 0.34);
}

function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    const W = Math.floor(cell.offsetWidth  / SCALE);
    const H = Math.floor(cell.offsetHeight / SCALE);
    canvas.width = W; canvas.height = H;
    return { canvas, ctx: canvas.getContext('2d'), W, H };
}

function fill({ ctx, W, H }, fn) {
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const col = waveToColor(fn(x, y));
            const i   = (y * W + x) * 4;
            img.data[i]     = col[0];
            img.data[i + 1] = col[1];
            img.data[i + 2] = col[2];
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

// ── 1 · Two coherent point sources ─────────────────────────────────────────
function drawTwoSources(cv, t) {
    const { W, H } = cv;
    const k  = 0.22;
    const s1 = [W * 0.3, H * 0.5];
    const s2 = [W * 0.7, H * 0.5];
    fill(cv, (x, y) => {
        const d1 = Math.hypot(x - s1[0], y - s1[1]);
        const d2 = Math.hypot(x - s2[0], y - s2[1]);
        return (Math.cos(d1 * k - t) + Math.cos(d2 * k - t)) / 2;
    });
}

// ── 2 · Classic moiré: two stripe fields at slightly different angles ───────
function drawMoireLines(cv, t) {
    const { W, H } = cv;
    const f  = 0.3;
    const a2 = 0.18 + Math.sin(t * 0.2) * 0.07;
    fill(cv, (x, y) => {
        const v1 = Math.sin(y * f);
        const v2 = Math.sin(x * Math.sin(a2) * f + y * Math.cos(a2) * f);
        return v1 * v2;
    });
}

// ── 3 · Beat frequency: two close-frequency waves, envelope visible ─────────
function drawBeat(cv, t) {
    const { W, H } = cv;
    fill(cv, (x, y) => {
        const k1 = 0.25;
        const k2 = k1 + (y / H) * 0.09;
        return (Math.sin(x * k1 - t) + Math.sin(x * k2 + t * 0.6)) / 2;
    });
}

// ── 4 · Standing wave: two traveling waves in opposite directions ────────────
function drawStandingWave(cv, t) {
    const { W, H } = cv;
    const kx = 0.18, ky = 0.13;
    fill(cv, (x, y) => {
        const right = Math.sin(x * kx - t);
        const left  = Math.sin(x * kx + t);
        const trans = Math.sin(y * ky);
        return ((right + left) / 2) * trans;
    });
}

// ── 5 · Four coherent sources at corners ────────────────────────────────────
function drawFourSources(cv, t) {
    const { W, H } = cv;
    const k   = 0.21;
    const src = [[W*.2,H*.2],[W*.8,H*.2],[W*.2,H*.8],[W*.8,H*.8]];
    fill(cv, (x, y) => {
        let s = 0;
        for (const [sx, sy] of src) s += Math.cos(Math.hypot(x - sx, y - sy) * k - t);
        return s / src.length;
    });
}

// ── 6 · Zone plates: two offset circular diffraction gratings ───────────────
function drawZonePlates(cv, t) {
    const { W, H } = cv;
    const off = 14 + Math.sin(t * 0.35) * 11;
    const p1  = [W / 2 - off, H / 2];
    const p2  = [W / 2 + off, H / 2];
    const s   = 0.002;
    fill(cv, (x, y) => {
        const r1 = (x - p1[0]) ** 2 + (y - p1[1]) ** 2;
        const r2 = (x - p2[0]) ** 2 + (y - p2[1]) ** 2;
        return (Math.sin(r1 * s) + Math.sin(r2 * s)) / 2;
    });
}

// ── 7 · Lissajous field: orthogonal sine products ───────────────────────────
function drawLissajous(cv, t) {
    const { W, H } = cv;
    const sx = Math.PI * 6 / W;
    const sy = Math.PI * 6 / H;
    fill(cv, (x, y) => {
        const a = Math.sin(x * sx * 3 + t)      * Math.cos(y * sy * 2);
        const b = Math.sin(x * sx * 2)           * Math.cos(y * sy * 3 + t * 0.7);
        return (a + b) / 2;
    });
}

// ── 8 · Rotating moiré: fixed + slowly spinning stripe field ────────────────
function drawRotatingMoire(cv, t) {
    const { W, H } = cv;
    const cx   = W / 2, cy = H / 2;
    const f    = 0.26;
    const cosA = Math.cos(t * 0.28), sinA = Math.sin(t * 0.28);
    fill(cv, (x, y) => {
        const v1 = Math.sin(y * f);
        const ry = (x - cx) * sinA + (y - cy) * cosA;
        const v2 = Math.sin(ry * f);
        return v1 * v2;
    });
}

export default {
    labels:  ['two sources', 'moiré lines', 'beat frequency', 'standing wave', 'four sources', 'zone plates', 'lissajous field', 'rotating moiré'],
    dt:      0.03,
    setup,
    drawFns: [drawTwoSources, drawMoireLines, drawBeat, drawStandingWave, drawFourSources, drawZonePlates, drawLissajous, drawRotatingMoire],
};
