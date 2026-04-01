export function setupCanvas(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    const W = cell.offsetWidth;
    const H = cell.offsetHeight;
    const DPR = Math.min(2, devicePixelRatio || 1);
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { canvas, ctx, W, H };
}

export function map(v, a, b, c, d) {
    return c + (d - c) * ((v - a) / (b - a));
}

export function clamp(v, lo = 0, hi = 1) {
    return Math.max(lo, Math.min(hi, v));
}

export function makeRng(seed) {
    let s = seed >>> 0;
    return () => {
        s = Math.imul(s, 1664525) + 1013904223 | 0;
        return (s >>> 0) / 4294967296;
    };
}
