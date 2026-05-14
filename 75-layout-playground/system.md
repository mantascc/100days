# Design System

Foundational tokens and principles for the Mintis layout playground. For component-level documentation see [interface.md](interface.md).

## Fidelity

This is a **low-fidelity, structural prototype**. The goal is to explore the *system* — how regions nest, how they collapse and expand, how space is divided and how components relate — not to finalize visual design or copy.

Text is deliberately abstracted to wireframe rectangles. This keeps attention on layout, hierarchy, and behavior: you read the *shape* of the interface instead of its content. Color, elevation, and motion are resolved enough to judge the system, but every label is a placeholder bar. When a decision needs real fidelity (typography sizing, copy length, iconography), that is a separate, later pass — this artifact answers "is the structure right?".

## Principles

1. **Canvas is primary, always visible.** The center work area is never hidden, never overlapped. Sidebar and window are secondary — they yield to the canvas, not the other way around.
2. **Flat, with near-invisible structure.** No gradients on surfaces, no heavy borders. Depth comes from a single hairline (`rgba(255,255,255,0.06)`) and restrained shadow — the macOS approach.
3. **Everything floats.** Components are independent floating islands on the shell, each carrying its own elevation. Containers (like the canvas) are transparent.
4. **Abstract the content.** Text is represented by wireframe rectangles so layout decisions aren't biased by copy. Real text appears only where it's structural (the "Mintis" titlebar label).
5. **Calm motion ("clear-channel").** One easing curve, no overshoot, no bounce. Transitions are sequenced (content fades, then resize, then content fades back) rather than simultaneous.
6. **One entry point on mobile.** Below 768px everything secondary collapses behind a single burger. The canvas keeps the full width.

## Color tokens

| Token | Value | Role |
|---|---|---|
| `--desktop` | `#0c0c0e` | Reserved — deepest level (currently behind body gradient) |
| `--bg` | `#161618` | Reserved baseline surface |
| `--panel` | `#1f1f22` | Surface of every floating component (sidebar, window, input, chips) |
| `--hairline` | `rgba(255,255,255,0.06)` | Every border |
| `--fg` | `#e8e8ea` | Primary text and icons |
| `--muted` | `#8a8a92` | Secondary text/icons, wireframe rectangles |
| `--attention` | `#f0b830` | Pending / needs-attention indicator (4×4 dot) |
| `--accent` | `#0a84ff` | Primary action — Apple system blue |
| `--accent-hover` | `#1e91ff` | Accent hover state |
| — | `#111114` | Shell background — fixed half-step between `--desktop` and `--bg` |

Body desktop backdrop: `linear-gradient(135deg, #0e1830, #122a32 55%, #143028)` — navy → mint.

Interaction tints (not tokenized, used inline):
- Hover wash: `rgba(255,255,255,0.04–0.06)`
- Active wash: `rgba(255,255,255,0.08–0.1)`
- Pressed-in (window icons): `rgba(0,0,0,0.3)` + inset shadow

## Spacing scale

`2 · 4 · 8 · 16 · 32`

| Step | Typical use |
|---|---|
| 2 | Folder-tree row gaps |
| 4 | Icon-stack gaps, nav item gaps |
| 8 | Component padding, header padding, toolbar gaps |
| 16 | Shell insets, canvas band gaps, input padding |
| 32 | Sidebar zone separation |

Shell insets: components anchor at `top: 46px` (38px titlebar + 8) with a 16px gap to the shell edge.

## Radius

| Value | Use |
|---|---|
| 2 | Wireframe placeholder rectangles |
| 6 | Icon-button, chip inner labels |
| 8 | Folder selector |
| 10 | Floating panels (sidebar, window, input) |
| 12 | Shell |
| 14 | Chip (pill) |
| 50% | Dots (traffic, status, attention) |

## Elevation

Three tiers, all built from the same layered-shadow language.

**Floating panel** (sidebar, window, input):
```css
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.03) inset,  /* top highlight */
  0 6px 18px rgba(0, 0, 0, 0.28),           /* ambient */
  0 1px 2px rgba(0, 0, 0, 0.35);            /* contact */
```

**Floating chip / control** (`.float` — lighter):
```css
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.03) inset,
  0 4px 12px rgba(0, 0, 0, 0.25),
  0 1px 2px rgba(0, 0, 0, 0.3);
```

**Shell** (the window itself, highest):
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3);
```

## Motion

- **Easing**: `--ease: cubic-bezier(0.4, 0, 0.2, 1)` — the only curve. Calm, no overshoot.
- **Durations**: `0.14s` (content fade), `0.18s` (detail fade), `0.28s` (resize / position).
- **Sequenced pattern** — never resize and fade at once:
  - *Opening*: outgoing content fades (140ms) → resize (280ms, +140ms delay) → incoming content fades (140ms, +420ms delay).
  - *Closing*: the same, reversed.
- Hover / active feedback: `0.15s ease`.

## Typography

- **Family**: JetBrains Mono (Google Fonts), monospace fallback stack.
- **Base**: 13px / 1.5.
- **Sizes**: 11px (status label), 12px (titlebar title), 13px (base).
- **Smoothing**: `-webkit-font-smoothing: antialiased`.

## Icons

- **Library**: Lucide (CDN).
- **Stroke width**: 2 (never varies).
- **Sizes**: 20px default, 16px small (`.i-sm`).
- One size, one stroke — consistency reads as "production".

## Breakpoint

Single breakpoint at **768px**.
- `> 768px`: full three-region layout, canvas band reacts to sidebar/window state via `:has()`.
- `≤ 768px`: shell goes full-bleed, sidebar becomes a burger drawer, window folds away, canvas takes the full width.

## Wireframe placeholder specs

| Element | Size (w × h) | Opacity |
|---|---|---|
| Sidebar label / window title | 64 × 8 | 0.35 |
| Sidebar nav item label | 80 × 6 | 0.35 (→ 0.6 on hover) |
| Folder-child item label | 64 × 5 | 0.25 |
| Folder selector label | 72 × 6 | 0.35 |
| Chip label | 40 × 6 | 0.35 |
| Input placeholder | 120 × 8 | 0.35 (fades on focus) |
| Attention dot | 4 × 4 | 1.0 (`--attention`) |
