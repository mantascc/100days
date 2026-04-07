# interface.md · component reference sheet

A pattern for exhaustively exploring a single UI element across its full design space.

---

## What it is

Take one UI element with discrete state (a toggle, a badge, a status indicator, a button) and map every meaningful form it can take. The result is a reference sheet — not a component library, but a thinking tool. You use it to find the right form before committing to one.

---

## Structure

### 1. Family grid

A `1px`-gap grid where each cell is one **family**: a distinct mechanism or metaphor the element can embody. Cells are numbered and labeled (e.g. `04 · chip + pip`).

Inside each cell:
- 3–5 sub-variants
- Each shown in both states (on / off) side by side
- All interactive — no dead demos

The grid auto-fills columns and reflows at any width.

### 2. Composed example

One realistic context embedding the element into a believable UI. The toggle here lives inside a chat input with an attachment button and a send button. Shows how the element behaves as part of a larger component rather than in isolation.

### 3. Combination catalog

A structured row table exploring the element **paired with one other component**. Each row is a named structural relationship — same two elements, different spatial arrangement. Covers the full positional space: inside / outside, left / right, above / below, overlapping, embedded.

10 rows is a good target. For this sketch: input field × mode toggle.

---

## Families in this sketch

| # | family | mechanism |
|---|--------|-----------|
| 04 | chip + pip | border + dot indicator, with label |
| 05 | segmented | connected segments, one fills |
| 07 | keycap | physical press metaphor, box-shadow depth |
| 10 | underline select | border-bottom as active signal |
| 11 | icon button | icon-only, labeled, circle, ghost variants |
| 12 | pure signal | led pip, bar strip, ring fill, corner mark — no label |
| 13 | typographic | bracket wrap, weight shift, opacity, prefix slash |
| 14 | mechanical | track pin, rocker |
| 15 | contextual | margin pip list, inline dot |

---

## Combination catalog: input × toggle

| variant | structural relationship |
|---------|------------------------|
| right chip | mode fused inside right, internal separator |
| left chip | mode fused inside left, internal separator |
| pip right | label-less, minimal footprint, right |
| pip left | label-less, minimal footprint, left |
| below | mode as bottom strip, shared outer border |
| above | mode as tab attached to top edge |
| detached | ghost input + standalone chip, no shared border |
| suffix | mode floats inside right, no separator |
| corner | 16px badge overlapping top-right corner |
| sidebar | the left border itself is the toggle |

---

## How to reuse this pattern

1. **Pick the subject** — one element with binary or discrete state
2. **Enumerate families** — what distinct metaphors can it take?
3. **Show on/off pairs** — every sub-variant in both states, side by side
4. **Make everything interactive** — no dead demos
5. **Build a composed example** — drop it into a plausible real UI
6. **Run the combination catalog** — pick one other component, enumerate structural relationships (10 is a good target)

---

## Good candidates for the same treatment

- Status badge
- Tooltip trigger
- Loading / progress state
- Selection indicator
- Action button
- Tab / nav item
- Notification dot
