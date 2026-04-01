# Variation Grid Pattern

*Display multiple versions of the same thing simultaneously so differences read as method, not noise.*

---

## Core Principle

A variation grid holds one variable fixed as a **scaffold** and varies exactly one **axis** across all cells. The simultaneous display is load-bearing — sequential iteration produces search (looking for the best); simultaneous display produces taxonomy (mapping the space).

The grid doesn't have to be 8 cells. It doesn't have to be chapters with prev/next navigation. The principle is:

> Fix the scaffold. Vary one axis. Show all results at once.

---

## The Chapter Contract

Each chapter (a unit of variation) exposes a small, stable interface:

```js
{
  labels:  string[]                           // cell names — what each variant is called
  drawFns: Array<(cv, t) => void>             // one draw function per cell
  dt:      number                             // 0 = static; >0 = animated (time step size)
  setup:   (id: string) => {canvas, ctx, W, H} // canvas initializer
}
```

The loader never knows what a chapter draws. It only calls `setup`, builds the DOM, and runs the loop.

---

## Chapter Formats

### Plain object export (simplest)

Use when: one-off chapter, no external config needed.

```js
// chapters/foo.js
export default {
    labels: ['variant a', 'variant b', ...],
    dt: 0.025,
    setup(id) {
        const cell = document.getElementById(id).parentElement;
        const canvas = document.getElementById(id);
        canvas.width = cell.offsetWidth;
        canvas.height = cell.offsetHeight;
        return { canvas, ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height };
    },
    drawFns: [
        (cv, t) => { /* draw variant a */ },
        (cv, t) => { /* draw variant b */ },
        // ...
    ]
};
```

### Factory function (flexible)

Use when: the chapter needs external input — a theme, a config object, a dataset.

```js
// chapters/foo.js
export function createChapter(config) {
    const { color, scale } = config;  // whatever the chapter needs

    function setup(id) { return setupCanvas(id); }

    return {
        labels: ['variant a', 'variant b', ...],
        dt: 0.025,
        setup,
        drawFns: [
            (cv, t) => { /* uses color, scale */ },
            // ...
        ]
    };
}
```

The factory is called once per load. Changing the config (e.g. swapping a theme) just calls the factory again — no module reload.

---

## The Loader (main.js)

The loader is generic. It handles DOM, RAF lifecycle, and navigation. It never touches drawing logic.

```js
const CHAPTER_FACTORIES = [
    { id: 'foo', create: createFooChapter },
    { id: 'bar', create: createBarChapter },
];

let rafId = null;

function load(index) {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }

    const chapter = CHAPTER_FACTORIES[index].create(/* config if needed */);
    const { labels, drawFns, dt, setup } = chapter;

    // rebuild grid
    grid.innerHTML = labels.map((label, i) => `
        <div class="card">
            <span class="label">${label}</span>
            <div class="cell"><canvas id="c${i + 1}"></canvas></div>
        </div>
    `).join('');

    // init canvases
    const cvs = {};
    for (let i = 0; i < labels.length; i++) cvs[i + 1] = setup(`c${i + 1}`);

    // run
    if (dt === 0) {
        for (let i = 0; i < labels.length; i++) drawFns[i](cvs[i + 1], 0);
    } else {
        let t = 0;
        const step = () => {
            t += dt;
            for (let i = 0; i < labels.length; i++) drawFns[i](cvs[i + 1], t);
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
    }
}
```

---

## Form Factor Variations

The 8-cell 4×2 grid is one form factor, not the only one.

| Form factor | When to use |
|-------------|-------------|
| **8 cells, 4×2** | Standard — 8 variants is enough to map an axis without overwhelming |
| **N cells, 1 row** | Comparing a small number of things (2–4) side by side |
| **N cells, auto-grid** | When N is determined by data, not design |
| **Single cell** | When the chapter itself cycles through variants over time |
| **Full-page sections** | When each variant needs space (Day 59 font explorer) |

The contract stays the same regardless of layout. The grid CSS handles the rest.

---

## Navigation Patterns

### Hash-based (stateful, bookmarkable)

```js
// chapter index in URL hash: #1, #2, ...
function hashIndex() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(N - 1, n - 1));
}

window.addEventListener('hashchange', () => { load(hashIndex()); });
btnNext.addEventListener('click', () => { active++; location.hash = active + 1; });
```

### Query param (for config variants, e.g. themes)

```js
// theme in query string, chapter in hash: ?theme=clay#2
const theme = getThemeBySlug(new URLSearchParams(location.search).get('theme'));
```

---

## What Goes in a Chapter

A chapter is a cross-section of one axis. Good axes:

- **Algorithm family** — 8 noise types, 8 wave interactions, 8 glitch modes
- **Shape family** — 8 arc variants, 8 curve types
- **Parameter range** — 8 points along a spectrum (slow → fast, ordered → chaotic)
- **Palette** — same drawing, 8 color treatments
- **Motion mode** — same shape, 8 different animation behaviors

Bad axes (too many at once):
- Changing both the algorithm and the palette per cell
- Cells that have nothing in common with each other

---

## Seen In

| Day | Grid size | Axis | Config |
|-----|-----------|------|--------|
| 56 · constrained-variation | 8 cells | noise/glitch algorithm family | hardcoded (Peach palette) |
| 57 · color-themes | 8 cells | same as 56, palette as top-level variable | theme registry |
| 58 · shapes | 8 cells | geometric primitive family | hardcoded (warm dark palette) |
| 59 · font-explorer | 8 sections | typographic property | theme switcher (3 options) |
