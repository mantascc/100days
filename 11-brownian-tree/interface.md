# Day 11: Ambient Clock

## Idea
Fullscreen clock with typing animation overlaid on particle network background

## Description
This project creates an ambient screensaver-like experience combining a centered digital clock with a typing animation and a particle network background. The background consists of wandering agents that form proximity-based connections, creating a gentle, ever-shifting mesh. Text phrases load from an external JSON file and display with typewriter effect below the clock, typing character-by-character, pausing, then deleting before cycling to a new random phrase.

The implementation uses a modular architecture with separate background and content systems that render in sequence. The particle background features responsive configuration with drastically different agent counts for mobile (50) vs desktop (300) to maintain performance. The typing animation includes configurable speeds for both typing and deletion, with a long pause after completing each phrase.

## Data Concepts
- **Primary**: Temporal (clock display, typing animation timing)
- **Secondary**: Network (particle proximity connections), Spatial (particle positions and movement)

## Conceptual Tags
#ambient #screensaver #clock #typewriter-effect #modular-architecture #responsive-design #temporal-display

## Technical Tags
#canvas #particle-system #proximity-network #json-data #timing-animation #device-detection #module-pattern

## Stack
- HTML5 Canvas
- Vanilla JavaScript (modular)
- Google Fonts (Instrument Serif)
- JSON data file
- CSS Grid Layout

## Mechanics
- **Particle Movement**: Agents wander with velocity clamped to max speed (0.18 desktop / 0.12 mobile); jitter (0.35/0.25) adds random velocity each frame before normalization
- **Edge Wrapping**: Particles wrap around screen edges with 2px buffer for seamless infinite flow
- **Proximity Links**: O(n²) distance check draws lines between agents within linkDist (60px), with alpha interpolation from 0.6 (near) to 0.02 (far)
- **Clock Display**: Standard Date object formatted as HH:MM with 64px serif font (desktop) or 48px (mobile)
- **Typing Animation**: Character-by-character reveal at 90ms intervals; pauses 15 seconds after completion; deletes at 65ms intervals; cycles to random phrase avoiding first phrase repeat
- **Responsive Scaling**: Device detection via innerWidth/innerHeight aspect ratio determines mobile vs desktop configuration

## Parameters
**Desktop:**
- `agentCount: 300` - Number of particles
- `speed: 0.18` - Maximum velocity per frame
- `jitter: 0.35` - Random velocity perturbation amplitude
- `linkDist: 60` - Connection distance threshold
- `gridGap: 24` - Background grid spacing
- `clockFontSize: 64` - Clock text size

**Mobile:**
- `agentCount: 50` - Reduced for performance
- `speed: 0.12` - Slower ambient motion
- `jitter: 0.25` - Less chaotic movement
- `gridGap: 16` - Denser grid pattern
- `clockFontSize: 48` - Smaller clock

**Typing:**
- `typeSpeed: 90` - Milliseconds between characters when typing
- `deleteSpeed: 65` - Milliseconds between characters when deleting
- `pauseAfterComplete: 15000` - Pause duration in milliseconds after phrase completes

## Notes
- Modular architecture separates concerns: background.js handles particle system, content.js handles clock and typing
- The system always starts with the first phrase from phrases.json, then cycles through random phrases (avoiding first phrase)
- Canvas context uses `desynchronized: true` hint for potential GPU optimization
- DPR capped at 2 to balance sharpness with performance
- Particle velocity normalized each frame prevents runaway acceleration while allowing directional chaos from jitter
- The typing cursor (pipe character) only shows during active typing, not during pause or deletion
- Link opacity interpolation creates depth perception - closer connections appear stronger
- Grid and particle systems run in CSS pixels but render at device pixel ratio for crisp visuals
- Fullscreen canvas implementation with window resize handling recreates entire particle field on dimension change
- The 6x agent count difference (50 vs 300) between mobile and desktop demonstrates aggressive performance scaling
- Serif font for clock contrasts with monospace for body text, establishing visual hierarchy
