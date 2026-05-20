# Interface

Component reference for the ASCII sheet primitive as used in this showcase. The reference implementation lives in [`daily-sketch/sketch-sticky-banner`](../daily-sketch/sketch-sticky-banner/index.html); this page demonstrates how the same primitive composes into many surfaces.

## Glossary

| Term | Element | Role |
|---|---|---|
| **Sheet** | `.sheet` | Container. Captures position, owns the filter mode (`data-filter`), hosts the canvas and label. |
| **Filter sheet** | `.filter-sheet` | Absolute-inset layer that applies the backdrop filter (blur / distort) and tint over content beneath. |
| **Canvas** | `canvas[data-sheet]` | Where glyphs are painted. Identity, formula, color, and glyph set live on `data-*`. |
| **Label** | `.sheet-label` | Opaque punch-through (defaults to a dark plate with a violet border). Holds copy that needs to read on top of the texture. |
| **Sublabel** | `.sheet-sub` | Secondary copy beneath the label, used on the hero. |
| **Distort filter** | `<svg><filter id="sheet-distort">` | Shared SVG filter. One definition; every distort-mode sheet references it. |
| **Nav** | `.nav` | Fixed top bar, project title left, return-to-index right. Non-interactive over the content. |
| **Filter cycle** | `.filter-cycle` | Hero-only button group: `off / blur / distort`. |
| **Tile** | `.tile` | One row of the use-case wall: name + tag + description + a `.tile-demo` containing the live sheet. |
| **Tile demo** | `.tile-demo` | The framed live area inside a tile. Holds the dummy content under the sheet and the sheet itself. |
| **Anatomy demo** | `.anatomy-demo` | Side-by-side live sheet + numbered backdrop grid (so the layers underneath are visible). |
| **Layer list** | `.layer-list` | The four-row list next to the anatomy demo. Hovering a row swaps the demo's filter mode. |
| **Formula strip** | `.formula-strip` | A 96px-tall sheet running one named formula, paired with a meta block showing its code. |
| **Rail** | `.rail-row` | A labeled row of small cells, each running the same formula with a different glyph set or color. |
| **Rail cell** | `.rail-cell` | One cell in a rail. Click to apply that glyph set / color to the hero. |
| **Modal** | `.modal` | Fullscreen overlay with a distort-mode sheet and a centered `.modal-card`. Opens via a tile button. |
| **Toast frame** | `.toast-frame` | Small framed sheet in the toast tile. Slides in via `data-toast="on"`. |
| **Marquee label** | `.marquee-label` | Opaque label that translates horizontally across a marquee-tile sheet. |
| **Drawer content** | `.drawer-content` | Wireframe nav list to the right of the vertical sheet in the drawer tile. |
| **Photo** | `.photo` | Painted gradient stand-in for an image in the reveal tile. The sheet sits over it; hover removes the sheet. |
| **Loading progress** | `.loading-progress` | Dot bar inside the loading-screen tile. |
| **Tooltip pop** | `.tooltip-pop` | Floating sheet that appears below a `tooltip-anchor` on hover. |

## Anatomy

```
.sheet                  ← position container, data-filter mode
├── .filter-sheet       ← backdrop-filter (blur | url(#distort)) + tint
├── canvas[data-sheet]  ← animated glyph field
└── .sheet-label        ← opaque punch-through (optional)
```

Plus one shared `<svg><defs><filter id="sheet-distort">…</filter></defs></svg>` at the top of `<body>`. The `<defs>` must live in light DOM for `backdrop-filter: url(#…)` to resolve.

## Sheet — data attributes

The `<canvas>` inside a `.sheet` configures itself from `data-*`:

| Attribute | Default | Effect |
|---|---|---|
| `data-sheet` | required | Unique key. The boot loop registers each Field in a `Map<key, Field>`. |
| `data-formula` | `interference` | Picks from `FORMULAS`. Currently: `interference`, `ripple`, `noise`, `flow`, `spiral`, `bands`. |
| `data-color` | `#7b6fa5` | Glyph fill color. Parsed once into an `rgb(r,g,b)` string. |
| `data-glyphs` | `dots` | Picks from `GLYPH_SETS`: `dots`, `braille`, `blocks`, `shade`, `ascii`. |
| `data-font-size` | `11` | Glyph size in px. Drives both `charW` (measured) and `charH` (1.2× size). |
| `data-fps` | `20` | Frame cap; the rAF loop only re-renders when `t − lastT > 1000/fps`. |
| `data-trail` | `0.35` | Alpha of the `destination-out` rectangle painted each frame. Higher = shorter trail. |

The `.sheet` itself takes `data-filter` (`off` / `blur` / `distort` / `bright`) which only switches CSS.

## Filter modes

| Mode | CSS effect |
|---|---|
| `off` | Pure ASCII over transparent ground — content fully visible underneath. |
| `blur` | `background: rgba(0,0,0,0.25)` + `backdrop-filter: blur(10px)`. |
| `distort` | `background: rgba(0,0,0,0.55)` + `backdrop-filter: url(#sheet-distort)`. Turbulence + displacement. |
| `bright` | `background: rgba(255,255,255,0.06)` + `backdrop-filter: blur(6px)`. Reserved for future light variants. |

The distort SVG filter is tuned so its base frequency (`0.012 0.028`) roughly matches the glyph grid period, so the displaced texture reads as "rippling along the ASCII flow" rather than random noise.

## Formulas

All formulas have signature `(x, y, t, cx, cy) → 0..1`. The result is mapped across `glyphs[0..N]`; values are clamped to `[0,1]`.

| Name | Function |
|---|---|
| `interference` (default) | `(sin(x·0.1 + t) + cos(y·0.12 − t·0.7) + sin((x+y)·0.05 + t·0.5) + 3) / 6` |
| `ripple` | Radial sine — distance from `(cx, cy)`, phase by `t`. |
| `noise` | Three mixed sines with mutually-prime-ish frequencies. Pseudo-noise without a noise lib. |
| `flow` | Sinusoid in `x`, advected by `sin(y·0.1)` plus `t`. Reads as wind. |
| `spiral` | `r` and `θ` from `(cx, cy)`. Sine of `r + 3θ − 2t`. |
| `bands` | `sin(y·0.5 + x·0.05 + t)` — used for divider and marquee tiles. |

Add new formulas by extending the `FORMULAS` object. No other change needed.

## Glyph sets

| Name | Glyphs (low → high density) |
|---|---|
| `dots` (default) | `' · ∙ ∘ ○ ◌ ◎ ⊙ ●'` |
| `braille` | `' ⠁ ⠃ ⠇ ⠏ ⠟ ⠿ ⡿ ⣿'` |
| `blocks` | `' ▁ ▂ ▃ ▄ ▅ ▆ ▇ █'` |
| `shade` | `' ░ ▒ ▒ ▓ ▓ █ █ █'` |
| `ascii` | `' . : - + * o # @'` |

The Field maps the formula's 0..1 across `glyphs[0..N]` with `Math.round(v · N)`. Cells that resolve to `' '` are skipped (no fill).

## Punch-through label

If a `.sheet-label` is present inside a `.sheet`, the Field:

1. Measures the label's bounding rect on resize and on first frame (`_measureBox`).
2. Converts the rect to grid coordinates `(c0, r0, c1, r1)`.
3. Per frame, builds an `evals` buffer:
   - Cells inside the box get `-1` (drawn skipped).
   - Cells within Chebyshev distance ≤ 5 get a `1 − (d − 1) / 4` proximity value (a 5-cell ramp).
4. When painting, glyph value `v` is replaced with `v · (1 − prox · 0.88)`, so density fades out cleanly toward the label edges.

The result is type that reads on top of the texture with no halo or hard cutout — the field thins out around the box.

## Use-case tiles

Each `.tile` is structurally identical: head (name + tag), body (description), and a `.tile-demo` containing a sheet (and any tile-specific extras). What varies is the sheet's geometry, filter, and what sits beneath:

| Tile | Sheet position | Filter | Extras |
|---|---|---|---|
| Sticky header | top band, 60px | `blur` | dummy lorem under it |
| Modal backdrop | full overlay (in `#modal`) | `distort` | trigger button + `.modal-card` |
| Toast | corner frame, 200×56, slides via transform | `distort` | trigger button, auto-timeout |
| Section divider | mid band, 32px | `off` | dummy lorem above and below |
| Side drawer | left band, 60px wide (vertical) | `blur` | `.drawer-content` nav list |
| Image reveal | full overlay over `.photo` | `distort` | `data-revealed` toggle on hover |
| Card surface | top band, 70px | `off` | `.card-stub` (title / price / meta) |
| Loading | full overlay | `blur` | `.loading-progress` dot bar |
| Marquee | mid band, 48px | `distort` | `.marquee-label` keyframe animation |
| Tooltip | small floating 180×70 | `blur` | `.tooltip-anchor` (parent hover reveals) |
| Footer band | bottom band, 50px | `blur` | `.footer-band-content` above |
| Stacked | top 42 + bottom 42 | `blur` | two sheets in same demo, independent fields |

## States

| State | Applied to | Effect |
|---|---|---|
| `data-filter="off/blur/distort/bright"` | `.sheet` | Selects the CSS filter mode. |
| `data-open="true"` | `#modal` | Shows the modal. Default `false` (`display: none`). |
| `data-toast="on"` | `#toast-tile` | CSS slides `.toast-frame` into view. |
| `data-revealed="true"` | `#reveal-tile` | CSS fades the sheet's opacity to 0, revealing the photo. |
| `.active` | `.filter-cycle button` | Marks the currently selected mode. |
| `.active` | `.layer-list li` | Highlights the hovered layer row. |
| `.on` | `.loading-progress span` | Marks a "filled" dot in the loader bar. |

## Rails — retheme hook

The hero is registered as `fields.get('hero')`. Clicking a `.rail-cell` calls:

- `data-rail="color"` → `heroField.setColor(value)`
- `data-rail="glyphs"` → `heroField.setGlyphs(value)`

Both methods are public on the Field class. New rails (e.g. fps, formula, font-size) plug in the same way — add a row of cells with the appropriate `data-rail` / `data-value` and a single line in the click handler.

## Embed surfaces (proposed API)

The embed footer previews the API surface the seed proposes — not yet implemented as a custom element here, but the Field class is structured to support it.

```html
<ascii-sheet height="200" color="#7b6fa5" filter="blur" formula="interference">
  <span slot="label">Hello world</span>
</ascii-sheet>
```

```js
sheet.config = {
  texture:   { glyphs: [' ', '·', '∙', '∘', '○', '◌', '◎', '⊙', '●'], fontSize: 11, fps: 20 },
  animation: { formula: (x, y, t) => myField(x, y, t), color: '#7b6fa5', speed: 0.025 },
  filter:    { mode: 'blur', blurPx: 10, tintAlpha: 0.4 }
};
```

## JavaScript

Single inline `<script>` at end of `<body>`:

- `GLYPH_SETS`, `FORMULAS` — pluggable maps.
- `class Field` — one canvas's worth of grid, formula, label-proximity carve, and render loop.
- `boot()` — walks `canvas[data-sheet]`, constructs a Field per canvas, registers in `fields: Map`.
- Filter-cycle interval + click handlers.
- Layer-list mouseenter → swap anatomy demo's filter mode.
- Modal, toast, reveal, loader-bar handlers.
- Rail click → `heroField.setColor` / `setGlyphs`.

All boot happens after `document.fonts.ready` so glyph metrics are stable on first measure.
