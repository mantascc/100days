import { lerp, setupCanvas, fillRGB, ph, hard } from '../lib/utils.js';

const VP = 14;

export function createChapter(theme) {
    const { pink: PINK, yellow: YELLOW, deep: DEEP } = theme;

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
        return setupCanvas(id);
    }

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

    function drawDiagonal(cv, t) {
        const { W } = cv;
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            return warmDim(base, hard(ph(x + y + t * 65, 5), 1) ? 1 : 0);
        });
    }

    function drawPulse(cv, t) {
        const { W } = cv;
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            const warp = Math.sin(x / W * Math.PI * 4 + t * 1.2) * 9;
            const lit = hard(ph(y + warp + t * 38, 6), 1) ? 1 : 0;
            return warmDim(base, lit);
        });
    }

    function drawVenetian(cv, t) {
        const { W } = cv;
        const openness = (Math.sin(t * 0.6) + 1) / 2;
        const darkW = VP * (1 - openness);
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            const d = ph(y, VP) < darkW ? 0.12 : 1;
            return dimDeep(base, d);
        });
    }

    function drawGrid(cv, t) {
        const { W } = cv;
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            const dh = hard(ph(y + t * 11, 7), 1) ? 1 : 0;
            const dv = hard(ph(x + t * 7, 7), 1) ? 1 : 0;
            return warmDim(base, 0.15 + 0.85 * dh * dv);
        });
    }

    function drawSilk(cv, t) {
        const { W } = cv;
        const freq = (2 * Math.PI) / 4;
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            const brightness = (Math.sin((y + t * 20) * freq) + 1) / 2;
            return warmDim(base, brightness, 0.38);
        });
    }

    function drawStagger(cv, t) {
        const { W } = cv;
        fillRGB(cv, (x, y) => {
            const base = lerp(PINK, YELLOW, x / W);
            const field = Math.floor(y / 18) % 2;
            const scroll = field === 0 ? t * 50 : -t * 50;
            const lit = hard(ph(y + scroll, 5), 1) ? 1 : 0;
            return warmDim(base, lit);
        });
    }

    function drawFrequency(cv, t) {
        const { W } = cv;
        fillRGB(cv, (x, y) => {
            const nx = x / W;
            const base = lerp(PINK, YELLOW, nx);
            const period = 3 + nx * 22;
            const lit = hard(ph(y + t * 40, period), 1) ? 1 : 0;
            return warmDim(base, lit);
        });
    }

    return {
        labels: ['drift', 'diagonal', 'pulse', 'venetian', 'grid', 'silk', 'stagger', 'frequency'],
        dt: 0.025,
        setup,
        drawFns: [drawDrift, drawDiagonal, drawPulse, drawVenetian, drawGrid, drawSilk, drawStagger, drawFrequency],
    };
}
