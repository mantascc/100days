# 91-retro-primitives

## idea
Four primitive shapes (circle, square, triangle, ellipse) treated as if they were being read off an old CRT tube. One shared shell renders the whole treatment as a reusable *primitive retro-texture*; four sibling pages swap the palette + animation mode.

## variants
| page | palette | animation |
|---|---|---|
| `index.html` | phosphor — warm sun / green rings | breathe — sub-pixel drift + slow scale breath |
| `cryo.html` | cobalt core / pale-cyan rings | sweep — bright bar travels top→bottom every ~3.6s |
| `signal.html` | magenta core / cyan rings | glitch — short horizontal tears with cyan fringe |
| `graphite.html` | wireframe, no fill / white rings | spin — internal hoops rotate around each shape's axis |

## the treatment (crt-tube-treatment)
Every variant runs the same pipeline. The subject is drawn once to an offscreen buffer, then screen-composited back at 22px blur → 7px blur → the subject itself at 0.7px blur — nothing renders crisp, because old tubes can't focus that sharp. One subtle green-offset copy adds chromatic fringing. On top: a tiny two-bar green readout, a heavy radial vignette, live RGBA film grain regenerated every ~3 frames, and a faint top gloss.

Around the canvas: 28px rounded-corner tube shell with an inner radial bevel (`::before`) and static repeating-gradient scanlines (`::after`, `mix-blend-mode: multiply`).

Everything variant-specific — palette, fill mode, ring colors, animation, grain tint, gloss color — lives in a single `window.VARIANT` object per page. `engine.js` reads it and runs.

## layout
```
91-retro-primitives/
  index.html      phosphor variant + nav
  cryo.html       cryo variant
  signal.html     signal variant
  graphite.html   graphite variant
  style.css       shared shell / tube / nav
  engine.js       shared canvas pipeline (reads window.VARIANT)
  interface.md    this file
```

Each page is a 2×2 grid of 260×260 tube cells + a top mast with a nav that flips between variants.

## responsive
Below 620px, the grid collapses to one column and the mast stacks. Tile size becomes `min(84vw, 320px)`.

## stack
vanilla · canvas 2d + Path2D · CSS grid · IBM Plex Mono
