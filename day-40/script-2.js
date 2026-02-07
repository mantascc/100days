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
const sketches = []; // { id, canvas, ctx, draw(data, time) }

// Initialization
function initSketches() {
    for (let i = 0; i <= 6; i++) {
        const id = `s${i}`;
        const canvas = document.getElementById(id);
        if (!canvas) continue;
        const ctx = canvas.getContext('2d');
        sketches.push({ id, canvas, ctx, index: i });
    }
    resize();
}

function resize() {
    sketches.forEach(s => {
        const rect = s.canvas.parentElement.getBoundingClientRect();
        // Make them square or responsive? 
        // Let's make them full width of container, height 300px
        s.canvas.width = rect.width;
        s.canvas.height = 300;
    });
}
window.addEventListener('resize', resize);

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
    constructor(x, y, v) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * v;
        this.vy = (Math.random() - 0.5) * v;
        this.life = 1.0;
        this.decay = 0.01 + Math.random() * 0.02;
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

function getAverageAmp(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return sum / data.length; // 0-255 usually around 128 for silence in unsigned byte? 
    // Wait, getByteTimeDomainData: silence is 128.
    // So amplitude is abs(val - 128).
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

    const vol = getVolume(dataArray); // 0 - ~128
    const rawAmp = vol;

    // Update Global State
    smoothedAmp = lerp(smoothedAmp, rawAmp, 0.1);
    const deltaAmp = Math.abs(rawAmp - prevAmp);
    prevAmp = rawAmp;

    rotation += 0.01 + (deltaAmp * 0.005);

    // Sketch 6 Logic (Update)
    if (rawAmp > 10) { // Threshold to spawn
        const count = Math.floor(rawAmp / 5);
        for (let i = 0; i < count; i++) {
            // Spawn at center
            particles.push(new Particle(
                sketches[6].canvas.width / 2,
                sketches[6].canvas.height / 2,
                rawAmp * 0.5
            ));
        }
    }
    // Update particles
    particles.forEach(p => p.update());
    particles = particles.filter(p => p.life > 0);


    sketches.forEach(s => {
        const ctx = s.ctx;
        const w = s.canvas.width;
        const h = s.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#111'; // Slightly lighter than black for contrast? Or full black.
        // Let's stick to full black #000 as per style, but maybe the container has a bg?
        // style.css has body #000.
        // Let's fill clear.

        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;

        switch (s.index) {
            case 0: // Direct
                // Amplitude -> Radius
                ctx.beginPath();
                ctx.arc(cx, cy, rawAmp * 2, 0, Math.PI * 2);
                ctx.stroke();
                break;

            case 1: // Scaled
                // Amp -> Opacity
                // Visual: Fixed circle, varying opacity
                const opacity = map(rawAmp, 0, 50, 0.1, 1.0);
                ctx.globalAlpha = Math.min(Math.max(opacity, 0.1), 1);
                ctx.beginPath();
                ctx.arc(cx, cy, 50, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
                break;

            case 2: // Threshold
                // > 180 (volume > 50ish in our scale) -> Flash
                if (rawAmp > 30) { // 30 is decent threshold for "loud"
                    ctx.fillRect(0, 0, w, h);
                } else {
                    ctx.beginPath();
                    ctx.rect(cx - 10, cy - 10, 20, 20);
                    ctx.stroke();
                }
                break;

            case 3: // Smoothed
                // Lerp -> Breathing
                ctx.beginPath();
                ctx.arc(cx, cy, smoothedAmp * 2, 0, Math.PI * 2);
                ctx.stroke();
                break;

            case 4: // Derived
                // ROC -> Stroke Weight
                // Visual: Line pulsing
                const weight = Math.max(1, deltaAmp * 2);
                ctx.lineWidth = weight;
                ctx.beginPath();
                ctx.moveTo(0, cy);
                ctx.lineTo(w, cy);
                ctx.stroke();
                break;

            case 5: // Cross-mapped
                // Amp->Size, ROC->Rot
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotation);
                const size = 20 + smoothedAmp;
                ctx.strokeRect(-size / 2, -size / 2, size, size);
                ctx.restore();
                break;

            case 6: // Emergent
                // Particles
                particles.forEach(p => p.draw(ctx));
                break;
        }
    });

}

window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    else if (audioCtx.state === 'suspended') audioCtx.resume();
});

initSketches();
setTimeout(initSketches, 100); // Safety
