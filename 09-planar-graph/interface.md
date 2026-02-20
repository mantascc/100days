# Day 9: Planar Graph Network

## Idea
Wandering agents connected by a dynamically-computed planar graph structure with MST backbone and non-crossing extra edges

## Description
This project creates a visual network of 200 agents performing gentle random walks while maintaining a strictly planar graph topology - a graph where no edges cross each other. The system continuously rebuilds the network each frame by first constructing a Minimum Spanning Tree (MST) to ensure connectivity, then greedily adding extra edges that respect planarity constraints and degree limits. Agents drift with Brownian-like motion and bounce off boundaries, while the graph structure adapts in real-time to their changing positions.

The implementation enforces planarity through comprehensive segment-segment intersection tests using computational geometry techniques. The MST phase uses Kruskal's algorithm with Union-Find data structure, testing each candidate edge for crossings before inclusion. Additional edges are added to increase connectivity while respecting a maximum degree of 3 per node and ensuring no new crossings occur. Mouse interaction creates local repulsion, pushing agents away from the pointer.

## Data Concepts
- **Primary**: Network (graph connectivity, planarity, MST construction)
- **Secondary**: Spatial (geometric constraints, intersection testing), Statistical (random walk, Brownian motion)

## Conceptual Tags
#planar-graphs #minimum-spanning-tree #kruskal-algorithm #computational-geometry #graph-theory #intersection-testing #network-topology #dynamic-graphs

## Technical Tags
#canvas #union-find #line-intersection #real-time-computation #particle-systems #interactive

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- CSS Variables

## Mechanics
- **Agent Movement**: Gentle drift with velocity clamped to ±0.30 pixels per frame, plus random jitter (0.02) added each tick; velocity reflects on boundary collision
- **Mouse Repulsion**: Inverse square repulsion within 2000px² radius pushes agents away from pointer position with force proportional to distance
- **MST Construction**: Kruskal's algorithm with Union-Find (path compression and union-by-rank) builds spanning tree from shortest edges that don't cross existing edges
- **Extra Edge Addition**: Greedy phase adds up to 12 additional edges beyond MST, respecting degree cap (3) and planarity by testing all crossings
- **Planarity Testing**: Orientation-based segment intersection using cross-product sign tests with collinear point handling via on-segment checks
- **Edge Filtering**: Only considers edges between 8-80 pixels before sorting, reducing computational load

## Parameters
- `N: 200` - Number of agents in cluster
- `PT: 2` - Agent visual size in pixels (2x2 square)
- `GRID: 20` - Background grid spacing
- `MAX_DEG: 3` - Maximum degree (connections) per node
- `MAX_EXTRA: 12` - Maximum extra edges beyond MST
- `DRIFT: 0.30` - Maximum velocity per axis
- `JITTER: 0.02` - Random velocity noise amplitude
- `EDGE_MIN: 8` - Minimum edge length to consider
- `EDGE_MAX: 80` - Maximum edge length to consider

## Notes
- Implements classical computational geometry algorithms - orientation test, segment intersection, and on-segment collinearity check
- Union-Find structure uses path compression and union-by-rank optimizations for near-constant time operations
- The planar graph constraint creates organic, non-tangled visual networks that feel clean and readable despite high agent count
- Edge length filtering (8-80px range) provides crucial performance optimization by reducing candidate edge count from O(n²) to manageable subset
- Real-time graph recomputation every frame demonstrates feasibility of dynamic planarity maintenance for medium-scale networks (200 nodes)
- MST ensures global connectivity while extra edges add local redundancy and visual interest
- The separation of MST vs extra edges in rendering allows for visual distinction (both rendered in same color here but structurally separate)
- Agents initialized in rough ring pattern near center provides good starting distribution for graph formation
- Mouse interaction demonstrates how external forces affect network topology in real-time
- The degree cap prevents overly-connected nodes while the planarity constraint prevents visual clutter from crossing edges
