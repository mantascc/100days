# Day 56: Constrained Variation

## Idea
Fix the scaffold, switch the algorithm, compare eight variants simultaneously

## Description
A canvas-based viewer for exploring one visual axis at a time across eight simultaneous cells. Six chapters — static, interference, scanlines, corrupt, anna, blank — each a different draw-function family running through the same 4×2 grid and Peach palette (pink `[244,160,160]` → yellow `[244,216,122]` on `#1A0F0A`).

The project doubles as a documented creative method (see `constrained-variation.md`): hold constants stable (palette, grid, timing loop, structure) and replace exactly one variable axis per chapter. The eye needs something fixed to perceive what changed. Simultaneous display is the second load-bearing move — sequential iteration produces search (looking for the best), simultaneous display produces taxonomy (mapping the space).

Each chapter is an ES module in `chapters/` exporting `labels`, `drawFns`, `dt`, and `setup`. The viewer lazy-loads chapters on hash navigation, rebuilds the 8-cell grid, and drives a shared requestAnimationFrame loop; `dt=0` means static, any positive value feeds the time accumulator. The blank chapter is an output target: the project ships a `constrained-variation-guide` skill (`skill.md`) that any AI assistant can use to write new chapters into `chapters/blank.js`, and a CLONE popover auto-opens there showing the module template.

## Data Concepts
- **Primary**: Visual (generative texture families, glitch/wave/scanline algorithms)
- **Secondary**: Temporal (shared time accumulator, per-chapter frame pacing)

## Conceptual Tags
#constrained-variation #possibility-space #taxonomy-not-search #creative-method #constants-as-reference-frame #glitch #moire #ai-collaboration

## Technical Tags
#canvas #es-modules #dynamic-import #raf-loop #hash-routing #skill-file

## Stack
- Vanilla JavaScript (ES modules, dynamic `import()` per chapter)
- HTML5 Canvas
- CSS custom properties (Peach palette)
- `skill.md` interaction pattern for generating new chapters

## Notes
- the method essay is the real artifact; the viewer is its demonstration — "constraints don't limit the possibility field, they define it"
- chapter contract (`labels`/`drawFns`/`dt`/`setup`) is small enough that an LLM can reliably emit a valid new chapter from a one-line prompt
- mapping tolerates bad variants because they define the edges of the space — culling before comparing turns mapping back into search
- the constants table sketches the next moves: any constant (palette, grid, substrate, timing) can become the next variable axis
- scaffold reused directly in day 58 (shapes)
