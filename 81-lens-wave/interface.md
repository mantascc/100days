# Day 81: Lens Wave

## Idea
Text rendered as a deformable material — warped, color-split, and lit from within. A WebGL fragment shader applies layered sine displacement, non-uniform lens scaling, chromatic aberration, and soft bloom to a Canvas 2D text texture. The result doubles as a product mockup tool: snap a frame, composite it over a garment, export to PNG.

## Description
The sketch renders user-editable text as a white-on-black Canvas 2D texture, uploads it to a WebGL sampler, and runs a fragment shader that makes the text breathe and fracture. A double-pass warp function (six horizontal + five vertical sine terms, called twice at offset time phases) produces non-repeating, fluid displacement. Before warp, a non-uniform scale (driven by slow sines over a zoomed UV space) creates the lens character: some regions compress while others stretch. Chromatic aberration splits the R, G, B channels horizontally — the fringe reads as a consequence of optics, not decoration. A three-ring additive bloom tinted warm-white to blue-cyan gives the text internal luminosity against the void.

The sketch retains a snap/export workflow: Snap captures a still frame from the GL canvas and composites it onto a sweater mockup via `mix-blend-mode: screen`. The Export button renders the composite at full resolution and downloads it as PNG. The text input is live — typing updates the texture in real time with a 120ms debounce.

## Data Concepts
- **Primary**: Visual (text as deformable material, optics simulation, glow)
- **Secondary**: Interaction (live text input, snap/export pipeline)

## Conceptual Tags
#text-material #lens-distortion #chromatic-aberration #bloom #warp #shader #product-mockup #generative-typography

## Technical Tags
#webgl #glsl-es-1.0 #fragment-shader #canvas2d #texture-upload #additive-blend #preserveDrawingBuffer #toDataURL

## Stack
- WebGL 1.0 (GLSL ES 1.0)
- Canvas 2D (text texture generation)
- Vanilla JavaScript
- IBM Plex Mono (Clear Channel typeface)
- Inline CSS (no build, no dependencies)

## Mechanics

### Text texture
Canvas 2D renders the active text in IBM Plex Mono 700 at auto-scaled size (fills 82% of canvas width, capped at 45% of canvas height). Black fill, white text, center-aligned. The canvas is uploaded to a WebGL TEXTURE_2D with LINEAR filtering and CLAMP_TO_EDGE wrapping. Re-uploaded on every text change.

### Warp function
Called twice per fragment: `warp(warp(scaled, t), t * 0.62 + 3.7)`. Each call computes a UV displacement from 11 sine terms — six driving horizontal offset (dx), five driving vertical (dy) — at varying frequencies (4.5–21.0 cycles) and speed multipliers (0.55–2.50). Amplitude per term is `AMP × weight` where weights sum to ~1.5 per axis.

The double-pass is the key: the second call uses a phase-shifted time (`t × 0.62 + 3.7`), so it modulates the already-warped coordinates at a different rhythm. This prevents periodicity that a single-pass warp reveals over time.

### Lens scaling
Before warping, UV is re-parameterized through a non-uniform scale:

```
sx = clamp(1 - sin(zUV.x × 7 + t × 1.10) × 0.38 - sin(zUV.x × 2.8 - t × 0.65) × 0.18, 0.15, 1.18)
sy = clamp(1 - sin(zUV.x × 4.5 + t × 0.85) × 0.28 - sin(zUV.y × 3.0 - t × 0.70) × 0.14
         - sin((zUV.x + zUV.y) × 3.5 + t × 1.30) × 0.10, 0.15, 2.00)
```

`zUV = (uv - 0.5) × 1.25 + 0.5` zooms the UV slightly before computing scale, so the modulation covers the full frame including edges. Clamps prevent inversion. The result: the warp field is not uniform — the lens compresses and expands different regions at different rates, giving the organic "thick glass" character.

### Chromatic aberration
Three separate texture samples offset along the X axis:
- R: `d + vec2(cax, 0.0)` — shifted right
- G: `d` — center
- B: `d - vec2(cax, 0.0)` — shifted left

`cax = u_px.x × CA` (CA = 4.5). Because `u_px.x = 1/W`, the offset scales inversely with resolution — correct behavior for a physical lens aberration.

### Bloom
A single-channel tap-blur on the `.r` sample (grayscale luminance of the already-warped position):

```
bloom = Σ (±rx4, ±ry4) × 0.072
      + Σ (±rx9, ±ry9) × 0.038
      + Σ (±rx16, ±ry16) × 0.018
```

8 taps per ring, 3 rings = 24 taps. Tinted `vec3(0.18, 0.50, 1.00)` — the blue-cyan matches the sketch's spectral accent (`#00b4ff`). Added to the RGB output with weight 1.2. Blending is `SRC_ALPHA, ONE` (additive), so bloom accumulates without occluding the base.

### Snap / export pipeline
1. **Snap**: `canvas.toDataURL('image/png')` (requires `preserveDrawingBuffer: true` at context creation) → set as `overlay.src` → fade in via `.visible` class.
2. **Export**: create offscreen canvas at sweater's natural dimensions; draw sweater image; if snap exists, draw overlay with `globalCompositeOperation = 'screen'` at hardcoded position (centered, top=310px); trigger download.

## Parameters

| Name         | Value   | Role                                          |
|--------------|---------|-----------------------------------------------|
| `AMP`        | 0.022   | Per-term warp amplitude                       |
| `CA`         | 4.5     | Chromatic aberration spread (px at full width)|
| `SPEED`      | 0.00052 | Time scale (ms → shader time)                |
| `FILL_RATIO` | 0.82    | Text target width as fraction of canvas width |
| `TILE_H_CSS` | 320     | Canvas height in CSS pixels                   |
| `DPR`        | device  | Pixel ratio for retina rendering              |

## Visual Language
- Ground: `#0a0a0a` body, `#000` canvas — full void
- Type: IBM Plex Mono 700 — monospace, maximum weight
- Spectral accent: `#00b4ff` — matches the bloom tint `vec3(0.18, 0.50, 1.00)`
- Snap button: accent fill, black label — the one affordance that matters
- Controls island: dark glass (`rgba(255,255,255,0.06)`, `blur(16px)`, `rgba(255,255,255,0.09)` border) — present but not competing with the canvas
- No rounded corners beyond the island pill and card 4px radius

## Notes
- `preserveDrawingBuffer: true` has a performance cost on some GPUs (disables swap-chain optimization). Necessary here because `toDataURL` must read from the front buffer after the frame has been drawn. The alternative — drawing to an FBO and reading from that — would be a significant refactor for no visible difference.
- The GLSL uses `highp float` precision. On mobile GPU drivers with degraded `mediump` precision, the warp would visibly quantize at fine-detail regions.
- IBM Plex Mono's letterforms are narrower than Inter's at equivalent size, so `FILL_RATIO = 0.82` may render slightly smaller text than the original Inter version for short strings.
- The export overlay position (`top: 310px`, `width: 288px`, `height: 102px`) is hardcoded to the specific sweater asset's chest print zone. A parameterized version would accept a JSON descriptor.

## Possible Extensions
- Expose `AMP`, `CA`, `SPEED` as range sliders in the control island — the warp is sensitive enough that even small AMP changes read dramatically
- Multi-text cycling: fade between textures on a timer, morph the warp between states
- Variable bloom tint: map the `vec3` accent to a CSS custom property, allow theme switching
- Freeze-frame grid: capture N frames across one full period, display as a variation grid (chapter pattern)
- Parameterize overlay coordinates: accept a JSON descriptor for product asset + print zone, making the snap workflow portable across different garments or product types
- WebM export: accumulate frames in a `MediaRecorder` stream for a short loop
