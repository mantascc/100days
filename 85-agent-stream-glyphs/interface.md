# 85 · agent-stream glyphs

## idea
A library of twelve agent-streaming patterns rendered as hash-seeded animated thumbnails. Each glyph runs the pattern's own timing recipe — jitter, cadence, sweep, pulse — so the typology is legible by silhouette.

## patterns
Twelve from [../daily-sketch/agent-patterns.md](../daily-sketch/agent-patterns.md), across six categories:

| # | Pattern | Category | Signature |
|---|---|---|---|
| 1  | token typewriter | text | jittered ticks |
| 3  | sentence pulse | text | slow pulse |
| 20 | file diff stream | files | accumulating ± rows |
| 30 | spinner | progress | rotating arc |
| 31 | progress bar | progress | left→right sweep |
| 32 | step indicator | progress | dot-by-dot fill |
| 33 | breathing ellipsis | progress | heartbeat |
| 42 | parallel agent fleet | multi-agent | shimmering grid |
| 46 | image resolve | multimodal | noise → reveal |
| 47 | audio waveform | multimodal | density envelope |
| 58 | memory write | state | discrete pulse |
| 63 | shimmer load | progress | traveling wave |

## interactions
- **Filter pills** — narrow by category
- **Click any glyph** — featured overlay with name, description, recipe, and a 280×280 version
- **Esc / click backdrop** — close

## stack
vanilla · IBM Plex Mono · canvas · single shared rAF · seeded mulberry32

## motion
Twelve canvases on one rAF loop. Each glyph hashes `${num}-${name}` to a seed and runs its own timing recipe forever. Hover scales the tile; click opens an enlarged feature view fed by a fresh per-feature seed.

## imagination
- seeds/computed-not-curated-thumbnails (dormant — revived)
- veins/design-system-and-reference-sheets
- /spark 2026-06-16 — Revive strategy
- drafted in [../daily-sketch/sketch-agent-stream-glyphs/](../daily-sketch/sketch-agent-stream-glyphs/)
