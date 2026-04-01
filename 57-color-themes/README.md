# Day 57: Color Themes

> "Color as a system variable, not decoration."

The constrained-variation viewer rebuilt as a color-theme instrument. The chapter structure stays fixed — six chapters, eight cells, identical motion systems — but the palette becomes the variable axis.

[Live Demo](index.html)

---

## Concept

Four themes (Peach, Clay, Aus, Ube) remap the same visual logic into different emotional registers. Switching themes while staying on the same chapter makes the palette difference legible in isolation — comparison happens in place, not in memory.

The result is a small taxonomy of palette identity: warm softness, earthen neutrals, and cooler synthetic tones all running through the same scaffold.

## Themes

| Theme | Character |
|-------|-----------|
| **Peach** | Warm pink → yellow gradient, dark brown ground |
| **Clay** | Earthen neutrals, muted ochres |
| **Aus** | Cooler, more synthetic tones |
| **Ube** | Muted purple, dusty rose, latte brown — soft and melancholic |

## How It Works

- Themes live in a single registry file (`themes.js`); the rest of the app reads from it
- Adding or removing a theme is a data change, not a project fork
- Theme switching preserves the active chapter — comparison stays local
- UI chrome uses a near-white accent with a small theme tint rather than full palette color
- The entropy chapter is particularly revealing: order, orbit, wobble, staircase, burnout, storm, and whiteout all shift character under each palette family

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML5 Canvas
- CSS custom properties
- Theme registry + chapter factories

*Part of the 100 Days of Creative Coding challenge.*
