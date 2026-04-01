// Chapter 1: Chart Types
// Data story: "A year of running" — 52 weekly distances.
// Gradual improvement, summer slump, strong finish.
// Same data, eight representations. Each reveals something different.

import { setupCanvas, map, makeRng } from '../lib/utils.js';

const rng = makeRng(42);
const DATA = Array.from({ length: 52 }, (_, w) => {
    let base;
    if      (w < 20) base = 15 + 15 * (w / 19);
    else if (w < 26) base = 30 - 20 * ((w - 20) / 5);
    else if (w < 32) base = 10 + 15 * ((w - 26) / 5);
    else if (w < 45) base = 25 +  5 * ((w - 32) / 12);
    else             base = 30 + 12 * ((w - 45) / 6);
    return Math.max(2, base + (rng() - 0.5) * 8);
});

const MAX = Math.max(...DATA);
const P   = 14;
const A   = '#00a8ff';
const BG  = '#0a0a0a';

function clear({ ctx, W, H }) { ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); }
function xOf(i, W) { return P + (i / (DATA.length - 1)) * (W - P * 2); }
function yOf(v, H) { return H - P - map(v, 0, MAX * 1.1, 0, H - P * 2); }

function drawLine(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    ctx.strokeStyle = A;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    DATA.forEach((v, i) => { i ? ctx.lineTo(xOf(i, W), yOf(v, H)) : ctx.moveTo(xOf(i, W), yOf(v, H)); });
    ctx.stroke();
}

function drawBar(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const bw = Math.max(1, (W - P * 2) / DATA.length - 1);
    DATA.forEach((v, i) => {
        const bh = map(v, 0, MAX * 1.1, 0, H - P * 2);
        ctx.fillStyle  = A;
        ctx.globalAlpha = 0.25 + 0.75 * (v / MAX);
        ctx.fillRect(xOf(i, W) - bw / 2, H - P - bh, bw, bh);
    });
    ctx.globalAlpha = 1;
}

function drawScatter(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    DATA.forEach((v, i) => {
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(xOf(i, W), yOf(v, H), 2, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawArea(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    ctx.beginPath();
    DATA.forEach((v, i) => { i ? ctx.lineTo(xOf(i, W), yOf(v, H)) : ctx.moveTo(xOf(i, W), yOf(v, H)); });
    ctx.lineTo(xOf(DATA.length - 1, W), H - P);
    ctx.lineTo(xOf(0, W), H - P);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,168,255,0.1)';
    ctx.fill();
    ctx.strokeStyle = A;
    ctx.lineWidth   = 1;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    DATA.forEach((v, i) => { i ? ctx.lineTo(xOf(i, W), yOf(v, H)) : ctx.moveTo(xOf(i, W), yOf(v, H)); });
    ctx.stroke();
}

function drawStep(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    ctx.strokeStyle = A;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    let py = yOf(DATA[0], H);
    ctx.moveTo(xOf(0, W), py);
    for (let i = 1; i < DATA.length; i++) {
        const x = xOf(i, W), y = yOf(DATA[i], H);
        ctx.lineTo(x, py);
        ctx.lineTo(x, y);
        py = y;
    }
    ctx.stroke();
}

function drawDotPlot(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const base = H - P;
    DATA.forEach((v, i) => {
        const x = xOf(i, W), y = yOf(v, H);
        ctx.strokeStyle = 'rgba(0,168,255,0.18)';
        ctx.lineWidth   = 0.5;
        ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawRadial(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const cx = W / 2, cy = H / 2;
    const maxR   = Math.min(W, H) / 2 - P;
    const innerR = maxR * 0.18;
    const n = DATA.length;
    DATA.forEach((v, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const r = innerR + map(v, 0, MAX, 0, maxR - innerR);
        ctx.strokeStyle = A;
        ctx.globalAlpha = 0.2 + 0.8 * (v / MAX);
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
        ctx.lineTo(cx + Math.cos(a) * r,      cy + Math.sin(a) * r);
        ctx.stroke();
    });
    ctx.globalAlpha = 1;
}

function drawHeatmap(cv) {
    const { ctx, W, H } = cv;
    clear(cv);
    const cols = 13, rows = 4;
    const cw = (W - P * 2) / cols;
    const ch = (H - P * 2) / rows;
    DATA.forEach((v, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        ctx.fillStyle   = A;
        ctx.globalAlpha = 0.04 + 0.96 * (v / MAX);
        ctx.fillRect(P + col * cw + 0.5, P + row * ch + 0.5, cw - 1, ch - 1);
    });
    ctx.globalAlpha = 1;
}

export function createChapter() {
    return {
        labels:   ['line', 'bar', 'scatter', 'area', 'step', 'dot-plot', 'radial', 'heatmap'],
        dt:       0,
        setup:    (id) => setupCanvas(id),
        drawFns:  [drawLine, drawBar, drawScatter, drawArea, drawStep, drawDotPlot, drawRadial, drawHeatmap],
    };
}
