---
id: veins/emergence-from-local-rules
type: vein
title: Emergence from local rules
state: active
charge: high
spawned: [02-vicsek-model, 03-chaos-agent, 04-random-walk, 05-fall, 07-apophenia, 14-dna-mutations, 18-cellular-automaton, 20-schelling-model, 24-rock-paper-scissors, 40-cube-grid-rules, 51-resonant-lattice, 52-reaction-diffusion, 54-concept-graph]
feeds: [moves/imagedata-double-buffer, tensions/iteration-vs-original-rules]
sources: [sources/vicsek-flocking, sources/schelling-segregation, sources/kuramoto-fireflies, sources/turing-gray-scott]
date: 2026-06-14
tags: [emergence, agents, complexity, generative]
---

# What
The thesis the practice keeps re-proving: rich, lifelike global behaviour out of a handful of dumb local rules, with no blueprint and no leader. Vicsek alignment, Schelling preference, CA neighbourhoods, Gray-Scott chemistry, rock-paper-paper dominance — each one is a small interaction iterated until structure falls out of the system rather than being drawn into it. The maker isn't composing the image; they're tuning the conditions under which an image composes itself.

# Trace
- [02-vicsek-model](../../02-vicsek-model/) — alignment-only agents, flocking with no flock plan.
- [18-cellular-automaton](../../18-cellular-automaton/) — global pattern from a per-cell rule.
- [20-schelling-model](../../20-schelling-model/) — mild local preference, stark global segregation.
- [24-rock-paper-scissors](../../24-rock-paper-scissors/) — cyclic dominance breeds spirals.
- [52-reaction-diffusion](../../52-reaction-diffusion/) — Turing patterns from two diffusing chemicals.
- [40-cube-grid-rules](../../40-cube-grid-rules/) — a 3D rule engine, same idea lifted off the plane.

# Charge
Still the gravitational centre of the whole sketchbook — almost everything orbits it. So strong it's worth distrusting; see the Break strategy.

# Prompts
- Emergence in a *legible* medium: glyphs as agents, a paragraph that self-sorts.
- A single rule small enough to tweet, behaviour rich enough to watch for a minute.
- Cross two rule systems in one field and let them fight for the substrate.
