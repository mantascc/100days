# day-52 / reaction-diffusion

gray-scott model. two chemicals, one canvas.

---

## the mechanism

two substances diffuse across a grid simultaneously:

- **u** — the feed chemical. replenishes from outside. spread everywhere at the start.
- **v** — the activator. starts near zero. seeds trigger its growth.

at every cell, every step:

```
uvv  = u × v²

u' = u + Du × ∇²u  −  uvv  +  f × (1 − u)
v' = v + Dv × ∇²v  +  uvv  −  (f + k) × v
```

- `Du`, `Dv` — diffusion rates. u spreads ~2× faster than v.
- `f` — feed rate. how fast u is replenished from the environment.
- `k` — kill rate. how fast v is removed.
- `∇²` — laplacian. the local average minus the cell itself — measures how different a cell is from its neighbors.

the key term is `u × v²`. v catalyzes its own production but needs u to do it. u gets consumed in the process. this autocatalytic feedback is what drives pattern formation.

---

## why patterns emerge

with no v, nothing happens. seed a small patch of v and the autocatalysis ignites — v grows, consuming u locally. the faster-diffusing u flows in from the edges but can't keep up at the core. a wavefront forms and propagates outward.

the shape of the pattern depends entirely on f and k:

| preset    | f      | k      | behavior                              |
|-----------|--------|--------|---------------------------------------|
| maze      | 0.029  | 0.057  | labyrinthine bands — default          |
| coral     | 0.0545 | 0.062  | branching coral-like structures       |
| spots     | 0.025  | 0.060  | isolated circular spots               |
| dendrite  | 0.010  | 0.047  | thin fractal dendrites, slow growth   |
| worms     | 0.078  | 0.061  | short worm-like segments              |

small changes to f or k shift the system between these regimes. near the boundary between two regimes, patterns become unstable and complex.

---

## the laplacian

uses a 9-point stencil:

```
0.05  0.20  0.05
0.20 −1.00  0.20
0.05  0.20  0.05
```

weights sum to zero. positive result = cell is below its neighbors (a valley). negative = above (a peak). this is what drives diffusion — substance flows from high to low concentration.

---

## implementation

- `Float32Array` double-buffer — two grids for u, two for v. write to next, swap, repeat.
- 8 simulation steps per animation frame — advances faster than real time.
- color mapping: v concentration → brightness. `0 = #0a0a0a`, `1 = #ffffff`.
- 256-entry lookup table for the color mapping — avoids per-pixel float math.
- wrapping boundary conditions — the grid tiles seamlessly at edges.
- mouse drag seeds `v=1, u=0` in a circular brush — disrupts existing patterns in real time.

---

## interaction

- **drag** on the canvas to paint new v seeds
- **feed / kill sliders** — move through parameter space continuously
- **preset buttons** — jump to named regimes
- **seed** — reinitialize with 200 random 5×5 patches scattered across the grid

changing f/k mid-simulation doesn't reset — the existing pattern evolves under the new rules. this often produces interesting transient behavior.

---

## references

- Pearson, J.E. (1993). *Complex patterns in a simple system*. Science, 261(5118).
- Gray, P. & Scott, S.K. (1984). *Autocatalytic reactions in the isothermal, continuous stirred tank reactor*. Chemical Engineering Science.
- Karl Sims' interactive parameter map: [mrob.com/pub/comp/xmorphia](http://mrob.com/pub/comp/xmorphia/)
