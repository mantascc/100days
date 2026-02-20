# 100 Loading Indicators

Systematic exploration of loading animations within strict constraints: 24×24px, single color, grouped conceptually.

## Structure

10 groups × 10 variations = 100 unique loaders

Each loader is a pure function receiving time `t` and rendering to canvas context.

## Groups

### 1. Geometric Primitives ✓
Basic shapes with fundamental transformations.
- Rotating square
- Pulsing circle
- Triangle spin
- Square scale
- Pentagon rotate
- Hexagon pulse
- Double square
- Diamond morph
- Ring expand
- Star twinkle

### 2. Organic Forms
Blob-like, flowing, breathing animations.

### 3. Particle Systems
Multiple elements: dots, pixels, particles in motion.

### 4. Line Art
Single stroke, spirals, continuous paths.

### 5. Grid Distortions
Systematic deformations, cellular patterns.

### 6. Symbolic
Icons, metaphors, recognizable loading concepts.

### 7. Optical/Physics
Orbits, gravity, springs, pendulums.

### 8. Glitch/Digital
Scan lines, pixelation, data streams, errors.

### 9. Minimalist Reduction
Single pixel journeys, morse code, extreme simplicity.

### 10. Hybrid Behaviors
Combinations, transitions, emergent complexity.

## Technical

Each loader function:
```javascript
(t) => {
  const ctx = this.ctx;
  // t = timestamp in milliseconds
  // SIZE = 24
  // BG = '#0a0a0a'
  // FG = '#ffffff'
  
  // Your animation here
}
```

## Development Approach

1. Implement one group at a time
2. Test variations in context of the full grid
3. Look for emergent patterns when viewed together
4. Refine based on visual rhythm across groups

## Notes

- Grid displays all 100 simultaneously
- Hover shows group/index
- Modular = easy iteration
- Each group explores different motion vocabulary