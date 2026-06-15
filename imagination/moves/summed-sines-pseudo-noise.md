---
id: moves/summed-sines-pseudo-noise
type: move
title: Summed sines pseudo-noise
state: active
charge: medium
spawned: [74-particles, 79-idle-states, 78-ascii-sheets-docs, 81-lens-wave]
feeds: [veins/stochastic-and-noise]
sources: []
date: 2026-06-14
tags: [noise, sine, signal, lightweight]
---

# What
Noise without a noise library: sum a chord of sines at mutually-prime frequencies and the result never quite repeats, giving smooth, organic, deterministic variation for almost no code. It's the maker's favourite trick for ambient motion and field generation when pulling in Perlin would be overkill — a few `Math.sin` calls standing in for a whole noise module. Deterministic, seekable, and trivially cheap.

# Trace
- [78-ascii-sheets-docs](../../78-ascii-sheets-docs/) — sine interference as the ASCII field.
- [79-idle-states](../../79-idle-states/) — summed sines as restful drift.
- [74-particles](../../74-particles/) — pseudo-noise steering the swarm.
- [81-lens-wave](../../81-lens-wave/) — overlapping waves as a lens field.

# Charge
Charming and frequently reached for — the "good enough noise" that keeps sketches lean. Ripe for being pushed somewhere more structural.

# Prompts
- Expose the chord: let the viewer add and detune the sines that make the field.
- Use the beat frequencies as a clock for an emergence system.
- Summed sines as a *typeface* deformer rather than a particle steerer.
