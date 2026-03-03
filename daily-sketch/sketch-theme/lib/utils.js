export function lerp(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ];
}

export function clamp(v, lo = 0, hi = 255) {
    return Math.max(lo, Math.min(hi, v));
}

export function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}

export function clampPx(v, max) {
    return Math.max(0, Math.min(max - 1, v));
}

export function setupCanvas(id, scale = 1) {
    const cell = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    const W = Math.floor(cell.offsetWidth / scale);
    const H = Math.floor(cell.offsetHeight / scale);
    canvas.width = W;
    canvas.height = H;
    return { canvas, ctx: canvas.getContext('2d'), W, H };
}

export function fillRGB(cv, fn) {
    const { ctx, W, H } = cv;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const c = fn(x, y);
            const i = (y * W + x) * 4;
            img.data[i] = clamp(c[0]);
            img.data[i + 1] = clamp(c[1]);
            img.data[i + 2] = clamp(c[2]);
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
}

export function hash(a, b = 0) {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
    return n - Math.floor(n);
}

export function ph(v, period) {
    return ((v % period) + period) % period;
}

export function hard(p, dw) {
    return p < dw ? 0 : 1;
}

export function rgbToHex([r, g, b]) {
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
