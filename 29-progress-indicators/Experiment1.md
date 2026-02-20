Here’s a clean project README you can drop into a repo:

---

# **100 Loading Indicators — Generative Study**

### Overview

A generative design experiment exploring **100 loading indicators** within strict constraints:

* **Size:** 24×24 px
* **Palette:** single foreground + single background color
* **Time:** 1-second loop
* **Medium:** HTML Canvas / JS (no assets, no libraries)

Each indicator is a minimal motion study — testing how *shape, rhythm, and perception* can express waiting.

---

### Concept

Loading icons are micro-narratives of anticipation.
By limiting form, color, and time, this project explores how **motion alone** can create emotion, identity, and legibility at microscopic scale.

---

### System Design

* **Engine:** a simple loop calling `draw(ctx, t)` where `t ∈ [0,1)`
* **Structure:**

  ```js
  {
    name: "arc-spin",
    group: "arcs",
    draw: (ctx, t) => { ... }
  }
  ```
* **Control:** keyboard to switch between loaders
* **Output:** browser canvas renders at pixel-perfect 24×24 px

---

### Groups (10 × 10)

| Group | Theme                  | Expression Focus                |
| ----- | ---------------------- | ------------------------------- |
| 01    | Arcs & Rings           | Circular motion, continuity     |
| 02    | Bars & Ticks           | Segments, equalizer-like pulse  |
| 03    | Dots & Orbits          | Minimal kinetic rhythm          |
| 04    | Morphing Shapes        | Form as transition              |
| 05    | Directional / Progress | Illusion of forward flow        |
| 06    | Pixel / Grid           | Pattern shifts in minimal space |
| 07    | Symbolic Icons         | Familiar signs abstracted       |
| 08    | Stroke Paths           | Draw/erase loops                |
| 09    | Center–Edge Pulsers    | Breathing, radar, wave          |
| 10    | Odd / Characterful     | Imperfect, expressive behaviors |

---

### Goals

* Develop a **library of micro-motion patterns**.
* Study **perceptual thresholds** — what still “reads” at 24 px.
* Explore **expressive minimalism**: emotion through restriction.
* Generate material for future UI systems or generative art projects.

---

### Implementation Notes

* Engine: plain JavaScript + Canvas 2D API
* Frame rate: 60 fps
* Loop duration: 1000 ms
* Helpers for easing, ping-pong, saw, and noise-based timing.
* Export ready for sprite sheets or GIF sequences later.

---

### Folder Structure

```
/src
  engine.js
  loaders-arcs.js
  loaders-bars.js
  ...
  loaders-weird.js
index.html
style.css
README.md
```

---

### Next Steps

1. Write the base engine (`engine.js`) with timeline + controls.
2. Implement **Group 1: Arcs & Rings (10 variants)**.
3. Set up grid preview view showing all loaders at once.
4. Iterate and refine motion rhythm consistency.

---

Would you like me to write a short **design statement** for the README — something like a poetic intro (“Why motion matters in stillness”)?
