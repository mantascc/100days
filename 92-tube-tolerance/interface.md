# 92-tube-tolerance

## idea
A texture instrument for the CRT tube treatment. Every knob buried in
[91-retro-primitives](../91-retro-primitives/)' `VARIANT` object is pulled out,
given a full range instead of a value, and shown nine at a time — as a random
batch, as a single-axis sweep, or as a 3×3 cross of two axes. You use it to find
a texture, not to look at a picture.

One test card is drawn **once per frame into a single buffer and shared by all
nine tubes**, so every difference on screen is provably the treatment and never
the signal. That is what makes it trustworthy as a comparison surface.

## tags
crt, texture, reference-sheet, tool, canvas, generative, parameter-space

## stack
vanilla · canvas 2d · CSS grid · IBM Plex Mono · single file, no deps

---

## the three modes

| mode | what the nine cells are | use it to |
|---|---|---|
| **batch** | nine samples from a bell around nominal, each with one axis pushed further | find a texture you didn't think to ask for |
| **sweep** | one axis stepped end to end across all nine | learn what an axis does, and where it breaks |
| **cross** | two axes as a 3×3 — chosen axis across, second axis down | find the interaction between two knobs |

In **sweep** and **cross**, every axis you are *not* sweeping sits at nominal, so
you read one variable against a fixed ground.

## range

One slider, 0–200%, meaning the same thing in all three modes: **how far from
nominal you are allowed to get.**

- **0%** — nine identical, correct tubes. The sheet goes dead. This is the
  reference; hit it whenever you have lost your sense of what "good" looks like.
- **100%** — sweep covers the axis's entire span, corner to corner.
- **above 100%** — only meaningful in batch, where it keeps widening the bell
  until the family falls apart.

Range interpolates *from nominal outward*, so turning it up never shifts the
centre of what you are looking at.

## reseed

New seed for batch mode, and a new **batch phosphor hue**. A batch shares a
coating colour with slight per-tube drift, so reseeding gives a new colour family
rather than nine unrelated hues. No visual effect in sweep or cross except on the
convergence fringe direction.

## reading a cell

Hover or tab to any tube for its full readout — all eight axes with their actual
values, the relevant one marked `▸`. The caption under each cell carries the
number that matters in the current mode: serial + lead axis in batch, the swept
value in sweep, both values in cross.

---

## the eight axes

Ranges are deliberately wider than a real tube would ever ship. The far ends are
the point. `nominal` is where a *good* tube sits, which is rarely the middle.

| axis | range | nominal | what it does to the picture |
|---|---|---|---|
| **spot** | 0.15 → 4.50 px | 0.80px | Blur of the subject layer itself — the sharpest the tube can be. Low is a clinical lab monitor; high dissolves the crosshatch and leaves only the circle. The single biggest lever on "lofi". |
| **converge** | −7 → +7 px | 0 | Misregistration of the three guns, as offset *and* per-channel scale, so error grows toward the corners. Zero sums back to pure white; away from zero, colour fringing. |
| **geometry** | −16 → +16 % | 0 | Pincushion, plus a little rotation and overscan riding along. Negative barrels, positive pinches. |
| **persist** | 4 → 600 ms | 16ms | Phosphor decay — how much of the previous frame survives. Low forgets instantly; high smears the orbiting probe dot into a complete ring and lifts the whole card's brightness. |
| **noise** | 0 → 100 % | 35% | Grain density. Sparse specks, regenerated every third frame, screened on top. |
| **emission** | 30 → 190 % | 100% | Overall brightness. Above 100% it burns an extra pass rather than clipping, so overexposure spreads instead of flattening to white. |
| **bloom** | 10 → 190 % | 100% | Scales both halo passes, blur radius *and* alpha together. Low is a flat panel; high is a tube with a dying, hazy screen. |
| **phosphor** | 15° → 210° | batch hue | Coating colour, as a `color` blend: hue from the coating, luminosity from the picture. Amber → gold → green → aqua → cyan. |

## recipes

Starting points found while building it. All from **cross** unless noted.

- **Lab monitor / clinical** — spot low, bloom low, noise low, persist low.
  Everything legible, nothing glowing. Good ground truth.
- **Dying tube** — bloom high × emission high. The halo swallows the crosshatch
  and only the outer circle survives.
- **Long-exposure oscilloscope** — persist high × spot low. The probe dot draws a
  hard, thin, permanent ring over a sharp card.
- **Bad colour set** — converge at either extreme × spot low. Fringing needs
  sharpness to read; blur it and the colour just muddies.
- **Photocopied** — noise high × emission low × bloom low. Grain dominates a dim
  picture.
- **Wrong tube entirely** — geometry at an extreme × bloom high. Warp is only
  obvious against something you know should be straight, which is what the circle
  and crosshatch are for.

The pairs worth crossing are the ones that fight: `spot × converge`,
`persist × emission`, `bloom × noise`. Crossing two axes that don't interact
gives a boring, separable grid — which is itself useful to learn about a pair.

---

## the signal

A test card, because a test card exists to make deviation legible.

| mark | what it reveals |
|---|---|
| outer + inner circle | geometry — a warped circle reads instantly |
| 6×6 crosshatch | convergence, pincushion |
| converging bar wedge | spot size |
| grey step wedge | emission |
| corner registration marks | overscan, rotation |
| one bright orbiting dot | persistence — the comet's length *is* the decay |

## the pipeline

The 91-retro-primitives treatment, with two additions this piece required.
Per tube, per frame:

1. **Phosphor buffer** — faded, not cleared: `fillRect` black at
   `1 − e^(−16.7/persistMs)`, then the frame added under `lighter`. Decay
   accumulates as a trail. *(new)*
2. **Per-gun composite** — the white card is split into `#f00/#0f0/#00f` copies
   once per frame (`multiply` + `destination-in` to restore alpha), each drawn
   with its own offset **and scale**, so convergence error grows toward the
   edges. Aligned guns sum back to white. *(new)*
3. **Geometry** — the card is redrawn as 12 horizontal strips, each scaled about
   centre by `1 + pin·(y² − ⅓)`. Later blur hides the seams, so the blur is
   load-bearing rather than decorative.
4. **Bloom → bloom → subject**, all `screen`, from the phosphor buffer:
   `blur(4+14b)` → `blur(1.6+5b)` → `blur(spot)`. The subject layer is itself
   blurred; nothing renders crisp. Emission above 100% burns an extra pass
   instead of clipping.
5. **Vignette**, radial, then **grain** — shared `ImageData` regenerated every
   third frame, only the top 16% of samples visible, `screen`.
6. **Phosphor colour** — `color` blend at α 0.62: hue/saturation from a flat
   `hsl()` fill, luminosity from the picture. Applied last, so the grain is
   tinted too — which is what sells it as emitted light.
7. **CSS shell** — 22px radius, inset hairline, `::before` radial bevel,
   `::after` repeating-gradient scanlines at `multiply`.

Reading → render parameter:

| reading | drives |
|---|---|
| spot | blur radius of the subject pass |
| converge | per-gun offset + per-channel scale |
| geometry | pincushion coefficient, rotation, overscan |
| persist | per-frame fade of the phosphor buffer |
| noise | grain alpha |
| emission | composite alpha + burn pass |
| bloom | both halo passes, radius and alpha together |
| phosphor | hue of the `color` tint |

The governing rule, inherited from 91: **subtract sharpness, add light.** Every
step either blurs or screens additively. The only steps that darken are the
vignette and the phosphor fade, and those two are what keep it from becoming a
white blob.

## the range model

Each axis is a normalised 0..1 position over its span, plus a `nom` marking where
a good tube sits — `spot` at 0.149, `persist` at 0.277, `converge` at 0.5. The
range slider interpolates from `nom` outward, which is why range 0 gives nine
identical correct tubes in every mode. Batch adds a bell around `nom` with one
axis pushed further; sweep and cross hold every unswept axis at `nom`.

## motion
The probe dot orbits, grain regenerates every 3 frames, phosphor trails settle at
each tube's own rate. Under `prefers-reduced-motion` the clock freezes, grain
stops regenerating, and the loop halts after ~90 frames — long enough for the
phosphor to settle, so the sheet holds as a still contact print.

## responsive
3 columns throughout; tile `min(44vw, 190px)` below 700px. Tubes are focusable;
focus shows the same readout as hover.

## notes
- `devicePixelRatio` capped at 1.5, blooms at two passes. ~100fps at dpr 1.
- Grew out of a concept piece about manufacturing tolerance — serials, QA
  verdicts, batch yield. The framing was cut: the interesting part was the
  parameter space, not the argument about it.
- **Open:** no way to take a texture away. The readout gives every value and they
  map onto the pipeline directly, but copying a look into another sketch is a
  manual transcription of eight numbers. A "copy config" emitting a
  `VARIANT`-shaped object for the hovered tube would close the loop and make this
  properly a tool rather than a viewer.

## imagination
Pressed [`techniques/crt-tube-treatment`](../imagination/techniques/crt-tube-treatment.md)
onto [`themes/randomness-feeling-intentional`](../imagination/themes/randomness-feeling-intentional.md)
via `/spark` on 2026-08-09, then turned away from the theme toward the range
itself. Lands on
[`threads/design-system-and-reference-sheets`](../imagination/threads/design-system-and-reference-sheets.md)
and hard on
[`themes/searching-vs-mapping`](../imagination/themes/searching-vs-mapping.md) —
batch is search, sweep and cross are mapping, and the mode switch is that choice
made explicit.
