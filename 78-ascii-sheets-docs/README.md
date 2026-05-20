# 78 · ASCII Sheets — docs

A promotional showcase site for the **ASCII sheet primitive** introduced in [`daily-sketch/sketch-sticky-banner`](../daily-sketch/sketch-sticky-banner/index.html). One reusable elevated surface — animated ASCII texture over a backdrop filter, with an optional opaque punch-through label — instantiated thirty times across a single scrolling page to argue: *one component, many shapes*.

## What's on the page

Top-to-bottom, the page is a long-scroll showcase:

1. **Hero** — full-bleed sheet with the title as punch-through. A `filter-cycle` button group at top-right manually picks `off / blur / distort`; if untouched, it auto-cycles every 3.5s.
2. **Intro** — the elevator pitch.
3. **Anatomy** — live sheet beside a four-item layer list. Hovering a layer changes the demo's filter mode so each layer's contribution is visible in isolation.
4. **Use cases** — a 2-column grid of twelve live tiles, each casting the same primitive in a different role:
   - Sticky page header · Modal backdrop (click → opens a fullscreen modal with a distort backdrop) · Notification toast (click → slides in, auto-dismisses) · Section divider · Side drawer · Image hover reveal · Product card surface · Loading screen · Marquee/ticker · Tooltip surface · Footer band · Stacked top+bottom.
5. **Formula gallery** — five horizontal strips, each running a different formula (`interference`, `ripple`, `noise`, `flow`, `spiral`) next to its code.
6. **Rails** — five glyph alphabets (`dots`, `braille`, `blocks`, `shade`, `ascii`) and five color palettes (`ube`, `amber`, `acid`, `coral`, `mono`). Clicking any cell re-themes the hero at the top of the page.
7. **Embed** — HTML attribute and JS-config code blocks showing the proposed API surface.

## System (high level)

### 1. One class, many instances

A single `Field` class drives every canvas on the page (~30 of them). It reads its config off `data-*` attributes on the canvas (`data-formula`, `data-color`, `data-glyphs`, `data-font-size`, `data-fps`, `data-trail`) and falls back to defaults — so adding a new variant is just markup, no JS.

Each instance owns its own grid, frame counter, and `ResizeObserver`. The boot loop walks `canvas[data-sheet]` once, constructs a Field per canvas, registers it in a `Map` keyed by `data-sheet`, and starts the rAF tick. Frame timing is gated by an `fpsInterval` (default 20fps) so the texture reads as glyph-grid motion, not silky-smooth video.

### 2. Formulas and glyph sets are pluggable

Formulas are pure functions `(x, y, t, cx, cy) → 0..1`. The five presets ship in a `FORMULAS` map; swapping is one assignment. Glyph alphabets live in a parallel `GLYPH_SETS` map. The texture is "mostly a font choice" — same formula, different alphabet, completely different mood — which is the point of the `Rails` section.

### 3. Punch-through label via proximity carve

If a `.sheet-label` exists inside a `.sheet`, the Field measures its bounding box every resize and, per frame, builds an `evals` buffer that marks cells fully inside the label box (`-1`, skip) and cells within 5 cells of the box (a 0..1 proximity ramp). Glyph values are attenuated by `1 − prox·0.88` so density falls off cleanly around the label edges instead of cutting hard — type reads on top of the texture without a halo.

### 4. Filter modes

Three filter modes are CSS-driven via `data-filter` on the `.sheet` element:

- `off` — pure ASCII over transparent ground; whatever's beneath shows through unmodified.
- `blur` — `backdrop-filter: blur(10px)` + 25% black tint.
- `distort` — `backdrop-filter: url(#sheet-distort)` + 55% black tint. The SVG filter chains `feTurbulence` (base frequency tuned to ~0.012/0.028, roughly matching the glyph grid period) into `feDisplacementMap` at scale 14.

A single `#sheet-distort` `<filter>` lives in a hidden SVG at the top of `<body>` and is shared across every distort-mode instance on the page.

### 5. Interactions

Inline JS at the bottom of the file wires the four interactive demos:

- **Hero filter cycle** — `setInterval` rotates `off → blur → distort` every 3.5s; clicking a `.filter-cycle` button cancels the timer and pins the choice.
- **Modal** — `data-action="open-modal"` opens, click on backdrop or close button shuts it.
- **Toast** — `data-action="fire-toast"` sets `data-toast="on"` on the tile (CSS slides the frame in), clears via timeout.
- **Image reveal** — `mouseenter` toggles `data-revealed="true"` (CSS fades the sheet's opacity).
- **Loader bar** — `setInterval` cycles a "running dots" progress indicator inside the loading-screen tile.
- **Rails retheme** — clicking a glyph or palette cell calls `setColor` / `setGlyphs` on the hero Field by ID.

## Files

- [index.html](index.html) — the showcase
- [interface.md](interface.md) — component reference for the ASCII sheet primitive

## Run

```
python3 -m http.server 3333
```

Then open <http://localhost:3333/78-ascii-sheets-docs/>.

## See also

- [`daily-sketch/sketch-sticky-banner`](../daily-sketch/sketch-sticky-banner/index.html) — the reference implementation that defined the primitive.
- [`seed-ascii-sheet.md`](../seed-ascii-sheet.md) — the design seed (anatomy, config groups, three tweak surfaces, open questions).
