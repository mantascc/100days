# Day 58: Shapes

> "A geometric vocabulary, one family at a time."

A constrained-variation viewer for 2D geometric primitives. Four chapters map a taxonomy of canvas shapes — arcs, lines, curves, knots — each rendered across eight simultaneous cells with a warm dark palette.

[Live Demo](index.html)

---

## Concept

Each chapter picks one shape family and explores eight distinct members of that family. The scaffold stays constant (grid, palette, canvas setup) so differences between shapes read as geometry, not style.

The three animation difficulty tiers from the design notes map naturally to the chapters: parameter-tweaker shapes (arcs, lines) animate via `Math.sin(t)` offsets; path-tracer shapes (curves) draw themselves over time; structural-constraint shapes (some knots) require more careful math to stay valid in motion.

## Chapters

| # | Chapter | Shapes |
|---|---------|--------|
| 01 | **arcs** | ring, concentric, offset, venn, rose, spiral, log spiral, tangent |
| 02 | **lines** | parallel, radial, grid, perspective, diagonal, hatch, fan, chevron |
| 03 | **curves** | sine, lissajous, epitrochoid, hypotrochoid, cardioid, astroid, lemniscate, trefoil |
| 04 | **knots** | torus knot variants and related closed-path forms |

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML5 Canvas
- Shared `lib/utils.js` for canvas setup
- Palette: warm cream line on deep brown ground (`rgb(26,15,10)`)

*Part of the 100 Days of Creative Coding challenge.*
