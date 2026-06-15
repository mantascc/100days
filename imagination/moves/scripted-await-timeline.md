---
id: moves/scripted-await-timeline
type: move
title: Scripted await timeline
state: active
charge: low
spawned: [61-hitl-patterns]
feeds: [veins/design-system-and-reference-sheets]
sources: []
date: 2026-06-14
tags: [animation, async, choreography, demo, scripted]
---

# What
Choreograph a deterministic demo as a straight-line sequence of `await pause(ms)` steps over `setTimeout` — a hand-written timeline rather than a simulation. Each beat (a message appears, a gate halts, a rollback fires) is a literal line of code, so the "play" reads like a script and replay re-runs the exact same choreography. It is honest theatre: it commits to nothing dynamic, which makes it perfect for *explaining* a system rather than running one. The cost is that replay never varies — no seed, no randomness.

# Trace
- [61-hitl-patterns](../../61-hitl-patterns/) — four oversight patterns each animated as a chained `await pause()` "play."

# Charge
Low — a single, narrow use as a reference-explainer device. But clearly reusable for any "let me walk you through what happens" demo, and the contrast with a *generative* variant (random confidence, random anomaly placement) is itself a live prompt.

# Prompts
- A seeded variant: the same choreography but with randomised beats, so repeat viewing differs.
- Let the viewer scrub the timeline — turn the linear script into a draggable playhead.
- Branch the script on a real choice (approve/reject) so the timeline forks under interaction.
