# Day 74: Particles

## Idea
Soft glowing dots drift on sinusoidal paths, pause on contact, then push apart

## Description
A field of blurred dots wanders across the viewport, each riding a chord of three sinusoids per axis with prime-ish frequencies so trajectories never loop in lockstep. When any two dots come within a collision threshold, both freeze and tint to the pause color; on resume each gets a transient outward kick that decays over ~1s while the underlying sinusoidal path continues untouched, so the dot merges smoothly back into its natural trajectory.

The bloom is pre-baked into a 96px radial-gradient sprite per color instead of using `ctx.filter = 'blur()'` per frame — the single biggest perf win in the sketch. Per-frame cost drops to one transform plus one drawImage per dot. Velocity drives small visual gains on top: up to +4px bloom breathing and ~1.45x stretch along the motion direction.

A floating pill at the bottom (plus arrow keys) cycles four named variants — swarm, drift, frantic, meta — each a coherent rebalance of density, palette, pause length, push strength, and bloom size over the same mechanic. The meta variant fakes metaballs with `composite: 'lighter'` plus a CSS `contrast(9)` filter that thresholds summed sprite alphas into fused blobs with the classic bridge — same look as sketches 41/42 without marching squares.

## Data Concepts
- **Primary**: Spatial (sinusoidal drift, pair collisions)
- **Secondary**: Temporal (pause/resume, decaying impulses)

## Conceptual Tags
#particles #drift #collision #pause-and-push #metaballs #variants #rest-states

## Technical Tags
#canvas #sprite-baking #radial-gradient #composite-lighter #contrast-threshold #sinusoid-chords

## Stack
- Single-file HTML5 Canvas, vanilla JS
- Pre-baked radial-gradient sprites instead of per-frame blur filters
- Three-sinusoid chords per axis for non-repeating drift
- O(N²) pair collision check; dot count scaled by sqrt of viewport area (36–216)
- CSS `contrast()` + additive compositing for the cheap-metaball variant

## Notes
- Each dot carries its own `localT`, so paused dots truly freeze on their curve instead of teleporting forward when they resume
- The push is layered as an offset on top of the sinusoidal position, not a velocity change — separation is visible but the trajectory stays intact
- A small random phase nudge at resume prevents stuck re-collision on the same path
- Variant swaps seed `prevX/prevY` on the actual curve so the first frame doesn't spike velocity (and blur/stretch) from the origin
