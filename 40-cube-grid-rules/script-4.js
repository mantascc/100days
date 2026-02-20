const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const info = document.getElementById('info');

// Constants
const CELL_SIZE = 24;
const GAP = 1; // Minimal gap as per seed4.md
const BG_COLOR = '#0a0a0a';
const ON_COLOR = '#e0e0e0';
const OFF_COLOR = '#111111';

// Exposed Parameters
const PARAMS = {
    level0: { threshold: 0.1 },
    level1: { opacityGain: 8.0 },
    level2: { smoothing: 0.125, threshold: 0.1 },
    level3: { probabilityScale: 0.5 },
    level4: { threshold: 0.1 },
    level5: { activeThreshold: 0.01, inactiveThreshold: 0.01, neighborLimit: 2.5 },
    level6: {
        loudThreshold: 0.7,
        quietThreshold: 0.01,
        flipMin: 0.4,
        flipMax: 0.6,
        flipChance: 0.9,
        rippleSpeed: 1
    }
};

// State
let audioCtx;
let analyser;
let dataArray;
let source;
let isRunning = false;
let isPaused = false;
let currentLevel = 0;
let frameOffset = 0; // Time-varying offset for ripple effect

// Grid State
let cols = 0;
let rows = 0;
let cubes = [];

// Helpers
const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const random = () => Math.random();



class Cube {
    constructor(index, x, y, c, r, level) {
        this.index = index; // Linear index within the full grid
        this.x = x;
        this.y = y;
        this.c = c; // column index
        this.r = r; // row index
        this.level = level; // Level this cube belongs to
        this.value = 0;
        this.state = false; // on/off
        this.prevState = false; // for detecting transitions
        this.prevValue = 0;
        this.traceTime = 0; // timestamp when cube turned off
    }
}

// Rules Engine Setup
// Actions: 'on', 'off', 'flip', 'scatter', 'decay', 'propagate', 'invert'
// We'll implement a subset that fits the visual style.
const rules = [
    // Loud = on
    { condition: (c, d) => d[c.index % d.length] > PARAMS.level6.loudThreshold, action: 'on' },
    // Quiet + isolated = off (simplified neighborhood for performance)
    { condition: (c, d) => d[c.index % d.length] < PARAMS.level6.quietThreshold, action: 'off' }, // Neighborhood is expensive to calc every frame for all rules if not careful, simplifying for now
    // Random flip
    { condition: (c, d) => d[c.index % d.length] > PARAMS.level6.flipMin && d[c.index % d.length] < PARAMS.level6.flipMax && random() > PARAMS.level6.flipChance, action: 'flip' }
];

function randomizeRules() {
    rules.sort(() => random() - 0.5);
    console.log('Rules randomized');
}

// Initialization
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cols = Math.floor(canvas.width / CELL_SIZE);
    rows = Math.floor(canvas.height / CELL_SIZE);

    initGrid();
}

function initGrid() {
    cubes = [];
    for (let i = 0; i < rows * cols; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        cubes.push(new Cube(i, x, y, c, r, currentLevel));
    }
}

async function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048; // Should give enough data points
        dataArray = new Uint8Array(analyser.frequencyBinCount); // 1024

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        overlay.classList.add('hidden');
        isRunning = true;

        loop();
    } catch (e) {
        console.error(e);
        overlay.textContent = "Mic Access Denied / Error";
    }
}

// Core Logic
function getNeighbors(cube) {
    // 4-connectivity or 8-connectivity? "adjacent" usually means 4 or 8.
    // Let's do 4 for simplicity.
    let count = 0;
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (let [dx, dy] of dirs) {
        const nc = cube.c + dx;
        const nr = cube.r + dy;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
            const idx = nr * cols + nc;
            if (cubes[idx] && cubes[idx].state) count++;
        }
    }
    return count;
}

function update() {
    if (!isRunning || isPaused) return;

    analyser.getByteTimeDomainData(dataArray);

    // Calculate RMS (Root Mean Square) for volume normalization
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const deviation = (dataArray[i] - 128) / 128;
        sumSquares += deviation * deviation;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // Normalize factor: boost quiet signals, cap loud signals
    // Target RMS around 0.15 for consistent visualization
    const targetRMS = 0.15;
    const normalizeFactor = rms > 0.01 ? Math.min(targetRMS / rms, 3.0) : 1.0;

    // Normalize data 0-1
    // dataArray contains raw waveform 0-255, 128 is silence.
    // We want magnitude 0-1, normalized by current volume
    const normalizedData = new Float32Array(dataArray.length);
    for (let i = 0; i < dataArray.length; i++) {
        const raw = Math.abs(dataArray[i] - 128) / 128;
        normalizedData[i] = Math.min(raw * normalizeFactor, 1.0);
    }

    // Since grid might be larger than data, we wrap or interpolate.
    // Let's just wrap for direct mapping.

    cubes.forEach(cube => {
        const dataVal = normalizedData[cube.index % normalizedData.length];

        // Save history first
        cube.prevValue = cube.value;

        switch (currentLevel) {
            case 0: // Direct threshold
                cube.state = dataVal > PARAMS.level0.threshold;
                cube.value = dataVal;
                break;

            case 1: // Opacity (mapped to value)
                cube.value = dataVal;
                cube.state = true; // Always on, alpha handles visibility
                break;

            case 2: // Smoothed threshold
                cube.value = lerp(cube.value, dataVal, PARAMS.level2.smoothing);
                cube.state = cube.value > PARAMS.level2.threshold;
                break;

            case 3: // Probabilistic
                if (random() < dataVal * PARAMS.level3.probabilityScale) cube.state = true;
                else cube.state = false;
                break;

            case 4: // Entropy scatter (approximated)
                const rndIdx = Math.floor(random() * normalizedData.length);
                const rndData = normalizedData[rndIdx];
                if (rndData > PARAMS.level4.threshold) cube.state = true;
                else cube.state = false;
                break;

            case 5: // Expression grammar (Rules Engine)
                // Use time-varying offset for ripple effect
                const level5Index = (cube.index + frameOffset) % normalizedData.length;
                const level5DataVal = normalizedData[level5Index];
                const neighbors = getNeighbors(cube);
                let matched = false;

                for (let r of rules) {
                    // Override dataVal with level5DataVal for this cube
                    const d = new Float32Array(normalizedData.length);
                    d.set(normalizedData);
                    d[cube.index % d.length] = level5DataVal;
                    if (r.condition(cube, d, neighbors)) {
                        applyAction(r.action, cube);
                        matched = true;
                        break;
                    }
                }
                break;
        }
    });

    // Detect state transitions (on→off) and set traceTime
    const now = performance.now();
    cubes.forEach(cube => {
        if (cube.prevState && !cube.state) {
            // Just turned off - start trace
            cube.traceTime = now;
        }
        cube.prevState = cube.state;
    });

    // Increment frame offset for ripple effect
    frameOffset = (frameOffset + PARAMS.level6.rippleSpeed) % 1024;
}

function applyAction(action, cube) {
    switch (action) {
        case 'on': cube.state = true; break;
        case 'off': cube.state = false; break;
        case 'flip': cube.state = !cube.state; break;
        case 'scatter':
            // Visual effect only? Or logical?
            // "Random pixels within cube" - handled in render? 
            // For now just flip state randomly
            cube.state = random() > 0.5;
            break;
        case 'decay':
            cube.value *= 0.9;
            if (cube.value < 0.05) cube.state = false;
            break;
    }
}

function draw() {
    requestAnimationFrame(draw);
    update();

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear screen

    const now = performance.now();
    const TRACE_DURATION = 500; // 0.5 seconds in ms

    cubes.forEach(cube => {
        let fill = OFF_COLOR;

        if (currentLevel === 1) {
            // Opacity mode
            const alpha = Math.min(cube.value * PARAMS.level1.opacityGain, 1);
            fill = `rgba(224, 224, 224, ${alpha})`;
        } else if (cube.state) {
            fill = ON_COLOR;
        } else {
            // Check for trace effect
            const elapsed = now - cube.traceTime;
            if (elapsed < TRACE_DURATION && cube.traceTime > 0) {
                // Trace: white with 0.1 opacity
                fill = 'rgba(255, 255, 255, 0.1)';
            } else {
                fill = OFF_COLOR;
            }
        }

        ctx.fillStyle = fill;
        // Draw with gap
        const size = CELL_SIZE - (GAP * 2);
        ctx.fillRect(cube.x + GAP, cube.y + GAP, size, size);
    });
}

function loop() {
    draw();
}


// Interaction
window.addEventListener('resize', resize);
window.addEventListener('load', resize);

window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    else if (audioCtx.state === 'suspended') audioCtx.resume();
});

// Mobile tap to switch levels
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
    touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    const touch = e.changedTouches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.x);
    const dy = Math.abs(touch.clientY - touchStartPos.y);

    // Only switch levels on quick tap (< 300ms) with minimal movement (< 20px)
    if (touchDuration < 300 && dx < 20 && dy < 20) {
        // Don't trigger on UI elements
        if (e.target.id === 'fab' || e.target.closest('#paramPanel')) return;

        if (!audioCtx) {
            initAudio();
            return;
        }

        const descriptions = [
            "Level 0: Direct Threshold",
            "Level 1: Opacity",
            "Level 2: Smoothed Threshold",
            "Level 3: Probabilistic",
            "Level 4: Entropy Scatter",
            "Level 5: Expression Grammar"
        ];

        currentLevel = (currentLevel + 1) % 6;
        info.textContent = descriptions[currentLevel];
    }
});

window.addEventListener('keydown', (e) => {
    const descriptions = [
        "Level 0: Direct Threshold",
        "Level 1: Opacity",
        "Level 2: Smoothed Threshold",
        "Level 3: Probabilistic",
        "Level 4: Entropy Scatter",
        "Level 5: Expression Grammar"
    ];

    if (e.key >= '0' && e.key <= '5') {
        currentLevel = parseInt(e.key);
        info.textContent = descriptions[currentLevel];
    } else if (e.key === 'ArrowRight') {
        currentLevel = (currentLevel + 1) % 6;
        info.textContent = descriptions[currentLevel];
    } else if (e.key === 'ArrowLeft') {
        currentLevel = (currentLevel - 1 + 6) % 6;
        info.textContent = descriptions[currentLevel];
    }

    if (e.key === 'r') {
        randomizeRules();
    }
    if (e.code === 'Space') {
        isPaused = !isPaused;
    }
});
