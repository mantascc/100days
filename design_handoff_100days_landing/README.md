# Handoff: 100days landing page

Three landing-page directions for [`mantascc/100days`](https://github.com/mantascc/100days), each with an initial (v1) and iterated (v2) version. All built in the **Clear Channel** design system.

## About the design files

The files in this bundle are **design references authored in HTML + React-via-Babel prototypes**. They are not production code and should not be shipped verbatim. The task is to **recreate these designs inside the `100days` repo** — which is a collection of single-file `index.html` experiments with no build pipeline. The landing page should match that grain: a single static `index.html` at the repo root, vanilla JS or inline Babel-transpiled React if needed, no bundler, no dependencies beyond what the prototypes already pull from CDNs.

If you want to introduce a tiny build step later, that's fine — but lean static first; the rest of the repo is handcrafted single files.

## Fidelity

**High-fidelity.** Colors, type, spacing, motion, and interactions are final. Implement pixel-parity with the v2 (iterated) version of whichever direction the user picks. The v1 versions are preserved for reference — they show what the v2 iterated away from.

## Open the prototype

Open `100days-landing.html` in a browser. It presents all six artboards on a pan/zoom design canvas. Click any artboard label to open it fullscreen; ←/→ cycles within a section, ↑/↓ jumps between sections.

## Three directions

### 1. Glyph thumbnails
- **Files:** `variants/V2ThumbnailGridV1.jsx` (v1), `variants/V2ThumbnailGrid.jsx` (v2)
- **Layout:** Serif hero ("specimens."), centered 1040px column, 240px-min auto-fill card grid. v2 adds a theme-filter chip row and a featured-first hero card (380px live glyph + copy).
- **Thumbnails:** each card renders a **live animated ASCII/dot glyph** drawn on a `<canvas>`, colored by the project's primary theme. Implementation: `data/glyph.js#animateGlyph`. Pull this verbatim; it's deterministic, cheap, and is the aesthetic hook of the whole page.
- **Interaction:** hover lifts border to the theme color and reveals the full theme list inside the thumbnail. Click opens `../<id>/index.html` (sibling folders in the 100days repo).
- **Hero card (v2 only):** largest glyph on the page (380px square), theme-colored. Acts as editorial feature — probably "the most recent project" in production.

### 2. Calendar field
- **Files:** `variants/V4CalendarV1.jsx` (v1), `variants/V4Calendar.jsx` (v2)
- **Layout:** 10×10 grid, one cell per day, 900–1040px column. Sidebar readout (v2) shows the hovered/selected project. Legend row at bottom shows theme counts.
- **Cells:** v2 cells each render a **mini live glyph** (66px) inside the square. Empty days are `✗` or blank. "now" marker on the highest-numbered landed day (with `color-success` green).
- **Interaction (v2):** click-to-select is sticky, arrow keys walk the grid (↑↓ moves by 10, ←→ moves by 1), Enter opens the project, double-click opens immediately. Selected cell glows in its theme color.

### 3. Constellation
- **Files:** `variants/V6ConstellationV1.jsx` (v1, static polar), `variants/V6Constellation.jsx` (v2, force simulation)
- **Layout:** 820×620 SVG canvas + 280px sidebar readout. Title "star *chart*" in serif with cyan italic emphasis.
- **v1:** static polar placement — themes get wedges, projects deterministically placed on arcs. No physics. Cheapest to ship.
- **v2:** full **force simulation** inside a `requestAnimationFrame` loop — repulsion, springs on edges, radial pull toward theme anchor. Nodes are **draggable** (pointer capture, pinned while held). Canvas supports **drag-to-pan** on empty space and **scroll-to-zoom** focused on the cursor.
- **Edges:** solid lines link each project to its nearest neighbor in the same theme. Dashed lines (v2) bridge any two projects that share ≥2 themes across different primary clusters.
- **Stars:** each node gets a radial-gradient halo and a subtle twinkle (sin-driven opacity). Hover/select reveals the title label above the node.

## Data

- `data/projects.js` exports `window.PROJECTS` (array) + `window.THEMES` (color map) + `window.THEME_ORDER` (taxonomy order).
- Theme taxonomy: `ascii, network, field, audio, color, type, grid, physics, agent, ui, data`. Each theme has a single hex — these are the ANSI-adjacent colors from Clear Channel (see `ds/colors_and_type.css`).
- Each project has: `id` (folder name in the repo), `day` (int), `title`, `themes` (array, primary first), `desc` (Clear Channel lab-note voice, 1 sentence), optional `disabled` for archived days.
- **Update path:** as new projects land in the repo, append to `PROJECTS`. The landing page recomputes counts, legend, and "now" marker automatically.

## Design tokens (Clear Channel)

See `ds/colors_and_type.css` for the canonical list. Essentials:

### Colors
- `--bg: #0a0a0a` (signature canvas — not pure black)
- `--bg-alt: #0f0f0f` (card surface)
- `--fg: #ffffff`, `--fg-2: #ccc`, `--fg-3: #888`, `--fg-4: #666`, `--fg-5: #444`
- `--border: #222`, `--border-hover: #333`, `--border-active: #444`
- **Accent (theme colors):**
  - ascii `#39c5cf` · network `#58a6ff` · field `#bc8cff` · audio `#d29922` · color `#f85149`
  - type `#f0e8d4` · grid `#888` · physics `#3fb950` · agent `#bc8cff` · ui `#58a6ff` · data `#d29922`

### Type
- Body / UI: `'JetBrains Mono', monospace` — everything text by default.
- Display: `'Instrument Serif'`, 48–112px for hero titles. Pair it with tight letter-spacing (`-0.02em` to `-0.03em`).
- Micro labels: 10–11px, `text-transform: uppercase`, `letter-spacing: 0.08em`–`0.12em`, color `#555`–`#666`.

### Spacing
8-px rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Generous outer padding (`48px 40px` to `64px 48px`).

### Borders & corners
- 1px solid `#222` is THE border. Never thicker.
- Square corners by default. Borders are the UI language; rounding is deliberate and rare.

### Motion
- `transition: all 0.2s` default. No springs, no bounces.
- Hover: border shifts from `#222` → theme color or `#444`. Color nudges one stop lighter.
- The only heavy motion is the glyph canvas animation and the V6 force sim — both `requestAnimationFrame` driven.

### Iconography
Unicode only — no SVG icons, no emoji. `✓ ✗ ⚠ ● ○ → ├── └──` etc., inheriting `currentColor`. See `colors_and_type.css`.

## Files in this bundle

```
100days-landing.html              ← canvas shell; open in browser
design-canvas.jsx                 ← pan/zoom framework (reference only; strip for prod)
data/
  projects.js                     ← PROJECTS, THEMES, THEME_ORDER
  glyph.js                        ← animateGlyph(canvas, project, opts) — ship verbatim
ds/
  colors_and_type.css             ← design tokens
  logo-mono.svg, logo-serif.svg   ← wordmarks
variants/
  V2ThumbnailGridV1.jsx, V2ThumbnailGrid.jsx
  V4CalendarV1.jsx,      V4Calendar.jsx
  V6ConstellationV1.jsx, V6Constellation.jsx
```

The `design-canvas.jsx` file is only the presentation shell for reviewing variants side-by-side — **do not ship it**. The production landing page should render a single direction full-bleed.

## Build path (suggested)

1. Pick one direction with the user (Thumbnails, Calendar, or Constellation).
2. Copy the corresponding `variants/*.jsx` file's JSX into a new `index.html` at the repo root.
3. Inline `projects.js` + `glyph.js` in `<script>` tags. Keep React + Babel standalone via CDN — that matches the repo's "no build" ethos.
4. Remove the `window.*` exports at the bottom of the variant file; the root `index.html` only needs one component.
5. Wire links to `./<project-id>/index.html` (they already point at `../<id>/index.html` because the prototype lives inside a sibling folder).

## Known details

- The constellation force sim uses a `React.useReducer` tick to force re-render on every RAF — crude but stable at 68 nodes. If you scale it, swap to a ref-driven SVG attribute loop.
- `animateGlyph` chooses one of ~8 field styles based on the project's primary theme; see the switch inside `data/glyph.js`.
- Disabled projects (`disabled: true`) render with an `✗` mark in the calendar and are excluded from the grid/constellation.
