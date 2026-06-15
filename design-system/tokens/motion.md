---
id: tokens/motion
type: tokens
title: Motion tokens
status: active
tags: [motion, timing, easing]
---

Governed by [physics-over-easing](../principles/physics-over-easing.md):
prefer real integration; the easing token is the sanctioned exception lane.

# Timing

| Token | Value | Usage | Status |
|-------|-------|-------|--------|
| `--duration-instant` | 0ms | Value changes | active |
| `--duration-fast` | 100ms | Hover, reveals | active |
| `--duration-base` | 150ms | State changes | active |
| `--duration-slow` | 300ms | Panel transitions | active |
| `--duration-drift` | 800ms | Ghost trails, floaty | provisional |

# Easing

```css
--ease-snap: linear;
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-physics: none; /* use actual integration */
```

| Token | Value | Status |
|-------|-------|--------|
| `--ease-snap` | linear | active |
| `--ease-out` | cubic-bezier(0.4, 0, 0.2, 1) | active |
| `--ease-physics` | none (real integration) | active |

**Physics > easing.** Use Euler/Verlet for gravity, springs, inertia. Let
things drift rather than bounce.

# Animation Principles

- Instant feedback on interaction
- Binary state changes (on/off, visible/hidden)
- No theatrical entrances
- Things breathe, never bounce
- Ghost trails: 12-15fps intentional stutter
