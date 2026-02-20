# Day 7: Apophenia

## Idea
Perceiving patterns in random motion—proximity links emerge and dissolve

## Description
Nodes drift randomly across a grid, drawing white lines to nearby neighbors within a threshold distance. "Apophenia" is the tendency to see meaningful patterns in random data. As nodes wander with slight directional noise, temporary clusters and network structures appear—then vanish. The simulation demonstrates how our pattern-seeking minds find structure even in pure randomness.

## Data Concepts
- **Primary**: Clustering (proximity-based grouping)
- **Secondary**: Network (dynamic edges), Spatial (distance-based relationships)

## Conceptual Tags
#apophenia #pattern-perception #proximity-graph #dynamic-network #emergence #random-motion #gestalt #perceptual-grouping

## Technical Tags
#canvas #spatial-queries #distance-threshold #particle-system #parameter-tuning #modal-ui

## Stack
- HTML5 Canvas
- Vanilla JS with RequestAnimationFrame
- Typed.js for title animation
- Modal dialog for parameter tuning

## Mechanics

### Node Behavior
- **Initialization**: Random position near center, random velocity direction
- **Motion**: Constant speed with directional noise (jitter)
- **Boundary**: Toroidal wrapping (reappear on opposite side)
- **Speed**: User-adjustable (0-1)
- **Noise**: Angular jitter (0°, 5°, 10°)

### Link Drawing
- **Condition**: Draw line if distance < LINK_DIST threshold
- **Distance options**: 30px, 60px, 90px
- **Visual**: White lines (full opacity)
- **Dynamic**: Links form/break every frame based on current positions

## Parameters (Tunable)
- **Node count**: 50, 100, 150, 250, 400, 600
- **Speed**: 0.0-1.0 (continuous slider)
- **Link distance**: 30, 60, 90px (affects clustering perception)
- **Noise**: 0, 5, 10 degrees (angular randomness)

## Perceptual Effects
- **Low link distance (30px)**: Sparse, fleeting connections
- **High link distance (90px)**: Dense web, everything feels connected
- **Low noise (0)**: Smooth, laminar flow patterns
- **High noise (10)**: Chaotic, unpredictable motion

## Notes
- Named after cognitive bias: seeing patterns in randomness
- No actual attraction between nodes—connections are purely visual artifacts of proximity
- Demonstrates Gestalt principles: proximity creates perceived grouping
- Grid provides spatial reference, emphasizing relative motion
- Tunable parameters let users explore parameter space and see emergence thresholds
- Responsive design: canvas scales with viewport
- 2×2px nodes, 20px grid spacing
- Metaphor for social networks, neural connections, or any system where proximity implies relationship
