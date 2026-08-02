# sketch-idle-crt

## idea
The floating face from `sketch-idle`, run through the [crt-tube-treatment](../../imagination/moves/crt-tube-treatment.md) in the **graphite** variant. Fullscreen single tube, wireframe only — no fill, cool-white ring + face marks (closed ˘˘ eyes, soft mouth), heavy bloom, live grain, static scanlines, curved tube corners, deep vignette.

## tags
canvas, character, retro, crt, bloom, phosphor, ambient

## stack
vanilla · IBM Plex Mono · canvas 2d + Path2D · CSS

## motion
- Slow ~5.5s sine breath: subtle scale + ring/face brightness modulation.
- Sub-pixel floating drift on two axes (independent sines, ~0.6px range) so the subject never sits still.
- Bloom intensity follows the breath — the face pulses through the tube's diffusion.

## chrome dropped from the original
- No charge meter, no readout dl, no header/foot text, no corner ticks, no "do nothing" nudge, no pointer interaction. The face is the whole piece; the tube is the frame.
