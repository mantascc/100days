# Day 84: ID Card

## Idea
A living credential — flow-field card surface that recedes to reveal its spec

## Description
A dark stage holds a single ID card: "Mantas Lilis · Human Participant · Curiosity, Inc., Interaction Department." The card's surface is a canvas flow field — 90 dim particles steered by a sin/cos pseudo-noise angle field, trailing through a slow fade — so the credential reads as a living material rather than printed plastic. A radial sheen tracks the pointer via `--mx/--my` custom properties, a 7s box-shadow keyframe makes the card breathe, and the void behind it is a second canvas of twinkling stars where roughly 1% are fast-moving "satellites" with a steady pulse.

Below the card sits a card-shaped trigger tab labeled "spec-002". Clicking it plays a depth sequence: the card lerps back to `translateZ(-120px)` (blurred, dimmed), a dossier frame fades in closer to the viewer at `translateZ(60px)`, then a glowing scanline sweeps top-to-bottom while the content blur-resolves in a 40ms-staggered cascade — the document appears to write itself. Escape or the close button reverses everything.

The dossier is a fictional spec ("Pointer input normalization for surface elements", RFC-0084) with a module/version/owner grid and an on-demand dependency graph: an `[Explain]` prompt with a blinking `>` swaps to a 3s fake load cycling through "Fetching dependencies / Resolving paths / Compiling graph" before materializing an SVG node-link diagram — replaced by a monospace text tree on narrow screens. Credential details are generated per load: random hex serial and an issued date stamped with today.

## Data Concepts
- **Primary**: Visual (living surface, simulated materiality)
- **Secondary**: Spatial (Z-axis recession, layered depth)

## Conceptual Tags
#identity #credential #living-surface #materiality #depth #dossier #fictional-spec #reveal

## Technical Tags
#canvas #flow-field #translatez #pointer-capture #custom-properties #staggered-transitions #svg

## Stack
- Single-file HTML/CSS/JS, two canvas layers (void starfield + card flow field)
- Pseudo-noise angle field from summed sin/cos; trail fade via low-alpha fill
- `perspective: 1600px` stage; rAF lerp (`cz += (tz - cz) * 0.16`) for card recession
- Pointer capture + `--mx/--my` custom properties for the touch-friendly sheen
- Inline SVG dependency graph with a mobile text-tree fallback; SVG fractal-noise grain overlay

## Notes
- Depth is sold by Z-translation and blur, not tilt — the card never rotates; recession is what makes the dossier feel nearer
- The depgraph load is pure theater: a 3s timer cycling status labels over a filling trail, no actual fetch
- `document.getElementById('filed')` targets an element that doesn't exist, so the barcode and dossier-bar generation after it never runs — both rows render empty
- Serial regenerates and the issued date stamps the current day on every load — the credential is always freshly issued
