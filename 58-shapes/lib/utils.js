export function setupCanvas(id) {
    const cell = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    const dpr = window.devicePixelRatio || 1;
    const W = cell.offsetWidth;
    const H = cell.offsetHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { canvas, ctx, W, H };
}
