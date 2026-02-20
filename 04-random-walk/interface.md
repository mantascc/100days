# Day 4: Random Walk

## Idea
Stochastic patterns emerge from purely random individual motion

## Description
400 agents perform independent random walks on a discrete lattice, each step choosing a random direction (up/down/left/right) with equal probability. Agents leave fading trails that visualize their history. Over time, the collective pattern reveals the statistical nature of random walks: agents tend to diffuse from their starting points, and density patterns emerge from pure randomness. No rules, no attraction, no coordination—just probability in action.

## Data Concepts
- **Primary**: Statistical (stochastic process, random walk)
- **Secondary**: Temporal (trails show motion history), Spatial (diffusion patterns)

## Conceptual Tags
#random-walk #stochastic #brownian-motion #diffusion #statistical-mechanics #probability #memoryless-process #markov-chain

## Technical Tags
#canvas #discrete-lattice #fixed-timestep #trail-rendering #toroidal-topology #particle-system

## Stack
- HTML5 Canvas
- Vanilla JS with RequestAnimationFrame
- Fixed-timestep simulation (70ms intervals)
- Time-based trail fading

## Mechanics
- **Grid**: 2px lattice (discrete positions)
- **Step**: Each agent randomly picks 1 of 4 cardinal directions
- **Probability**: Uniform distribution (25% each direction)
- **Boundary**: Toroidal wrapping (agents reappear on opposite side)
- **Trail lifetime**: 10 seconds (configurable via ?life=N URL parameter)
- **Agents**: 400 simultaneous walkers

## Parameters
- 400 agents
- 70ms per step
- 2×2px agent size
- 10px grid for visual reference

## Notes
- Classic model from statistical physics and probability theory
- Despite zero coordination, collective patterns emerge: density gradients, diffusion waves
- Demonstrates Brownian motion / Wiener process on a lattice
- Trail opacity fades linearly with age
- Can be tuned for denser/sparser patterns by changing agent count
- URL parameter `?life=5` adjusts trail lifetime for different visual effects
- Memoryless (Markov property): next position depends only on current position, not history
