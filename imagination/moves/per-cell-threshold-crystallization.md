---
id: moves/per-cell-threshold-crystallization
type: move
title: Per-cell threshold crystallization
state: active
charge: medium
spawned: [55-ascii-loading, 62-terminal-cli]
feeds: [veins/ascii-and-text-rendering]
sources: []
date: 2026-06-14
tags: [ascii, animation, threshold, reveal, crystallization]
---

# What
Resolve an image from noise by giving each cell its own reveal threshold and crossing them over time: chaos glyphs settle, cell by cell, into the final figure as a rising clock passes each cell's value. The craft is in *biasing* the thresholds — foreground cells get low thresholds, background gets high — so the figure crystallizes *out of* the noise rather than fading in uniformly. The note from day-62 names this ordering as "the single best detail." A flat `Uint8Array`/`Float32Array` cell buffer plus a `requestAnimationFrame` threshold loop is the whole machine.

# Trace
- [55-ascii-loading](../../55-ascii-loading/) — the crystallization study this technique originates from.
- [62-terminal-cli](../../62-terminal-cli/) — the ASCII cat resolving from noise, foreground cells settling before background.

# Charge
Medium and proven — it has now travelled from its origin sketch into a second piece, which is the signal it has become a real owned technique rather than a one-off effect.

# Prompts
- Crystallize *toward* one image then *away* into another — a continuous morph through noise.
- Drive the per-cell threshold from an external field (audio, pointer) so the reveal follows attention.
- The inverse: dissolve a figure back into noise with the same threshold ordering reversed.
