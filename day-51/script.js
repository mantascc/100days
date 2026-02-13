/**
 * Day 51: Resonant Lattice
 * Physics grid simulation
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const UI = {
    energy: document.getElementById('energy-val'),
    damping: document.getElementById('damping-val'),
    nodes: document.getElementById('node-count')
};

// Configuration
const CONFIG = {
    gridSpacing: 25,
    nodeRadius: 1.5,
    stiffness: 0.015,
    damping: 0.95,
    mass: 1.0,
    cursorRadius: 40, // Half size (was 80)
    cursorForce: 0.5, // Keep low
    connectionOpacity: 0.05,
    accentColor: { r: 0, g: 255, b: 170 } // Cyan
};

let width, height;
let nodes = [];
let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, prevX: -1000, prevY: -1000, down: false };

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.restX = x;
        this.restY = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
    }

    update() {
        // 1. Spring force to rest position
        const dx = this.restX - this.x;
        const dy = this.restY - this.y;
        this.ax += dx * CONFIG.stiffness;
        this.ay += dy * CONFIG.stiffness;

        // 2. Mouse Interaction (Repulsion/Attraction)
        // Only if mouse is moving enough or pressed
        const dmx = mouse.x - this.x;
        const dmy = mouse.y - this.y;
        const distSq = dmx * dmx + dmy * dmy;

        if (distSq < CONFIG.cursorRadius * CONFIG.cursorRadius) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / CONFIG.cursorRadius) * CONFIG.cursorForce;

            // Push away
            this.ax -= (dmx / dist) * force;
            this.ay -= (dmy / dist) * force;

            // Add mouse velocity influence (drag)
            if (mouse.vx !== 0 || mouse.vy !== 0) {
                this.ax += mouse.vx * 0.1;
                this.ay += mouse.vy * 0.1;
            }
        }

        // 3. Integrate
        this.vx += this.ax;
        this.vy += this.ay;

        this.vx *= CONFIG.damping;
        this.vy *= CONFIG.damping;

        this.x += this.vx;
        this.y += this.vy;

        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }

    draw() {
        const dx = this.x - this.restX;
        const dy = this.y - this.restY;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const displacement = Math.sqrt(dx * dx + dy * dy);

        // Color based on displacement energy
        // Base: #333333 (51, 51, 51)
        // Accent: #00ffaa (0, 255, 170)

        const t = Math.min(speed * 0.5 + displacement * 0.1, 1);

        const r = 51 + (CONFIG.accentColor.r - 51) * t;
        const g = 51 + (CONFIG.accentColor.g - 51) * t;
        const b = 51 + (CONFIG.accentColor.b - 51) * t;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        // Variable size
        const radius = CONFIG.nodeRadius + t * 2;

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        return t; // Return energy level
    }
}

function init() {
    resize();
    createGrid();
    loop();
}

function createGrid() {
    nodes = [];
    const cols = Math.ceil(width / CONFIG.gridSpacing);
    const rows = Math.ceil(height / CONFIG.gridSpacing);

    // Center alignment offset
    const offsetX = (width - (cols - 1) * CONFIG.gridSpacing) / 2;
    const offsetY = (height - (rows - 1) * CONFIG.gridSpacing) / 2;

    for (let i = 0; i < cols; i++) {
        nodes[i] = [];
        for (let j = 0; j < rows; j++) {
            const x = offsetX + i * CONFIG.gridSpacing;
            const y = offsetY + j * CONFIG.gridSpacing;
            nodes[i][j] = new Node(x, y);
        }
    }

    UI.nodes.innerText = cols * rows;
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function loop() {
    requestAnimationFrame(loop);

    // Clear with trail effect? No, "Computational Minimalism" says "Physics over easing". 
    // Clean frame for crispness.
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    let totalEnergy = 0;

    // Apply neighbor forces (Lattice)
    // We do this in a separate pass or just let the update handle it?
    // Doing it properly: accumulate forces first.

    const cols = nodes.length;
    const rows = nodes[0].length;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const node = nodes[i][j];

            // Neighbors: Right, Bottom (to avoid double counting, but for simulation we need all 4 interactions every frame)
            // Or simpler: each node looks at neighbors?
            // Let's do a pass where each node pulls on its neighbors.

            if (i < cols - 1) spring(node, nodes[i + 1][j]); // Right
            if (j < rows - 1) spring(node, nodes[i][j + 1]); // Bottom
        }
    }

    // Update and Draw
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const node = nodes[i][j];
            node.update();
            const energy = node.draw();
            totalEnergy += energy;
        }
    }

    // Draw Connections (Optional - maybe only if energy high?)
    ctx.strokeStyle = `rgba(255, 255, 255, ${CONFIG.connectionOpacity})`;
    ctx.beginPath();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Grid lines
            if (i < cols - 1) {
                ctx.moveTo(nodes[i][j].x, nodes[i][j].y);
                ctx.lineTo(nodes[i + 1][j].x, nodes[i + 1][j].y);
            }
            if (j < rows - 1) {
                ctx.moveTo(nodes[i][j].x, nodes[i][j].y);
                ctx.lineTo(nodes[i][j + 1].x, nodes[i][j + 1].y);
            }
        }
    }
    ctx.stroke();

    UI.energy.innerText = totalEnergy.toFixed(2);
}

function spring(nodeA, nodeB) {
    const dx = nodeB.x - nodeA.x;
    const dy = nodeB.y - nodeA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Rest distance is gridSpacing
    // But wait, the diagonal connections? No diagonals in this simple lattice.
    // Horizontal/Vertical rest distance is gridSpacing.

    // Force = stiffness * (currentDist - restDist)
    const difference = dist - CONFIG.gridSpacing;
    const force = difference * CONFIG.stiffness * 0.5; // Shared force

    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    nodeA.ax += fx;
    nodeA.ay += fy;

    nodeB.ax -= fx;
    nodeB.ay -= fy;
}

// Interaction
window.addEventListener('resize', () => {
    resize();
    createGrid();
});

window.addEventListener('mousemove', (e) => {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    mouse.vx = mouse.x - mouse.prevX;
    mouse.vy = mouse.y - mouse.prevY;
});

// Mobile Interaction
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouse.prevX = mouse.x = e.touches[0].clientX;
    mouse.prevY = mouse.y = e.touches[0].clientY;
    mouse.down = true;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;

    mouse.vx = mouse.x - mouse.prevX;
    mouse.vy = mouse.y - mouse.prevY;
}, { passive: false });

canvas.addEventListener('touchend', () => {
    mouse.down = false;
    // Reset velocity so it doesn't keep dragging
    mouse.vx = 0;
    mouse.vy = 0;
    // Move off screen
    mouse.x = -1000;
    mouse.y = -1000;
});


init();
