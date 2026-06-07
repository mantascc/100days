# sketch-z-axis

A pattern library of nine Z-axis affordances for UI. Each view is a self-contained recipe — a way the Z axis can do useful work in an interface.

## stack
vanilla · IBM Plex Mono · CSS 3D transforms (`perspective`, `translateZ`, `transform-style: preserve-3d`)

## global tokens
- `--accent: #a48ad4` (ube)
- `perspective: 700px` per view (1200px on notification for stronger depth)
- `transition` ease: `cubic-bezier(0.22, 1, 0.36, 1)`
- shadow tiers: `.shadow-low` / `.shadow-mid` / `.shadow-high` — pure black, no glow

## controller
Floating island (bottom-center, blurred dark pill) drives a `VIEWS` array. Add/remove a view by editing one entry:

```js
{ id: 'v-xxx', name: 'label', action: 'btn text' | null, init: initFn }
```

`action` exposes a secondary button (`#action`) above the island. `null` hides it. Arrow keys + dot row also navigate.

---

## patterns

### 01 · two states
**Use when:** a panel has a "default" and an "attention" mode.
**Z values:** `-100px` ↔ `+100px`.
**Drive:** click `#action` ("toggle z").
**Tells depth via:** translateZ + border-color shift to accent + shadow tier swap (`mid` → `high`).
**API hook:** `panel.classList.toggle('near')`.

### 02 · stacked deck
**Use when:** showing a queue, history, or "next up" stack.
**Z values:** topmost at 0, each behind it at `-50px` step, with a `+14px` Y offset for parallax legibility.
**Drive:** click `#action` ("cycle") — rotates `order = [...rest, head]`.
**Tells depth via:** stepped Z + Y offset + opacity decay (`-0.15` per slot) + accent border on top.

### 03 · modal lift
**Use when:** a list item needs to become the focal subject (detail expand, inline edit).
**Z values:** lifted row `+120px`, siblings `-80px`.
**Drive:** click any row; click again to un-lift.
**Tells depth via:** translateZ + blur(1.2px) + opacity(0.5) on un-lifted rows + accent border + high shadow on the lifted one.
**API hook:** add `.lifted` to the row; `.has-lift` on the list container drives sibling recession.

### 04 · z-scroll
**Use when:** a presentation or step-through reads better as forward travel than vertical scroll.
**Z values:** slabs stepped `260px` apart; active slab parks at 0; visited slabs sit at positive Z (behind viewer), upcoming at negative Z.
**Drive:** scroll wheel inside the view (`{passive: false}` + preventDefault).
**Tells depth via:** translateZ + opacity decay by distance + accent border on focal slab.
**State:** smoothed `pos` lerps toward `target` at 0.18 per frame.

### 05 · hover grid
**Use when:** showing a soft "magnetic" response across a field of tiles (file picker, palette, board).
**Z values:** hovered tile `+80px`; neighbors `max(0, 60 - distance * 18)`.
**Drive:** `pointermove` on the grid.
**Tells depth via:** translateZ + accent border + shadow on the hot tile + smaller dot indicator turning accent.
**Reset:** `pointerleave` clears all inline styles.

### 06 · pressed state
**Use when:** a button benefits from tactile recession instead of color change.
**Z values:** rest `+40px`, pressed `-30px` (into a darker "well" at `-20px`).
**Drive:** `pointerdown` / `pointerup` / `pointerleave`.
**Tells depth via:** translateZ + darker background + softer border.
**Pair with:** the visible `.press-well` behind the button to sell the recession.

### 07 · layer explode
**Use when:** debugging or teaching the compositing structure of a UI.
**Z values:** layers spread to `[0, 60, 120, 180]px` in exploded state; all collapse to 0 in flat state.
**Drive:** click `#action` ("explode") — toggles `.exploded` on `.mock` and each `.layer`.
**Tells depth via:** translateZ + scene rotation `rotateX(50deg) rotateZ(-30deg)` to make the stack visible from the side + accent-dim borders to mark layer boundaries.

### 08 · parallax cursor
**Use when:** an idle screen needs ambient depth (login, empty state, hero).
**Z values:** panels carry `data-d` of `-300, -150, 0, +120, +220`.
**Drive:** `pointermove` on the view; map mouse offset to per-element `translate3d(x, y, d)` where `xy` scales by `d / 300 * 30px`.
**Tells depth via:** translateZ + correlated XY parallax (further panels move less, closer panels move more) + accent on the focal layer.

### 09 · notification
**Use when:** a transient message should feel like an *arrival*, not a slide.
**Z values:** start at `-1200px` (blurred, invisible), animate to `0`, exit forward to `+400px`.
**Drive:** click "spawn toast"; auto-dismiss after 2.4s.
**Tells depth via:** keyframe translateZ + blur(4px → 0) on entry + accent border + high shadow.
**API hook:** add `.in` to play arrival, `.out` to play departure. Replay needs the `void offsetWidth` reflow trick.

---

## reuse checklist
- Wrap each view in a parent with `perspective: <600–1200>px`.
- Give Z-moving elements `transform-style: preserve-3d` on their parent.
- Z under ~50px reads as elevation; Z over ~200px reads as travel.
- Shadows must scale with Z — a panel at +100 with a low shadow looks broken.
- Drop blur on anything you want the eye to skip; keep it sharp on the focal subject.
