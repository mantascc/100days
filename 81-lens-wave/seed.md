# Lens Wave — Seed

## Concept
Text as material. Not static, not animated — *deformed*.

The letters exist. The warp makes them breathe, buckle, fracture into
their component channels. You can read them, but they resist you slightly.

---

## Core mechanism

```
TEXT TEXTURE
  render text white-on-black → Canvas 2D → WebGL texture

WARP FUNCTION
  per-pixel UV displacement via layered sine waves
  six horizontal + five vertical terms, different frequencies + phases
  double-pass: warp(warp(uv, t), t * 0.62 + 3.7)
  — second pass at a different time offset = non-repeating motion

LENS SCALING
  before warp: non-uniform scale along x and y
  sx, sy driven by slow sines over zUV (zoomed UV)
  clamp keeps it from collapsing to zero or inverting
  — produces the "lens" character: some regions compress, others stretch

CHROMATIC ABERRATION
  sample R channel at d + cax offset
  sample G channel at d (center)
  sample B channel at d - cax offset
  — fringe increases with pixel size, so it scales naturally with resolution

BLOOM
  multi-tap box blur on the .r channel (grayscale)
  three rings: ±4px, ±9px, ±16px, weighted 0.072 / 0.038 / 0.018
  tinted vec3(0.18, 0.50, 1.00) — warm white core, blue-cyan halo
  additive blend (SRC_ALPHA, ONE) — glow accumulates, never occludes
```

---

## Parameters

| Name         | Value   | Effect                                      |
|--------------|---------|---------------------------------------------|
| `AMP`        | 0.022   | Warp amplitude — displacement per sine term |
| `CA`         | 4.5     | Chromatic aberration spread in pixels       |
| `SPEED`      | 0.00052 | Time scale — lower = slower drift           |
| `FILL_RATIO` | 0.82    | Text width as fraction of canvas width      |
| `TILE_H_CSS` | 320     | Canvas height in CSS pixels                 |

---

## Structure

```
INIT
  resize canvas → renderText() → upload GL texture → set u_px

FRAME LOOP
  clear → uniform1f(u_time, ts * SPEED) → drawArrays

INTERACTION
  textInput → debounce 120ms → renderText() → re-upload texture
  snapBtn   → canvas.toDataURL() → set overlay.src → fade in
  exportBtn → composite sweater + overlay → download PNG
```

---

## Snap workflow

The sketch doubles as a product mockup tool:
- Type any text → it renders warped in the canvas
- Snap captures a frame of the GL output
- The frozen frame composites over the sweater image via `mix-blend-mode: screen`
- Export renders the composite to a full-res PNG

The warp keeps running during snap — the still frame reads as a
moment captured from a living material.

---

## Extensions

- Expose AMP / CA / SPEED as sliders in the control island
- Multi-text: cycle through a list, morph between textures
- Color accent as a variable: map bloom tint to a theme token
- Video export: capture N frames → encode as WebM
- Different base: swap sweater for any product image (parameterize the overlay coords)
