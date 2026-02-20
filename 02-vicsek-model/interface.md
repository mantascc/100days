# Day 2: Vicsek Model

## Idea
Collective flocking behavior emerges from simple local alignment rules

## Description
Implementation of the Vicsek model - a classic agent-based flocking simulation. Each agent (boid) continuously aligns its heading with nearby neighbors within a perception radius, with added noise. Global patterns (swarms, vortices, streams) emerge from purely local interactions without central coordination. Demonstrates self-organization in collective systems.

## Data Concepts
- **Primary**: Network (local neighbor interactions)
- **Secondary**: Statistical (noise as stochasticity), Emergence

## Conceptual Tags
#emergence #flocking #swarm-intelligence #collective-behavior #self-organization #agent-based-model #vicsek-model #local-to-global

## Technical Tags
#canvas #spatial-hashing #grid-optimization #particle-system #toroidal-boundary

## Stack
- HTML5 Canvas (2D context)
- Vanilla JS with RequestAnimationFrame
- Spatial hashing (grid cells) for O(n) neighbor lookup
- Delta time for frame-independent motion

## Parameters
- **Noise** (0-100): Angular randomness in alignment
- **Radius** (5-80px): Neighbor perception distance
- **Speed** (10-120): Agent velocity
- **Agents** (50-800): Population size

## Algorithm
1. Grid-based spatial hashing for efficient neighbor queries
2. Each agent samples neighbors within radius
3. Calculates average heading of neighbors
4. Adds noise to heading
5. Moves forward in new direction
6. Wraps at boundaries (toroidal space)

## Notes
- Classic model from statistical physics (Vicsek et al., 1995)
- Phase transition observable: low noise → order, high noise → disorder
- Spatial hashing makes it performant even with 800 agents
- Trail fade effect reveals flow patterns and vortex formation
- Isolated agents perform random walk
- Demonstrates how complexity emerges without blueprint or leader
