---
id: moves/offscreen-canvas-downsample
type: move
title: Offscreen canvas downsample
state: active
charge: medium
spawned: [12-wind-field, 13-image-flow-field, 15-binary-camera-grid, 15b-binary-camera-grid-v2, 33-three-body-problem]
feeds: [veins/grids-as-compositional-frame]
sources: []
date: 2026-06-14
tags: [canvas, sampling, pixels, grid]
---

# What
Render or capture into a small offscreen canvas, read its pixels with `getImageData`, then map those values onto a coarser display grid. It's the bridge between continuous image sources — video, a rendered scene, an uploaded photo — and the practice's love of discrete cells. The downsample step is where the quantisation aesthetic lives: a smooth feed becomes a legible field of samples.

# Trace
- [15-binary-camera-grid](../../15-binary-camera-grid/) — webcam read down to a binary lattice.
- [13-image-flow-field](../../13-image-flow-field/) — image pixels sampled to steer flow.
- [12-wind-field](../../12-wind-field/) — text mask captured offscreen, sampled to a grid.
- [33-three-body-problem](../../33-three-body-problem/) — scene buffered before slit-scan read.

# Charge
A solid plumbing move — quietly enables the camera and image sketches. Rarely the point, but nothing works without it.

# Prompts
- Make the downsample *visible* — show both buffers, the smooth and the sampled.
- Recursive downsampling: a feed of itself, each pass coarser.
- Sample with a non-grid kernel — Voronoi cells reading the image.
