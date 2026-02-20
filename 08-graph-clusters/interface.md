# Day 8: Graph Clusters

## Idea
Multiple wandering graph clusters with exact or minimum degree constraints and soft-body repulsion

## Description
This project visualizes multiple distinct clusters of agents, each internally connected as a graph network. Agents wander randomly within bounded space while maintaining flexible spring-based connections to their cluster neighbors. The system enforces graph-theoretic degree constraints - either exact k-regular graphs where every node has exactly k connections, or minimum-degree graphs where nodes have at least a specified number of connections. Clusters repel each other as soft discs, preventing overlap while allowing organic movement.

The implementation includes sophisticated graph construction algorithms using Havel-Hakimi style techniques for exact-regular graphs with random tie-breaking, and greedy top-up methods for minimum-degree graphs. Edges visualize tension through opacity variations, becoming more prominent as they stretch beyond ideal length. The simulation combines random walk behavior with spring-based cohesion and inter-cluster repulsion forces.

## Data Concepts
- **Primary**: Network (graph theory, degree constraints, connectivity)
- **Secondary**: Clustering (spatial grouping, soft-body repulsion), Spatial (bounded wandering, position-based forces)

## Conceptual Tags
#graph-theory #k-regular-graphs #degree-constraints #havel-hakimi #network-topology #clustering #soft-bodies #graph-construction #discrete-mathematics

## Technical Tags
#canvas #spring-physics #particle-systems #graph-algorithms #computational-geometry #collision-avoidance

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- CSS Grid Layout

## Mechanics
- **Graph Construction**: Two modes - 'exact' uses Havel-Hakimi algorithm with up to 50 randomized attempts to construct k-regular graphs; 'min' uses greedy degree-balancing with ring-seeded baseline connectivity
- **Agent Movement**: Random walk with turn jitter (0.2 radians) plus boundary steering that redirects toward canvas center when approaching edges
- **Intra-Cluster Springs**: Hooke's law forces activate when edge length exceeds linkMax (50px), pulling connected agents together with spring constant linkK (0.2)
- **Inter-Cluster Repulsion**: Cluster centers computed as centroid of all agents; when cluster bounding circles overlap, soft-body repulsion pushes all agents in opposite directions
- **Edge Visualization**: Opacity increases with tension, ranging from 0.15 to 0.65 based on current vs maximum link distance

## Parameters
- `gridStep: 12` - Visual grid spacing in pixels
- `speed: 0.5` - Base agent velocity per frame
- `turnJitter: 0.2` - Random heading variation amplitude
- `steerBack: 0.5` - Boundary avoidance steering strength
- `margin: 8` - Edge proximity threshold for boundary steering
- `dot: 2` - Agent visual size (2x2 pixels)
- `linkMax: 50` - Target edge rest length in pixels
- `linkK: 0.2` - Spring force coefficient
- `clusterSize: 20` - Number of agents per cluster (minimum 4)
- `clusterCount: 5` - Number of distinct clusters (1-10)
- `clusterRadius: 40` - Soft-body collision radius for cluster repulsion
- `clusterRepelK: 0.25` - Inter-cluster repulsion force coefficient
- `degreeMode: 'exact'` - Graph construction mode ('exact' for k-regular, 'min' for minimum degree)
- `degreeTarget: 5` - Target degree for exact mode (must satisfy n*k even for feasibility)
- `connectRatio: 0.5` - Connection density for minimum mode (fraction of n-1)
- `minDegree: 1` - Minimum degree guarantee for 'min' mode

## Notes
- Implements formal graph theory algorithms typically found in theoretical computer science - Havel-Hakimi construction for realizing degree sequences
- The exact k-regular mode enforces strict parity constraint: n*k must be even for a simple graph to exist with all nodes having exactly k edges
- Graph rebuilding triggers automatically when topology parameters change at runtime, with fallback from exact to min mode if construction fails
- Sanity checks validate degree constraints and detect self-loops/duplicate edges in console
- Seed positions use Poisson disc-like rejection sampling to prevent initial cluster overlap, with grid fallback after 200 attempts
- Press 'R' to regenerate cluster positions while preserving graph topology
- Visual feedback through edge opacity creates tension awareness - stretched edges become more visible
- The combination of random walk and spring forces produces organic, breathing cluster movement while maintaining graph connectivity
- Demonstrates how discrete combinatorial structures (graphs) can drive continuous spatial dynamics
