
// Visual Engine (Canvas)

import state from './state.js';

let canvas;
let ctx;
let animationId;
let width;
let height;

// Mathematical Wave Functions (normalized x: 0..1)
const waveFunctions = {
    sine: (x) => Math.sin(x * Math.PI * 2),
    triangle: (x) => 1 - 4 * Math.abs(Math.round(x) - x),
    square: (x) => (x < 0.5 ? 1 : -1),
    sawtooth: (x) => 2 * (x - Math.floor(x + 0.5))
};

// Map indices to keys
const waves = ['sine', 'triangle', 'square', 'sawtooth'];

// Current continuous morph value (0.0 to 3.0)
let currentMorph = 0.0;

export function initVisual(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');

    // Handle resizing
    window.addEventListener('resize', resize);
    resize();
}

function resize() {
    // Canvas is now inside a flex container (visual-card)
    // We want to match the container's size.
    // However, canvas by default acts as an inline block or has intrinsic size.
    // CSS handles the display size (width: 100%), but we need to set internal resolution.

    // Get the parent container
    const parent = canvas.parentElement;

    // Use container's client dimensions
    width = parent.clientWidth;
    height = parent.clientHeight;

    // Support High DPI displays for crisp lines
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale context to match dpr
    ctx.scale(dpr, dpr);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

export function startVisualLoop() {
    const loop = () => {
        render();
        animationId = requestAnimationFrame(loop);
    };
    loop();
}

// Receive continuous value from interaction/slider
export function setVisualMorph(value) {
    currentMorph = value;
}

function render() {
    // Clear
    // Use logical width/height because context is scaled
    ctx.clearRect(0, 0, width, height);

    // Determine which two waves we are blending
    // e.g. 1.5 is halfway between Triangle (1) and Square (2)

    // Clamp
    let m = Math.max(0, Math.min(3, currentMorph));

    let indexA = Math.floor(m);
    let indexB = Math.ceil(m);
    if (indexA === indexB && indexB < 3) indexB++;

    const typeA = waves[indexA];
    const typeB = waves[indexB];

    const mix = m - indexA; // 0.0 to 1.0

    // Draw
    ctx.beginPath();

    // Style
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#002FFF'; // Accent 1
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#002FFF';

    const centerY = height / 2;
    const amplitude = 80; // slightly smaller so it doesn't hit edges

    // Optimization: Draw segments
    // Ensure we have enough resolution for square waves
    const step = width / 400; // Draw 400 points

    for (let x = 0; x <= width; x += step) {
        // Normalized x 0..1
        // Map screen x to signal phase
        // Let's say 2 cycles across screen
        const phase = (x / width) * 2;

        const funcA = waveFunctions[typeA];
        const funcB = waveFunctions[typeB];

        // Get sample values
        const s1 = funcA(phase);
        const s2 = funcB(phase);

        // Interpolate
        const yVal = lerp(s1, s2, mix);

        const y = centerY - (yVal * amplitude);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}
