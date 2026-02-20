# metaball

## page 01 / simulation

Interactive metaball field. Two circles—one fixed, one follows cursor. Watch the topology shift as distance changes.

**mechanics:**
- field strength: r² / distance²
- threshold: 1.0
- marching squares: 10px grid
- merge point: when summed fields exceed threshold

**controls:**
- move mouse to control second circle
- observe merge/separate behavior

**visual language:**
- dark background #0a0a0a
- white stroke contours
- subtle center dots
- clean grid sampling

**code structure:**
```
sample grid → calculate field sum at each point → 
find threshold crossings → trace contours → render
```

---

## page 02 / explanation

### what is metaball

A metaball is a surface defined by summed influence fields. Each point generates an invisible force that weakens with distance. Where multiple fields overlap strongly enough, surfaces merge organically.

### the math

```
strength = r² / distance²
```

Close to center = strong field  
Far from center = weak field  
Sum all circles at any point  
Where sum ≥ 1.0 = visible surface

### emergence

**Far:** Fields don't overlap. Two separate circles.  
**Closer:** Fields begin to sum in middle region.  
**Threshold crossed:** Summed field exceeds 1.0 between them. Connection appears.  
**Very close:** Single unified blob.

The liquid behavior emerges naturally—no special merge logic needed. Simple local rules create complex global forms.

### marching squares algorithm

1. Create grid over space
2. Sample field strength at each grid point
3. Mark points above/below threshold
4. Draw lines where boundary crosses cells
5. Connect lines into contours

Each cell has 16 possible configurations based on which corners are above threshold. The algorithm traces the boundary between inside/outside regions.

### applications

- molecular visualization (electron density)
- fluid simulation rendering
- organic 3D modeling
- motion graphics (liquid logos)
- game effects (slime, water)

### variations to explore

**charge values:** negative charge = repulsion field  
**different radii:** larger circles dominate field  
**custom falloff:** exponential or linear decay  
**multiple bodies:** 3-5 circles with autonomous movement  
**3d extension:** metaspheres (volumetric)  
**animation:** pulse radii, orbit paths, noise-driven motion

### related concepts

- implicit surfaces
- signed distance fields (SDF)
- level set methods
- isosurface extraction
- potential fields in physics

---

## implementation notes

Current sketch uses canvas 2D. Could extend to:
- SVG path output (true vector)
- WebGL for real-time large grids
- 3D marching cubes for volumetric
- Bezier curve fitting for smoothing

Grid resolution tradeoff: smaller = smoother but slower, larger = faster but jagged.

## style seeds

- computational minimalism
- dark void backgrounds
- monospace typography
- primitive geometry
- no gradients, pure forms
- subtle grid systems
- center dots as anchors