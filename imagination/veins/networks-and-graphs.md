---
id: veins/networks-and-graphs
type: vein
title: Networks and graphs
state: active
charge: high
spawned: [02-vicsek-model, 03-chaos-agent, 07-apophenia, 08-graph-clusters, 09-planar-graph, 10-audio-reactive-agents, 11-brownian-tree, 16-hub-spoke-network, 17-audio-reactive-network, 19-coworker-network, 21-interaction-heatmap, 22-directed-network, 50-execution-trace-graph, 54-concept-graph, 80-network]
feeds: [moves/proximity-link-drawing, moves/d3-force-simulation]
sources: [sources/graph-theory-algorithms]
date: 2026-06-14
tags: [graph, network, structure, force]
---

# What
Nodes and edges as the default way to think about almost any system. Proximity meshes, MSTs, k-regular and planar generators, hub-and-spoke topologies, directed flows, force-laid concept maps — the graph keeps showing up as the structural motif under the surface, whether the data is agents, coworkers, audio, or a program's own execution trace. When the maker doesn't know how to draw a relationship, they draw an edge.

# Trace
- [09-planar-graph](../../09-planar-graph/) — generate, then guarantee no crossings.
- [16-hub-spoke-network](../../16-hub-spoke-network/) — centrality made visible.
- [22-directed-network](../../22-directed-network/) — arrows turn structure into flow.
- [19-coworker-network](../../19-coworker-network/) — real social data on a force layout.
- [50-execution-trace-graph](../../50-execution-trace-graph/) — the code watching itself run.
- [80-network](../../80-network/) — the proximity-mesh look, distilled.

# Charge
A near-permanent default. Productive, but also a comfort zone — half the corpus resolves to dots-and-lines.

# Prompts
- A graph whose *layout itself* is the content, not the nodes.
- An edge that carries time: links that fade, decay, or remember.
- Refuse the node entirely — a network rendered only as fields between things.
