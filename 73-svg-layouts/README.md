# sketch-73-svg-layouts

Schematic SVG mockups of agent / code workspaces. A single self-contained HTML file that renders interface "takes" as inline SVG and animates them with CSS.

Source: `armature/stage/soft-island-ideas.html`.

## System (high level)

### 1. Takes carousel
The page holds N `<figure class="take">` blocks. Only one is visible at a time (`.take--active`). A small floating control bar (`prev` / dots / `next`) and arrow keys cycle through them. The active index is stored in a single `active` integer; `show(i)` toggles the class, updates the dots, and disables the buttons at the ends.

### 2. Each take is one inline SVG
A take is a 480×360 SVG drawn entirely from primitives — `<rect>` for panels, `<line>` for "text" rows, `<circle>` for dots, plus a single `feDropShadow` filter for elevation. No fonts, no real text. The illusion of an interface comes from rectangles arranged on a 6 px outer-pad / 6 px inter-panel-gap grid.

### 3. Theme system
Three CSS variable sets drive everything:
- light defaults on `:root`
- dark defaults inside `@media (prefers-color-scheme: dark)`
- explicit override via `:root[data-theme="dark"|"light"]`

The toggle button writes the chosen theme to `localStorage` (`armature-theme`) and sets `data-theme` on `<html>`. SVG fills/strokes use `var(--fg)`, `var(--muted)`, `var(--accent)`, etc., so the same markup repaints itself when the palette swaps.

### 4. Animation grammar
Three reusable patterns, all pure CSS:

- **Streaming rows** — chat lines and code lines share `.stream-row` / `.code-line` with one keyframe (`stream-row`). Each row gets an inline `animation-delay` so they appear staggered, fade in, hold, then fade out on a synced 8 s loop.
- **Panel choreography** — in T1 the chat panel's `width` and the artifact panel's `transform`/`opacity` share a 9 s `ease-in-out` timeline (`chat-resize`, `artifact-slide`). They open the artifact, hold, and close in sync. `animation-fill-mode: backwards` plus an `0.8 s` delay makes the scene start in the "closed" state.
- **Centering shift** — because the chat panel resizes, its inner content shifts (`chat-content-shift`) by half the width delta to stay visually centered. A small `artifact-trigger` accent dot pulses at the moment the artifact enters, suggesting causality.

### 5. Chrome
A fixed breadcrumb (top-left) and theme toggle (top-right) sit above the content with `z-index: 10`. The control bar is bottom-centered. All chrome uses the same `--elev1` / `--stroke` tokens as the SVGs, so the page reads as one surface.

## Files

- `index.html` — the sketch (copied from the armature source)
