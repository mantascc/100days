# metaball / overview

Portable context for implementing metaball visualization with marching squares.

---

## concept

**Metaball** = surface defined by summed influence fields. Each circle emits an invisible force field that weakens with distance. Where overlapping fields exceed a threshold, surfaces merge organically.

**Core insight:** Liquid-like merging behavior emerges naturally from simple field math—no special merge logic required.

---

## the math

### field function

```
strength = r² / distance²
```

- `r` = circle radius
- `distance` = distance from point to circle center
- Close to center → strong field
- Far from center → weak field

### threshold test

```
if (sum_of_all_fields >= 1.0) → inside surface
```

---

## marching squares algorithm

Traces the boundary between inside/outside regions on a 2D grid.

### steps

1. Create grid over space (e.g., 10px cells)
2. Sample field strength at each grid corner
3. Classify corners as above/below threshold
4. Build 4-bit case index from corner states
5. Draw line segments where boundary crosses cell edges
6. Interpolate exact crossing positions for smooth contours

### corner ordering

```
TL (bit 0) ——— TR (bit 1)
    |             |
    |    cell     |
    |             |
BL (bit 3) ——— BR (bit 2)
```

### case index

```javascript
let idx = 0;
if (fTL >= THRESHOLD) idx |= 1;   // bit 0
if (fTR >= THRESHOLD) idx |= 2;   // bit 1
if (fBR >= THRESHOLD) idx |= 4;   // bit 2
if (fBL >= THRESHOLD) idx |= 8;   // bit 3
```

16 possible cases (0-15). Cases 0 and 15 have no boundary crossings.

### edge interpolation

```javascript
// Find exact crossing point between two corners
interp = (v1, v2, p1, p2) => {
  t = (THRESHOLD - v1) / (v2 - v1)
  return p1 + t * (p2 - p1)
}

// Edge positions
top    = [interp(fTL, fTR, x0, x1), y0]
right  = [x1, interp(fTR, fBR, y0, y1)]
bottom = [interp(fBL, fBR, x0, x1), y1]
left   = [x0, interp(fTL, fBL, y0, y1)]
```

### case → line mapping

```
case 1:  left → top
case 2:  top → right
case 3:  left → right
case 4:  right → bottom
case 5:  left → top, right → bottom  (saddle)
case 6:  top → bottom
case 7:  left → bottom
case 8:  bottom → left
case 9:  bottom → top
case 10: top → right, bottom → left  (saddle)
case 11: bottom → right
case 12: right → left
case 13: right → top
case 14: top → left
```

---

## pseudocode

```
CONSTANTS:
  GRID = 10          // cell size in pixels
  THRESHOLD = 1.0    // field threshold for surface
  circles = [{x, y, radius}, ...]

FUNCTION field(px, py):
  total = 0
  FOR each circle:
    dist_sq = (px - circle.x)² + (py - circle.y)²
    IF dist_sq > 0:
      total += (circle.radius²) / dist_sq
  RETURN total

FUNCTION draw():
  clear canvas
  
  FOR gy FROM 0 TO height STEP GRID:
    FOR gx FROM 0 TO width STEP GRID:
      
      // Sample four corners
      fTL = field(gx, gy)
      fTR = field(gx + GRID, gy)
      fBR = field(gx + GRID, gy + GRID)
      fBL = field(gx, gy + GRID)
      
      // Build case index
      idx = 0
      IF fTL >= THRESHOLD: idx |= 1
      IF fTR >= THRESHOLD: idx |= 2
      IF fBR >= THRESHOLD: idx |= 4
      IF fBL >= THRESHOLD: idx |= 8
      
      // Skip empty/full cells
      IF idx == 0 OR idx == 15: CONTINUE
      
      // Interpolate edge crossings
      top    = interpolate(fTL, fTR, x0, x1), y0
      right  = x1, interpolate(fTR, fBR, y0, y1)
      bottom = interpolate(fBL, fBR, x0, x1), y1
      left   = x0, interpolate(fTL, fBL, y0, y1)
      
      // Draw lines based on case
      SWITCH idx:
        CASE 1: line(left, top)
        CASE 2: line(top, right)
        ... (14 cases total)
  
  stroke all paths
  request next frame
```

---

## code structure (current implementation)

```
index.html (single file)
├── <style>
│   ├── body, canvas (fullscreen)
│   ├── .info (top-left label)
│   ├── .help-btn (? button)
│   ├── .modal-overlay, .modal (explanation popup)
│   └── @media (mobile fallback)
│
├── <body>
│   ├── .mobile-fallback (shown on ≤768px)
│   ├── <canvas> (simulation)
│   ├── .help-btn (?)
│   └── .modal-overlay (explanation content)
│
└── <script>
    ├── Constants: GRID, THRESHOLD, R1, R2
    ├── State: W, H, cx1, cy1, cx2, cy2
    ├── field(px, py) → sum of r²/d² for all circles
    ├── interp(v1, v2, p1, p2) → edge crossing position
    ├── resize() → update canvas dimensions
    ├── on_mouse(e) → update cursor circle position
    ├── draw() → clear, march, render, loop
    └── Modal event listeners
```

---

## variations

| Variation | Change |
|-----------|--------|
| **Repulsion** | Negative radius → subtracts from field |
| **Multiple bodies** | Add more circles to array, animate positions |
| **Custom falloff** | Replace r²/d² with exponential or linear decay |
| **Pulsing** | Animate radius with sin(time) |
| **3D extension** | Marching cubes (same concept, 256 cases) |

---

## key parameters

| Parameter | Current | Effect |
|-----------|---------|--------|
| `GRID` | 10px | Smaller = smoother, slower |
| `THRESHOLD` | 1.0 | Higher = smaller blobs |
| `R1, R2` | 80, 60 | Circle radii (field strength) |

---

## dependencies

None. Pure vanilla JavaScript + Canvas 2D.
