
// Main entry point

import { initAudio, toggleAudio, setMorph } from './audio.js';
import { initVisual, startVisualLoop } from './visual.js';
import { initInteraction } from './interaction.js';

async function main() {
    console.log('Wave Morph Initializing...');

    // Initialize Audio Engine (but don't start it yet - requires user gesture)
    const audioContext = initAudio();

    // Initialize Visual Engine
    const canvas = document.getElementById('visualizer');
    initVisual(canvas);
    startVisualLoop();

    // Initialize Interaction
    initInteraction();

    console.log('Ready.');
}

// Start when DOM is ready
window.addEventListener('DOMContentLoaded', main);
