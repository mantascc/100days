# sketch-topology-library

## idea
A living library of reusable agent formations. The same six dots persist while
only their relationships change: council, maker–critic, pipeline, star, peer
network, and lens stack.

The sketch treats topology itself as a design material. Switching formations
changes information flow, authority, handoffs, and the behavior the system
tends to produce.

Core thesis:

**same dots + different topology → different system behavior**

The central Mintis stays constant while the formation changes around it.

## interaction
Choose a topology from the library rail. The dots re-form and animated pulses
show the active information paths. Click a dot to inspect which persistent
agency unit occupies that position.

The right panel describes:
- what the topology tends to produce
- its common failure mode
- where a human intervenes

## source ideas
Inspired by the min1 notebook:
- Agent Topology as a Medium
- Topology Library
- Dots Visualization / Daily Sketch
- Lens Dots
- Mintis — Persistent Intent Graph / Hub System

## tags
agents, topology, dots, distributed-intelligence, graph, library, interaction-design

## stack
vanilla · canvas · CSS · IBM Plex Mono

## motion
Edges stay understated. Small amber pulses carry information through the
formation so the primary visual event is not the graph itself but the changing
pattern of flow. The same named dots persist across every topology.

## question
What is the minimum visual grammar required for a person to understand that
the behavior of an intelligent system can come from its relationships rather
than its parts?


## topology data schema
The library is data-driven through `topologies.json`.

Each topology defines:
- `id` and display metadata
- `layout` — the spatial formation primitive
- `edges` — directed information-flow pairs by dot index
- `produces`
- `failure`
- `human` — the human intervention point

The persistent dot vocabulary is also declared in the same file.

Adding a formation should usually mean adding one JSON object. New rendering code
is only needed when a topology requires a genuinely new spatial layout primitive.
