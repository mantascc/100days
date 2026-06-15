---
id: tensions/desktop-only-vs-responsive
type: tension
title: Desktop-only vs responsive
state: active
charge: low
spawned: [27-muse, 34-particle-text-morph, 35-flight-path-viz, 36-spinning-globe, 37-sentiment-analyzer, 83-video-index]
feeds: []
sources: []
date: 2026-06-14
tags: [responsive, interaction, platform]
---

# What
Rich desktop interaction keeps colliding with mobile parity. The most expressive sketches assume a cursor, hover, a wide canvas, real compute — and that assumption quietly excludes the phone. Each time the question surfaces, the answer has been "desktop-only, for now," which is fine for a sketchbook but accumulates as an unexamined default. The deeper question is whether some ideas are *intrinsically* desktop, or whether the maker just hasn't designed the touch translation yet.

# Trace
- [35-flight-path-viz](../../35-flight-path-viz/) — built for a single device, an iPad locked to landscape, the platform baked into the layout.
- [37-sentiment-analyzer](../../37-sentiment-analyzer/) — a React/Vite app leaning on WebGPU-class compute, implicitly a desktop-browser target.

# Charge
Low and recurring — a practical nag rather than a creative fire. Kept open as a reminder, not a priority. The recent app-shaped sketches (an iPad-locked tracker, a compute-heavy React analyzer) pick a single platform up front rather than negotiating across them.

# Prompts
- A sketch designed touch-first from the start, then ported *up* to desktop.
- An interaction that has no cursor analogue — built around tilt, or two thumbs.
- Make the responsive break the subject: a piece that reflows as performance.
