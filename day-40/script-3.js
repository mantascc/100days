const overlay = document.getElementById('overlay');

// Global audio state
let audioCtx;
let analyser;
let dataArray;
let source;
let isRunning = false;

// Helpers
const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// Sketch Setup
// We are using IDs c0, c1, c2, c3, c4, c5, c6
// Mapping them to their original logic index for switch case: 0,1,2,3,4,5,6
const sketchIds = [0, 1, 2, 3, 4, 5, 6, 7];
const sketches = [];

// Initialization
function initSketches() {
    sketches.length = 0;
    sketchIds.forEach(i => {
        const id = `c${i}`;
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        sketches.push({ id, canvas, ctx, index: i });
    });
    resize();
}

function resize() {
    sketches.forEach(s => {
        const rect = s.canvas.parentElement.getBoundingClientRect();
        s.canvas.width = rect.width;
        s.canvas.height = rect.height;
    });
}
window.addEventListener('resize', resize);
// Initial resize
setTimeout(resize, 0);

async function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        overlay.classList.add('hidden');
        isRunning = true;

        loop();
    } catch (e) {
        console.error(e);
        overlay.textContent = "Mic Error";
    }
}

// State for smoothed/derived sketches
let smoothedAmp = 0;
let prevAmp = 0;
let rotation = 0;
let particles = [];

// Particle Class for Sketch 6
class Particle {
    constructor(x, y, v, w, h) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * v;
        this.vy = (Math.random() - 0.5) * v;
        this.life = 1.0;
        this.decay = 0.05 + Math.random() * 0.05; // Faster decay for small box
        this.w = w;
        this.h = h;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, 2, 2);
        ctx.globalAlpha = 1.0;
    }
}

function getVolume(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += Math.abs(data[i] - 128);
    }
    return sum / data.length; // approx 0-128
}


function loop() {
    if (!isRunning) return;
    requestAnimationFrame(loop);

    analyser.getByteTimeDomainData(dataArray);

    const vol = getVolume(dataArray);
    const rawAmp = vol;

    // Update Global State
    smoothedAmp = lerp(smoothedAmp, rawAmp, 0.1);
    const deltaAmp = Math.abs(rawAmp - prevAmp);
    prevAmp = rawAmp;

    rotation += 0.01 + (deltaAmp * 0.005);

    // Sketch 6 Logic (Update) - Local to the context? No, global particles list.
    // Need to spawn particles relative to that specific canvas.
    // Actually, let's process spawning inside the loop per sketch for easier coordinate mapping
    // OR just pass the canvas dims to the particle.
    // Let's spawn particles only if Sketch 6 exists
    const s6 = sketches.find(s => s.index === 6);
    if (s6 && rawAmp > 10) {
        // Spawning logic relative to s6 center
        const count = Math.floor(rawAmp / 10);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(
                s6.canvas.width / 2,
                s6.canvas.height / 2,
                rawAmp * 0.5,
                s6.canvas.width,
                s6.canvas.height
            ));
        }
    }
    particles.forEach(p => p.update());
    particles = particles.filter(p => p.life > 0);


    sketches.forEach(s => {
        const ctx = s.ctx;
        const w = s.canvas.width;
        const h = s.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        // Scaling factors for small grid (cubes are smaller than full width)
        // Adjust multipliers if needed.

        switch (s.index) {
            case 0: // Direct
                ctx.beginPath();
                ctx.arc(cx, cy, rawAmp, 0, Math.PI * 2); // rawAmp is usually small enough for small box
                ctx.stroke();
                break;

            case 1: // Scaled
                const opacity = map(rawAmp, 0, 50, 0.1, 1.0);
                ctx.globalAlpha = Math.min(Math.max(opacity, 0.1), 1);
                ctx.beginPath();
                ctx.arc(cx, cy, w / 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
                break;

            case 2: // Threshold
                if (rawAmp > 30) {
                    ctx.fillRect(0, 0, w, h);
                } else {
                    ctx.beginPath();
                    ctx.rect(cx - 10, cy - 10, 20, 20);
                    ctx.stroke();
                }
                break;

            case 3: // Smoothed
                ctx.beginPath();
                ctx.arc(cx, cy, smoothedAmp, 0, Math.PI * 2);
                ctx.stroke();
                break;

            case 4: // Derived
                const weight = Math.max(1, deltaAmp);
                ctx.lineWidth = weight;
                ctx.beginPath();
                ctx.moveTo(0, cy);
                ctx.lineTo(w, cy);
                ctx.stroke();
                break;

            case 5: // Cross-mapped
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotation);
                const size = 10 + smoothedAmp; // Smaller base size
                ctx.strokeRect(-size / 2, -size / 2, size, size);
                ctx.restore();
                break;

            case 6: // Emergent
                particles.forEach(p => p.draw(ctx));
                break;

            case 7: // Scribble (Sine extraction)
                ctx.beginPath();
                // Use w/2, h/2 for center
                for (let i = 0; i < dataArray.length - 100; i += 2) {
                    let x = (dataArray[i] - 128) + cx;
                    let y = (dataArray[i + 50] - 128) + cy; // Phase shifted for lissajous effect
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                break;
        }
    });
}

window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    else if (audioCtx.state === 'suspended') audioCtx.resume();
});

initSketches();
