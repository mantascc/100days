# Day 24: Rock Paper Scissors Simulation

## Idea
Agent-based rock-paper-scissors simulation where agents bounce on collision and convert losers until one species dominates

## Description
This project simulates the classic rock-paper-scissors dynamics as a spatial agent-based model. 66 agents (rocks, papers, scissors) wander the canvas with random walks and gentle rotation. When agents collide, they bounce apart and the loser converts to the winner's species following RPS rules (rock beats scissors, scissors beats paper, paper beats rock). The simulation continues until only one species remains, showing "GG [Winner]!!1" overlay. Real-time stats track population counts for each species, revealing which one will emerge victorious.

The implementation uses image-based agents with toroidal wrapping (agents reappear on opposite edge when exiting). Collision detection uses axis-aligned bounding boxes (AABB), and bounce physics reverse velocities along collision normal. The conversion system processes all collisions per frame, then batch-applies species changes to prevent cascading within-frame conversions.

## Data Concepts
- **Primary**: Spatial (agent positioning, collision detection, movement physics)
- **Secondary**: Statistical (population dynamics, competitive exclusion), Temporal (simulation evolution)

## Conceptual Tags
#agent-based-model #rock-paper-scissors #competitive-dynamics #population-ecology #spatial-simulation #game-theory #cyclic-competition #emergent-winner

## Technical Tags
#canvas #collision-detection #aabb #toroidal-space #image-sprites #bounce-physics

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- Image assets (rock, scissors, paper sprites)
- Google Fonts (Workbench)

## Mechanics
- **Agent Movement**: Random walk with turn jitter (0.08 radians); constant speed (2.0 desktop / 1.25 mobile); toroidal edge wrapping
- **Rotation**: Continuous rotation at 0.005 radians/frame for visual interest
- **Collision Detection**: O(n²) AABB check - boxes overlap if edges intersect on both axes
- **RPS Logic**: beats() function implements rules - rock>scissors, scissors>paper, paper>rock; ties return either species
- **Bounce Physics**: Calculate center-to-center vector, normalize to collision normal, reverse velocity along normal for both agents
- **Conversion System**: Map stores pending conversions (loser index → winner species); batch applied after all collision checks to prevent mid-frame cascades
- **Win Condition**: Check if only one species remains after each frame; if true, pause simulation and show winner overlay
- **Mobile Optimization**: Reduced agent count (66), slower speed (1.25), smaller images (0.5 scale) for performance

## Parameters
- `N_AGENTS: 66` - Total agent count (22 of each species at start)
- `SPEED: 2.0` (desktop) / `1.25` (mobile) - Movement speed in pixels per frame
- `TURN_JITTER: 0.08` - Random heading variation amplitude
- `ROTATION_SPEED: 0.005` - Constant rotation rate for visual spin
- `IMAGE_SCALE: 1.0` (desktop) / `0.5` (mobile) - Sprite size multiplier

## Notes
- Rock-paper-scissors dynamics create non-transitive competition - no "best" strategy, only cyclical superiority
- Spatial element crucial - if agents were well-mixed (no spatial structure), winner would be pure chance; spatial clustering allows temporary dominance regions
- The simulation demonstrates competitive exclusion principle - only one species can occupy niche in the end
- Initial 1:1:1 ratio (22 each) provides fair starting conditions, but early random fluctuations often determine winner
- Toroidal topology eliminates edge effects - no boundaries to constrain movement or create special zones
- Bounce physics essential - without it, converted agents would continue overlapping, causing instant re-conversion
- Batch conversion prevents frame artifacts - if conversions applied immediately, first collision in frame could affect subsequent collisions
- The "GG [Winner]!!1" message uses intentional typo ("!!1" vs "!!") for humorous internet culture reference
- Image rotation adds visual dynamism without affecting collision detection (AABB still axis-aligned despite sprite rotation)
- Mobile optimizations demonstrate performance-conscious design - half speed and half scale maintain smooth 60fps
- Population tracking shows phase transitions - periods of stability, sudden collapses, eventual winner emergence
- The model has applications in ecology (predator-prey-competitor systems), game theory (mixed strategies), and sociology (competing ideologies)
- Unlike typical predator-prey models (2 species), 3-species RPS creates more complex dynamics with no stable equilibrium
- Victory overlay blocks further interaction, requires explicit "Play again" to reset - prevents accidental restart
- Initial random positioning and velocity ensures unique evolution each run despite deterministic rules
