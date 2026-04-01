# sketch-data-forms

> "Same data. Different form. Different story."

A variation grid with four chapters. Each chapter fixes a dataset and varies the representation across eight simultaneous cells.

[Live Demo](index.html) — requires a local server (ES modules)

---

## Chapters

### 01 · chart-types
*A year of running — 52 weekly distances.*

Gradual improvement, a summer slump, a strong finish. Eight chart types applied to the same time series: line, bar, scatter, area, step, dot-plot, radial, heatmap. Some show momentum, some show variance, some show seasonal rhythm. The same story reads differently in each form.

### 02 · graph-layouts
*A small team that merged — two clusters of 8, one bridge, three isolates.*

Eight layout algorithms on the same 20-node graph. Force-directed variants (balanced, compact, expanded, clustered) converge to different equilibria. Geometric layouts (circular, bipartite, community, by-degree) impose structure directly. The bridge node and the isolates read very differently depending on what the layout optimises for.

### 03 · projections
*Where the internet lives — 29 major data center locations.*

The same lat/lng points rendered through eight map projections. Mercator inflates the north; Mollweide equalises area; orthographic views centred on the Atlantic, Pacific, and North Pole each tell a different story about concentration; azimuthal equidistant distorts distance from its centre. The cluster of dots in North America and Europe stays fixed — everything else moves around it.

### 04 · encodings
*200 people, one city, wildly unequal incomes.*

Pareto-distributed synthetic incomes ($20k–$2.5M). Eight visual channels encoding the same column: position on a linear scale (everything crowds left), position on a log scale (spread becomes legible), color grid, size-by-area, histogram, KDE density curve, rank profile, and an inequality share chart showing cumulative income from the bottom up. Each encoding surfaces a different aspect of the distribution.

---

## How It Works

Follows the [variation grid pattern](../../computational-minimalism/variation-grid.md). Each chapter is a factory function returning `{ labels, drawFns, dt, setup }`. The loader in `main.js` is generic — it rebuilds the DOM, initialises canvases, and runs the RAF loop without knowing anything about what each cell draws.

All chapters are static (`dt=0`). Graph layouts are pre-computed at chapter load time using a synchronous force simulation (300–400 iterations, 20 nodes — fast enough to be imperceptible).

## Tech Stack

- Vanilla JavaScript (ES modules)
- HTML5 Canvas
- No external dependencies
- JetBrains Mono (Google Fonts)
- Computational Minimalism design system

*Part of the 100 Days of Creative Coding challenge.*
