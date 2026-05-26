# Interaction — borrowable principles

A field guide to the parts of this sketch worth lifting into other work. Each section names the pattern, why it's there, and the smallest snippet you'd need to reproduce it.

## Higher-order principles

**Idle is a signal, not background.**
Every cell here has a `claim` (what kind of idle it is) and a `risk` (how it can be misread). Treat idle as a designed state with intent; don't let "nothing's happening" be an accident.

**One cell responds; the rest ignore presence.**
Cell 04 (lean-toward) is the only thing wired to the cursor. If every cell reacted, the page would feel *interactive*, not idle. Reactivity is a strong signal — spend it carefully.

**Decouple rhythms.**
No two animations share a period, phase, or noise seed. Independent frequencies prevent the page from collapsing into one big synchronized loop. If two motions ever align by accident, the eye picks it up as a defect.

**Pair every motion with a still anchor.**
Breath has a held ring. Drift has a faint crosshair. Hover has a horizon + plumb-line. Listening bars have a baseline. Without an anchor, motion reads as "loading"; with one, it reads as "present, not acting."

**Name the typology in metadata, not chrome.**
The four-row `<dl>` (`claim / signal / motion / risk`) does more work than any title would: it forces each direction to argue for itself, and it lets a reader compare directions in seconds. Borrow this for any ideation board.

## Reusable patterns

### 1. The cell template

```html
<div class="cell" data-cell="kebab-name">
  <div class="cell-header"><span>cell name</span><span class="cell-index">NN</span></div>
  <div class="cell-stage"><canvas></canvas></div>
  <dl class="cell-meta">
    <dt>claim</dt><dd>…</dd>
    <dt>signal</dt><dd>…</dd>
    <dt>motion</dt><dd>…</dd>
    <dt>risk</dt><dd>…</dd>
  </dl>
</div>
```

Three regions, fixed order: header (label + index), stage (the visual), meta (the typology). The CSS pins meta to a 64px-label / 1fr-value grid. Swap `<canvas>` for HTML when the cell is typographic (see cells 02 and 08).

### 2. Elevated dock

A pill switcher pinned bottom-center, designed to feel "closer to us" than the grid behind it.

```css
.dock {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px; padding: 5px;
  background: #1c1c1c;
  border: 1px solid #2e2e2e;
  border-radius: 999px;
  box-shadow:
    0 24px 60px rgba(0,0,0,0.7),    /* far drop */
    0 8px 16px rgba(0,0,0,0.55),    /* mid drop */
    0 2px 4px rgba(0,0,0,0.4),      /* contact shadow */
    inset 0 1px 0 rgba(255,255,255,0.05); /* top edge highlight */
  backdrop-filter: blur(12px);
}
.dock-item.is-active {
  background: #262626;
  box-shadow: inset 0 0 0 1px #353535, inset 0 1px 0 rgba(255,255,255,0.06);
}
```

Three shadow layers, not one. Far drop establishes depth, mid drop softens, contact shadow grounds. Inset highlight gives the top edge a "lit" feel. The active pocket is a recessed inset shadow — the opposite direction of the elevation, which reads as "pressed."

### 3. Breath (sine pulse with halo)

```js
const phase = (Math.sin((t / 4) * Math.PI * 2 - Math.PI / 2) + 1) / 2; // 0..1
const r = baseR + phase * pulseR;
const alpha = 0.35 + phase * 0.6;
// disc
ctx.fillStyle = `rgba(0,168,255,${alpha})`;
ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
// halo
const glow = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 3);
glow.addColorStop(0, `rgba(0,168,255,${alpha * 0.4})`);
glow.addColorStop(1, 'rgba(0,168,255,0)');
ctx.fillStyle = glow;
ctx.arc(cx, cy, r * 3, 0, Math.PI * 2); ctx.fill();
```

The phase is `(sin − π/2 + 1) / 2` so it starts at 0 instead of 0.5 — feels like an inhale beginning, not mid-cycle. Halo radius is `3×` disc radius; alpha is `0.4×` peak.

### 4. Caret (CSS keyframe blink)

```css
.caret {
  display: inline-block; width: 3px; height: 0.95em;
  background: currentColor;
  animation: caret-blink 1.1s steps(1, end) infinite;
}
@keyframes caret-blink {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
```

`steps(1, end)` gives a hard on/off — interpolated opacity would fade and read as breath. 1.1s is intentionally slower than the macOS default (~530ms): the slowness is what makes it patient.

### 5. Drift (noise random walk with soft bounds)

```js
m.seedX += dt * 0.0004;
const ax = (Math.sin(m.seedX) + Math.sin(m.seedX * 2.3)) * 0.00002;
m.vx += ax;
m.vx *= 0.992;          // light drag
m.x += m.vx * dt;
// soft bounds — nudge inward at edges
if (m.x < 0.1) m.vx += 0.00004;
if (m.x > 0.9) m.vx -= 0.00004;
```

Summed sines of mutually-prime-ish frequencies give cheap pseudo-noise without a library. Drag keeps velocity bounded so trajectories settle; soft bounds prevent wall-bouncing without hard reflection.

### 6. Lean-toward (cursor anywhere → angle to local center)

```js
window.addEventListener('mousemove', (e) => { cursor.x = e.clientX; cursor.y = e.clientY; cursor.active = true; });

// per cell, per frame:
const rect = cellEl.getBoundingClientRect();
const dx = cursor.x - (rect.left + rect.width / 2);
const dy = cursor.y - (rect.top + rect.height / 2);
const dist = Math.hypot(dx, dy);
const norm = Math.min(1, dist / (maxDist * 0.5));
tx = Math.cos(Math.atan2(dy, dx)) * norm;
ty = Math.sin(Math.atan2(dy, dx)) * norm;
// smooth toward target
ox += (tx - ox) * 0.06;
oy += (ty - oy) * 0.06;
// neutral idle micro-sway, scaled by inverse energy
const fx = ox + Math.sin(t * 0.6) * 0.06 * (1 - energy);
```

Two layered behaviors: a smoothed orientation toward the cursor, *plus* an idle micro-sway that fades as activity rises. The cell never goes fully still and never feels jumpy.

### 7. Hover (organic float via summed sines)

```js
const swayX = Math.sin(t * 0.55) * 0.85 + Math.sin(t * 0.21 + 1.7) * 0.18;
const bobY  = Math.sin(t * 0.95) * 0.55 + Math.sin(t * 0.33 + 0.6) * 0.25;
```

Two sines per axis — fast carrier + slow drift — with mutually-prime-ish frequencies. The result reads as natural, not mechanical. The primary axis (here X) gets a bigger amplitude than the secondary (Y).

### 8. Orbit (pixel squares, tilted ellipses)

```js
const ang = (t / period) * Math.PI * 2 * dir;
const ex = Math.cos(ang) * rx, ey = Math.sin(ang) * ry;
const cosR = Math.cos(rot), sinR = Math.sin(rot);
const px = Math.round(cx + ex * cosR - ey * sinR);
const py = Math.round(cy + ex * sinR + ey * cosR);
ctx.fillRect(px - 1, py - 1, 3 * DPR, 3 * DPR);
```

Borrowed from [`06-orbital`](../06-orbital/index.html). `Math.round` on positions + `fillRect` (not `arc`) gives a sharp pixel feel. Idle speeds are 10–17 seconds per revolution — fast enough to perceive, slow enough to feel patient.

### 9. Listening bars (pseudo-noise floor)

```js
const n = (Math.sin(t * s.freq + s.phase) + Math.sin(t * s.freq * 2.3 + s.phase * 1.5)) * 0.5;
const amp = 0.04 + (n * 0.5 + 0.5) * 0.18;   // 4%..22% of fieldH
```

Each bar has its own `freq` and `phase`, so the row never aligns. `0.04` baseline floor ensures no bar disappears — that floor is the "still listening" signal.

### 10. Elapsed counter

```js
const start = performance.now();
function pad(n) { return n < 10 ? '0' + n : '' + n; }
setInterval(() => {
  const s = Math.floor((performance.now() - start) / 1000);
  mm.textContent = pad(Math.floor(s / 60) % 100);
  ss.textContent = pad(s % 60);
}, 1000);
```

Anchor on `performance.now()` not wall-clock — survives tab focus changes cleanly. Update on a `setInterval`, not `rAF`: a second-tick doesn't need 60fps. The colon between blinks on its own CSS keyframe.

## When to use which

| You want to signal… | Use |
|---|---|
| Service is alive | **breath** |
| Awaiting your input | **caret** |
| Ambient presence, no target | **drift** |
| Ready to respond to you specifically | **lean-toward** |
| Suspended, between actions | **hover** |
| Still doing its cycle, no progress | **orbit** |
| Open input channel, not capturing | **listening bars** |
| Time is being kept; you are not late | **elapsed counter** |

## Anti-patterns

- **Spinner energy.** Avoid speeds or rhythms that read as "loading." Idle should feel slower than work.
- **Synchronized blinks across elements.** One thing blinks. Two blinking in unison reads as alarm.
- **Reactive everything.** If every element responds to the cursor, none of them are idle.
- **Hard reset on hover-out.** When attention leaves, settle — don't snap back to neutral.
