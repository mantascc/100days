import { lerp, setupCanvas, fillRGB } from '../lib/utils.js';

const SCALE = 3;

export function createChapter(theme) {
    const { pink: PINK, yellow: YELLOW, coral: CORAL, cream: CREAM } = theme;

    function waveToColor(v) {
        const u = (Math.max(-1, Math.min(1, v)) + 1) / 2;
        if (u < 0.33) return lerp(CORAL, PINK, u / 0.33);
        if (u < 0.66) return lerp(PINK, YELLOW, (u - 0.33) / 0.33);
        return lerp(YELLOW, CREAM, (u - 0.66) / 0.34);
    }

    function setup(id) {
        return setupCanvas(id, SCALE);
    }

    function fill(cv, fn) {
        fillRGB(cv, (x, y) => waveToColor(fn(x, y)));
    }

    function drawTwoSources(cv, t) {
        const { W, H } = cv;
        const k = 0.22;
        const s1 = [W * 0.3, H * 0.5];
        const s2 = [W * 0.7, H * 0.5];
        fill(cv, (x, y) => {
            const d1 = Math.hypot(x - s1[0], y - s1[1]);
            const d2 = Math.hypot(x - s2[0], y - s2[1]);
            return (Math.cos(d1 * k - t) + Math.cos(d2 * k - t)) / 2;
        });
    }

    function drawMoireLines(cv, t) {
        const f = 0.3;
        const a2 = 0.18 + Math.sin(t * 0.2) * 0.07;
        fill(cv, (x, y) => {
            const v1 = Math.sin(y * f);
            const v2 = Math.sin(x * Math.sin(a2) * f + y * Math.cos(a2) * f);
            return v1 * v2;
        });
    }

    function drawBeat(cv, t) {
        const { H } = cv;
        fill(cv, (x, y) => {
            const k1 = 0.25;
            const k2 = k1 + (y / H) * 0.09;
            return (Math.sin(x * k1 - t) + Math.sin(x * k2 + t * 0.6)) / 2;
        });
    }

    function drawStandingWave(cv, t) {
        const kx = 0.18;
        const ky = 0.13;
        fill(cv, (x, y) => {
            const right = Math.sin(x * kx - t);
            const left = Math.sin(x * kx + t);
            const trans = Math.sin(y * ky);
            return ((right + left) / 2) * trans;
        });
    }

    function drawFourSources(cv, t) {
        const { W, H } = cv;
        const k = 0.21;
        const src = [[W * 0.2, H * 0.2], [W * 0.8, H * 0.2], [W * 0.2, H * 0.8], [W * 0.8, H * 0.8]];
        fill(cv, (x, y) => {
            let s = 0;
            for (const [sx, sy] of src) s += Math.cos(Math.hypot(x - sx, y - sy) * k - t);
            return s / src.length;
        });
    }

    function drawZonePlates(cv, t) {
        const { W, H } = cv;
        const off = 14 + Math.sin(t * 0.35) * 11;
        const p1 = [W / 2 - off, H / 2];
        const p2 = [W / 2 + off, H / 2];
        const s = 0.002;
        fill(cv, (x, y) => {
            const r1 = (x - p1[0]) ** 2 + (y - p1[1]) ** 2;
            const r2 = (x - p2[0]) ** 2 + (y - p2[1]) ** 2;
            return (Math.sin(r1 * s) + Math.sin(r2 * s)) / 2;
        });
    }

    function drawLissajous(cv, t) {
        const { W, H } = cv;
        const sx = Math.PI * 6 / W;
        const sy = Math.PI * 6 / H;
        fill(cv, (x, y) => {
            const a = Math.sin(x * sx * 3 + t) * Math.cos(y * sy * 2);
            const b = Math.sin(x * sx * 2) * Math.cos(y * sy * 3 + t * 0.7);
            return (a + b) / 2;
        });
    }

    function drawRotatingMoire(cv, t) {
        const { W, H } = cv;
        const cx = W / 2;
        const cy = H / 2;
        const f = 0.26;
        const cosA = Math.cos(t * 0.28);
        const sinA = Math.sin(t * 0.28);
        fill(cv, (x, y) => {
            const v1 = Math.sin(y * f);
            const ry = (x - cx) * sinA + (y - cy) * cosA;
            const v2 = Math.sin(ry * f);
            return v1 * v2;
        });
    }

    return {
        labels: ['two sources', 'moiré lines', 'beat frequency', 'standing wave', 'four sources', 'zone plates', 'lissajous field', 'rotating moiré'],
        dt: 0.03,
        setup,
        drawFns: [drawTwoSources, drawMoireLines, drawBeat, drawStandingWave, drawFourSources, drawZonePlates, drawLissajous, drawRotatingMoire],
    };
}
