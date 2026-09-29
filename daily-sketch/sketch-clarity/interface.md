# CLARITY — optical studies

## Idea
Nothing is perfectly clear. A specimen sheet of six translucent geometric primitives: cube, rhombus (octahedron), triangular prism, circular lens, slab, and overlapping twin cubes. Clarity is a tension between reading the form and losing its edges to light.

## Lineage
- `91-retro-primitives`: shared bloom → subject → chromatic fringe → grain treatment.
- `58-shapes`: simultaneous constrained variations within a geometric vocabulary.
- `daily-sketch/sketch-color-explorer-v2`: immediate palette exploration.
- `28-liquid-glass`: material as an interactive parameter space.
- `daily-sketch/sketch-idle-crt`: slow breathing motion and imperfect optical focus.

## Interaction
Five material presets (Optical, Cryo, Amber, Ghost, Afterglow); six continuous controls (clarity, edge bleed, film grain, chromatic fringe, reflection, motion). Mutate discovers combinations; Reset restores Optical after a mutation, or the selected preset. Drag any form to turn it; select a cell to inspect at larger scale. Pause freezes motion and grain. Save PNG exports the full specimen sheet with parameter values. Reduced-motion preference starts paused. Responsive two/three-column grid, keyboard-accessible controls and native modal with Escape dismissal.

## Rendering
Dependency-free Canvas 2D. Projected 3D meshes with depth-sorted translucent faces, directional gradient highlights, clipped fine grooves, offset spectral edges, corner glints, two-scale bloom, a flattened reflected image, soft-light film grain and vignette. This is an expressive optical approximation rather than physical ray-traced refraction. Device pixel ratio capped at 1.6; offscreen cells skip drawing; hidden tabs stop rendering. No external assets or requests.

## Open question
How much imperfection can a form absorb before transparency stops communicating clarity?

## Tags
visual-primitives, translucent, geometry, retro-futurism, grain, bloom, reflection, constrained-variation, canvas, motion, clarity

## Promoted
The refined, indexed version is [`99-clarity`](../../99-clarity/index.html), with a canvas-first layout and popup controls.
