# sketch-moog-phase-grid

## idea
Remix of Day 68 Moog Phase — a 4×2 grid of seven audio-reactive vignettes, all reading the same analyser, each drawing shapes a different way.

## tags
audio, generative, grid, brutalist, primitives

## stack
vanilla · Web Audio (getUserMedia mic + two sample toggles) · canvas

## motion
Seven cells share one analyser fed by one of three sources (0714-1, 0714-2, mic): phase Lissajous, oscilloscope, pulsing ring, rotated wave, concentric bands, crosshair, orbit scatter. Fade cells (phase, diag, orbit) leave trailing traces; the rest redraw cleanly. Idle: subtle rotating traces on the fade cells, static grid marks on the rest. Layout reflows on portrait viewports — 4×2 landscape becomes 2×4 portrait, controls wrap onto two rows.
