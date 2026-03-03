import { clamp, lerp, setupCanvas } from '../lib/utils.js';

function applyAlpha(rgb, alpha) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function createSeeds(count) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        phase: i * 0.173,
        offset: i * 1.618,
        radius: 0.18 + (i % 11) / 18,
        speed: 0.55 + (i % 7) * 0.08,
        weight: 0.35 + (i % 9) / 12,
    }));
}

function setup(id) {
    const cv = setupCanvas(id);
    return { ...cv, seeds: createSeeds(48) };
}

function fade(ctx, W, H, rgb, alpha) {
    ctx.fillStyle = applyAlpha(rgb, alpha);
    ctx.fillRect(0, 0, W, H);
}

function axisOrbit(seed, t, W, H, entropy = 0) {
    const cx = W * 0.5;
    const cy = H * 0.5;
    const angle = t * seed.speed + seed.phase;
    const ex = Math.cos(angle) * W * (0.22 + seed.radius * 0.05);
    const ey = Math.sin(angle) * H * (0.12 + seed.radius * 0.04);
    const axisMix = Math.max(0, 1 - entropy * 3.2);
    const wx = Math.sin((t * 1.2 + seed.offset) * 0.9) * W * 0.18 * entropy;
    const wy = Math.sin((t * 0.9 + seed.phase) * 1.3 + 0.7) * H * 0.18 * entropy;
    return {
        x: cx + ex * (1 - axisMix) + ex * axisMix + wx,
        y: cy + ey * (1 - axisMix) + wy,
    };
}

function drawOrdered(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.35);

    ctx.strokeStyle = applyAlpha(theme.cream ?? theme.yellow, 0.12);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.15, H * 0.5 + 0.5);
    ctx.lineTo(W * 0.85, H * 0.5 + 0.5);
    ctx.stroke();

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const p = axisOrbit(seed, t, W, H, 0);
        const size = 1.2 + seed.weight * 1.6;
        const c = lerp(theme.pink, theme.yellow, (i % 12) / 11);
        ctx.fillStyle = applyAlpha(c, 0.8);
        ctx.fillRect(p.x - size * 0.5, H * 0.5 - size * 0.5, size, size);
    }
}

function drawOrbit(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.22);

    ctx.strokeStyle = applyAlpha(lerp(theme.deep, theme.pink, 0.5), 0.1);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.5, W * 0.28, H * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const p = axisOrbit(seed, t, W, H, 0.08);
        const tail = axisOrbit(seed, t - 0.18, W, H, 0.08);
        const c = lerp(theme.pink, theme.yellow, (seed.weight - 0.35) / 0.75);

        ctx.strokeStyle = applyAlpha(c, 0.18);
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = applyAlpha(c, 0.75);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + seed.weight * 1.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawWobble(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.18);

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const p1 = axisOrbit(seed, t, W, H, 0.22);
        const p2 = axisOrbit(seed, t - 0.12, W, H, 0.22);
        const p3 = axisOrbit(seed, t - 0.24, W, H, 0.22);
        const c = lerp(theme.pink, theme.cream ?? theme.yellow, (i % 9) / 8);

        ctx.strokeStyle = applyAlpha(c, 0.22);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.quadraticCurveTo(p2.x, p2.y, p1.x, p1.y);
        ctx.stroke();

        ctx.fillStyle = applyAlpha(c, 0.68);
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 1 + seed.weight * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSurge(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.14);
    const pulse = (Math.sin(t * 0.7) + 1) * 0.5;
    const cx = W * 0.5;
    const cy = H * 0.5;

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const angle = seed.phase * 1.6 + t * seed.speed * 0.8;
        const surge = 0.18 + pulse * (0.22 + seed.weight * 0.1);
        const x = cx + Math.cos(angle) * W * surge;
        const y = cy + Math.sin(angle) * H * surge * 0.72;
        const c = lerp(theme.yellow, theme.cream ?? theme.pink, pulse * 0.7);

        ctx.strokeStyle = applyAlpha(c, 0.14 + pulse * 0.1);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = applyAlpha(c, 0.5 + pulse * 0.25);
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + seed.weight * 1.8 + pulse * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawStaircase(cv, t, theme) {
    const { ctx, W, H } = cv;
    fade(ctx, W, H, theme.deep, 0.16);

    const steps = 7;
    const bars = 22;
    for (let i = 0; i < bars; i++) {
        const lane = i % steps;
        const width = W / bars;
        const x = i * width;
        const phase = (t * 0.45 + i * 0.17) % 1;
        const stepLevel = Math.floor(phase * steps) / (steps - 1);
        const h = H * (0.18 + stepLevel * 0.68);
        const c = lerp(theme.pink, theme.yellow, lane / (steps - 1));

        ctx.fillStyle = applyAlpha(c, 0.14);
        ctx.fillRect(x, H - h, width - 1, h);

        ctx.fillStyle = applyAlpha(c, 0.65);
        ctx.fillRect(x, H - h, width - 1, 2);
    }
}

function drawBurnout(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.08);
    const load = Math.min(1, 0.28 + t * 0.01);

    const topGlow = ctx.createLinearGradient(0, 0, 0, H);
    topGlow.addColorStop(0, applyAlpha(lerp(theme.cream ?? theme.yellow, theme.yellow, 0.5), 0.22 + load * 0.18));
    topGlow.addColorStop(0.35, applyAlpha(theme.pink, 0.08));
    topGlow.addColorStop(1, applyAlpha(theme.deep, 0));
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const x = ((seed.offset * 37 + t * (28 + seed.id % 5)) % (W + 40)) - 20;
        const y = (H * 0.16) + Math.sin(t * 0.3 + seed.phase) * H * 0.08 + (seed.id % 6) * H * 0.08;
        const len = H * (0.12 + seed.weight * 0.26 + load * 0.14);
        const c = lerp(theme.yellow, theme.cream ?? theme.pink, seed.weight * 0.7);

        ctx.strokeStyle = applyAlpha(c, 0.12 + load * 0.08);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + len);
        ctx.stroke();
    }
}

function drawStorm(cv, t, theme) {
    const { ctx, W, H, seeds } = cv;
    fade(ctx, W, H, theme.deep, 0.06);

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const p = axisOrbit(seed, t, W, H, 0.82);
        const q = axisOrbit(seed, t - 0.18, W, H, 0.82);
        const r = axisOrbit(seed, t - 0.34, W, H, 0.82);
        const c = i % 5 === 0 ? theme.cream ?? theme.yellow : lerp(theme.pink, theme.yellow, (i % 10) / 9);

        ctx.strokeStyle = applyAlpha(c, 0.18 + seed.weight * 0.08);
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(q.x, q.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }
}

function drawWhiteout(cv, t, theme) {
    const { ctx, W, H } = cv;
    fade(ctx, W, H, lerp(theme.deep, theme.pink, 0.18), 0.04);

    const bands = 24;
    for (let i = 0; i < bands; i++) {
        const y = (i / (bands - 1)) * H;
        const phase = t * (0.4 + (i % 5) * 0.07);
        const drift = Math.sin(phase + i * 0.6) * W * 0.08;
        const c = i % 3 === 0
            ? theme.cream ?? theme.yellow
            : lerp(theme.pink, theme.yellow, i / (bands - 1));

        ctx.strokeStyle = applyAlpha(c, 0.1 + (i % 4) * 0.04);
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 12) {
            const yy = y + Math.sin((x / W) * Math.PI * 4 + phase + i * 0.2) * 5;
            if (x === -20) ctx.moveTo(x + drift, yy);
            else ctx.lineTo(x + drift, yy);
        }
        ctx.stroke();
    }

    for (let i = 0; i < 80; i++) {
        const x = ((i * 23.7 + t * 32) % (W + 24)) - 12;
        const y = ((i * 17.3 + t * (18 + (i % 7))) % (H + 24)) - 12;
        const c = i % 4 === 0 ? theme.cream ?? theme.yellow : theme.yellow;
        ctx.fillStyle = applyAlpha(c, 0.12 + (i % 5) * 0.03);
        ctx.fillRect(x, y, 2, 2);
    }
}

export function createChapter(theme) {
    return {
        labels: ['ordered', 'orbit', 'wobble', 'surge', 'staircase', 'burnout', 'storm', 'whiteout'],
        dt: 0.022,
        setup,
        drawFns: [
            (cv, t) => drawOrdered(cv, t, theme),
            (cv, t) => drawOrbit(cv, t, theme),
            (cv, t) => drawWobble(cv, t, theme),
            (cv, t) => drawSurge(cv, t, theme),
            (cv, t) => drawStaircase(cv, t, theme),
            (cv, t) => drawBurnout(cv, t, theme),
            (cv, t) => drawStorm(cv, t, theme),
            (cv, t) => drawWhiteout(cv, t, theme),
        ],
    };
}
