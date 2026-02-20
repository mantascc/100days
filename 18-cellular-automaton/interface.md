# Day 18: Custom Cellular Automaton

## Idea
Step-by-step cellular automaton with custom rules: birth on 3 neighbors, death on 5+ neighbors

## Description
This project implements a custom cellular automaton that evolves through discrete generations triggered by user input. Unlike Conway's Game of Life, this uses modified rules: cells become black (alive) if they have exactly 3 black neighbors, become white (dead) if they have 5 or more black neighbors, and otherwise maintain their current state. The system starts with random initial configuration (45% black density) and evolves one generation per spacebar press or button tap. The 1-pixel white border remains fixed to provide stable boundaries.

The implementation uses a dual-buffer approach with separate state and memory arrays to prevent read-write conflicts during updates. The 240×240 pixel resolution provides fine-grained cellular detail while remaining computationally manageable for per-pixel iteration. Mobile devices get dedicated Step and Reset buttons with responsive scaling to fit screen width.

## Data Concepts
- **Primary**: Spatial (cellular grid, Moore neighborhood, local rules)
- **Secondary**: Temporal (discrete generations, state evolution)

## Conceptual Tags
#cellular-automaton #grid-systems #emergence #discrete-dynamics #moore-neighborhood #custom-rules #step-simulation #local-computation

## Technical Tags
#canvas #image-data #double-buffering #pixel-manipulation #responsive-ui #mobile-controls

## Stack
- HTML5 Canvas
- ImageData API
- Vanilla JavaScript
- CSS Grid Layout

## Mechanics
- **State Representation**: 2D arrays of Uint8Arrays (W×H), 0=white/dead, 1=black/alive
- **Neighbor Counting**: Moore neighborhood (8-cell surrounding square) excluding center cell
- **Update Rules**:
  - If exactly 3 black neighbors: become black (birth rule)
  - If 5+ black neighbors: become white (death by overcrowding)
  - Otherwise: maintain current state (persistence)
- **Double Buffering**: Read from `state` array, write to `memory` array, then copy `memory` to `state` - prevents cascade updates within single generation
- **Border Handling**: 1-pixel border excluded from update rules, remains white permanently
- **Initial Seeding**: Random configuration with 45% black density (tuned for interesting dynamics)
- **Rendering**: Direct ImageData manipulation - iterate through pixels, set RGB based on state, putImageData() for display

## Parameters
- `W: 240` / `H: 240` - Grid resolution (pixels)
- `scale: floor(min(innerWidth, innerHeight) / 260)` - Visual scaling factor
- `initialDensity: 0.45` - Probability of black cell in initial random state (45%)
- Neighbor thresholds:
  - Birth: exactly 3 neighbors
  - Death: 5 or more neighbors
  - Persistence: 0-2 or 4 neighbors

## Notes
- The modified rules create different dynamics than Conway's Game of Life - no standard patterns like gliders or blinkers emerge
- Birth-on-3 rule mirrors Game of Life's birth rule, maintaining that sweet spot for structure formation
- Death-on-5+ rule (vs Game of Life's 4+ death) allows slightly denser configurations before collapse
- The persistence rule (maintain state for 0-2 or 4 neighbors) creates stability - structures don't immediately dissolve
- 45% initial density provides good balance - enough structure for interesting patterns without immediate death or stagnation
- Step-by-step execution allows careful observation of pattern evolution unlike continuous animation
- Double buffering prevents "wave propagation" artifacts where earlier updates in iteration affect later cells in same generation
- Fixed white border provides containment - patterns can't wrap or escape, creating closed-system dynamics
- Uint8Array storage extremely memory-efficient for binary state (1 byte per cell vs 4 bytes for regular array)
- Direct ImageData manipulation bypasses higher-level canvas drawing for maximum performance
- The 240×240 resolution creates 57,600 cells - large enough for complex patterns, small enough for instant computation
- Mobile scaling maintains pixel-perfect rendering while fitting screen - CSS scaling without changing logical resolution
- The rule set creates "stable-ish" dynamics - not too explosive (like Game of Life replicators), not too boring (like Highlife's tendency to die)
- Lacks the rich library of known patterns that make Conway's Life interesting - demonstrates how slight rule changes dramatically affect behavior
- Press-to-advance interaction invites contemplative observation vs automatic animation
