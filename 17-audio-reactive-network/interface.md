# Day 17: Audio-Reactive Force Network

## Idea
Microphone-driven force-directed graph where sound volume dynamically controls link distance and charge strength

## Description
This project extends Day 16's hub-spoke force network with real-time audio reactivity. The same hierarchical graph structure (hubs with shared and exclusive agents) now responds to microphone input by modulating the physics simulation. Louder sounds increase repulsive charge forces and link distances, causing the network to expand and become more agitated. Quiet moments allow the network to contract into a tighter, calmer configuration. Users must click "Enable microphone" to grant permission, after which the graph continuously adjusts its forces based on sound amplitude.

The implementation computes RMS (root mean square) amplitude from time-domain audio data, applies exponential moving average smoothing (alpha 0.4), and maps the 0-1 volume range to force parameters: link distance scales from 20-100px and charge strength scales from -10 to -150. The simulation continuously reheats with gentle alphaTarget (0.15) to allow force changes to take effect without jarring jumps. All graph validation tests from Day 16 remain active.

## Data Concepts
- **Primary**: Audio (microphone input, RMS amplitude, real-time sonification)
- **Secondary**: Network (graph topology, force-directed layout), Temporal (smooth transitions, EMA filtering)

## Conceptual Tags
#audio-reactive #sonification #force-directed-graph #real-time-audio #microphone-input #physics-modulation #amplitude-mapping #network-visualization

## Technical Tags
#web-audio-api #d3-force #canvas #analyser-node #rms #ema-smoothing #user-permissions

## Stack
- HTML5 Canvas
- D3-Force (v3) from CDN
- Web Audio API (AnalyserNode)
- getUserMedia API
- Vanilla JavaScript (ES6 modules)

## Mechanics
- **Audio Setup**: getUserMedia with high-quality settings (44.1kHz sample rate, no echo cancellation/noise suppression/auto gain); MediaStreamSource → AnalyserNode with FFT 1024, smoothing 0.8
- **RMS Computation**: Time-domain samples centered around 128, squared, averaged, square-rooted; scaled ×8 for sensitivity, clamped to 0-1
- **EMA Smoothing**: `volSmooth = volSmooth×0.6 + vol×0.4` provides temporal coherence across frames
- **Force Mapping**: Linear interpolation - `linkDistance = 20 + 80×volSmooth` (quiet→tight, loud→spread); `chargeStrength = -10 - 140×volSmooth` (quiet→weak repulsion, loud→strong repulsion)
- **Continuous Reheat**: `alphaTarget(0.15).restart()` each frame keeps simulation warm enough for force changes to propagate without full energy spike
- **Graph Structure**: Identical to Day 16 - 160 agents, 3 hubs, 100% shared ratio (all non-hubs connect to all hubs), 0-2 extra edges per node

## Parameters
- `N: 160` - Total agent count
- `HUB_COUNT: 3` - Number of hub nodes
- `SHARED_RATIO: 1` - All non-hubs connect to all hubs (changed from Day 16's 0.3)
- `VOL_SMOOTH_A: 0.4` - EMA smoothing factor for volume
- Audio settings:
  - `fftSize: 1024` - Analysis window size
  - `smoothingTimeConstant: 0.8` - Analyser smoothing
  - `sampleRate: 44100` - Hz
- Volume-to-force mapping:
  - Link distance: 20-100px (linear with volume)
  - Charge strength: -10 to -150 (linear with volume)
- `alphaTarget: 0.15` - Simulation heat level for force updates

## Notes
- The full shared connectivity (SHARED_RATIO=1) creates denser central structure than Day 16, providing more dramatic visual response to audio input
- RMS amplitude provides perceptually-relevant loudness measurement - louder than peak amplitude and matches human hearing better
- The ×8 sensitivity scaling addresses typical RMS range (0-0.125) for speech/ambient sound, bringing it into usable 0-1 range
- EMA smoothing (alpha 0.4) balances responsiveness with stability - filters out frame-to-frame noise while tracking volume changes within ~150ms
- Disabling echo cancellation, noise suppression, and auto gain gives raw audio signal - better for artistic visualization than communication-optimized processing
- Continuous alphaTarget strategy avoids jarring "pop" that would occur from full simulation restart on every force change
- The double-linear mapping (volume→distance, volume→charge) creates correlated expansion - both spacing and repulsion increase together
- Link distance range (20-100, 5x ratio) provides dramatic visual range without becoming unreadably sparse at maximum
- Charge strength range (-10 to -150, 15x ratio) creates strong repulsive explosions during loud moments while maintaining coherence during quiet
- Microphone permissions require user gesture (button click) per web security policy - overlay pattern standard for audio-reactive web apps
- The project demonstrates direct sonification principle: audio features directly drive visual parameters with minimal transformation
- Backdrop blur on permission overlay creates professional polish while maintaining context visibility
- Force modulation technique applicable to any time-series data - stock prices, sensor readings, network traffic, etc.
