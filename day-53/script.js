/**
 * Day 53: ASCII Animated Grid
 * A hypnotic, interactive 100x100 ASCII grid visualization.
 */

const CONFIG = {
    cols: 100,
    rows: 100, // Reduced slightly to ensure it fits vertically on most screens
    fontSize: 12,
    charWidth: 7,  // Approx dependent on font
    charHeight: 14 // Approx dependent on font
};

const MODES = {
    RIPPLE: 'ripple',
    WAVE: 'wave',
    RAIN: 'rain',
    BREATH: 'breath',
    WORM: 'worm'
};

// Symbol Sets
const SYMBOLS = {
    [MODES.RIPPLE]: ['·', '∙', '∶', '∴', '∷', '≡', '∞', '∫', '∬', '⊠', '█'],
    [MODES.WAVE]: ['·', '∿', '∾', '≈', '≋', '∰', '∯', '∮', '∲', '∳', '⊛'],
    [MODES.RAIN]: [' ', '˙', '∣', '∤', '⋮', '⋰', '⋱', '∥', '⫿', '║', '╫', '╬'],
    [MODES.BREATH]: [' ', '∘', '○', '◌', '◎', '⊙', '⊚', '⊛', '●', '◉', '⦿', '⏣'],
    [MODES.WORM]: [' ', '∙', '∶', '∵', '∴', '∷', '⁖', '⁘', '⁙', '⊹', '✳', '❊']
};

class Grid {
    constructor() {
        this.el = document.getElementById('grid');
        this.cols = 100;
        this.rows = 60; // 100x100 is too tall for 16:9 screens usually. 100x60 is better aspect ratio.
        this.cells = [];
        this.mode = MODES.RIPPLE;
        this.frame = 0;
        this.mouse = { x: -1, y: -1, active: false };

        this.resize();
        this.init();

        this.lastTime = 0;
        this.interval = 1000 / 30; // 30 FPS cap for "retro" feel
    }

    resize() {
        // Dynamic resizing based on container? 
        // For now hardcoded textual grid size, but CSS scales it.
        // Let's stick to a fixed logical grid.
    }

    init() {
        this.cells = [];
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                row.push({
                    x, y,
                    val: 0,       // Current value (0-1)
                    target: 0,    // Target value
                    velocity: 0,  // For physics-based modes
                    char: ' '     // Rendered char
                });
            }
            this.cells.push(row);
        }
    }

    setMode(mode) {
        this.mode = mode;
        this.init(); // Reset grid clear
        document.querySelectorAll('.mode').forEach(el => {
            el.classList.toggle('active', el.dataset.mode === mode);
        });
    }

    update() {
        this.frame++;

        // Mode specific logic
        switch (this.mode) {
            case MODES.RIPPLE:
                this.updateRipple();
                break;
            case MODES.WAVE:
                this.updateWave();
                break;
            case MODES.RAIN:
                this.updateRain();
                break;
            case MODES.BREATH:
                this.updateBreath();
                break;
            case MODES.WORM:
                this.updateWorm();
                break;
        }

        // Decay/Smooth
        // Not needed for all, but good for some. Handled in specific updates.
    }

    updateRipple() {
        // Physics propagation
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.cells[y][x];

                // Mouse Interaction
                if (this.mouse.active) {
                    const dx = x - this.mouse.x;
                    const dy = y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 5) {
                        cell.val = 1;
                    }
                }

                // Simple smoothing / spreading
                // This is a cellular automata approach for ripples roughly
                // Average of neighbors * damping
                // Actually, let's just do a distance field from mouse + noise

                let val = cell.val * 0.95; // Decay

                // Allow neighbors to propagate?
                // Complex without a second buffer. Simple distance logic might be better.

                cell.val = val;
            }
        }

        // Better Ripple: Wave equation?
        // Let's stick to a simpler visual: Distance from mouse + Sine wave
        if (this.mouse.active) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    const dx = x - this.mouse.x;
                    const dy = (y - this.mouse.y) * 2; // Aspect correction
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // calculate wave
                    const wave = Math.sin(dist * 0.5 - this.frame * 0.2);
                    // Damping by distance
                    const damp = Math.max(0, 1 - dist / 40);

                    this.cells[y][x].val = (wave * 0.5 + 0.5) * damp;
                }
            }
        } else {
            // Idle ripple
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    this.cells[y][x].val *= 0.9;
                }
            }
        }
    }

    updateWave() {
        // Perlin-ish noise or simple Sine interference
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const dx = x * 0.1;
                const dy = y * 0.1;
                const t = this.frame * 0.05;

                const v1 = Math.sin(dx + t);
                const v2 = Math.cos(dy - t);
                const v3 = Math.sin(dx + dy + t);

                let val = (v1 + v2 + v3) / 3; // -1 to 1

                // Mouse distort
                if (this.mouse.active) {
                    const mdx = x - this.mouse.x;
                    const mdy = y - this.mouse.y;
                    const dist = Math.sqrt(mdx * mdx + mdy * mdy);
                    const interact = Math.max(0, 1 - dist / 20);
                    val += interact;
                }

                this.cells[y][x].val = (val + 1) / 2; // 0 to 1
            }
        }
    }

    updateRain() {
        // Random drops at top, fall down
        // Spawn
        if (Math.random() < 0.3) {
            const x = Math.floor(Math.random() * this.cols);
            this.cells[0][x].val = 1;
            this.cells[0][x].velocity = 1; // Speed
        }

        // Move down (iterate backwards to not overwrite propagation in one frame)
        // Or swap buffers. Backwards iteration helps.
        // We need to preserve trails.

        // Manual copy to avoid buffer issues or just meticulous logic.
        // Since we want trails, we update from bottom up.
        for (let x = 0; x < this.cols; x++) {
            for (let y = this.rows - 1; y >= 0; y--) {
                const cell = this.cells[y][x];

                if (cell.val > 0.1) {
                    // Stay or move?
                    if (y < this.rows - 1) {
                        const next = this.cells[y + 1][x];
                        // Probability to fall
                        if (cell.val > 0.8) {
                            next.val = cell.val;
                            cell.val = cell.val * 0.5; // Leave trail
                        } else {
                            cell.val *= 0.9; // Decay trail
                        }
                    } else {
                        cell.val *= 0.9; // Decay at bottom
                    }
                }
            }

            // Mouse interaction: Block rain?
            if (this.mouse.active) {
                const my = Math.floor(this.mouse.y);
                const mx = Math.floor(this.mouse.x);
                // Simple Umbrella
                if (Math.abs(x - mx) < 5) {
                    // Height map of umbrella
                    const umbrellaY = my - Math.abs(x - mx); // Triangle
                    if (umbrellaY >= 0 && umbrellaY < this.rows) {
                        // Clear rain below umbrella
                        // Actually, just delete rain at this Y
                        this.cells[umbrellaY][x].val = 0;
                    }
                }
            }
        }
    }

    updateBreath() {
        // Concentric circles expanding/contracting
        const cx = this.cols / 2;
        const cy = this.rows / 2;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const dx = x - cx;
                const dy = (y - cy) * 2; // Aspect
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Breathing function
                const t = this.frame * 0.05;
                const radius = 20 + Math.sin(t) * 10;
                const width = 5 + Math.cos(t * 1.5) * 2;

                let val = Math.abs(dist - radius) < width ? 1 - Math.abs(dist - radius) / width : 0;

                // Add mouse influence
                if (this.mouse.active) {
                    const mdx = x - this.mouse.x;
                    const mdy = (y - this.mouse.y) * 2;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    const mval = Math.max(0, 1 - mdist / 15);
                    val = Math.max(val, mval);
                }

                this.cells[y][x].val = val;
            }
        }
    }

    updateWorm() {
        // Perlin noise flow field or just worms?
        // Let's do a noisy field that looks like writhing
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const scale = 0.1;
                const noise = Math.sin(x * scale + this.frame * 0.1) * Math.cos(y * scale + this.frame * 0.1);

                // Mouse attract
                let val = (noise + 1) / 2;

                if (this.mouse.active) {
                    const dx = x - this.mouse.x;
                    const dy = y - this.mouse.y;
                    const angle = Math.atan2(dy, dx);
                    // Starburst effect
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 20) {
                        val = Math.abs(Math.sin(angle * 5 + this.frame * 0.2));
                        val *= (1 - dist / 20);
                    }
                }

                this.cells[y][x].val = val;
            }
        }
    }

    render() {
        const symbols = SYMBOLS[this.mode];
        const numSymbols = symbols.length - 1;

        let output = '';
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.cells[y][x];
                // Clamp 0-1
                let val = Math.max(0, Math.min(1, cell.val));

                // Map to symbol
                const index = Math.floor(val * numSymbols);
                output += symbols[index];
            }
            output += '\n';
        }

        this.el.textContent = output;
    }
}

// Setup
const grid = new Grid();

// Loop
function animate(time) {
    if (time - grid.lastTime > grid.interval) {
        grid.update();
        grid.render();
        grid.lastTime = time;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Interaction
const gridEl = document.getElementById('grid');

function updateMouse(clientX, clientY) {
    const rect = gridEl.getBoundingClientRect();
    // Map mouse px to grid coordinates
    // Clamp to 0-cols/rows
    const x = Math.floor((clientX - rect.left) / rect.width * grid.cols);
    const y = Math.floor((clientY - rect.top) / rect.height * grid.rows);

    // Check if within bounds
    if (x >= 0 && x < grid.cols && y >= 0 && y < grid.rows) {
        grid.mouse.x = x;
        grid.mouse.y = y;
        grid.mouse.active = true;
    } else {
        grid.mouse.active = false;
    }
}

// Mouse events
gridEl.addEventListener('mousemove', (e) => {
    updateMouse(e.clientX, e.clientY);
});

gridEl.addEventListener('mouseleave', () => {
    grid.mouse.active = false;
});

// Keys
window.addEventListener('keydown', (e) => {
    if (e.key === '1') grid.setMode(MODES.RIPPLE);
    if (e.key === '2') grid.setMode(MODES.WAVE);
    if (e.key === '3') grid.setMode(MODES.RAIN);
    if (e.key === '4') grid.setMode(MODES.BREATH);
    if (e.key === '5') grid.setMode(MODES.WORM);
});

// UI Clicks
document.querySelectorAll('.mode').forEach(el => {
    el.addEventListener('click', () => {
        grid.setMode(el.dataset.mode);
    });
});

// Touch
// Use window/document event but filter target
document.addEventListener('touchmove', (e) => {
    // Check if target is grid or inside grid
    if (e.target.id === 'grid' || e.target.closest('#grid')) {
        e.preventDefault();
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    if (e.target.id === 'grid' || e.target.closest('#grid')) {
        e.preventDefault();
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    grid.mouse.active = false;
});
