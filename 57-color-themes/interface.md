# Day 57: Color Themes

## Idea
Theme-switchable constrained-variation viewer that remaps a fixed sketch system through multiple palettes

## Description
This project turns the constrained-variation viewer into a color-theme instrument. The underlying chapter structure stays fixed: six chapters, eight cells per chapter, identical motion systems, and a consistent UI scaffold. What changes is the palette. Each theme remaps the same visual logic into a different emotional register, making color feel like a first-class variable rather than a finishing layer.

The viewer currently ships with three themes: Peach, Clay, and Aus. A compact selector swaps themes while preserving the active chapter, so comparisons happen in place. The result is a small taxonomy of palette identity: warm softness, earthen neutrals, and cooler synthetic tones all run through the same scaffold. The entropy chapter pushes this further by showing how order, orbit, wobble, staircase buildup, burnout, storm, and whiteout shift under each palette family.

The implementation is registry-driven. Themes live in one file, and the rest of the app reads from that registry. Adding or removing a theme is a small data change instead of a new project fork. That makes the sketch less about one chosen palette and more about palette systems as a reusable creative coding structure.

## Data Concepts
- **Primary**: Visual (palette systems, color remapping, comparative display)
- **Secondary**: Statistical (taxonomy, controlled variation), Temporal (animated chapter states)

## Conceptual Tags
#color-themes #palette-systems #constrained-variation #comparative-display #taxonomy #visual-identity #theme-switching #entropy

## Technical Tags
#canvas #vanilla-js #theme-registry #module-architecture #generative-art #palette-interpolation

## Stack
- HTML5 Canvas
- Vanilla JavaScript modules
- CSS custom properties
- Theme registry + chapter factories

## Notes
- The same sketch system is reused across themes to keep comparison legible
- UI chrome uses a shared near-white accent with a small theme tint rather than full palette color
- Theme switching preserves the active chapter so comparison stays local
- The project grew out of extracting the daily sketch into a numbered standalone day
- Color is treated as a system variable, not just decoration
