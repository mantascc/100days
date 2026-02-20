
// Audio Engine (Upgraded for Crossfading)

import state from './state.js';

let audioCtx;
let masterGain;

// MorphOscillator manages two oscillators to blend between types
class MorphOscillator {
    constructor(ctx, destination) {
        this.ctx = ctx;
        this.destination = destination;

        // Two oscillators A and B
        this.oscA = ctx.createOscillator();
        this.oscB = ctx.createOscillator();

        // Their individual gain nodes for crossfading
        this.gainA = ctx.createGain();
        this.gainB = ctx.createGain();

        // Connect O -> G -> Destination
        this.oscA.connect(this.gainA);
        this.oscB.connect(this.gainB);
        this.gainA.connect(destination);
        this.gainB.connect(destination);

        // Initial config
        this.frequency = 220;
        this.updateFrequency(this.frequency);
        this.setMorph(0); // Start at 0 (Sine)

        this.oscA.start();
        this.oscB.start();
    }

    updateFrequency(freq) {
        this.frequency = freq;
        const now = this.ctx.currentTime;
        this.oscA.frequency.setTargetAtTime(freq, now, 0.01);
        this.oscB.frequency.setTargetAtTime(freq, now, 0.01);
    }

    // morphValue: 0 (Sine), 1 (Triangle), 2 (Square), 3 (Sawtooth)
    setMorph(value) {
        // Clamp 0-3
        value = Math.max(0, Math.min(3, value));

        // Determine which types we are between
        const waves = ['sine', 'triangle', 'square', 'sawtooth'];

        let indexA = Math.floor(value);
        let indexB = Math.ceil(value);

        // If exact integer
        if (indexA === indexB && indexB < 3) indexB++;

        const typeA = waves[indexA];
        const typeB = waves[indexB];

        const mix = value - indexA; // 0.0 to 1.0 (amount of B)

        // Efficient switching: only change types if needed to avoid pops?
        // Web Audio allows setting type anytime.
        if (this.oscA.type !== typeA) this.oscA.type = typeA;
        if (this.oscB.type !== typeB) this.oscB.type = typeB;

        // Crossfade logic (Constant Power or Linear?)
        // Linear is simpler for now:
        // Gain A = 1 - mix
        // Gain B = mix
        // (Constant power would be cos/sin rule, but linear is fine for basic morph)

        const now = this.ctx.currentTime;
        // Use small ramp to remove zipper noise
        this.gainA.gain.setTargetAtTime(1 - mix, now, 0.01);
        this.gainB.gain.setTargetAtTime(mix, now, 0.01);
    }

    stop() {
        this.oscA.stop();
        this.oscB.stop();
    }
}

let morphOsc;

export function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime); // Start muted

    morphOsc = new MorphOscillator(audioCtx, masterGain);

    return audioCtx;
}

export function toggleAudio() {
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const fadeTime = 0.1;

    // Note: state.isPlaying has already been toggled by the caller
    // So if isPlaying is true, we want to play (gain = 0.5)
    // If isPlaying is false, we want to stop (gain = 0)
    if (state.isPlaying) {
        masterGain.gain.setTargetAtTime(0.5, now, fadeTime);
    } else {
        masterGain.gain.setTargetAtTime(0, now, fadeTime);
    }
}

// Replaces setWaveType
export function setMorph(value) {
    if (!morphOsc) return;
    morphOsc.setMorph(value);
}
