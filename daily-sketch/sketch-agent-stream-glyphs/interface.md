# sketch-agent-stream-glyphs

## idea
Each agent-streaming pattern earns a computed thumbnail: hash the pattern id to a seed, then run its actual timing recipe as a small animated glyph. The typology is legible by silhouette — bundles cluster, raw streams jitter, file-edits sweep.

## patterns
Eight timing-signature patterns from [agent-patterns.md](../agent-patterns.md):

| # | Pattern | Glyph signature |
|---|---|---|
| 1 | Token-by-token typewriter | jittered ticks |
| 3 | Sentence-by-sentence | slow pulse |
| 30 | Spinner with phase label | rotating arc |
| 31 | Determinate progress bar | sweep |
| 33 | Breathing ellipsis | heartbeat |
| 46 | Image generation (blur → resolve) | reveal curve |
| 47 | Audio waveform building | density envelope |
| 63 | Shimmer load | traveling wave |

## tags
generative, identity, reference-sheet, agents, streaming, procedural, glyphs

## stack
vanilla · IBM Plex Mono · canvas (single shared rAF)

## motion
Wall of small square glyphs, each animating its pattern in perpetuity. Hover lifts a card and the glyph scales up; the pattern's longform name fades in next to it. No two silhouettes match because no two timing recipes match.

## imagination
- seeds/computed-not-curated-thumbnails (dormant revival)
- veins/design-system-and-reference-sheets
- /spark 2026-06-16 — Revive strategy
