---
id: tokens/geometry
type: tokens
title: Geometry tokens
status: active
tags: [geometry, stroke, grid]
---

# Primitives Only

- Circles, lines, rectangles, points
- No organic curves unless algorithmically generated
- Polygons through code, not drawing

# Stroke

No fills unless essential. Let density create form.

| Token | Value | Status |
|-------|-------|--------|
| `--stroke-thin` | 1px | active |
| `--stroke-default` | 2px | active |
| `--stroke-heavy` | 3px | provisional |

# Grid

- 8px base grid (optional 4px for fine work)
- Grid as underlying logic, rarely visible
- When shown: 5-10% opacity max

| Rule | Value | Status |
|------|-------|--------|
| Base grid | 8px | active |
| Fine grid | 4px | provisional |
| Visible-grid opacity | 5–10% | active |
