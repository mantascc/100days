# Day 51: Resonant Lattice

> "The aesthetic of watching something think."

**Resonant Lattice** is an interactive physics simulation that visualizes energy propagation across a discrete medium. It models a fabric-like grid where each node is a mass-spring damper system connected to its neighbors.

[Live Demo](index.html)

---

## Concept

This project explores **Computational Minimalism**:
*   **Quiet Systems**: The grid is invisible until disturbed.
*   **Physics over Easing**: Movement is driven by Hooke's Law (springs) and Verlet integration, not pre-canned animations.
*   **Data as Material**: The visualization directly represents the kinetic energy of the simulation.

## How it Works

The simulation runs in a loop on an HTML5 Canvas:

1.  **Grid System**: The screen is divided into a lattice of `Node` objects.
2.  **Spring Physics**: Each node is connected to its right and bottom neighbors. When a node moves, it pulls its neighbors, creating a chain reaction (ripples).
3.  **Interaction**: 
    - **Mouse**: Moving the cursor pushes nearby nodes (`Radius 40px`) gently.
    - **Touch**: Touching and dragging creates the same ripple effect.
4.  **Damping**: Friction is applied every frame (`velocity *= 0.96`) to ensure the waves eventually settle back to a "quiet" state.
5.  **Rendering**: Nodes are colored based on their energy (Speed + Displacement). High energy = Cyan, Low energy = Dark Grey.

## Tech Stack

*   **Vanilla JavaScript**: No libraries, just raw math.
*   **HTML5 Canvas**: For high-performance rendering of 1000+ nodes.
*   **CSS Variables**: For consistent design tokens (`--ground-void`, `--accent`).

---

*Part of the 100 Days of Code challenge.*
