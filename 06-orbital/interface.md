# Day 6: Orbital

## Idea
Miniature solar systems in a grid—16 unique orbital configurations

## Description
A 4×4 grid containing 16 independent mini solar systems. Each cell has a central star (white square) with 3 orbiters on elliptical paths. Every orbital system has randomized parameters: ellipse size, eccentricity, rotation angle, orbital speed, and direction (clockwise/counterclockwise). The result is a mesmerizing tapestry of synchronized yet distinct celestial mechanics—no two systems are identical.

## Data Concepts
- **Primary**: Spatial (orbital geometry, parametric paths)
- **Secondary**: Temporal (periodic motion, phase relationships)

## Conceptual Tags
#orbital-mechanics #elliptical-orbits #celestial-mechanics #parametric-motion #kepler #grid-composition #synchronized-chaos

## Technical Tags
#canvas #ellipse-rendering #rotation-transformation #parametric-equations #double-buffering #pixel-perfect

## Stack
- HTML5 Canvas (double-buffered)
- Vanilla JS with RequestAnimationFrame
- Typed.js for animated title
- Affine transformations for rotated ellipses

## Mechanics

### Orbital Parameters (per orbiter)
- **rx, ry**: Ellipse semi-major and semi-minor axes (18-45% of cell radius)
- **rot**: Ellipse rotation angle (0-2π, random)
- **ang**: Current orbital phase (0-2π)
- **spd**: Angular velocity (0.003-0.06 rad/frame)
- **Direction**: 50% chance of clockwise vs counterclockwise

### Rendering
1. Background canvas (static): grid lines + orbit paths
2. Foreground canvas (animated): stars + moving orbiters
3. Parametric ellipse: `x = rx*cos(θ), y = ry*sin(θ)`, then rotated
4. Pixel-aligned squares (2×2 for orbiters, 3×3 for stars)

## Grid Layout
- 4×4 cells (16 solar systems)
- 400×400px canvas
- 100px per cell
- Each cell is independent, no cross-cell interactions

## Parameters
- 16 cells × 3 orbiters = 48 total orbiting bodies
- Ellipse axes: 18-45% of cell half-width
- Speed range: 0.003-0.06 rad/frame (~60fps)
- 50% reverse chance (counterclockwise)

## Notes
- Double-buffered: static background redrawn only on reset
- Ellipse rendering uses native `ctx.ellipse()` with rotation
- Demonstrates Kepler's laws in miniature
- Each system evolves independently, creating complex phase relationships
- Reset button generates new random configurations
- Typed.js adds playful title animation
- Grid provides compositional structure while allowing individual variation
- Demonstrates order within chaos: predictable orbits, unpredictable ensemble
