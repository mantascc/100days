# Day 71: Index — 100 Days

## Idea
Landing page for the series — every project gets a live animated ascii glyph

## Description
The index page for the whole collection: a hero ("Hej." in Instrument Serif, count out of 100, a nod to Tiantian Xu), then a 1px-gap grid of cards, one per project, each linking to `../<id>/index.html`. The catalogue is a hardcoded `window.PROJECTS` array of ~70 entries with day number, title, one-line description, and theme tags drawn from an eleven-theme vocabulary (ascii, network, field, audio, color, type, grid, physics, agent, ui, data), each theme mapped to a color.

The thumbnails are not screenshots. `renderGlyph()` draws a small ascii-character canvas per project, dispatching on the project's primary theme: sine-cosine interference fields of dot or wave glyphs for ascii/field/audio, orbiting node rings with dotted edges for network, a golden-angle spiral for physics, drifting stroke characters for agent, block-density bands for color, a giant serif initial for type, bar-chart columns for data, wireframe rows for ui. The project id is hashed into a seed, so every project gets a stable but distinct variant, and a rAF loop keeps all visible glyphs animating at once.

The whole thing is a single HTML file running React 18 UMD with Babel standalone compiling JSX in the browser — no build step, consistent with the rest of the series. The glyph renderer itself is plain vanilla JS, exposed on `window` and called from a React effect.

## Data Concepts
- **Primary**: Visual (procedural thumbnails, ascii rendering)
- **Secondary**: Network (the series as a catalogued, themed collection)

## Conceptual Tags
#index #meta-visualization #procedural-thumbnails #ascii-art #generative-identity #self-documentation #portfolio

## Technical Tags
#react #babel-standalone #canvas-2d #requestanimationframe #string-hashing #single-file

## Stack
- Single HTML file, React 18 + ReactDOM UMD from unpkg
- Babel standalone for in-browser JSX (no build)
- Canvas 2D glyph renderer in vanilla JS, dpr-aware
- JetBrains Mono + Instrument Serif via Google Fonts
- Hardcoded project catalogue with theme taxonomy

## Notes
- a sibling of day 54's concept graph — same idea (the collection as data) but as a browsable grid rather than a force layout
- the glyph-per-theme dispatch means new projects get a thumbnail for free; nothing is drawn by hand
- the id hash seeds frequency and speed, so two projects sharing a theme still animate differently
- every card's canvas runs its own rAF loop simultaneously; `canvas.isConnected` is the only cleanup guard
- the eleven-theme tag set here is looser and more practical than the eight formal data concepts in interface-schema.md
