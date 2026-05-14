# Interface

Component reference for the Mintis layout playground. For tokens and principles see [system.md](system.md).

## Glossary

| Term | Element | Role |
|---|---|---|
| **Desktop** | `body` | OS-level background. Gradient (navy → mint). |
| **Shell** | `.shell` | The app window. Fixed `#111114` background, hosts the titlebar and all floating components. |
| **Titlebar** | `.titlebar` | 38px transparent top bar. Traffic lights, centered "Mintis" title, status dot. On mobile: burger replaces traffic lights. |
| **Traffic** | `.traffic__dot` | macOS close/minimise/maximise pills (12px). Cosmetic. Hidden on mobile. |
| **Burger** | `.titlebar__burger` | `menu` icon, mobile only. Toggles the sidebar drawer. |
| **Status** | `.status` | Top-right. Green glow dot + hover-revealed "Connected" label. |
| **Sidebar** | `.sidebar` | Left-floating panel. Two states: expanded full panel (240px) and collapsed icon-rail island (44×208). Starts collapsed. |
| **Window** | `.window` | Right-floating tool palette. 44px collapsed, expands in place to 320px. Hidden on mobile. |
| **Canvas** | `.canvas` | Centered work area. Fluid, capped at 768px, lives in the band between sidebar and window — never overlaps either. |
| **Input** | `.input` | Composer block, vertically centered in the canvas. Tall single field with a wireframe placeholder. |
| **Toolbar** | `.canvas__toolbar` | Row above the input: folder selector + two quick-action chips. |
| **Scrim** | `.scrim` | Mobile-only backdrop behind the sidebar drawer. |

## Layout

```
┌─ desktop (body gradient) ─────────────────────────────────┐
│  ┌─ shell (#111114) ───────────────────────────────────┐  │
│  │ ┌titlebar────────────────────────────────────────┐  │  │
│  │ │ ● ● ●               Mintis            ● Connected │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │ ┌rail┐    ┌──────── canvas ────────┐      ┌window┐   │  │
│  │ │ ⤢  │    │  [📁▾] [▭] [▭]          │      │ ◳     │   │  │
│  │ │ ▦  │    │                        │      │ 📁    │   │  │
│  │ │ ⌕  │    │   ┌── input ──────┐     │      │ ▭     │   │  │
│  │ │ ▢  │    │   │  ▭             │     │      │ #     │   │  │
│  │ │ ⌖  │    │   └───────────────┘     │      │ ▤     │   │  │
│  │ │ ┌┐ │    └────────────────────────┘      │ ⋮     │   │  │
│  │ └────┘                                    └───────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

Components anchor at `top: 46px` (38px titlebar + 8). 16px gap to shell edges.

## Sidebar

Two distinct states that crossfade-and-resize (never simultaneous).

**Expanded** (`.sidebar__full`, 240 × calc(100% − 62))
- `.sidebar__header` — wireframe label + minimize toggle
- `.sidebar__body` — three zones separated by 32px gap:
  - `--nav` — 4 items (dashboard, search, inbox, bell)
  - `--folders` — `flex: 1`, scrolls; folders with indented `dot` children; one child carries `.is-selected`
  - `--account` — single settings icon-button, right-aligned

**Collapsed** (`.sidebar__rail`, 44 × 208 floating island)
- `maximize` expand icon at top
- 4 nav icons (dashboard, search, inbox, notifications)
- `.sidebar__slot` — dashed empty notification slot holding a 4×4 `--attention` dot

Only the top `maximize` icon expands the rail; the nav icons are inert. The header `minimize` collapses it.

## Window

Single `.window` element, two layers, row-reverse layout.

- `.window__stack` — always-visible 44px icon column (notebook-pen, folder, bookmark, tag, archive + `more-vertical` overflow)
- `.window__detail` — revealed when expanded; `.window__header` with a 64×8 wireframe title

Clicking a stack icon expands the window to 320px and gives that icon a pressed-in state (`.is-active` — dark bg + inset shadow). Clicking the active icon again collapses it. The overflow icon is inert.

## Canvas

- `position: absolute`, `top: 46 / bottom: 16`
- Band: `left: 272px` (clears sidebar), `right: 76px` (clears window)
- `width: auto`, `max-width: 768px`, auto margins → centered within the band
- **Reactive** (desktop, `@media min-width: 769px`, via `:has()`):
  - `.sidebar.is-collapsed` → `left: 76px`
  - `.window.is-expanded` → `right: 352px`
- Vertically centers its children (`justify-content: center`, 16px gap)

### Toolbar
- `.folder-select` — pill: folder icon + 72×6 wireframe label + chevron-down
- `.chip` ×2 — pill: 40×6 wireframe label
- All carry `.float` (lighter elevation shadow)

### Input
- Tall single field (`min-height: 56px`, 16px padding)
- `.input__placeholder` — 120×8 wireframe bar, fades on focus / when filled
- No send button

## States

| State class | Applied to | Effect |
|---|---|---|
| `.is-collapsed` | `.sidebar` | Crossfades to the 44×208 icon-rail island |
| `.is-open` | `.sidebar` + `.scrim` | Mobile only — slides the sidebar drawer in over the scrim |
| `.is-expanded` | `.window` | Widens to 320px, reveals `.window__detail` |
| `.is-active` | `.icon-btn` (in `.window`) | Pressed-in look (dark bg + inset shadow) |
| `.is-selected` | `.sidebar__item` | Replaces the bullet with a 4×4 `--attention` dot |

## Responsive

Single breakpoint at **768px**.

| | Desktop (`> 768px`) | Mobile (`≤ 768px`) |
|---|---|---|
| Shell | Floating, rounded, bordered | Full-bleed, no radius/border |
| Titlebar | Traffic lights | Burger replaces traffic lights |
| Sidebar | Collapsible island, in-flow | Off-canvas left drawer, burger-triggered, always shows full panel |
| Window | Visible, expandable | `display: none` |
| Canvas | Reactive band between neighbors | Full width, 12px insets |
| Scrim | — | Backdrop behind the open drawer |

## Icons

- Library: **Lucide** (CDN). Stroke width **2**. Default **20px**, small **16px** via `.i-sm`.
- Used: `menu`, `minimize`, `maximize`, `layout-dashboard`, `search`, `inbox`, `bell`, `folder`, `dot`, `settings`, `chevron-down`, `notebook-pen`, `bookmark`, `tag`, `archive`, `more-vertical`.

## JavaScript

Minimal, inline at end of `<body>`:
- `lucide.createIcons()` — renders icons
- Burger ⇄ scrim ⇄ `.sidebar.is-open` — mobile drawer toggle
- `.window__stack` icon clicks — toggle `.is-expanded` + `.is-active` (overflow excluded)

Sidebar collapse/expand and folder-rail expand are handled by inline `onclick` attributes.
