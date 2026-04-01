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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // T(p,q) torus knot: winds p times around the tube, q times through the hole.
    // All knots with gcd(p,q)=1 close exactly at u=2π.
    function knotXYZ(u, p, q, R = 2, r = 1) {
        return [
            (R + r * Math.cos(q * u)) * Math.cos(p * u),
            (R + r * Math.cos(q * u)) * Math.sin(p * u),
            r * Math.sin(q * u),
        ];
    }

    function rotate3D(x, y, z, ry, rx) {
        const x1 =  x * Math.cos(ry) + z * Math.sin(ry);
        const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
        const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx);
        return [x1, y2, z2];
    }

    // Draw a knot segment-by-segment; z-depth drives lineWidth and alpha
    function drawKnot(cv, t, p, q, rySpeed, rxSpeed, steps = 800) {
        const { ctx, W, H } = cv;
        prep(cv);
        const scale = Math.min(W, H) * 0.12;
        const cx = W / 2, cy = H / 2;
        const ry = t * rySpeed;
        const rx = t * rxSpeed;

        for (let i = 0; i < steps; i++) {
            const u0 = (i       / steps) * TAU;
            const u1 = ((i + 1) / steps) * TAU;

            const [ax, ay, az] = rotate3D(...knotXYZ(u0, p, q), ry, rx);
            const [bx, by, bz] = rotate3D(...knotXYZ(u1, p, q), ry, rx);

            const depth = Math.tanh((az + bz) / 4) * 0.5 + 0.5; // 0=far, 1=near

            ctx.globalAlpha = 0.15 + 0.85 * depth;
            ctx.lineWidth   = 0.3  + 2.2  * depth;

            ctx.beginPath();
            ctx.moveTo(cx + ax * scale, cy + ay * scale);
            ctx.lineTo(cx + bx * scale, cy + by * scale);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    }

    // T(2,3) — trefoil; 3 crossings; simplest non-trivial knot
    function drawTrefoil(cv, t)    { drawKnot(cv, t, 2, 3, 0.07,              Math.PI * 0.030); }
    // T(2,5) — cinquefoil; 5 crossings; pentagonal symmetry
    function drawCinquefoil(cv, t) { drawKnot(cv, t, 2, 5, 0.06,              Math.PI * 0.025, 1000); }
    // T(2,7) — septafoil; 7 crossings; heptagonal
    function drawSeptafoil(cv, t)  { drawKnot(cv, t, 2, 7, 0.08,              Math.PI * 0.020, 1000); }
    // T(2,9) — enneafoil; 9 crossings
    function drawEnneafoil(cv, t)  { drawKnot(cv, t, 2, 9, 0.05,              Math.PI * 0.035, 1000); }
    // T(3,4) — 8 crossings; denser weave than the p=2 family
    function drawT34(cv, t)        { drawKnot(cv, t, 3, 4, 0.09,              Math.PI * 0.040, 1000); }
    // T(3,5) — 10 crossings
    function drawT35(cv, t)        { drawKnot(cv, t, 3, 5, 0.065,             Math.PI * 0.028, 1200); }
    // T(3,7) — 14 crossings
    function drawT37(cv, t)        { drawKnot(cv, t, 3, 7, 0.055,             Math.PI * 0.033, 1200); }
    // T(4,5) — 16 crossings; maximally intricate in this set
    function drawT45(cv, t)        { drawKnot(cv, t, 4, 5, 0.075,             Math.PI * 0.022, 1200); }

    return {
        labels: ['trefoil', 'cinquefoil', 'septafoil', 'enneafoil', '3·4', '3·5', '3·7', '4·5'],
        dt: 0.008,
        setup,
        drawFns: [drawTrefoil, drawCinquefoil, drawSeptafoil, drawEnneafoil, drawT34, drawT35, drawT37, drawT45],
    };
}
