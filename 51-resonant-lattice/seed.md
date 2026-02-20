# Day 51: Resonant Lattice

---

## Concept

Based on the trajectory of days 40-50 (grids, physics, data visualization), Day 51 explores **wave propagation in a discrete medium**.

**"Resonant Lattice"** is an interactive grid where each node is a mass-spring damper system connected to its neighbors. The visualization focuses on the transmission of energy across a "quiet" surface.

- **Interaction**: Mouse movement adds kinetic energy to local nodes.
- **Physics**: Verlet integration for stability. Nodes pull neighbors.
- **Visuals**: Nodes are normally dim/invisible. They light up based on velocity/displacement.
- **Metaphor**: A digital fabric that ripples with thought/input.

---

## Aesthetic: Computational Minimalism

Following the `style-seed.md` principles:

### 1. Palette
- **Background**: `Ground Void (#0a0a0a)` - deep, infinite.
- **Grid**: `Border Subtle (#1a1a1a)` - barely visible structure.
- **Nodes**: `Text Ghost (#333333)` -> `Text Primary (#ffffff)` based on energy.
- **Accent**: `Cyan (#00ffaa)` for high-energy peaks.

### 2. Motion
- **No Easing**: All movement is driven by spring forces and damping.
- **Damping**: High. The system returns to rest quickly ("Quiet systems").

### 3. Typography
- **Font**: `JetBrains Mono` (or system monospace).
- **Labels**: Small, uppercase, tracking-wide. Display simulation metrics (Energy, Damping, Nodes).

---

## Implementation Plan

1. **Setup**: Canvas-based renderer for performance (1000+ nodes).
2. **Grid Logic**: 2D array of `Node` objects {x, y, vx, vy, mass}.
3. **Physics Loop**:
   - Accumulate forces (Hooke's Law from 4 neighbors).
   - Apply Damping.
   - Update Positions (Verlet).
4. **Render Loop**:
   - Draw connections (optional/faint).
   - Draw nodes as pixels/rects.
   - Color mapping: `lerp(Ghost, Accent, velocity)`.
