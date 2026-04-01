import { setupCanvas } from '../lib/utils.js';

const DEEP = 'rgb(26, 15, 10)';
const LINE = 'rgba(255, 243, 224, 0.88)';

export function createChapter() {
    function setup(id) { return setupCanvas(id); }

    function prep(cv) {
        const { ctx, W, H } = cv;
        ctx.fillStyle = DEEP;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = LINE;
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.globalAlpha = 1;
    }

    // Parallel — slow sine wave ripples through the stack
    function drawParallel(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const n = 8;
        const padX = W * 0.1;
        const padY = H * 0.12;
        const spacing = (H - padY * 2) / (n - 1);
        const A = spacing * 0.28;
        for (let i = 0; i < n; i++) {
            const baseY = padY + spacing * i;
            const y = baseY + A * Math.sin(t * 0.8 + i * 0.7);
            ctx.beginPath();
            ctx.moveTo(padX, y);
            ctx.lineTo(W - padX, y);
            ctx.stroke();
        }
    }

    // Radial — whole sunburst rotates very slowly
    function drawRadial(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const cx = W / 2, cy = H / 2;
        const r = Math.min(W, H) * 0.45;
        const n = 16;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.1);
        ctx.translate(-cx, -cy);
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            ctx.stroke();
        }
        ctx.restore();
    }

    // Grid — each line breathes with a slow phase offset, warping the grid
    function drawGrid(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const padX = W * 0.08;
        const padY = H * 0.08;
        const cols = 7;
        const rows = Math.max(3, Math.round(cols * (H / W)));
        const A = W * 0.02;
        for (let i = 0; i <= cols; i++) {
            const baseX = padX + (W - padX * 2) * (i / cols);
            const x = baseX + A * Math.sin(t * 0.6 + i * 0.85);
            ctx.beginPath();
            ctx.moveTo(x, padY);
            ctx.lineTo(x, H - padY);
            ctx.stroke();
        }
        for (let i = 0; i <= rows; i++) {
            const baseY = padY + (H - padY * 2) * (i / rows);
            const y = baseY + A * Math.sin(t * 0.6 + i * 0.9);
            ctx.beginPath();
            ctx.moveTo(padX, y);
            ctx.lineTo(W - padX, y);
            ctx.stroke();
        }
    }

    // Diagonal — lines drift sideways in one direction, tiling seamlessly
    function drawDiagonal(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const spacing = W * 0.13;
        const shift = (t * 14) % spacing;
        const n = Math.ceil((W + H) / spacing) + 2;
        for (let k = -2; k <= n; k++) {
            const x0 = k * spacing - shift;
            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0 + H, H);
            ctx.stroke();
        }
    }

    // Perspective — vanishing point traces a slow figure-8
    function drawPerspective(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const vx = W / 2 + W * 0.22 * Math.sin(t * 0.4);
        const vy = H * 0.22 + H * 0.1 * Math.sin(t * 0.8);
        const n = 10;
        for (let i = 0; i <= n; i++) {
            const bx = W * (i / n);
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(bx, H);
            ctx.stroke();
        }
    }

    // Hatch — fixed geometry; brightness waves travel in opposite directions
    // through each set, so lit intersections migrate across the lattice
    function drawHatch(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const spacing = W * 0.13;
        const n = Math.ceil((W + H) / spacing) + 2;
        for (let k = -2; k <= n; k++) {
            const x0 = k * spacing;
            ctx.globalAlpha = 0.08 + 0.92 * ((Math.sin(t * 0.75 + k * 0.8) + 1) / 2);
            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0 + H, H);
            ctx.stroke();
        }
        for (let k = -2; k <= n; k++) {
            const x0 = W - k * spacing;
            ctx.globalAlpha = 0.08 + 0.92 * ((Math.sin(t * 0.75 - k * 0.8) + 1) / 2);
            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0 - H, H);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Fan — origin oscillates along the bottom edge
    function drawFan(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const ox = W * 0.5 + W * 0.3 * Math.sin(t * 0.35);
        const oy = H;
        const n = 9;
        for (let i = 0; i <= n; i++) {
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(W * (i / n), 0);
            ctx.stroke();
        }
        for (let i = 1; i <= n; i++) {
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(W, H * (1 - i / n));
            ctx.stroke();
        }
    }

    // Chevron — slow wave pulses through peak heights
    function drawChevron(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const n = 5;
        for (let i = 0; i < n; i++) {
            const y = H * 0.14 + (H * 0.72) * (i / (n - 1));
            const basePeak = H * 0.07 * (1 - i * 0.12);
            const peak = basePeak * (0.2 + 1.4 * ((Math.sin(t * 0.65 - i * 0.55) + 1) / 2));
            ctx.beginPath();
            ctx.moveTo(W * 0.08, y);
            ctx.lineTo(W / 2, y - peak);
            ctx.lineTo(W * 0.92, y);
            ctx.stroke();
        }
    }

    return {
        labels: ['parallel', 'radial', 'grid', 'diagonal', 'perspective', 'hatch', 'fan', 'chevron'],
        dt: 0.008,
        setup,
        drawFns: [drawParallel, drawRadial, drawGrid, drawDiagonal, drawPerspective, drawHatch, drawFan, drawChevron],
    };
}
