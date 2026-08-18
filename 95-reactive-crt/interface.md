# 95-reactive-crt

> Grew out of [sketch-audio-tube-grid](../daily-sketch/sketch-audio-tube-grid/).

## idea
Sixteen tubes, one room. The CRT pipeline from
[92-tube-tolerance](../92-tube-tolerance/) locked to a single named variant —
`EMISSION` — with sixteen different abstract generators drawing into it from the
same microphone.

92 held the signal still and swept the tube: one test card, nine tubes, every
difference provably the treatment. This inverts it. **One tube, sixteen signals.**
Every cell runs the identical pipeline at identical settings, so every difference
on screen is provably the drawing.

## tags
crt, audio-reactive, reference-sheet, canvas, webaudio, generative, grid, texture

## stack
vanilla · canvas 2d · Web Audio · CSS grid · IBM Plex Mono · single file, no deps

---

## the pair it belongs to

| | signal | tube |
|---|---|---|
| **92-tube-tolerance** | one test card, fixed | nine, swept across eight axes |
| **sketch-tube-driven** | one test card, fixed | one, driven by audio |
| **this** | sixteen generators, driven by audio | one, fixed |

[sketch-tube-driven](../daily-sketch/sketch-tube-driven/) argued that audio should only ever
reach the *treatment*, never the picture, because a drawn signal reads as
decoration. This takes the opposite side on purpose: the audio draws, and what
keeps it from being decoration is that the treatment is held constant across
sixteen cells. The grid becomes a comparison surface for **ways of drawing sound**
rather than a single reactive image.

Both are true. They are two halves of the same question and the pair is more
useful than either.

## the EMISSION variant

The whole tube, as one object with the shape 91's `window.VARIANT` had and 92's
axis names:

```js
const EMISSION = {
  spot: 0.92,  converge: 1.30,  geometry: 6.0,  persist: 74,
  noise: 0.30, emission: 1.30,  bloom: 1.45,    phosphor: 150
};
```

`emission: 1.30` is the name. It idles above nominal, so the tube is always
slightly over-driven and every generator sits on the burn pass rather than
clipping to white. Four values are exposed as knobs; the other four are the
variant's identity and stay put.

## the four knobs

| knob | range | what it does |
|---|---|---|
| **gain** | 50–600% | input scaling, before the bands. The only knob that touches the signal. |
| **drive** | 0–150% | how hard audio modulates the tube. **At 0 every tube sits exactly at the variant**, so the sheet is a still contact print of sixteen drawings — the reference state, same job as 92's `range 0`. |
| **emission** | 30–190% | the variant's headline axis, live. |
| **phosphor** | 15–210° | coating hue. Uniform across all sixteen on purpose. |

## the mapping

Audio reaches the tube in four places. Each cell is keyed to one band, so the
sheet lights unevenly — the bass cells breathe on the kick, the air cells chatter.

| reading | drives |
|---|---|
| cell's band level | emission ↑, bloom ↑, persist ↓ |
| onset (spectral flux) | emission spike, convergence pushed apart |
| quiet | persist ↑ — silence smears, sound sharpens |

Convergence on transients is the one that sells it: a loud hit throws the guns
apart and the whole cell fringes red-and-blue for a few frames, the way a real
tube does when you drive it past what the yoke can hold.

## the sixteen

Each is a *composition*, not a single mark: fixed furniture (frame, ladder,
graticule, orbit path, registration ticks) that stays put, and a live part that
moves against it. Motion is only legible against something that doesn't move —
that is what 92's test card was for, and each cell here has to supply its own.

| # | | band | |
|---|---|---|---|
| 01 | **ridge** | low | eight spectra deep, newest in front, hidden lines removed |
| 02 | **radial** | mid | spectrum as 64 spokes; the marked spoke is the loudest bin |
| 03 | **scope** | amp | time domain, 128 samples, triggered on the first rising zero |
| 04 | **bars** | mid | twenty bands, caps holding the peak and falling |
| 05 | **rings** | bass | one ring per band; the gap rotates, the radius breathes |
| 06 | **matrix** | high | 13×13 field sampled by distance; the top decile gets a box |
| 07 | **lissajous** | mid | ratio snaps to a small set; the head is the bright end |
| 08 | **orbit** | bass | five bodies; band sets the radius, phosphor draws the trail |
| 09 | **sweep** | high | radar; blips are held peaks, lit as the beam passes |
| 10 | **spiral** | low | four turns; stroke thickness reads the spectrum centre-out |
| 11 | **poly** | sub | sides 3 to 8, alternating spin, vertices carrying the level |
| 12 | **mesh** | mid | spectral history in perspective; the near row is now |
| 13 | **blocks** | bass | a seeded recursive layout; a plate fills when its bin crosses |
| 14 | **burst** | air | 112 hairlines at fixed phases; transients throw long spikes |
| 15 | **moiré** | high | two rulings, one rotating; the beat is the only reactive part |
| 16 | **plume** | amp | particles on onsets, drag and lateral drift, funnel fixed |

Grouped by family: **line** (ridge, scope, bars, mesh) · **radial** (radial,
rings, sweep, spiral, burst) · **curve** (lissajous, orbit) · **field** (matrix,
blocks, moiré) · **particle** (plume).

## the signal

Two sources, one interface.

- **simulated** — the default, so the sheet is alive before permission. Not noise:
  a kick, a snare on 3, a hat on eighths and two pads, rendered straight into the
  bins. The generators need something with structure or all sixteen read as the
  same jitter.
- **microphone** — `fftSize` 1024, first 192 bins (~8 kHz). Echo cancellation,
  noise suppression and AGC all **off** — they are built to flatten exactly what
  this wants. Rise-fast/fall-slow smoothing per bin, so transients survive.

`listen` toggles. **The mic needs `https` or `localhost`** — on `file://` the
button reports it and the sheet stays on the simulation.

Spectrum sampling is warped (`f^1.55`): a linear FFT axis puts everything
interesting in the leftmost eighth. Anything that averages before drawing —
ridge, mesh — also gets a gamma lift, or the quiet detail flattens into a
straight line.

## the pipeline

92's, with one change forced by the cell count. Per cell, per frame:

1. **The drawing** — generator into its own transparent tile. Opaque `#000` fill
   is hidden-line removal: black adds nothing under `lighter`.
2. **Guns** — three tinted copies (`multiply` + `destination-in`) summed into
   **one beam buffer** at their convergence offsets and scales.
3. **Warp** — the beam, once, as 10 strips scaled by `1 + pin·(y² − ⅓)`.
4. **Phosphor** — faded not cleared, `1 − e^(−16.7/persist)`, frame added under
   `lighter`.
5. **Bloom → bloom → subject**, all `screen`; emission above 100% burns an extra
   pass instead of clipping.
6. **Vignette → grain → coating** (`color` blend, last, so the grain tints too)
   **→ gloss**.
7. **CSS shell** — 20px radius, inset hairline, radial bevel, scanlines at
   `multiply`.

**The change:** 92 warped each gun separately — three strip loops per tube. At
sixteen tubes that is three times too many draws, and the beam carries the same
misregistration either way. Compositing the guns first and warping once cost
nothing visible and made sixteen affordable. The per-channel *scale* survives, so
the fringe still grows toward the corners.

## performance
- `devicePixelRatio` capped at 1.25, tiles 164px on desktop and up to 190px
  on a phone (two columns can afford the width four cannot), 10 strips.
- Two shared scratch buffers (beam, tint) reused across all sixteen — each cell
  finishes before the next starts.
- The blur passes are the cost, not the draws. If the rolling frame average
  passes 30ms the outer halo drops out, and returns below 19ms; hysteretic, so it
  cannot oscillate.
- Grain is one shared field regenerated every third frame, each tube screening it
  at the variant's level.

## responsive
**4×4** above 820px, **2×8** below, tile `min(44vw, 190px)`. Masthead stacks and
the legend wraps on narrow. Tubes are focusable; focus shows the same readout as
hover.

Two things the phone exposed that the desktop hid:

- **The tile size was never actually read.** `getPropertyValue('--tile')` returns
  the literal token — `min(44vw, 190px)` — not a resolved length, so `parseInt`
  gave `NaN` and the canvas fell back to a hard-coded 190 at every width where
  the tile was something else. It also meant the resize rebuild compared 190 to
  190 and never fired. Fixed by measuring a throwaway element with
  `width: var(--tile)` instead of parsing the variable. The backing store now
  matches the displayed size exactly at any viewport.
- **The tube was cropping its own picture.** Overscan, plus the pincushion
  widening the top and bottom strips by `pin·⅔`, throws about 8% of every
  composition past the tile edge — invisible at a desktop tile, obvious on a
  phone, where outer rings and registration marks were being cut clean off. The
  generators now draw into an inset frame:

  ```js
  const SAFE = 1 / (OVER * (1 + PIN * (2 / 3)) * 1.02);   // 0.909
  ```

  Derived from the optics rather than picked by eye, so changing `geometry` in
  the variant moves the safe frame with it and no generator has to know.

## motion
Continuous. Each generator carries its own clock and its own memory — ridge and
mesh hold spectral history, orbit and plume hold state, burst holds decaying
spikes — so the sheet keeps moving through a quiet passage instead of freezing.
Under `prefers-reduced-motion` the simulation freezes to a held frame and grain
stops regenerating; **the microphone path still animates**, because that motion is
something the viewer switched on deliberately.

## notes
- `A.at(f)` / `A.seg(i,n)` are the whole generator API for reading the spectrum.
  Adding a seventeenth cell is one entry in `GENS` — a `draw(g, S, t, m, rnd)` and
  a band key. `m` is per-cell memory, `rnd` a seeded generator that `reseed`
  re-rolls.
- **Open:** every cell is keyed to *one* band, which is the crudest possible
  routing. A per-cell band picker — or a modulation matrix, the 92 `cross` move
  applied to routing rather than to axes — would turn this from a sheet into an
  instrument.
- **Open:** at drive 0 the sixteen are a still print, which is the right reference
  state, but there is no way to take one cell away. Same open question 92 ended
  on, one layer up: a "copy config" would want to emit the generator *and* the
  variant.

## imagination
Landed the same week as [94-relationships](../94-relationships/), which is also
sixteen cells, also a specimen sheet, and also holds one thing constant so the
sixteen differences are legible — edges there, generators here. Neither knew about
the other; that the form arrived twice from different directions is the argument
for it.

Sits between [92-tube-tolerance](../92-tube-tolerance/) and
[sketch-tube-driven](../daily-sketch/sketch-tube-driven/), and inverts both. Presses
`techniques/crt-tube-treatment` onto the audio-reactive line running through
[67-audio-reactive-ascii](../67-audio-reactive-ascii/) and
[17-audio-reactive-network](../17-audio-reactive-network/). Lands on
`threads/design-system-and-reference-sheets` — a contact sheet whose constant is
the treatment and whose variable is the drawing — and on
`themes/searching-vs-mapping`: sixteen at once is search, and the fixed tube is
what makes the search fair.
