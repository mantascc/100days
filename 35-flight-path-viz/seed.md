# Flight Path Prototype — Horizontal iPad

## Overview
Horizontal iPad prototype visualizing a single flight path (A → B) animating over time on a dark mode map.

## Visual Specs
- **Map style:** Dark mode, black and white only
- **Orientation:** Horizontal (landscape) only
- **Flight path:** Single route A → B with temporal animation
- **Aesthetic:** High contrast, minimal, computational

## Aesthetic Constraints
- **Computational minimalism:** Clean geometry, no decoration
- **Monochrome:** Pure black background, white path/markers
- **Precision:** Anti-aliased lines, exact positioning
- **Contemplative pacing:** Slow, deliberate animation
- **Data legibility:** Path as pure information, no skeuomorphism
- **Geometric primitives:** Circle markers for A/B, clean arc for path

## Technical Stack
- Mapbox GL JS (vector tiles, custom dark style stripped to essentials)
- GeoJSON LineString for flight path (great circle arc)
- CSS: lock to landscape orientation
- Animation: smooth interpolation along path over time

## Core Interaction
Path animates from origin to destination, showing progression. No user controls in v1 — pure observation of movement through space.

## Next Questions
- Fixed route or configurable A/B points?
- Animation duration/speed?
- Show plane icon or just the growing line?
- Any UI elements (time elapsed, distance, coordinates)?