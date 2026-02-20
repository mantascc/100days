
// State Management

const state = {
    isPlaying: false,
    currentWaveType: 'sine', // 'sine', 'triangle', 'square', 'sawtooth'

    // For visual morphing
    targetWaveType: 'sine',
    morphProgress: 1.0, // 0.0 to 1.0. 1.0 means fully morphed to target.

    // Wave definitions map for easy access
    waves: ['sine', 'triangle', 'square', 'sawtooth']
};

export default state;

export function updateState(updates) {
    Object.assign(state, updates);
}
