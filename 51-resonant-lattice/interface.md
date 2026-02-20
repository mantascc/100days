# Day 51: Resonant Lattice

## Idea
Interactive spring-mass lattice showing energy propagation, resonance, and damping effects

## Description
This project simulates a 2D lattice of interconnected masses with spring forces, visualizing wave propagation and resonance patterns. UI displays real-time metrics: total system energy, damping coefficient (0.98), and node count. Users interact by clicking to inject energy, watching waves propagate through the lattice with realistic physics. The system demonstrates resonance, interference patterns, and energy dissipation through damping. Clean monospace UI provides quantitative feedback on simulation state.

## Data Concepts
- **Primary**: Spatial (lattice structure, spring connections, node positions)
- **Secondary**: Temporal (wave propagation, oscillation), Statistical (energy distribution, damping)

## Conceptual Tags
#spring-mass-system #wave-propagation #resonance #physics-simulation #lattice-dynamics #energy-dissipation #harmonic-motion

## Technical Tags
#canvas #physics-simulation #spring-forces #numerical-integration #real-time-metrics

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- CSS

## Notes
- Spring-mass lattices model materials, membranes, and wave media
- Energy metric tracks total kinetic + potential energy in system
- Damping (0.98) causes gradual energy loss, preventing infinite oscillation
- Resonance occurs when driving frequency matches natural frequency
- Interference patterns emerge from wave superposition
- The simulation demonstrates how local spring forces create global wave behavior
- Click interaction provides controlled energy injection for experimentation
