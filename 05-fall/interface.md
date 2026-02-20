# Day 5: Fall

## Idea
Biased random walk where gravity interrupts pure randomness

## Description
Similar to Day 4's random walk, but with a gravitational twist: every 4th step, all 400 agents are forced to move diagonally down-left (southwest) simultaneously. Between gravity events, agents perform standard random walks. The result is a drift pattern—agents still diffuse randomly, but with a persistent directional bias. Creates diagonal "fall lines" that emerge and fade as agents respond to the periodic force.

## Data Concepts
- **Primary**: Statistical (biased random walk, drift-diffusion)
- **Secondary**: Temporal (periodic forcing), Spatial (directional flow)

## Conceptual Tags
#biased-random-walk #drift-diffusion #gravity #periodic-forcing #stochastic-process #markov-chain #external-force

## Technical Tags
#canvas #discrete-lattice #fixed-timestep #periodic-event #trail-rendering #toroidal-topology

## Stack
- HTML5 Canvas
- Vanilla JS with RequestAnimationFrame
- Fixed-timestep simulation (70ms intervals)
- Time-based trail fading (5s default)

## Mechanics
- **Random walk**: 3 out of 4 steps are random (up/down/left/right, 25% each)
- **Forced step**: Every 4th step, all agents move down-left (x-=2, y+=2)
- **Net effect**: Drift in southwest direction + random diffusion
- **Grid**: 2px discrete lattice
- **Boundary**: Toroidal (wraps around)
- **Trail**: Fading breadcrumbs with linear opacity decay

## Physics Analogy
- **Pure random walk** = thermal motion (Brownian)
- **Biased random walk** = charged particle in electric field, or sediment settling in water
- **Periodic forcing** = pulsed gravity or external field

## Parameters
- 400 agents
- 70ms per step
- Force every 4th step (FORCE_EVERY = 4)
- 5-second trail lifetime (configurable via ?life=N)
- 2×2px agent size

## Notes
- Extension of Day 4, adds deterministic component to stochastic process
- Despite periodic forcing, individual paths remain unpredictable
- Collective pattern shows clear drift: agents accumulate in the direction of force
- Demonstrates superposition of random and deterministic motion
- Trail patterns reveal both the random diffusion and the directional bias
- Can adjust FORCE_EVERY to change drift strength (lower = more drift)
