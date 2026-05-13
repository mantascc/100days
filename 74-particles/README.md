# 74-particles

A single-file canvas sketch. Soft dots drift across the viewport on multi-harmonic sinusoidal paths, freeze and tint when their blooms touch, then get a decaying outward kick on resume. A small floating pill at the bottom cycles four variants of the same system.

## System (high level)

### 1. Motion
Each dot has its own anchor in `[0, 1]² ` across the viewport and rides a chord of three sinusoids per axis. Offset phases and prime-ish harmonic frequencies keep trajectories from looping in lockstep — the dots drift, cross, and recompose without ever repeating. Padding equal to one drift radius keeps every dot on-screen even at its most extreme wander. Each dot also carries its own `localT`, so paused dots truly freeze on their curve rather than teleporting forward when others advance.

### 2. Collision pause + push
A naive O(N²) pair check fires when any two centers come within `COLLIDE_THRESH`. Both dots get a same-length pause and stash the unit separation vector. On resume, that vector is materialized as a transient `offX/offY` offset (the visible "scoot away"), decaying back to zero with a per-second decay factor. The underlying sinusoidal position is untouched — the push is layered on top — so the dot smoothly merges back into its natural trajectory. A small random phase nudge at resume prevents stuck re-collision on the same path.

### 3. Sprite-based bloom
The dot bloom is pre-baked into a 96 px radial-gradient sprite once per color, then `drawImage`'d per frame. This kills the dominant cost of the original `ctx.filter = 'blur(...)'` approach (which forces a new compositing layer per call, stacked 4-deep). Per-frame cost is now a transform + a single `drawImage` per dot. Velocity drives two small visual gains on top: a +4 px bloom breathing and a ~1.45× stretch along motion.

### 4. Variants
A `VARIANTS` array of named configs swaps the mutable state — sprites, dot count, collision thresh, pause length, push strength, bloom size, drift fraction, harmonic frequency multiplier, optional CSS filter on the canvas, and optional composite mode. `applyVariant(idx)` re-bakes the two sprites, rewrites the scalars, and rebuilds the dot array, seeding `prevX/prevY` on the curve so the first post-swap frame doesn't spike velocity from the origin. The draw loop reads from `let`-bound state so swaps take effect on the next frame without restarting `rAF`. UI: `‹ name ›` pill plus left/right arrow keys.

- **swarm** (default) — dense, snappy, amber pause
- **drift** — the original baseline: slow, sparse, white → ube
- **frantic** — fast, short pause, big kick
- **meta** — few big blobs that fuse on contact

### 5. Meta variant (cheap metaballs)
The meta variant fakes marching-squares metaballs (sketches 41 / 42) with two passes layered on top of the existing engine: `globalCompositeOperation = 'lighter'` so overlapping sprite alphas sum, and a CSS `filter: contrast(9)` on the canvas element that thresholds the summed soft alpha into hard-edged disks. Where two dots overlap, the alpha sum crosses the contrast knee gradually — producing the smooth bridge that reads as a fused metaball. Collision still fires at `COLLIDE_THRESH`, tuned so the fused shape thins out just before the pair pauses and recoils.

## Files

- `index.html` — the sketch
