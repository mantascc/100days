// Chapter 4: Encodings
// Data story: "200 people, one city, wildly unequal incomes."
// Pareto-distributed synthetic incomes. Same column of values, eight visual channels.
// Each encoding reveals or hides a different aspect of the distribution.

import { setupCanvas, map, clamp, makeRng } from '../lib/utils.js';

// ── Data ──────────────────────────────────────────────────────────────────────

const rng = makeRng(137);
const INCOMES = Array.from({ length: 200 }, () => {
    // Pareto distribution: xmin * (1 - u)^(-1/alpha)
    const u = Math.max(0.001, rng());
    return Math.min(20000 * Math.pow(1 - u, -1 / 1.5), 2500000);
}).sort((a, b) => a - b);

const MIN_I  = INCOMES[0];
const MAX_I  = INCOMES[INCOMES.length - 1];
const LOGMIN = Math.log10(MIN_I);
const LOGMAX = Math.log10(MAX_I);

function normLinear(v) { return (v - MIN_I) / (MAX_I - MIN_I); }
function normLog(v)    { return (Math.log10(v) - LOGMIN) / (LOGMAX - LOGMIN); }

// Quintile color: 5 steps from dim to bright
function quintileAlpha(rank, n) {
    const q = Math.floor((rank / n) * 5);
    return 0.15 + q * 0.17;
}

const A  = '#00a8ff';
const BG = '#0a0a0a';
function clear({ ctx, W, H }) { ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); }

// ── 1. Strip plot — linear scale ──────────────────────────────────────────────

const jitterRng = makeRng(99);
const JITTER = Array.from({ length: 200 }, () => jitterRng() - 0.5);

function drawStripLinear(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P = 16, midY = H / 2;
    INCOMES.forEach((v, i) => {
        const x  = P + normLinear(v) * (W - P * 2);
        const y  = midY + JITTER[i] * H * 0.38;
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.45;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ── 2. Strip plot — log scale ─────────────────────────────────────────────────

function drawStripLog(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P = 16, midY = H / 2;
    INCOMES.forEach((v, i) => {
        const x = P + normLog(v) * (W - P * 2);
        const y = midY + JITTER[i] * H * 0.38;
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.45;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ── 3. Color grid (sorted) ────────────────────────────────────────────────────

function drawColorGrid(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const cols = 20, rows = 10;
    const P    = 12;
    const cw   = (W - P * 2) / cols;
    const ch   = (H - P * 2) / rows;
    INCOMES.forEach((v, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.05 + 0.95 * normLog(v);
        ctx.fillRect(P + col * cw + 0.5, P + row * ch + 0.5, cw - 1, ch - 1);
    });
    ctx.globalAlpha = 1;
}

// ── 4. Size encoding (area ∝ income) ─────────────────────────────────────────

function drawSize(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const cols = 20, rows = 10;
    const P    = 12;
    const cw   = (W - P * 2) / cols;
    const ch   = (H - P * 2) / rows;
    INCOMES.forEach((v, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const cx  = P + (col + 0.5) * cw;
        const cy  = P + (row + 0.5) * ch;
        const r   = Math.max(1, normLog(v) * Math.min(cw, ch) * 0.5);
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.5 + 0.5 * normLog(v);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ── 5. Histogram (log-scale buckets) ─────────────────────────────────────────

function drawHistogram(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P    = 14;
    const BINS = 20;
    const counts = new Array(BINS).fill(0);
    INCOMES.forEach(v => {
        const b = Math.min(BINS - 1, Math.floor(normLog(v) * BINS));
        counts[b]++;
    });
    const maxCount = Math.max(...counts);
    const bw = (W - P * 2) / BINS;
    counts.forEach((c, i) => {
        const bh = map(c, 0, maxCount, 0, H - P * 2 - 4);
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.25 + 0.75 * (c / maxCount);
        ctx.fillRect(P + i * bw + 0.5, H - P - bh, bw - 1, bh);
    });
    ctx.globalAlpha = 1;
}

// ── 6. Density curve (KDE approximation) ─────────────────────────────────────

function drawDensity(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P      = 14;
    const STEPS  = W - P * 2;
    const BW     = 0.06; // bandwidth in normalised log space
    const density = new Float32Array(STEPS);
    for (let s = 0; s < STEPS; s++) {
        const t = s / (STEPS - 1);
        let sum = 0;
        INCOMES.forEach(v => {
            const vt = normLog(v);
            const d  = (t - vt) / BW;
            sum += Math.exp(-0.5 * d * d);
        });
        density[s] = sum / (INCOMES.length * BW * Math.sqrt(2 * Math.PI));
    }
    const maxD = Math.max(...density);

    // Area fill
    ctx.beginPath();
    ctx.moveTo(P, H - P);
    density.forEach((d, s) => { ctx.lineTo(P + s, H - P - map(d, 0, maxD, 0, H - P * 2)); });
    ctx.lineTo(P + STEPS - 1, H - P);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,168,255,0.08)';
    ctx.fill();

    // Line
    ctx.strokeStyle = A;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    density.forEach((d, s) => {
        const x = P + s, y = H - P - map(d, 0, maxD, 0, H - P * 2);
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
}

// ── 7. Rank profile ───────────────────────────────────────────────────────────

function drawRankProfile(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P = 14;
    INCOMES.forEach((v, i) => {
        const x = P + (i / (INCOMES.length - 1)) * (W - P * 2);
        const h = map(normLog(v), 0, 1, 1, H - P * 2);
        ctx.fillStyle   = A;
        ctx.globalAlpha = quintileAlpha(i, INCOMES.length);
        ctx.fillRect(x - 0.5, H - P - h, 1, h);
    });
    ctx.globalAlpha = 1;
}

// ── 8. Inequality split ───────────────────────────────────────────────────────

function drawInequalitySplit(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const P  = 14;
    const n  = INCOMES.length;
    const total = INCOMES.reduce((s, v) => s + v, 0);

    // Compute cumulative income share for each person (sorted ascending)
    const shares = INCOMES.map((_, i) => {
        const topN   = n - i;
        const topSum = INCOMES.slice(i).reduce((s, v) => s + v, 0);
        return topSum / total;
    });

    // Bar height = canvas height; each bar width = 1 person = (W-2P)/200
    const bw = (W - P * 2) / n;
    INCOMES.forEach((v, i) => {
        const barH = shares[i] * (H - P * 2);
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.12 + 0.88 * (i / n);
        ctx.fillRect(P + i * bw, H - P - barH, Math.max(1, bw - 0.5), barH);
    });
    ctx.globalAlpha = 1;
}

// ── Chapter factory ───────────────────────────────────────────────────────────

export function createChapter() {
    return {
        labels: [
            'position · linear',
            'position · log',
            'color · sorted grid',
            'size · area',
            'histogram · log bins',
            'density · KDE',
            'rank profile',
            'inequality share',
        ],
        dt: 0,
        setup:   (id) => setupCanvas(id),
        drawFns: [
            drawStripLinear, drawStripLog,
            drawColorGrid,   drawSize,
            drawHistogram,   drawDensity,
            drawRankProfile, drawInequalitySplit,
        ],
    };
}
