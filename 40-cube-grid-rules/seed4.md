# Cube Grid — Generative Rules Engine

## Concept

Grid of 24×24px cubes. Black/white. No motion. 
Sound data (or any 1D array) feeds rules. Rules determine state.
Swap rules to shift expression.

---

## Grid

```
GRID
  cols: n (data length or fixed)
  rows: m (fixed or derived)
  cell: 24×24 px
  gap: 0 or minimal (1-2px)
  
CUBE STATE
  value: 0–1 (continuous)
  state: on/off (binary)
  history: previous value (for smoothing)
```

---

## Mapping Levels

### Level 0 — Direct threshold

```
if data[i] > 0.5 → on
else → off
```

### Level 1 — Opacity

```
cube.opacity = data[i]
```

### Level 2 — Smoothed threshold

```
cube.value = lerp(cube.value, data[i], 0.1)
if cube.value > 0.5 → on
```

### Level 3 — Probabilistic

```
if random() < data[i] → on
```

### Level 4 — Entropy scatter

```
pick randomIndex from data
if data[randomIndex] > threshold → on
```

### Level 5 — Neighborhood

```
neighbors = count adjacent on-cubes
if data[i] > 0.5 AND neighbors >= 2 → on
if data[i] < 0.5 AND neighbors < 2 → off
```

### Level 6 — Expression grammar

```
evaluate rules[] in order
apply first matching action
```

---

## Expression Vocabulary

| Action | Effect |
|--------|--------|
| `on` | White |
| `off` | Black |
| `flip` | Toggle current state |
| `scatter` | Random pixels within cube |
| `decay` | Reduce value by factor |
| `propagate` | Copy state to random neighbor |
| `invert` | Swap all states |
| `subdivide` | Treat cube as inner grid |

---

## Rule Structure

```
rule = {
  condition: function(cube, data, neighbors) → boolean
  action: 'on' | 'off' | 'flip' | 'scatter' | ...
  priority: number (optional)
}
```

### Example Rules

```
// Loud = on
{ condition: (c, d) => d[c.index] > 0.7, action: 'on' }

// Quiet + isolated = off
{ condition: (c, d, n) => d[c.index] < 0.3 && n < 2, action: 'off' }

// High entropy = scatter
{ condition: (c, d) => entropy(d) > 0.6, action: 'scatter' }

// Silence = decay all
{ condition: (c, d) => rms(d) < 0.05, action: 'decay' }

// Random flip at medium values
{ condition: (c, d) => d[c.index] > 0.4 && d[c.index] < 0.6 && random() > 0.8, action: 'flip' }
```

---

## Render Modes

| Mode | Description |
|------|-------------|
| Binary | Black or white only |
| Grayscale | Opacity from value |
| Dither | Scatter pixels by value |
| Outline | Stroke only, no fill |
| Inset | Smaller square, gap reveals state |

---

## Structure

```
SETUP
  create grid[rows][cols]
  initialize cubes with value: 0, state: off
  define rules[]
  
FRAME
  read data (1D array, normalized 0–1)
  
  for each cube:
    neighbors = countOnNeighbors(cube)
    for each rule:
      if rule.condition(cube, data, neighbors):
        apply(rule.action, cube)
        break
  
  render:
    for each cube:
      if binary mode:
        fill = cube.state ? white : black
      if grayscale mode:
        fill = gray(cube.value)
      drawRect(cube.x, cube.y, 24, 24, fill)

INTERACTION
  key 0–6: switch mapping level
  key r: randomize rule order
  key space: pause/resume data input
  click cube: inspect value + state
```

---

## Data Sources (interchangeable)

```
source = 
  | audioData (analyser.getByteTimeDomainData)
  | randomArray (for testing)
  | gradient (for debugging)
  | perlinNoise (for organic feel)
```

---

## Variations to Explore

- Rule stacking: multiple rules can fire
- Rule mutation: thresholds drift over time
- Grid topology: wrap edges, hex grid, irregular
- History: cubes remember N frames, rules reference past
- Clusters: adjacent on-cubes merge visually

---

## Style

- Background: #0a0a0a
- On: #e0e0e0 or #ffffff
- Off: #0a0a0a or #111111
- Gap: 1px #000 (optional)
- No stroke, no shadow
- Monospace labels if any