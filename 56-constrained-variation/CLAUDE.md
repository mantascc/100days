# Peach — Project Binding

This project uses the **constrained-variation-guide** skill. See `skill.md` for the full method and interaction pattern.

---

## Project-specific constants

**Palette** — pink `[244, 160, 160]` → yellow `[244, 216, 122]`. Background `#1A0F0A`.
**Grid** — 8 cells, 4×2, displayed simultaneously.
**Structure** — each chapter is a JS module in `chapters/`. Output goes to `chapters/blank.js`.

## Reference library

Existing cells the practitioner can point to by name:

**01 · static** — `dither` `pixel noise` `scanlines` `bit crush` `channel shift` `low res` `interference` `corrupt`
**02 · interference** — `two sources` `moiré lines` `beat frequency` `standing wave` `four sources` `zone plates` `lissajous field` `rotating moiré`
**03 · scanlines** — `drift` `diagonal` `pulse` `venetian` `grid` `silk` `stagger` `frequency`
**04 · corrupt** — `chunk` `dissolve` `melt` `warp` `skip` `mirror` `scatter` `tile`

## Output format

Write into `chapters/blank.js`. Export shape:

```js
export default {
    labels:  [...],   // 8 strings
    dt:      0.025,   // 0 = static
    setup,            // function(id) → { canvas, ctx, W, H }
    drawFns: [...],   // 8 functions (cv, t) => void
};
```

Standard setup:

```js
function setup(id) {
    const cell   = document.getElementById(id).parentElement;
    const canvas = document.getElementById(id);
    canvas.width  = cell.offsetWidth;
    canvas.height = cell.offsetHeight;
    return { canvas, ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height };
}
```
