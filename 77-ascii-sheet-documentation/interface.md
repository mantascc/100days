# Interface

Component reference for **ASCII Sheet Documentation**.

## Concept

The ASCII Sheet is a fixed banner layer for pages that need a persistent visual signal. It combines a backdrop-processing sheet with a canvas-rendered ASCII field. The documentation page shows how the same component can shift between editorial, operational, event, portfolio, and playground use cases.

## Anatomy

```
.banner            fixed top layer, captures pointer events
├── .filter-sheet  backdrop blur or SVG displacement filter
└── canvas         animated ASCII glyph field

.top-controls      fixed right-side control surface
```

The earlier centered label box has been removed. The right-side label input is now the only visible label/control surface, which keeps the banner itself as a pure visual component.

## Banner

| Element | Role |
|---|---|
| `.banner` | Fixed top strip, `height: var(--banner-h)`, above page content. |
| `.filter-sheet` | Transparent, blurred, or distorted backdrop layer. |
| `#banner-field` | Canvas drawing the glyph texture. |
| `#banner-distort` | Light-DOM SVG filter used by `backdrop-filter: url(#banner-distort)`. |

## Controls

| Control | Values | Effect |
|---|---|---|
| Filter | `off`, `blur`, `distort` | Changes the backdrop-processing layer. |
| Formula | `interference`, `ripple`, `flow` | Changes the animated glyph field. |
| Label input | Free text | Updates the serialized config snapshot. |
| Swatches | Violet, green, amber, cyan | Changes glyph color/accent. |
| Variant cards | Six presets | Applies a complete banner personality. |

## Scroll Presets

Each section carries `data-case`. An `IntersectionObserver` applies the matching config as sections enter focus.

| Case | Label | Filter | Formula | Glyph set | Tone |
|---|---|---|---|---|---|
| `hero` | `SIGNAL LAYER` | blur | interference | soft | default product hero |
| `editorial` | `FIELD NOTES` | blur | interference | soft | quiet masthead |
| `dashboard` | `SYSTEM ONLINE` | distort | flow | terminal | operational ribbon |
| `event` | `LIVE SIGNAL` | distort | ripple | math | launch/event signal |
| `portfolio` | `INDEX` | blur | noise | minimal | light translucent rail |
| `gallery` | `PRESET GALLERY` | off | flow | soft | transparent texture |
| `playground` | `COPY CONFIG` | blur | interference | soft | documentation/config state |

## JavaScript

- `AsciiField` owns canvas sizing, glyph metrics, animation timing, and drawing.
- `cases` stores section-level configs.
- `applyConfig()` updates CSS variables, filter attributes, active controls, and the config snapshot.
- Preview cards instantiate small independent `AsciiField` canvases.

## Composition Notes

- The page body uses `padding-top: var(--banner-h)` so content begins below the fixed sheet.
- The banner intentionally captures pointer events, making scrolled-under content visually present but non-interactive in that strip.
- The SVG filter definitions remain in light DOM so `backdrop-filter: url(#banner-distort)` resolves correctly.
- The centered label/punch-through behavior is no longer active in this documentation variant.
