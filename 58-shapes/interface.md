# Day 58: Shapes

## Idea
A geometric vocabulary built one shape family at a time, eight cells per chapter

## Description
A constrained-variation viewer for 2D geometric primitives. Four chapters — arcs, lines, curves, knots — each pick one shape family and render eight members of it across a 4×2 canvas grid: arcs (ring, concentric, tangent, offset, venn, rose, chain, log spiral), lines (parallel, radial, grid, diagonal, perspective, hatch, fan, chevron), curves (sine, lissajous, epitrochoid, superellipse, cardioid, astroid, rose, trefoil), knots (torus knots from trefoil up to T(4,5)).

The scaffold stays constant — warm cream line `rgba(255,243,224,0.88)` on deep brown `rgb(26,15,10)`, shared grid, shared time step `dt = 0.008` — so differences between cells read as geometry, not style. Each chapter is an ES module exporting a `createChapter()` factory that returns `labels`, `drawFns`, `dt`, and `setup`; the viewer drives all eight cells from one requestAnimationFrame loop and navigates chapters by hash plus prev/next buttons.

The knots chapter is the technical peak: T(p,q) torus knots computed in 3D, rotated by two time-driven axes, then drawn segment-by-segment with z-depth mapped to lineWidth and alpha — depth cues without a real 3D pipeline. `animation.md` documents a difficulty taxonomy discovered along the way: parameter tweakers (sin(t) on a radius or gap), path tracers (the curve draws itself over time), and structural constraints (tangency, hardcoded intersections) that resist animation without careful math.

## Data Concepts
- **Primary**: Spatial (geometric primitives, parametric curves)
- **Secondary**: Temporal (shared time accumulator driving all animation), Visual (line-on-ground rendering)

## Conceptual Tags
#geometry #parametric-curves #torus-knots #shape-taxonomy #constrained-variation #vocabulary-building #animation-difficulty

## Technical Tags
#canvas #es-modules #raf-loop #hash-routing #3d-projection #dpr-scaling

## Stack
- Vanilla JavaScript (ES modules, `createChapter()` factory per chapter)
- HTML5 Canvas with devicePixelRatio-aware setup (`lib/utils.js`)
- DM Mono (Google Fonts), CSS custom properties
- Hash routing + toolbar prev/next for chapter navigation

## Notes
- direct reuse of the day 56 scaffold with the variable axis switched from texture algorithm to shape family
- the animation.md tier system (tweaker / tracer / structural) is a useful lens: how a shape is defined predicts how hard it is to animate
- torus knots get 3D depth from nothing but per-segment lineWidth and alpha — no projection matrix, just two rotations and a z sort implied by draw order
- every chapter runs at the same dt=0.008, so cross-chapter tempo is one of the held constants
