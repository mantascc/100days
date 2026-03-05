import { setupCanvas } from '../lib/utils.js';

const DEEP = 'rgb(26, 15, 10)';
const LINE = 'rgba(255, 243, 224, 0.88)';
const TAU = Math.PI * 2;

export function createChapter() {
    function setup(id) { return setupCanvas(id); }

    function prep(cv) {
        const { ctx, W, H } = cv;
        ctx.fillStyle = DEEP;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = LINE;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;
    }

    // Single ring — gap orbits slowly around the circumference
    function drawRing(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const r = Math.min(W, H) * 0.38;
        const gap = 0.6;
        const start = t * 0.3;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r, start + gap / 2, start + TAU - gap / 2);
        ctx.stroke();
    }

    // Concentric rings — brightness wave travels outward; radii stay fixed
    function drawConcentric(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const max = Math.min(W, H) * 0.43;
        const n = 6;
        for (let i = 0; i < n; i++) {
            const r = max * ((i + 1) / n);
            ctx.globalAlpha = 0.12 + 0.88 * ((Math.sin(t * 0.7 - i * 0.95) + 1) / 2);
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, r, 0, TAU);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Tangent circles — wave of size ripples left to right; tangency maintained
    function drawTangent(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const n = 5;
        const baseR = Math.min(Math.min(W, H) * 0.41, W / (n * 2)) * 0.68;
        const amp = baseR * 0.28;
        const radii = Array.from({ length: n }, (_, i) =>
            Math.max(2, baseR + amp * Math.sin(t * 1.1 + i * 1.1))
        );
        const halfTotal = radii.reduce((s, r) => s + r, 0);
        let cx = W / 2 - halfTotal;
        for (let i = 0; i < n; i++) {
            cx += radii[i];
            ctx.beginPath();
            ctx.arc(cx, H / 2, radii[i], 0, TAU);
            ctx.stroke();
            cx += radii[i];
        }
    }

    // Offset circles — centers orbit on slow elliptical paths
    function drawOffset(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const r = Math.min(W, H) * 0.33;
        const maxD = r * 0.72;
        const dx = maxD * Math.sin(t * 0.45);
        const dy = maxD * 0.38 * Math.sin(t * 0.7);
        ctx.beginPath();
        ctx.arc(W / 2 - dx, H / 2 - dy, r, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(W / 2 + dx, H / 2 + dy, r, 0, TAU);
        ctx.stroke();
    }

    // Venn — fixed geometry; brightness cycles through the three circles in sequence
    function drawVenn(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const r = Math.min(W, H) * 0.3;
        const d = r * 0.64;
        const centers = [
            [W / 2,           H / 2 - d * 0.58],
            [W / 2 - d * 0.5, H / 2 + d * 0.29],
            [W / 2 + d * 0.5, H / 2 + d * 0.29],
        ];
        for (let i = 0; i < 3; i++) {
            const [cx, cy] = centers[i];
            ctx.globalAlpha = 0.1 + 0.9 * ((Math.sin(t * 0.6 + (i / 3) * TAU) + 1) / 2);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, TAU);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Rose — slowly rotates in place
    function drawRose(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const cx = W / 2, cy = H / 2;
        const r = Math.min(W, H) * 0.43;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.07);
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        for (let i = 0; i <= 360; i++) {
            const theta = (i / 360) * TAU;
            const radius = r * Math.cos(3 * theta);
            const x = cx + radius * Math.cos(theta);
            const y = cy + radius * Math.sin(theta);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    // Chain — 8 circles along the diagonal; a slow pulse sweeps through them
    function drawChain(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const n = 6;
        const r = Math.min(W, H) * 0.16;
        const x0 = r, y0 = r;
        const x1 = W - r, y1 = H - r;
        // (i+1)/(n+1) spaces n circles evenly and centers the chain in the tile
        for (let i = 0; i < n; i++) {
            const frac = (i + 1) / (n + 1);
            const cx = x0 + (x1 - x0) * frac;
            const cy = y0 + (y1 - y0) * frac;
            const s = Math.max(0, Math.sin(t * 1.2 - i * TAU / n));
            ctx.globalAlpha = 0.08 + 0.92 * s * s * s;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, TAU);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Log spiral — rotates; self-similarity makes it look like eternal growth
    function drawLogSpiral(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const cx = W / 2, cy = H / 2;
        const maxR = Math.min(W, H) * 0.43;
        const b = 0.18;
        const turns = 3.5;
        const maxTheta = turns * TAU;
        const a = maxR / Math.exp(b * maxTheta);
        const steps = 500;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.12);
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const theta = (i / steps) * maxTheta;
            const r = a * Math.exp(b * theta);
            const x = cx + r * Math.cos(theta);
            const y = cy + r * Math.sin(theta);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    return {
        labels: ['ring', 'concentric', 'tangent', 'offset', 'venn', 'rose', 'chain', 'log spiral'],
        dt: 0.008,
        setup,
        drawFns: [drawRing, drawConcentric, drawTangent, drawOffset, drawVenn, drawRose, drawChain, drawLogSpiral],
    };
}
