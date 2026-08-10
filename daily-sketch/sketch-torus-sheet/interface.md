# sketch-torus-sheet

## idea
A specimen sheet with no edges. Both axes of the parameter space are **angles**,
so the space is genuinely periodic in both directions and the lattice sampling it
has to be a torus. Drag in any direction forever; the same specimen returns, but
there is no corner to tell you where the sheet began.

## tags
reference-sheet, torus, parameter-space, wrapping, canvas, generative, infinite-pan

## stack
vanilla · canvas 2d · IBM Plex Mono · single file, no deps

---

## why a torus

Every reference sheet the practice has made has a first cell. Top-left is where
you start reading, and that corner is a silent claim: *this is where the space
begins.* For a palette or a set of states that claim is harmless. For a periodic
parameter it is a lie — there is no highest phase.

So the sheet is cut to fit the parameter instead of the other way round. Cell
`(i, j)` draws from `(i mod P, j mod P)`; walking `P` cells in any direction
returns a **byte-identical** specimen, not a similar one. The lap counter in the
readout is the only evidence you ever moved.

## the specimen

Two harmonics, each with its own phase:

```
r(t) = R · (1 + 0.30·cos(3t + φ) + 0.19·cos(5t + ψ))
```

- **φ** — x axis, `0 → 360°` across one lap
- **ψ** — y axis, `0 → 360°` down one lap

Both are circular, which is the whole argument. A fainter inner echo at
`φ + π` rides under each figure so a cell reads as a specimen rather than an icon.

## reading it

| element | what it tells you |
|---|---|
| **id** (`A00`, `H07`) | the residue — two cells sharing an id *are* the same cell |
| **φ / ψ** | the specimen's coordinates on the torus |
| **lap** | how many full periods from where you happened to load |
| **crosshatch corners** | the cell currently under the centre of the viewport |

`lap` turns accent-blue the moment it leaves `+0, +0` — the only way to know you
have travelled.

## controls

- **period** — 8 / 12 / 16 specimens per lap. Sets the sampling resolution of the
  torus, and therefore the total population (64 / 144 / 256).
- **seam** — draw the period boundary. Off by default, and that is the point: a
  torus has a seam only where you choose to cut it. Turning it on shows the cut
  is arbitrary; turning it off makes it vanish completely.
- **origin** — tint the `(0,0)` residue. Also arbitrary, also invisible by default.
- **walk a lap** — animate exactly one period along x. You end where you started.
- drag, wheel, arrow keys. `shift + arrow` jumps a whole lap.

## motion
None per-cell — the specimens are static. All motion is navigation: pointer drag
with a decaying glide (`v *= 0.92`), and the one-lap walk on an ease-in-out.
Under `prefers-reduced-motion` the glide and the lap animation are both skipped;
panning still works, it just stops dead.

## notes
- Only the visible window of the lattice is drawn — roughly 110 cells at
  1600×900, each a 180-segment path. Redraw is on interaction, not on a clock.
- `mod()` is the positive-remainder kind. The whole sketch collapses without it;
  JS `%` goes negative and the sheet tears at the origin.
- **Open:** the two axes are both phases, which makes the torus honest but the
  *specimen* fairly tame. The interesting version pairs two genuinely different
  circular parameters — hue and rotation, say — where wrapping in one direction
  feels nothing like wrapping in the other.
- **Open:** no zoom. Pulling back far enough to see a whole period at once would
  turn the torus from something you walk into something you read, which is the
  searching-vs-mapping switch this sheet currently refuses to offer.

## imagination
Came from `/spark` on 2026-08-09 as the **Collide**:
[`techniques/toroidal-wrapping`](../../imagination/techniques/toroidal-wrapping.md)
× [`threads/design-system-and-reference-sheets`](../../imagination/threads/design-system-and-reference-sheets.md)
— the two furthest-apart high-charge entities in the layer, a wrapping trick from
the agents/particles world dropped into the documentation genre. Also lands on
[`threads/grids-as-compositional-frame`](../../imagination/threads/grids-as-compositional-frame.md)
(the grid is the coordinate system here, not the stage) and on
[`themes/searching-vs-mapping`](../../imagination/themes/searching-vs-mapping.md)
— an infinite sheet can only be searched, never mapped, which is the opposite of
what a reference sheet is for.

**Harvest 2026-08-09 — `no-signal`.** The torus closes and the demonstration is
clean, but the maker's read is that it lands cold: a correct recombination of two
existing entities rather than something that wanted to exist. Nothing lifted into
the layer. Per SPEC §7.1.1 this closes the read, not the sketch — if a later
piece makes the periodic-parameter idea matter, this one is its first sighting.
