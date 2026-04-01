# Day 56: Constrained Variation

> "Fix the scaffold. Switch the algorithm. Compare simultaneously."

A canvas-based viewer for exploring one visual axis at a time across eight simultaneous cells. Six chapters, each a different draw function family running through the same 4×2 grid and Peach palette.

[Live Demo](index.html)

---

## Concept

Constrained variation is a creative method: hold constants stable (palette, grid, timing loop, structure) and replace exactly one variable axis per chapter. Displaying all eight variants simultaneously turns iteration into taxonomy — you're mapping a possibility space, not searching for the best result.

The eye needs something fixed to perceive what changed. Constants do this work silently.

## Chapters

| # | Chapter | Axis explored |
|---|---------|---------------|
| 01 | **static** | noise types — dither, pixel noise, scanlines, bit crush, channel shift, low res, interference, corrupt |
| 02 | **interference** | wave interactions — two sources, moiré, beat frequency, standing wave, four sources, zone plates, lissajous field, rotating moiré |
| 03 | **scanlines** | scan patterns — drift, diagonal, pulse, venetian, grid, silk, stagger, frequency |
| 04 | **corrupt** | glitch modes — chunk, dissolve, melt, warp, skip, mirror, scatter, tile |
| 05 | **anna** | custom study |
| 06 | **blank** | output target — write new chapters here via the skill |

## How It Works

- Each chapter is a JS module in `chapters/` exporting `labels`, `drawFns`, `dt`, and `setup`
- The viewer lazy-loads chapters on navigation, rebuilds the 8-cell grid, and starts a shared `requestAnimationFrame` loop
- `dt=0` means static (no animation); any positive value drives the time accumulator
- A CLONE popover on the blank chapter shows the module template for writing new variants

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML5 Canvas
- CSS custom properties
- Peach palette: pink `[244,160,160]` → yellow `[244,216,122]`, background `#1A0F0A`

## Skill

This project ships a `constrained-variation-guide` skill (`skill.md`) for generating new chapters interactively. Paste `skill.md` into any AI assistant, then describe what you want:

```
remix tile but slower
something that feels like breathing
8 variations from still to broken
```

Your chapter appears as the next slot in the grid.

*Part of the 100 Days of Creative Coding challenge.*
