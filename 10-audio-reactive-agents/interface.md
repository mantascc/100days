# Day 10: Audio-Reactive Agents

## Idea
Microphone-driven particle swarm where loudness controls movement speed and chaos

## Description
This project creates a responsive particle system that reacts in real-time to microphone input. Agents drift across the canvas with proximity-based connections forming a dynamic network visualization. The system maps audio features directly to movement parameters - louder sounds accelerate agents and increase random jitter, while quiet moments produce slow, graceful drift. The Web Audio API analyzes microphone input using time-domain RMS (root mean square) calculations to measure sound intensity.

The implementation includes device detection for responsive scaling, using 200 agents on desktop and 100 on mobile with adjusted connection distances for optimal performance. Agents maintain constant speed but modulate their velocity magnitude based on audio input, creating a pulsing, breathing effect synchronized with environmental sound. Nearby agents within connection radius draw translucent grey lines, visualizing the swarm's emergent network topology.

## Data Concepts
- **Primary**: Audio (real-time signal processing, RMS loudness)
- **Secondary**: Network (proximity connections, dynamic topology), Spatial (particle positions, boundary constraints)

## Conceptual Tags
#audio-reactive #real-time #microphone-input #swarm-behavior #emergent-networks #sonification #amplitude-mapping #responsive-design

## Technical Tags
#web-audio-api #canvas #time-domain-analysis #device-detection #particle-system #real-time-rendering

## Stack
- HTML5 Canvas
- Web Audio API (AnalyserNode, MediaStreamSource)
- Vanilla JavaScript
- ResizeObserver
- getUserMedia API

## Mechanics
- **Audio Analysis**: Web Audio API AnalyserNode with FFT size 1024 and smoothing 0.85; RMS computed from time-domain samples as sqrt(mean(samples²))
- **Speed Mapping**: `speed = 0.05 + 50.0 × RMS`, mapping typical RMS range (0-0.5) to movement speed
- **Noise Mapping**: `noise = 0.05 + 100.0 × RMS`, louder input increases random velocity perturbation
- **Velocity Normalization**: Each frame, velocity magnitude normalized to target speed, then jitter added - prevents acceleration but allows directional chaos
- **Boundary Handling**: Soft bounce with 0.98 damping coefficient reflects agents off edges
- **Connection Drawing**: O(n²) proximity test draws lines between agents within 30px (desktop) or 25px (mobile)
- **Device Detection**: User agent parsing plus touch point detection determines mobile vs desktop for parameter scaling

## Parameters
- `DESKTOP_AGENTS: 200` / `MOBILE_AGENTS: 100` - Responsive agent count
- `DESKTOP_CONNECTION_DISTANCE: 30` / `MOBILE_CONNECTION_DISTANCE: 25` - Proximity threshold for drawing connections
- `GRID: 8` - Visual grid spacing in pixels
- `AGENT_SIZE: 2` - Agent rendering size (2x2 pixels)
- `BASE_SPEED: 0.05` - Minimum drift velocity (silent audio)
- `RMS_TO_SPEED: 50.0` - Loudness-to-speed multiplier
- `BASE_NOISE: 0.05` - Minimum jitter amplitude
- `RMS_TO_NOISE: 100.0` - Loudness-to-jitter multiplier
- `EDGE_BOUNCE: 0.98` - Velocity damping on wall collision
- `FFT: 1024` - FFT size for audio analysis
- `smoothingTimeConstant: 0.85` - Time-domain smoothing for audio analyser

## Notes
- Uses RMS (root mean square) rather than frequency analysis, measuring raw amplitude regardless of pitch or timbre
- The velocity normalization approach (renormalize to target speed each frame, then add noise) creates interesting behavior where chaos increases but overall flow speed stays controlled
- Echo cancellation and noise suppression enabled in getUserMedia constraints for cleaner audio signal
- Periodic console logging (every 60 frames) for debugging audio levels and simulation parameters
- Device detection includes multiple heuristics: user agent parsing, touch point detection, and screen width threshold
- Connection visualization uses O(n²) algorithm with early termination on distance - acceptable for 100-200 agents but would need spatial partitioning for larger counts
- The 0.98 damping on bounce prevents agents from getting stuck vibrating in corners
- Audio smoothing (0.85) prevents jarring jumps from transient sounds while maintaining responsiveness
- Visual feedback from connections creates sense of coherence even as individual agents move chaotically
- The project demonstrates direct sonification - audio features directly control visual parameters without intermediate mapping layers
- Typical RMS range of 0-0.5 for speech and ambient sound scales to speed range of 0.05-25.05 px/frame
