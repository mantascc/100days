# 99 · CLARITY — optical studies

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
Dependency-free Canvas 2D. Projected 3D meshes with depth-sorted translucent faces, directional gradient highlights, clipped fine grooves, offset spectral edges, corner glints, two-scale bloom, a flattened reflected image, soft-light film grain and vignette. This is an expressive optical approximation rather than physical ray-traced refraction. Compositing capped at 30 fps; dimensions cached by ResizeObserver; grain patterns cached; paused frames redraw only on changes; inspector suspends grid rendering. Device pixel ratio capped at 1.25 on mobile and 1.6 on desktop; offscreen cells skip drawing; hidden tabs stop rendering. No external assets or requests.

## Open question
How much imperfection can a form absorb before transparency stops communicating clarity?

## Tags
visual-primitives, translucent, geometry, retro-futurism, grain, bloom, reflection, constrained-variation, canvas, motion, clarity


## Promotion
Promoted from `daily-sketch/sketch-clarity` at the maker’s request. The original daily sketch remains as the process artifact. Header, introductory title, and footer removed. All material presets, sliders, mutation, pause/reset, and export live inside a single Controls popup. Native dialogs handle focus and Escape; backdrop taps dismiss. Gallery gestures allow vertical page scrolling and horizontal rotation; the enlarged inspector supports rotation on both axes. Controls have 44px touch targets and respect safe-area insets.

## Default material
Optical: clarity **92**, edge bleed **45**, film grain **87**, chromatic fringe **100**, reflection **54**, motion **60**, matching the supplied screenshot. Reset on Optical restores these values.

## Large-screen bounds
The horizontally and vertically centered desktop specimen grid caps at 1440 × 960 CSS pixels (approximately 480 × 480 per cell). It continues to fit smaller desktop viewports; mobile retains its two-column scrolling layout.

## Instagram export
`node scripts/export-reel.cjs` renders a 10-second, 1080×1920, 30 fps H.264 MP4 into `exports/` (ignored by git). Requires `@napi-rs/canvas` and ffmpeg. The exporter uses the sketch’s actual mesh/material renderer, with no browser chrome or controls. The six-form composition moves through Optical → Cryo → Amber → Afterglow → Ghost → Optical, smoothly interpolating material parameters. The title and grid sit inside generous vertical margins for Story/Reel overlays. Silent video; no soundtrack added.
