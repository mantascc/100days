# 100 Progress Indicators

A systematic exploration of loading animations within strict constraints: 24×24px, single color, grouped conceptually.

## Overview

100 unique loading indicators organized into 10 thematic groups, each exploring different motion vocabularies and animation principles.

## Groups

1. **Geometric Primitives** - Basic shapes with fundamental transformations
2. **Organic Forms** - Blob-like, flowing, breathing animations
3. **Particle Systems** - Multiple elements: dots, pixels, particles in motion
4. **Line Art** - Single stroke, spirals, continuous paths
5. **Grid Distortions** - Systematic deformations, cellular patterns
6. **Symbolic** - Icons, metaphors, recognizable loading concepts
7. **Optical/Physics** - Orbits, gravity, springs, pendulums
8. **Glitch/Digital** - Scan lines, pixelation, data streams, errors
9. **Minimalist Reduction** - Single pixel journeys, morse code, extreme simplicity
10. **Hybrid Behaviors** - Combinations, transitions, emergent complexity

## Features

- 100 unique animations
- Pure JavaScript + Canvas 2D API
- No dependencies
- Responsive design (desktop, tablet, mobile)
- All animations run at 60fps with 1-second loops

## View Live

Open `index.html` in your browser to see all 100 loading indicators in action.

## Technical Details

- **Size**: 24×24 px
- **Palette**: Single foreground + single background color
- **Duration**: 1-second loop
- **Medium**: HTML Canvas / JavaScript
- **Structure**: Pure functions receiving time `t` and rendering to canvas context

## Development Approach

1. Each loader is a pure function: `(ctx, t) => { ... }`
2. Organized by conceptual groups
3. Grid displays all 100 simultaneously
4. Hover (desktop) or tap (mobile) to see group/index
5. Modular design for easy iteration

## Project Structure

```
/day-29
  index.html          # Main page
  style.css           # Responsive styles
  /src
    engine.js         # Animation engine
    loaders.js        # Loader registration
    /groups           # Individual group implementations
      geometric.js
      organic.js
      particle.js
      lineart.js
      grid.js
      symbolic.js
      physics.js
      glitch.js
      minimalist.js
      hybrid.js
```

## License

MIT
