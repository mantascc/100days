---
id: techniques/crt-tube-treatment
type: technique
title: CRT tube treatment
state: active
charge: high
spawned: [91-retro-primitives]
feeds: [themes/showing-mechanism-vs-polish, threads/design-system-and-reference-sheets]
sources: []
date: 2026-08-01
tags: [texture, canvas, bloom, grain, scanlines, crt, retro, primitive]
---

# What
The reusable *primitive retro-texture* — a bundled canvas + CSS pipeline that makes any subject look like it's being read off an old CRT tube. It is not a look glued onto a piece; it is a treatment the piece runs *through*.

The pipeline, per frame, per cell:

1. Draw the subject once, crisp, into an offscreen buffer at devicePixelRatio.
2. Composite the buffer back onto the main canvas at `screen` blend with **22px** blur — the fat outer halo.
3. Composite it again at **7px** — the middle bloom.
4. Draw the buffer itself at **0.7px** blur — the "subject." Nothing ever renders truly crisp; old tubes can't focus that sharp.
5. Add one directional chromatic nudge: the buffer redrawn ~1px offset, `screen`, alpha ~0.22.
6. Overlay: tiny two-bar readout, heavy radial vignette, live RGBA film grain regenerated every ~3 frames, faint top gloss.
7. Around the cell, in CSS only: 28px rounded-corner tube shell, an inner radial bevel via `::before`, static repeating-linear-gradient scanlines via `::after` at `mix-blend-mode: multiply`.

Everything variant-specific — palette, fill mode, ring colors, animation, grain tint — lives in one `VARIANT` config object. The pipeline is fixed; the config is what changes.

# Trace
- [91-retro-primitives](../../91-retro-primitives/) — first crystallization. Applied to circle/square/triangle/ellipse across four palette-swap variants: phosphor (warm sun + breathe), cryo (cobalt + sweep bar), signal (magenta + tear glitch), graphite (mono wireframe + axial spin).

# Charge
Bright, because it was won by iteration: the first pass read as "pinball animation" and the second, deliberately over-bloomed and de-focused, snapped into the reference. The technique now knows what "cheap" looks like and what "tube" looks like — the delta is the pipeline. Portable to anything: type, glyph fields, agents, sprites. Wants to be applied off-grid, to a single hero subject.

# Prompts
- Apply the treatment to a single fullscreen glyph field (letterforms as the subject) — CRT-typeset instead of CRT-sphered.
- Feed [techniques/glyph-density-ramp](../techniques/glyph-density-ramp.md) through the tube: ASCII rendered on a phosphor screen.
- A single tube filling the viewport, one subject, no grid — commit fully to the reference.
- Break the treatment: render the *exposed* pipeline as the piece — buffer, blur, composite steps laid out side by side. Answers [themes/showing-mechanism-vs-polish](../themes/showing-mechanism-vs-polish.md).
- Animation modes as a fifth axis: rig the pipeline so `breathe / sweep / glitch / spin` become a library the way palettes already are.
