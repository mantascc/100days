# Day 55: ASCII Loading

> "The aesthetic of watching something think."

A loading screen built from two side-by-side ASCII grids and a progress bar. Noise resolves into structure over 15 seconds.

[Live Demo](index.html)

---

## Concept

Two grids animate in parallel, each with a distinct crystallization behavior:

- **Grid 1** — radial. Characters lock from the center outward, cycling through chaos → settling → stable (`·`). The emergence follows a distance-weighted stochastic threshold.
- **Grid 2** — figural. A face emerges from noise. Three cell types resolve at different rates: border (`█`) first, then fill (`▒`), then hole-edges (`█`) tracing the eyes and mouth as outlined voids.

The loading bar runs exactly 15 seconds, linear, with a pulsing scan-head.

## How It Works

- Each cell has a threshold (0–1). When progress exceeds it, the cell locks to its final state.
- Pre-lock: cells cycle through `CHAOS` characters, transitioning through `SETTLING` glyphs as they approach their threshold.
- Grid 2 uses a two-pass parser: pass 1 reads `█`/`▒` from a template string; pass 2 finds space cells adjacent to fill and marks them as hole-edges.
- 12fps intentional stutter via `GRID_INTERVAL` throttle on `requestAnimationFrame`.

## Tech Stack

- Vanilla JavaScript
- No canvas — DOM `<span>` cells inside `<pre>` elements
- JetBrains Mono (Google Fonts)
- CSS custom properties from the Computational Minimalism style-seed

*Part of the 100 Days of Creative Coding challenge.*
