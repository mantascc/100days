---
id: moves/geodesic-great-circle-path
type: move
title: Geodesic great-circle path
state: active
charge: low
spawned: [35-flight-path-viz]
feeds: []
sources: []
date: 2026-06-14
tags: [geospatial, map, geodesic, leaflet, turf]
---

# What
Draw the *shortest path between two points on a sphere* and animate a marker along it — a great-circle arc rather than a straight screen line. Turf.js handles the geodesic math, Leaflet renders the basemap and the curve, and a parametric position along the arc gives a smoothly moving plane. The reusable kernel is small: two coordinates → a GeoJSON LineString arc → an interpolated point at fraction `t`. It is the first real geospatial primitive in the practice and the entry point to anything map-shaped.

# Trace
- [35-flight-path-viz](../../35-flight-path-viz/) — a Copenhagen→Barcelona route animating along a great circle with waypoint annotations.

# Charge
Low for now — a single use, and bound to a heavier mapping stack (Leaflet/Turf) than the practice usually reaches for. But clearly reusable: any "A to B over the world" idea wants exactly this.

# Prompts
- Strip it to the seed's pure-monochrome vision: black map, white arc, no chrome, slow draw.
- Many arcs at once — a route network as an emergent great-circle web.
- Couple the arc to time, not distance: pacing that speeds and slows like a real flight.
