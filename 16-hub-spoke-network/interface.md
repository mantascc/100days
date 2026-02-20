# Day 16: Hub-Spoke Force Network

## Idea
Force-directed graph with designated hub nodes, shared vs exclusive agent connections, and draggable hub repositioning

## Description
This project visualizes a hierarchical network structure where a fixed number of hub nodes serve as connection points for regular agents. Agents are divided into two categories: shared agents that connect to all hubs, and exclusive agents that connect to exactly one hub. The system uses D3's force simulation for physics-based layout with repulsion, attraction, and collision forces. Users can drag hub nodes to reposition them, causing the network to dynamically reorganize. Press 'R' or the mobile refresh button to regenerate the entire graph with new random topology.

The implementation includes comprehensive graph validation tests using console assertions to ensure correct topology: no hub-to-hub connections, shared agents connect to all hubs, exclusive agents connect to exactly one hub, no self-loops or duplicate edges, and full graph connectivity via depth-first search. The graph generator uses careful bucket distribution to evenly assign exclusive agents across hubs. Mobile devices get a centered refresh button instead of keyboard hints.

## Data Concepts
- **Primary**: Network (graph topology, hub-spoke architecture, hierarchical connectivity)
- **Secondary**: Spatial (force-directed layout, collision physics)

## Conceptual Tags
#force-directed-graph #hub-spoke #network-topology #d3-force #hierarchical-networks #graph-validation #interactive-layout #physics-simulation

## Technical Tags
#d3js #canvas #force-simulation #graph-algorithms #drag-interaction #dfs-connectivity #mobile-responsive

## Stack
- HTML5 Canvas
- D3-Force (v3) from CDN
- Vanilla JavaScript (ES6 modules)
- Pointer Events API
- Touch Events API

## Mechanics
- **Graph Generation**: 150 agents, 4 fixed hubs; 30% of non-hub agents designated "shared" (connect to all hubs), remaining 70% distributed evenly across hubs as "exclusive" connections
- **Edge Creation**: Hub-to-agent connections established first; then 0-2 extra non-hub-to-non-hub links per node added randomly with duplicate/self-loop prevention
- **Force Simulation**: D3 forces - charge (-30 repulsion), center (viewport center), link (distance 120, strength 0.6), collide (radius 2)
- **Hub Dragging**: Pointer/touch events detect nearest hub within 15px radius; dragging fixes hub position (fx, fy); release unfixes and allows natural movement
- **Visual Encoding**: Hubs rendered as 3x3 px squares with 8px radius semi-transparent halo (alpha 0.15); regular agents 2x2 px; edges 1px dark grey
- **Validation Tests**: Console assertions check topology constraints, count verification, and full graph connectivity using DFS

## Parameters
- `N: 150` - Total agent count
- `HUB_COUNT: 4` - Number of hub nodes
- `SHARED_RATIO: 0.3` - Fraction of non-hubs that connect to all hubs
- `EXTRA_MIN: 0` / `EXTRA_MAX: 2` - Range of extra non-hub edges per node
- `EDGE_COLOR: #2a2a2a` - Edge color (dark grey)
- `NODE_COLOR: #fff` - Node color (white)
- `NODE_SIZE: 2` - Regular agent size in pixels
- `DRAG_RADIUS2: 225` - Hub detection radius squared (15²)
- Force parameters: charge -30, link distance 120, link strength 0.6, collide radius 2

## Notes
- Implements hub-spoke network topology commonly seen in infrastructure, airline routes, and organizational hierarchies
- The shared/exclusive agent split creates interesting visual structure - shared agents form dense center, exclusive agents form spoke clusters
- Comprehensive test suite demonstrates rigorous graph validation approach using console assertions - each constraint explicitly checked
- DFS connectivity test ensures no disconnected components exist - critical for network functionality
- Hub dragging with alphaTarget (0.35) reheats simulation for smooth reorganization without full restart
- Bucket distribution algorithm ensures exclusive agents divide evenly across hubs using modulo round-robin
- The 100,000 guard iteration prevents infinite loops during extra edge generation if targets can't be satisfied
- Edge deduplication uses sorted string keys (smaller,larger format) for O(1) Set lookup
- Mobile detection switches UI paradigm from keyboard hints to button, recognizing different interaction patterns
- Force distance of 120px creates spacious layout that prevents visual clutter even with 150 agents
- Hub halo visual (faint circle) helps identify draggable elements without requiring text labels
- The project demonstrates how constraint-based topology (connection rules) combines with physical simulation (force layout) for readable network visualization
