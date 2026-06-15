---
id: moves/toroidal-wrapping
type: move
title: Toroidal wrapping
state: active
charge: high
spawned: [02-vicsek-model, 03-chaos-agent, 04-random-walk, 05-fall, 07-apophenia, 11-brownian-tree, 14-dna-mutations, 24-rock-paper-scissors]
feeds: [veins/agents-and-particle-systems]
sources: []
date: 2026-06-14
tags: [agents, boundary, topology]
---

# What
Wrap-around boundaries as the default world for any agent field: an agent leaving the right edge re-enters on the left, the canvas becoming a torus. It removes edge artefacts and pooling, keeps density uniform, and lets a small population feel boundless. So habitual now it's applied without thinking — which is its own small risk, since a hard wall is sometimes the more interesting choice.

# Trace
- [02-vicsek-model](../../02-vicsek-model/) — flock never piles at an edge.
- [04-random-walk](../../04-random-walk/) — the walker can't escape the frame.
- [24-rock-paper-scissors](../../24-rock-paper-scissors/) — spirals continue across boundaries.
- [11-brownian-tree](../../11-brownian-tree/) — wandering particles seeded from all edges.

# Charge
A reflex. Reliable enough to be invisible, which is exactly when to interrogate it.

# Prompts
- A world where the wrap is *visible* — show the seam, make the torus legible.
- Asymmetric wrapping: horizontal torus, vertical wall.
- A wrap with a twist — Möbius topology, agents returning mirrored.
