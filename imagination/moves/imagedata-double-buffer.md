---
id: moves/imagedata-double-buffer
type: move
title: ImageData double buffer
state: active
charge: low
spawned: [18-cellular-automaton, 20-schelling-model, 52-reaction-diffusion]
feeds: [veins/cellular-automata-and-pattern-formation, veins/emergence-from-local-rules]
sources: []
date: 2026-06-14
tags: [simulation, buffer, cellular-automata, state]
---

# What
The correctness trick behind any grid simulation: keep state in a `Uint8Array`, read from buffer A while writing the next generation into buffer B, then swap. Without it, a cell update sees its neighbours' new values mid-pass and the simulation corrupts. It's unglamorous infrastructure, but it's the difference between a CA that works and one that subtly cheats — and it generalises to reaction-diffusion and Schelling alike.

# Trace
- [18-cellular-automaton](../../18-cellular-automaton/) — read-A/write-B per generation.
- [20-schelling-model](../../20-schelling-model/) — agents relocate against a frozen snapshot.
- [52-reaction-diffusion](../../52-reaction-diffusion/) — two chemical buffers ping-ponged.

# Charge
Quiet, foundational, finished. Not a thing to "explore" so much as to keep getting right — surfaces only when a new grid sim needs it.

# Prompts
- Deliberately *break* the double buffer and study the corruption as an aesthetic.
- A sim that reads from N past frames, not just one — temporal neighbourhoods.
- Pack richer per-cell state into the typed array — vectors, ages, histories.
