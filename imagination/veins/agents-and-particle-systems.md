---
id: veins/agents-and-particle-systems
type: vein
title: Agents and particle systems
state: active
charge: high
spawned: [02-vicsek-model, 03-chaos-agent, 04-random-walk, 05-fall, 07-apophenia, 08-graph-clusters, 09-planar-graph, 10-audio-reactive-agents, 11-brownian-tree, 14-dna-mutations, 20-schelling-model, 24-rock-paper-scissors, 34-particle-text-morph, 45-gravity-pills, 51-resonant-lattice, 74-particles]
feeds: [moves/toroidal-wrapping, moves/proximity-link-drawing]
sources: [sources/vicsek-flocking, sources/brownian-markov]
date: 2026-06-14
tags: [agents, particles, simulation, substrate]
---

# What
The workhorse substrate of the practice: a population of small things, each with a position and a velocity, nudged by jitter, neighbours, forces, or noise, and let loose in a wrapping field. Boids, walkers, pills, morphing letter-particles — the implementation is nearly muscle memory now. Almost every other vein gets *expressed* through this one, which is exactly why it's worth noticing as its own obsession rather than treating it as plumbing.

# Trace
- [03-chaos-agent](../../03-chaos-agent/) — the bare agent loop, jitter and wrap.
- [04-random-walk](../../04-random-walk/) — the simplest possible mover.
- [45-gravity-pills](../../45-gravity-pills/) — agents under a force law.
- [34-particle-text-morph](../../34-particle-text-morph/) — particles snap to letterforms.
- [74-particles](../../74-particles/) — the system as pure aesthetic object.
- [51-resonant-lattice](../../51-resonant-lattice/) — agents coupled into a vibrating mesh.

# Charge
Fully owned and slightly invisible — it's the air the work breathes. Worth occasionally building something that has *no* agents at all.

# Prompts
- One agent only, but given a rich interior life instead of a population.
- Agents that age, reproduce, and die — population dynamics as the picture.
- A particle system where the medium pushes back: viscosity, fatigue, terrain.
