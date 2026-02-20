# Day 3: Clusters and a Chaos Agent

## Idea
How a single disruptive agent affects collective clustering behavior

## Description
Boids-like clustering simulation with a twist: one random agent is "harmful" and injects extra noise into any cluster it joins. Agents naturally form cohesive groups through alignment, cohesion, and separation forces. When the chaos agent (red) joins a cluster of 6+ agents, the entire cluster experiences dramatically increased jitter, causing partial dissolution or turbulent motion. Demonstrates how individual disruption propagates through connected systems.

## Data Concepts
- **Primary**: Clustering (spatial grouping)
- **Secondary**: Network (connected components), Statistical (noise injection)

## Conceptual Tags
#clustering #boids #disruption #connected-components #collective-behavior #chaos-injection #network-effects #emergence

## Technical Tags
#canvas #particle-system #graph-traversal #spatial-queries #reynolds-boids #toroidal-space

## Stack
- HTML5 Canvas
- Vanilla JS
- Connected component detection (BFS/DFS)
- Reynolds boids steering behaviors

## Mechanics

### Clustering Forces
- **Alignment**: Match neighbors' velocity (0.5 gain)
- **Cohesion**: Move toward neighbor centroid (0.01 gain)
- **Separation**: Push away when too close (inverse distance²)
- **Base noise**: 0.2 random jitter

### Chaos Mechanism
1. Detect clusters via connected components (15px radius)
2. Find cluster containing harmful agent
3. If cluster size ≥ 6, multiply noise by 10× for all members
4. Increased jitter disrupts cohesion, causing instability

### Parameters
- 100 agents (99 normal, 1 harmful)
- 15px sense radius
- Toroidal wrapping
- Speed capped at 1.5px/frame

## Notes
- Click to reset and randomize harmful agent
- Grid backdrop (16px) provides spatial reference
- Harmful agent marked red for visibility
- Demonstrates network effects: local disruption → global impact
- Small clusters (<6) are immune to chaos
- Large clusters fragment when infected, then may re-coalesce
- Metaphor for contagion, misinformation spread, or system vulnerabilities
