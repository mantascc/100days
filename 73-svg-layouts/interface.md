# Day 73: SVG Layouts

## Idea
Schematic SVG wireframes of agent workspaces, animated entirely with CSS

## Description
Two interface "takes" rendered as inline SVG and cycled by a carousel: t1, an agent workspace where a full-width chat panel shrinks to let an artifact panel (grouped bars, a scatter plot, summary rows) slide in from the right; t2, a code workspace with file list, code editor, and an agent assistant column. Everything is drawn from primitives — `<rect>` for panels, `<line>` for "text", `<circle>` for dots, one `feDropShadow` for elevation. No fonts, no real text; the illusion of an interface comes from rectangles on a 6px outer-pad / 6px gap grid.

The motion is pure CSS keyframes, organised as a small grammar. Streaming rows: chat and code lines share one `stream-row` keyframe with inline per-row delays, fading in staggered on an 8s loop. Panel choreography: in t1 the chat panel's width (398 ↔ 248) and the artifact's translate/opacity share a synced 9s timeline, with `animation-fill-mode: backwards` so the scene opens in the closed state. A centering shift moves the chat content by half the width delta so it stays visually centred, and an accent `artifact-trigger` dot pulses on the agent message just as the artifact enters — suggesting causality.

Chrome is minimal: breadcrumb top-left, theme toggle top-right, prev/dots/next control bar bottom-centre, arrow keys also navigate. Three CSS-variable palettes (light default, OS dark via media query, explicit `data-theme` override persisted to localStorage) repaint the same SVG markup, since every fill and stroke is a `var()`.

## Data Concepts
- **Primary**: Visual (interface schematics, wireframe rendering)
- **Secondary**: Temporal (choreographed animation timelines)

## Conceptual Tags
#wireframe #schematic #agent-workspace #layout-systems #motion-choreography #lo-fi #design-exploration

## Technical Tags
#inline-svg #css-keyframes #css-variables #carousel #theme-toggle #localstorage #no-canvas

## Stack
- Single HTML file, copied from `armature/stage/soft-island-ideas.html`
- Inline 480×360 SVGs built only from rect/line/circle primitives
- CSS keyframe animation, no JS in the motion path
- CSS custom properties for light/dark theming with localStorage persistence
- Small vanilla JS for take switching, dots, keyboard nav, theme toggle

## Notes
- a departure from the canvas sketches — JS only handles state, all motion lives in CSS timelines
- `animation-fill-mode: backwards` with a 0.8s delay is what makes the scene start closed instead of flashing the open state
- the chat-content counter-shift (translate by half the panel's width delta) is the detail that sells the resize
- soft greens and clay accent instead of the series' usual #0a0a0a — closer to physical-product palettes
- breadcrumb links back to `../index.html`, the day-71 index
