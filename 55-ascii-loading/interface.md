# Day 55: ASCII Loading

## Idea
Loading screen where two ASCII grids crystallize from noise over 15 seconds

## Description
A fake loading screen built from two side-by-side 32×16 character grids and a 2px progress bar. Each cell holds a random threshold (0–1); as the linear 15-second progress passes a cell's threshold, the cell locks to its final glyph. Before locking, cells cycle through chaos characters (`!@#$%^&*...`), shifting to settling glyphs (`░▒▓▪▫`) once local progress exceeds 0.72 — noise resolves into structure in three visible phases.

The two grids crystallize differently. Grid 1 is radial: thresholds are distance-weighted from the center plus random jitter, so stability spreads outward in a rough ring, every cell ending as a dim `·`. Grid 2 is figural: a face emerges from the noise. A two-pass parser reads a template string — pass 1 classifies border (`█`) and fill (`▒`) cells by codepoint, pass 2 marks space cells adjacent to face cells as hole-edges, so the eyes and mouth render as outlined voids. Face cells get low thresholds (border first, then fill, then hole-edges); background cells lock last.

The grid updates are throttled to 12fps via an interval check inside requestAnimationFrame — an intentional stutter that reads as machine effort. The bar, percentage counter, and countdown run smoothly; at completion the label flips to a green "system ready".

## Data Concepts
- **Primary**: Visual (ASCII art, character animation)
- **Secondary**: Statistical (per-cell stochastic thresholds), Temporal (progress-driven state)

## Conceptual Tags
#ascii-art #emergence #noise-to-signal #crystallization #loading-states #terminal-aesthetics #anticipation

## Technical Tags
#vanilla-js #dom-spans #pre-element #threshold-fields #raf-throttling #monospace

## Stack
- Vanilla JavaScript, no canvas — DOM `<span>` cells inside `<pre>` elements
- JetBrains Mono (Google Fonts)
- CSS custom properties from the Computational Minimalism style-seed
- requestAnimationFrame with 12fps grid throttle

## Notes
- the per-cell threshold trick gives organic emergence from one global progress value — no per-cell state machines needed
- the face template's hole-edge pass (spaces adjacent to fill become `█`) is what makes eyes/mouth read as features instead of gaps
- deliberate 12fps stutter on the grids against a smooth bar — "the aesthetic of watching something think"
- continues the ASCII grid thread from day 53, swapping free-running modes for progress-driven resolution
