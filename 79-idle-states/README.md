# 79 · Idle States

Eight visual interpretations of an idle state — *patience, present without proactive* — arranged as two 2×2 typologies on facing pages. The sketch is an **ideation board**, not a finished UI: each cell pairs a continuous motion with a metadata block (`claim / signal / motion / risk`) so the eight directions read as a comparison, not a gallery.

> Idle = here, but not asking. Ready whenever you are.

## What's on the page

Two pages share a shell. Switch between them with the floating dock at the bottom center.

**I — ambient** ([`index.html`](index.html))

| # | Cell | Idea | Motion |
|---|---|---|---|
| 01 | **breath** | alive, resting | small accent-blue disc pulses inside a held ring (~4s sine) + soft outer glow |
| 02 | **caret** | typographic patience | large `on idle` type with a blinking vertical bar (~1.1s, CSS keyframes) |
| 03 | **drift** | untethered, present | five motes on a noise-driven random walk inside a faint crosshair field |
| 04 | **lean-toward** | ready, not acting | figure rests neutral, orients subtly toward the cursor anywhere on screen, settles back when input stops |

**II — instrumented** ([`set-b.html`](set-b.html))

| # | Cell | Idea | Motion |
|---|---|---|---|
| 05 | **hover** | suspended, weightless | ball with mostly-lateral sway + faint vertical bob over a dashed horizon and plumb-line |
| 06 | **orbit** | time as cycle | pixel core + two tilted elliptical paths, outer ~17s/rev (white), inner ~10s/rev (blue) — nods to [`06-orbital`](../06-orbital/index.html) |
| 07 | **listening bars** | sensing, not capturing | nine bars at noise-floor (~4–22% amplitude) with independent slow-sine frequencies |
| 08 | **elapsed counter** | idle, named | large `MM:SS` ticking since arrival, blinking colon, label `since you arrived` |

## System

Each cell is structurally identical: header (name + index), stage (canvas or HTML), and a four-row `<dl>` of metadata. That structure is what makes the page a typology rather than a demo reel — the metadata forces each direction to declare what *kind* of idle it claims to be.

Motion is implemented per cell:

- **Canvas cells** (01, 03, 04, 05, 06, 07) — one self-contained IIFE per canvas, each with its own `rAF` loop and `setupCanvas` helper that handles DPR.
- **CSS-driven cells** (02, 08) — pure HTML/CSS. Cell 02 is a `<span class="caret">` with a `caret-blink` keyframe. Cell 08 is a live `MM:SS` counter updated by `setInterval` against a `performance.now()` start time.
- **Cursor-aware cell** (04 only) — listens on a global `mousemove` and computes the cursor's angle relative to its own `getBoundingClientRect()`. The other seven ignore presence entirely; this asymmetry is the point.

The shared shell is a 2×2 CSS grid with 1px gutters, capped at 920×620, padded into the viewport so the floating dock has clearance. Inset L-shaped corner ticks anchor the frame visually.

## The dock

A pill-shaped floating switcher anchored bottom-center, raised off the page with stacked shadows + inset highlight + `backdrop-filter: blur`. Two segments — `I ambient` / `II instrumented` — link to the corresponding pages, and the active page is marked with a recessed pocket and an accent-blue roman numeral.

The dock is the only chrome the sketch needs: navigation, set name, and current-position indicator in one element.

## Files

- [index.html](index.html) — set I (ambient)
- [set-b.html](set-b.html) — set II (instrumented)
- [interaction.md](interaction.md) — borrowable principles for idle-state motion

## Run

```
python3 -m http.server 3333
```

Then open <http://localhost:3333/79-idle-states/>.

## See also

- [`06-orbital`](../06-orbital/index.html) — pixel orbit aesthetic this sketch borrows from for cell 06.
- [`30-thinking-states`](../30-thinking-states/index.html) — sibling typology, but for *thinking* rather than *idle*.
