# Day 71: Index — 100 Days

## Idea
The landing page for the whole series: a grid of project cards, each with a live, procedurally animated ASCII thumbnail derived from the project's theme.

## Description
A single-file index of the 100-day sketchbook. A serif "Hej." masthead and a live count sit above a responsive card grid, one card per project, sorted newest-first and linking out to each sketch. The signature element is the thumbnail: rather than store screenshots, each card renders a canvas "glyph" generated on the fly from the project's id and primary theme. A hash of the id seeds the animation, and the first theme tag selects a distinct visual grammar — `ascii`/`field`/`audio` draw sine-interference dot fields, `network` draws orbiting nodes with edges, `physics` a phyllotaxis spiral, `agent` scattered directional strokes, `grid`/`color`/`type`/`ui`/`data` each their own rendering, with `type` stamping the title's first letter as a serif drop-cap. Every thumbnail animates continuously via `requestAnimationFrame`. Theme color comes from a shared palette map shown as a colored dot on each card.

## Data Concepts
- **Primary**: Collection (catalog, index, project registry)
- **Secondary**: Categorical (theme taxonomy and color coding), Procedural (seeded per-project generative glyphs)

## Conceptual Tags
#index #catalog #generative-thumbnails #procedural-identity #ascii-art #taxonomy #specimen-grid #computational-aesthetics

## Technical Tags
#react #babel-standalone #canvas2d #requestanimationframe #seeded-hash #cdn-react #data-driven-ui

## Stack
- React 18 + ReactDOM + Babel Standalone, all from unpkg CDN, transpiled in-browser (`type="text/babel"`)
- Three inline data structures on `window`: `PROJECTS`, `THEMES` (label + color), `THEME_ORDER`
- `renderGlyph(canvas, project, opts)` + `animateGlyph()` — Canvas 2D, monospace text cells, per-theme branches
- Deterministic seed from a bit-shift string hash of `project.id`; Instrument Serif + JetBrains Mono via Google Fonts

## Notes
- No stored thumbnail assets — every card's image is generated from its id. This is the strongest idea here: the catalog's visual identity is computed, not curated, so adding a project instantly gets a unique animated glyph for free.
- Theme drives the glyph's visual grammar, so the grid reads as a typology at a glance — you can spot the network sketches vs. the field sketches by silhouette. The shared `THEMES` color map ties dot, glyph, and tag together.
- Every card runs its own rAF loop. Fine at ~70 cards, but this will not scale to a few hundred animated canvases without virtualization or pausing off-screen tiles. Known ceiling.
- The seed only varies *within* a theme (id hash tweaks frequencies, counts, offsets); the branch is chosen by theme. So two `grid` projects look related but not identical — intended family resemblance, worth preserving.
- `day` is mostly integer but `15b` uses `15.5` to sort the variant correctly — a small hack in an otherwise clean data model. Fine, but a `sortKey` field would be cleaner if more variants appear.
- This file doubles as the canonical project registry (id, day, title, themes, desc). Other sketches reference the same concept (day-54 concept-graph). Keeping descriptions here in sync with each sketch's own interface.md is an ongoing maintenance risk.
- Cards link to `../{id}/index.html` by relative path, so the index assumes the flat sibling-folder layout of the 100days directory. Moving it breaks every link.
