# Day 14: Synchronizing Fireflies

## Idea
Proximity-based phase synchronization where clustered agents pulse together and drift upward, isolated agents remain dim and sink

## Description
This project simulates collective synchronization inspired by firefly behavior. Agents wander through space, and when they find neighbors within sensing radius, they begin synchronizing their internal phase oscillators through local coupling. Synchronized clusters pulse in brightness collectively and drift upward with gentle motion, while isolated agents remain dim blue and sink downward with chaotic tumbling. The system demonstrates emergent order - clusters form, synchronize, and disperse dynamically without central coordination.

The implementation uses the Kuramoto model's phase-averaging approach where each agent adjusts its phase toward the mean phase of nearby neighbors. Synced agents also experience weak mutual attraction, helping maintain cluster cohesion. Visual feedback distinguishes synchronized (pulsing white/grey) from unsynchronized (static dim blue) agents. Mobile devices use reduced agent counts (500 vs 1000) with larger visual size for touch-friendly viewing.

## Data Concepts
- **Primary**: Temporal (phase oscillators, synchronization dynamics, periodic pulsing)
- **Secondary**: Clustering (proximity detection, emergent grouping), Spatial (drift forces, velocity-based motion)

## Conceptual Tags
#synchronization #kuramoto-model #firefly-algorithm #emergent-behavior #phase-coupling #collective-dynamics #swarm-intelligence #self-organization

## Technical Tags
#canvas #particle-system #oscillators #proximity-detection #phase-synchronization #responsive-design

## Stack
- HTML5 Canvas
- Vanilla JavaScript

## Mechanics
- **Phase Synchronization**: Kuramoto-style coupling - each agent with neighbors computes average neighbor phase and adjusts toward it at syncSpeed (0.1) rate
- **Neighbor Detection**: O(n²) distance check within clusterRadius (15px desktop / 25px mobile); agents with any neighbors count as "synced"
- **Mutual Attraction**: Synced agents experience inverse-distance attraction force (0.01/dist) toward neighbors, helping maintain clusters
- **Differential Drift**: Synced agents drift upward (-0.05 vy) with small noise (±0.5), unsynced agents sink strongly (+10 vy) with noise
- **Jitter**: Synced agents get low jitter (0.1 velocity perturbation), unsynced get high jitter (1.0) creating chaotic tumbling
- **Visual Encoding**: Synced agents pulse brightness via sin(phase) from minBrightness (0.15) to 1.0; unsynced agents static at 0.8 brightness with blue tint
- **Edge Wrapping**: Positions wrap toroidally at canvas boundaries for infinite space illusion

## Parameters
- `syncSpeed: 0.1` - Phase coupling strength (0-1)
- `movementSpeed: 0.3` - Velocity clamp magnitude
- `syncedJitter: 0.1` - Random velocity perturbation for synced agents
- `unsyncedJitter: 1` - Random velocity perturbation for unsynced agents
- `upwardDrift: 0.05` - Upward force for synced agents
- `downwardDrift: 10` - Downward force for unsynced agents
- `driftNoise: 0.5` - Random noise added to drift forces
- `syncedColor: {r:200, g:200, b:200}` - Base color for synced agents (white/grey)
- `unsyncedColor: {r:25, g:0, b:255}` - Base color for unsynced agents (dark blue)
- `unsyncedBrightness: 0.8` - Brightness multiplier for unsynced
- `minSyncedBrightness: 0.15` - Minimum brightness for synced pulse

**Desktop:**
- `agentCount: 1000` - Number of particles
- `agentSize: 2` - Render size in pixels
- `clusterRadius: 15` - Synchronization sensing range

**Mobile:**
- `agentCount: 500` - Reduced for performance
- `agentSize: 4` - Larger for visibility
- `clusterRadius: 25` - Larger sensing range

## Notes
- Implements simplified Kuramoto synchronization model - a fundamental system in study of coupled oscillators from statistical physics
- The upward/downward drift creates visual stratification - synchronized clusters rise toward top, unsynchronized agents sink
- Strong downward drift (10 vs 0.05 upward) creates dramatic visual separation and makes unsync state clearly punishing
- The 10:1 jitter ratio between unsynced and synced creates stark behavioral contrast - synced motion is smooth and purposeful, unsynced is chaotic
- Phase averaging without weighting by distance implements global coupling within sensing radius (all neighbors equally influential)
- Mutual attraction force (inverse distance) creates soft cohesion without hard constraints, allowing clusters to form and dissolve organically
- The sin(phase) brightness mapping creates smooth pulsing synchronized across cluster members when phases align
- Minimum brightness of 0.15 for synced agents ensures they remain visible even at pulse minimum
- The system exhibits multiple equilibria - fully dispersed (all unsync), fully clustered (all sync), and patchy (mixed clusters)
- Mobile's larger sensing radius (25 vs 15) compensates for lower agent density, maintaining similar local neighborhood sizes
- Edge wrapping eliminates boundary effects that would disrupt synchronization near edges
- The combination of phase sync + spatial attraction + vertical stratification creates rich emergent dynamics
- Visual feedback (color + brightness + motion) provides immediate readability of sync state without requiring connection lines
- Real-world firefly synchronization shows similar pattern - isolated fireflies flash irregularly, clusters synchronize collectively
