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

function dimDeep(base, d) {
    return [
        DEEP[0] + (base[0] - DEEP[0]) * d,
        DEEP[1] + (base[1] - DEEP[1]) * d,
        DEEP[2] + (base[2] - DEEP[2]) * d,
    ];
}

function warmDim(base, d, floor = 0.28) {
    const f = floor + (1 - floor) * d;
    return [base[0] * f, base[1] * f, base[2] * f];
}

function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    canvas.width  = cell.offsetWidth;
    canvas.height = cell.offsetHeight;
    return { canvas, ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height };
}

function fillRGB(cv, fn) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const c = fn(x, y);
            const i = (y * W + x) * 4;
            img.data[i]     = clamp(c[0]);
            img.data[i + 1] = clamp(c[1]);
            img.data[i + 2] = clamp(c[2]);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

const VP = 14;
function ph(v, period) { return ((v % period) + period) % period; }
function hard(p, dw)   { return p < dw ? 0 : 1; }

// ── 1 · Drift — three line systems at different periods beat together ────────
function drawDrift(cv, t) {
    const { W } = cv;
    const sys = [{ p: 5, s: 48 }, { p: 7, s: 31 }, { p: 11, s: 19 }];
    fillRGB(cv, (x, y) => {
        const base = lerp(PINK, YELLOW, x / W);
        let lit = 1;
        for (const { p, s } of sys) {
            if (ph(y + t * s, p) < 1) lit *= 0.3;
        }
        return warmDim(base, lit);
    });
}

// ── 2 · Diagonal — dense 45° lines scrolling along their axis ───────────────
function drawDiagonal(cv, t) {
    const { W } = cv;
    const P = 5, DW = 1;
    fillRGB(cv, (x, y) => {
        const base = lerp(PINK, YELLOW, x / W);
        return warmDim(base, hard(ph(x + y + t * 65, P), DW) ? 1 : 0);
    });
}

// ── 3 · Pulse — lines with sinusoidal phase warp along x ────────────────────
function drawPulse(cv, t) {
    const { W } = cv;
    const P = 6, DW = 1;
    fillRGB(cv, (x, y) => {
        const base = lerp(PINK, YELLOW, x / W);
        const warp = Math.sin(x / W * Math.PI * 4 + t * 1.2) * 9;
        const lit  = hard(ph(y + warp + t * 38, P), DW) ? 1 : 0;
        return warmDim(base, lit);
    });
}

// ── 4 · Venetian — gap width opens and closes ───────────────────────────────
function drawVenetian(cv, t) {
    const { W } = cv;
    const openness = (Math.sin(t * 0.6) + 1) / 2;
    const darkW    = VP * (1 - openness);
    fillRGB(cv, (x, y) => {
        const base = lerp(PINK, YELLOW, x / W);
        const d    = ph(y, VP) < darkW ? 0.12 : 1.0;
        return dimDeep(base, d);
    });
}

// ── 5 · Grid — horizontal + vertical lines cross, intersections glow ────────
function drawGrid(cv, t) {
    const { W } = cv;
    const P = 7, DW = 1;
    fillRGB(cv, (x, y) => {
        const base = lerp(PINK, YELLOW, x / W);
        const dh   = hard(ph(y + t * 11, P), DW) ? 1 : 0;
        const dv   = hard(ph(x + t *  7, P), DW) ? 1 : 0;
        return warmDim(base, 0.15 + 0.85 * dh * dv);
    });
}

// ── 6 · Silk — ultra-dense smooth sin, warm floor, no hard edge ─────────────
function drawSilk(cv, t) {
    const { W } = cv;
    const freq = (2 * Math.PI) / 4;
    fillRGB(cv, (x, y) => {
        const base       = lerp(PINK, YELLOW, x / W);
        const brightness = (Math.sin((y + t * 20) * freq) + 1) / 2;
        return warmDim(base, brightness, 0.38);
    });
}

// ── 7 · Stagger — alternating bands scroll in opposite directions ────────────
function drawStagger(cv, t) {
    const { W } = cv;
    const P = 5, DW = 1, BAND = 18;
    fillRGB(cv, (x, y) => {
        const base   = lerp(PINK, YELLOW, x / W);
        const field  = Math.floor(y / BAND) % 2;
        const scroll = field === 0 ? t * 50 : -t * 50;
        const lit    = hard(ph(y + scroll, P), DW) ? 1 : 0;
        return warmDim(base, lit);
    });
}

// ── 8 · Frequency — period varies left→right, dense to sparse ───────────────
function drawFrequency(cv, t) {
    const { W } = cv;
    fillRGB(cv, (x, y) => {
        const nx     = x / W;
        const base   = lerp(PINK, YELLOW, nx);
        const period = 3 + nx * 22;
        const lit    = hard(ph(y + t * 40, period), 1) ? 1 : 0;
        return warmDim(base, lit);
    });
}

export default {
    labels:  ['drift', 'diagonal', 'pulse', 'venetian', 'grid', 'silk', 'stagger', 'frequency'],
    dt:      0.025,
    setup,
    drawFns: [drawDrift, drawDiagonal, drawPulse, drawVenetian, drawGrid, drawSilk, drawStagger, drawFrequency],
};
