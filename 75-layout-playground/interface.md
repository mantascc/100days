# Interface

Layout-system playground. Floating components on a dark canvas with macOS-style hairline borders.

## Glossary

| Term | Element | Role |
|---|---|---|
| **Desktop** | `body` | OS-level background. Gradient (navy → mint). |
| **Shell** | `.shell` | The app window. Holds the titlebar and all floating components. Rounded, hairline-bordered, drop-shadowed. |
| **Titlebar** | `.titlebar` | 38px transparent top bar inside the shell. Carries traffic lights and the connection status dot. |
| **Traffic** | `.traffic__dot` | macOS close/minimise/maximise pills (12px). Cosmetic only. |
| **Status** | `.status` | Top-right indicator. Green glow dot + hover-revealed "Connected" label. |
| **Sidebar** | `.sidebar` | Left-floating panel, 240px. Holds nav / folders / account zones. Collapsible to a 46px header rail. |
| **Window** | `.window` | Right-floating palette, 44px collapsed. Expands to 320px when an icon is activated. Stack stays visible; selected icon is pressed-in. |
| **Canvas** | `.canvas` | Centred work area between sidebar and window. Transparent container — components inside float independently. |
| **Input** | `.input` | Composer block. Centered vertically in the canvas. Currently shows a wireframe placeholder rectangle. |

## Layout

```
┌─ desktop (body gradient) ────────────────────────────┐
│  ┌─ shell (#111114, rounded, hairline) ──────────┐   │
│  │  ┌─titlebar─────────────────────────────────┐ │   │
│  │  │ ● ● ●                              ● Connected │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │ ┌sidebar┐  ┌──── canvas ────┐  ┌window┐       │   │
│  │ │240px  │  │   (centered)   │  │44px  │       │   │
│  │ │       │  │                │  │      │       │   │
│  │ │ nav   │  │  ┌──input───┐  │  │ ◯    │       │   │
│  │ │ folders│ │  │ wireframe│  │  │ ▢    │       │   │
│  │ │ ⚙     │  │  └──────────┘  │  │ ▷    │       │   │
│  │ └───────┘  └────────────────┘  └──────┘       │   │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

Insets inside the shell: titlebar 38px tall, then each floating component anchored at `top: 46px` with a 16px gap to the bottom.

## Sizing

| Component | Default | Collapsed / Expanded |
|---|---|---|
| Sidebar | 240 × calc(100% − 62) | 240 × 46 (collapsed) |
| Window | 44 × 204 | 320 × calc(100% − 62) (expanded) |
| Canvas | 768 wide, vertically centered | — |
| Input | 768 wide, ~88 tall | — |
| Icon-btn | 28 × 28 | — |
| Lucide icon | 20 default, 16 `.i-sm` | stroke-width: 2 |

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--desktop` | `#0c0c0e` | Reserved (currently overridden by body gradient) |
| `--bg` | `#161618` | Reserved baseline canvas color |
| `--panel` | `#1f1f22` | Surface of sidebar, window, input |
| `--hairline` | `rgba(255,255,255,0.06)` | All borders |
| `--fg` | `#e8e8ea` | Primary text/icons |
| `--muted` | `#8a8a92` | Secondary text/icons, wireframe rectangles |
| `--attention` | `#f0b830` | Selected item / pending-state indicator |
| `--accent` | `#0a84ff` | Primary action (Apple system blue) |
| `--accent-hover` | `#1e91ff` | Accent hover state |

Shell background is currently a fixed darker variant `#111114` (between desktop and bg).

## Elevation

Three-layer subtle shadow on every floating panel:

```css
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.03) inset, /* top highlight */
  0 6px 18px rgba(0, 0, 0, 0.28),          /* ambient */
  0 1px 2px rgba(0, 0, 0, 0.35);           /* contact */
```

The shell itself sits one level higher (drop shadow `0 20px 60px`).

## Motion

- **Ease**: `cubic-bezier(0.4, 0, 0.2, 1)` (var `--ease`). Calm, no overshoot. Clear-channel.
- **Sidebar collapse**: body fades out (140ms) → resize (280ms, delayed 140ms).
- **Sidebar expand**: resize (280ms) → body fades in (140ms, delayed 280ms).
- **Window activate**: resize (280ms) → detail fades in (180ms, delayed 140ms). Stack stays visible.
- **Window deactivate**: detail fades out (180ms) → resize (280ms). Same pattern reversed.
- **Hover / active on icons**: 150ms ease.

## States

| State class | Applied to | Effect |
|---|---|---|
| `.is-collapsed` | `.sidebar` | Shrinks to 46px header-only rail; attention dot moves next to label |
| `.is-expanded` | `.window` | Widens to 320px and reveals `.window__detail` panel |
| `.is-active` | `.icon-btn` (in `.window`) | Pressed-in look (dark bg + inset shadow) |
| `.is-selected` | `.sidebar__item` | Replaces bullet icon with a 4×4 `--attention` dot |

## Icons

- Library: **Lucide** (CDN script)
- Stroke width: **2**
- Default size: **20px**
- Small variant: **16px** via `.i-sm`
- Used: `minimize`, `maximize`, `layout-dashboard`, `search`, `inbox`, `bell`, `folder`, `dot`, `settings`, `notebook-pen`, `bookmark`, `tag`, `archive`, `more-vertical`

## Typography

- Family: **JetBrains Mono** (loaded from Google Fonts)
- Base: 13px / 1.5 line-height
- Status label: 11px, 0.04em tracking
- Anti-aliasing: `-webkit-font-smoothing: antialiased`

## Wireframe placeholders

Text content is intentionally abstracted to rectangles so layout decisions aren't biased by copy.

| Element | Width × Height | Opacity |
|---|---|---|
| Sidebar label / window title | 64 × 8 | 0.35 |
| Sidebar item label (top nav) | 80 × 6 | 0.35 (rises to 0.6 on item hover) |
| Folder child item label | 64 × 5 | 0.25 |
| Input placeholder | 120 × 8 | 0.35 (fades on focus) |
| Attention dot | 4 × 4 | 1.0, `--attention` |
