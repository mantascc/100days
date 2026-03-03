import { setupCanvas } from '../lib/utils.js';

export function createChapter(theme) {
    function setup(id) {
        return setupCanvas(id);
    }

    function drawEmpty(cv) {
        const { ctx, W, H } = cv;
        ctx.fillStyle = `rgb(${theme.deep[0]}, ${theme.deep[1]}, ${theme.deep[2]})`;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = `rgba(${theme.pink[0]}, ${theme.pink[1]}, ${theme.pink[2]}, 0.07)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }

    return {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08'],
        dt: 0,
        setup,
        drawFns: Array(8).fill(drawEmpty),
    };
}
