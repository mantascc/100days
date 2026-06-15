---
id: moves/backdrop-filter-svg-distort
type: move
title: Backdrop-filter SVG distort
state: active
charge: medium
spawned: [28-liquid-glass, 77-ascii-sheet-documentation, 78-ascii-sheets-docs]
feeds: [veins/ascii-and-text-rendering]
sources: []
date: 2026-06-14
tags: [css, svg, filter, glass]
---

# What
Layer a `backdrop-filter: blur()` over content, then warp it through an SVG `url(#distort)` filter built on `feTurbulence` and `feDisplacementMap` — the "liquid glass" effect, all in the compositor with no canvas. The refinement the maker found: matching the distortion's turbulence frequency to the underlying glyph grid so the warp reads as coherent ripple rather than mush. It's where the ASCII vein and the polish instinct meet.

# Trace
- [28-liquid-glass](../../28-liquid-glass/) — the founding glass-over-content study.
- [77-ascii-sheet-documentation](../../77-ascii-sheet-documentation/) — distortion tuned to glyph pitch.
- [78-ascii-sheets-docs](../../78-ascii-sheets-docs/) — glass layered over an ASCII field.

# Charge
A satisfying, current effect — the most "designed" of the rendering moves. Sits right on the polish-vs-mechanism tension.

# Prompts
- Drive the distortion frequency by audio so the glass ripples to sound.
- Glass that reveals rather than obscures — distortion as a reading lens.
- Push the freq mismatch on purpose: aesthetic from the mush.
