---
id: moves/perlin-fbm-displacement
type: move
title: Perlin / fBm displacement
state: active
charge: medium
spawned: [12-wind-field, 13-image-flow-field, 28-liquid-glass]
feeds: [veins/stochastic-and-noise]
sources: [sources/perlin-noise]
date: 2026-06-14
tags: [noise, perlin, fbm, displacement]
---

# What
A hand-implemented Perlin + fractional-Brownian-motion field used to displace a grid, steer a flow, or warp a surface — with `feTurbulence` as the declarative SVG cousin when the displacement can live in the filter graph. Owning the noise function rather than calling a library means the maker can reach inside it: bias the gradients, tune the octaves, sample it as a vector field. It's the smooth counterpart to the practice's rougher stochastic moves.

# Trace
- [12-wind-field](../../12-wind-field/) — fBm as an invisible steering breeze.
- [13-image-flow-field](../../13-image-flow-field/) — noise advecting an image's pixels.
- [28-liquid-glass](../../28-liquid-glass/) — feTurbulence as a glassy distortion.

# Charge
Solid and reusable, slightly taken for granted. The leap from "noise that moves things" to "noise as the subject" is unmade.

# Prompts
- Expose the field itself — render the vectors, make the wind visible.
- Layer two fBm fields at different scales and let the beat frequency emerge.
- Drive the noise's octaves by audio so detail blooms with volume.
