# Day 45: Gravity Pills

## Idea
Physics simulation of pill-shaped objects with gravity, drag interaction, and collision dynamics

## Description
This project simulates pill-shaped UI elements as physical objects subject to gravity and collision. Users can drag pills around the canvas, with Matter.js handling realistic physics including gravity, bouncing, friction, and pill-to-pill collisions. The light aesthetic (#e8e8e8 background) contrasts with previous dark projects. DM Sans font and rounded pill shapes create friendly, tactile interface. Max-width 800px container with shadow on desktop provides focused interaction area.

## Data Concepts
- **Primary**: Spatial (physics simulation, collision detection, position dynamics)
- **Secondary**: Temporal (continuous physics updates, drag interactions)

## Conceptual Tags
#physics-simulation #gravity #collision-detection #interactive-objects #matter-js #pill-shapes #drag-interaction

## Technical Tags
#matter-js #physics-engine #canvas #drag-events #collision-physics

## Stack
- Matter.js physics engine
- HTML5 Canvas
- Vanilla JavaScript
- Google Fonts (DM Sans)

## Notes
- Pill shapes (rounded rectangles) create friendly, approachable aesthetic vs circles/squares
- Grab cursor feedback indicates draggable objects
- Physics makes interface feel tangible and playful vs static UI elements
- The project demonstrates how physics can enhance UI personality
- Matter.js handles complex collision math, allowing focus on interaction design
- Max-width constraint creates predictable interaction bounds
