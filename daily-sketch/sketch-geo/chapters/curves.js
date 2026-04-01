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
    }

    // u = path parameter (0..TAU); animation time t captured from closure
    function path(cv, fn, steps = 400) {
        const { ctx } = cv;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const u = (i / steps) * TAU;
            const [x, y] = fn(u);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // 3D trefoil knot coordinates
    function knot3D(u) {
        return [
            Math.sin(u) + 2 * Math.sin(2 * u),
            Math.cos(u) - 2 * Math.cos(2 * u),
            -Math.sin(3 * u),
        ];
    }

    // Rotate around Y then X, return [x, y, z]
    function rotate3D(x, y, z, ry, rx) {
        const x1 =  x * Math.cos(ry) + z * Math.sin(ry);
        const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
        const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx);
        return [x1, y2, z2];
    }

    // Sine — phase scrolls rightward
    function drawSine(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const A = H * 0.32;
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
            const y = H / 2 + A * Math.sin((x / W) * TAU - t * 2);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Lissajous — x-phase shifts, morphing through the 3:2 family
    function drawLissajous(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const A = Math.min(W, H) * 0.42;
        const cx = W / 2, cy = H / 2;
        path(cv, (u) => [
            cx + A * Math.sin(3 * u + t * 0.5),
            cy + A * Math.sin(2 * u),
        ], 600);
    }

    // Epitrochoid — slow rotation
    function drawEpitrochoid(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const R = 3, r = 1, d = 1.4;
        const scale = Math.min(W, H) * 0.42 / (R + r + d);
        const cx = W / 2, cy = H / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.08);
        ctx.translate(-cx, -cy);
        path(cv, (u) => [
            cx + scale * ((R + r) * Math.cos(u) - d * Math.cos((R + r) / r * u)),
            cy + scale * ((R + r) * Math.sin(u) - d * Math.sin((R + r) / r * u)),
        ], 600);
        ctx.restore();
    }

    // Superellipse (Lamé curve) — exponent n morphs:
    // n≈0.5 → concave star | n=1 → diamond | n=2 → circle | n>2 → rounded square
    function drawSuperellipse(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const a = Math.min(W, H) * 0.40;
        const cx = W / 2, cy = H / 2;
        const n = 2 + 1.6 * Math.sin(t * 0.22);
        const exp = 2 / n;
        path(cv, (u) => [
            cx + a * Math.sign(Math.cos(u)) * Math.pow(Math.abs(Math.cos(u)), exp),
            cy + a * Math.sign(Math.sin(u)) * Math.pow(Math.abs(Math.sin(u)), exp),
        ], 600);
    }

    // Cardioid — slow rotation
    function drawCardioid(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const a = Math.min(W, H) * 0.21;
        const ox = W / 2 - a * 0.875;
        const cy = H / 2;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(t * 0.12);
        ctx.translate(-W / 2, -H / 2);
        path(cv, (u) => {
            const rr = a * (1 + Math.cos(u));
            return [ox + rr * Math.cos(u), cy + rr * Math.sin(u)];
        }, 400);
        ctx.restore();
    }

    // Astroid — slow rotation
    function drawAstroid(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const a = Math.min(W, H) * 0.42;
        const cx = W / 2, cy = H / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.1);
        ctx.translate(-cx, -cy);
        path(cv, (u) => [
            cx + a * Math.pow(Math.cos(u), 3),
            cy + a * Math.pow(Math.sin(u), 3),
        ], 400);
        ctx.restore();
    }

    // Rose (rhodonea) — petal count k drifts continuously; intermediate
    // non-integer k creates transitional forms between petal families
    function drawRose(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const R = Math.min(W, H) * 0.42;
        const cx = W / 2, cy = H / 2;
        const k = 2 + Math.sin(t * 0.18);
        const steps = 800;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const u = (i / steps) * TAU * 2; // 0..4π for non-integer k
            const r = R * Math.cos(k * u);
            const x = cx + r * Math.cos(u);
            const y = cy + r * Math.sin(u);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Trefoil — true 3D knot, projected with depth cues:
    // near segments are bright and thick, far segments are dim and thin
    function drawTrefoil(cv, t) {
        const { ctx, W, H } = cv;
        prep(cv);
        const scale = Math.min(W, H) * 0.11;
        const cx = W / 2, cy = H / 2;
        const ry = t * 0.07;
        const rx = t * Math.PI * 0.03; // irrational ratio → never loops in sync
        const steps = 600;

        for (let i = 0; i < steps; i++) {
            const u0 = (i / steps) * TAU;
            const u1 = ((i + 1) / steps) * TAU;

            const [ax, ay, az] = rotate3D(...knot3D(u0), ry, rx);
            const [bx, by, bz] = rotate3D(...knot3D(u1), ry, rx);

            const zMid = (az + bz) / 2;
            const zNorm = Math.tanh(zMid / 2); // smooth map to (-1, 1)
            const depth = zNorm * 0.5 + 0.5;  // 0 = far, 1 = near

            ctx.globalAlpha = 0.15 + 0.85 * depth;
            ctx.lineWidth = 0.3 + 2.2 * depth;

            ctx.beginPath();
            ctx.moveTo(cx + ax * scale, cy + ay * scale);
            ctx.lineTo(cx + bx * scale, cy + by * scale);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    }

    return {
        labels: ['sine', 'lissajous', 'epitrochoid', 'superellipse', 'cardioid', 'astroid', 'rose', 'trefoil'],
        dt: 0.008,
        setup,
        drawFns: [drawSine, drawLissajous, drawEpitrochoid, drawSuperellipse, drawCardioid, drawAstroid, drawRose, drawTrefoil],
    };
}
