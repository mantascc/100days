// Interaction Logic

import state, { updateState } from './state.js';
import { setMorph, toggleAudio } from './audio.js';
import { setVisualMorph } from './visual.js';

export function initInteraction() {

    // -- UI Elements --
    const slider = document.getElementById('morph-slider');
    const toggleBtn = document.getElementById('toggle-btn');

    // -- Handlers --

    const handleToggle = (e) => {
        if (e) e.stopPropagation();

        const isPlaying = !state.isPlaying;
        updateState({ isPlaying });

        // Audio
        toggleAudio();

        // UI
        toggleBtn.classList.toggle('active', isPlaying);
        toggleBtn.querySelector('span').innerText = isPlaying ? 'STOP' : 'PLAY';
    };

    const handleSlider = (e) => {
        const val = parseFloat(e.target.value);

        // Audio
        setMorph(val);

        // Visual
        setVisualMorph(val);

        // State
        updateState({ morphProgress: val });
    };

    // -- Listeners --

    // Click Toggle
    toggleBtn.addEventListener('click', handleToggle);

    // Slider Change (input event for realtime)
    slider.addEventListener('input', handleSlider);

    // Keyboard Shortcuts (Optional: Keys 1-4 move slider)
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (['1', '2', '3', '4'].includes(key)) {
            const index = parseInt(key) - 1;

            // Move slider visually
            slider.value = index;

            // Trigger handler manually
            // (setting .value programmatically doesn't fire 'input')
            handleSlider({ target: slider });
        }

        // Spacebar to toggle?
        if (e.code === 'Space') {
            e.preventDefault(); // prevent scrolling
            handleToggle();
        }
    });

    // Global Click (Optional: Remove if button is primary)
    // "click: toggle sound on/off" from seed
    // Since we now have a button, maybe we disable global click to avoid accidental toggles?
    // Let's keep it but ignore if target is compatible (slider)
    /*
    window.addEventListener('click', (e) => {
        // If clicking slider or button, ignore
        if (e.target.closest('.controls-bar')) return;
        
        handleToggle();
    });
    */
    // Users usually prefer explicit controls when controls exist.
    // Let's rely on the button for now as per "different controls" request.

}
