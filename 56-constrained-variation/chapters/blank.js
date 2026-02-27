function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    canvas.width  = cell.offsetWidth;
    canvas.height = cell.offsetHeight;
    return { canvas, ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height };
}

function drawEmpty(cv) {
    const { ctx, W, H } = cv;
    ctx.fillStyle = '#1A0F0A';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(244, 191, 160, 0.07)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
}

export default {
    labels:  ['01', '02', '03', '04', '05', '06', '07', '08'],
    dt:      0,
    setup,
    drawFns: Array(8).fill(drawEmpty),
};
