# ASCII Sheet — Seed

*A reusable elevated banner: animated ASCII texture + filter sheet over scrolling content.*

Reference implementation: [`daily-sketch/sketch-sticky-banner/index.html`](daily-sketch/sketch-sticky-banner/index.html)

---

## Idea

An overlay strip pinned to the top of a page. Two layers stacked:

1. **Filter sheet** — sits above the scrolling page, processes what passes underneath (blur, tint, distortion).
2. **ASCII texture** — animated glyph field rendered on canvas, floats on top of the filter sheet.

Optional **label box** (e.g. "Hello world") punches through both layers with an opaque black background so type stays legible against the texture.

The strip captures pointer events so scrolled-under content is non-interactive — the elevated layer is visual only.

---

## Anatomy

```
.banner            position: fixed, pointer-events: auto, no background
├── .filter-sheet  backdrop-filter (blur | url(#distort)), tint
├── canvas         ASCII glyph field, destination-out trail
└── .banner-label  opaque black box, pointer-events: none
```

Plus a sibling `<svg>` with `<filter id="banner-distort">` (`feTurbulence` + `feDisplacementMap`) — `<defs>` must live in light DOM for `backdrop-filter: url(#…)` to resolve.

---

## Config (three groups)

```js
{
  texture: {
    glyphs:     [' ', '·', '∙', '∘', '○', '◌', '◎', '⊙', '●'],
    fontSize:   11,
    fontWeight: 300,
    fps:        20,
    trail:      0.35,    // alpha per frame of destination-out erase
  },
  animation: {
    formula: (x, y, t) =>                    // returns 0..1
      (Math.sin(x*0.1+t) + Math.cos(y*0.12-t*0.7) + Math.sin((x+y)*0.05+t*0.5) + 3) / 6,
    color:   '#7b6fa5',                      // ube-violet
    speed:   0.025,                          // t increment per frame
  },
  filter: {
    mode:          'blur',                   // 'off' | 'blur' | 'distort'
    blurPx:        10,
    tintAlpha:     0.4,                      // 0.6 for distort by default
    distortScale:  14,
    baseFrequency: '0.012 0.028',
    octaves:       2,
    seed:          4,
  }
}
```

---

## Three ways to tweak

| Surface | Use case | Power |
|---|---|---|
| **HTML attributes** | Drop-in sketches: `height`, `color`, `filter`, `formula="ripple"` (preset) | Strings/presets only |
| **JS `el.config = {…}`** | Custom formula functions, full override | Full |
| **Built-in tweak panel** | Live prototyping: opt-in via `<ascii-banner controls>`, with "copy config" snapshot button | Full + live |

Layer them: ship sketches with attributes, prototype with the panel, graduate to JS config when a custom formula is needed.

---

## Formula presets

| Name | Function |
|---|---|
| `interference` (default) | `(sin(x·0.1+t) + cos(y·0.12-t·0.7) + sin((x+y)·0.05+t·0.5) + 3) / 6` |
| `ripple` | Radial sinusoid from center, distance-based phase |
| `noise` | Value noise sampled at low frequency |
| `flow` | Perlin-like flow, x/y advected over time |

All formulas return `0..1`; the texture maps that range across the `glyphs` array.

---

## Filter modes

| Mode | Effect |
|---|---|
| `off` | Pure ASCII on transparent ground — content fully visible |
| `blur` | `backdrop-filter: blur(10px)` + 40% black tint |
| `distort` | `backdrop-filter: url(#banner-distort)` (turbulence + displacement) + 60% black tint |

Distort uses ~0.012–0.028 base frequency to roughly match the ASCII glyph grid period, so the displaced text reads as "rippling along the ASCII flow" rather than random noise.

---

## Composition contract

- **Pointer events**: banner `auto` (captures all), label and filter sheet `none`.
- **Z-order**: banner z:10, toggle controls z:20, content z:0.
- **Scroll offset**: host page adds `padding-top: var(--banner-h)` so content starts below the strip.
- **Label proximity**: the canvas reads the label bounding box and shrinks glyphs near its edges (`evals` proximity field) so type sits cleanly in the texture.
- **Font**: IBM Plex Mono 300; wait for `document.fonts.ready` before first render so glyph metrics are stable.

---

## Open questions

- Should the component own the `padding-top` offset on its parent, or leave that to the host?
- Worth a `theme="light"` variant (white text/glyphs over translucent white sheet)?
- Multiple banners on one page need unique SVG filter IDs — auto-suffix?
