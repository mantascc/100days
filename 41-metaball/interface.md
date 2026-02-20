# Day 41: Metaball

## Idea
Interactive metaball physics simulation with mouse-driven particle attraction

## Description
This project implements metaballs - organic blob-like forms created through implicit surface rendering where multiple spheres blend together smoothly. The system uses crosshair cursor indicating interactive mode, with help button revealing modal with controls. Metaballs merge and separate fluidly based on proximity, creating liquid-like organic shapes. Monospace typography and dark aesthetic (#0a0a0a background) emphasize computational/experimental nature.

## Data Concepts
- **Primary**: Visual (implicit surfaces, smooth blending, organic forms)
- **Secondary**: Spatial (particle positions, distance fields, surface computation)

## Conceptual Tags
#metaballs #implicit-surfaces #organic-shapes #fluid-dynamics #blob-rendering #distance-fields #computational-geometry

## Technical Tags
#canvas #marching-squares #distance-fields #particle-systems #mouse-interaction

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- Courier New monospace

## Notes
- Metaballs use distance field functions where surfaces form at threshold values
- Smooth blending creates organic liquid-metal aesthetic
- Technique commonly used in VFX for liquid/gel simulations
- Mouse interaction likely attracts or repels blob centers
- Help modal suggests multiple interaction modes or parameter controls
- Crosshair cursor indicates precision targeting for interaction
