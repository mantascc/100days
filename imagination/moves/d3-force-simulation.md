---
id: moves/d3-force-simulation
type: move
title: D3 force simulation
state: active
charge: medium
spawned: [16-hub-spoke-network, 17-audio-reactive-network, 19-coworker-network, 22-directed-network]
feeds: [veins/networks-and-graphs]
sources: [sources/graph-theory-algorithms]
date: 2026-06-14
tags: [d3, force, graph, layout]
---

# What
D3's force layout as the go-to graph engine: charge for repulsion, link for structure, collide for non-overlap, with `alphaTarget` reheating the simulation on drag so the layout settles, then springs back to life under the cursor. It's the one place the practice leans on a real library rather than hand-rolling — and the reheat-on-interaction trick is what makes these graphs feel alive rather than static diagrams.

# Trace
- [16-hub-spoke-network](../../16-hub-spoke-network/) — charge tuned to expose centrality.
- [19-coworker-network](../../19-coworker-network/) — real data settling into clusters.
- [22-directed-network](../../22-directed-network/) — forces plus arrowed flow.
- [17-audio-reactive-network](../../17-audio-reactive-network/) — sound as the reheat source.

# Charge
Dependable and a bit borrowed — it's the least "from scratch" move in the kit, which both speeds the work and makes the results feel less owned.

# Prompts
- Replace one D3 force with a hand-written one and feel the difference.
- A force layout where the *forces themselves* are the visual, not the nodes.
- Reheat driven by something ambient — time of day, scroll, microphone.
