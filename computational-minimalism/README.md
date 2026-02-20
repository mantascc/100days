# Computational Minimalism

*The aesthetic of watching something think.*

Design system and tools for creating visually quiet, informationally dense creative coding sketches.

---

## Philosophy

- Quiet systems over loud interfaces
- Visible logic, emergent complexity
- Reduction as polish (strip, don't add)
- Data as material — show the grain
- Physics over easing, linear over theatrical

---

## Contents

### `style-seed.md`
Complete design system documentation:
- Color tokens (ground, text, structural, accent)
- Typography tokens (scale, rhythm, fonts)
- Spacing system (4px base unit)
- Geometry rules (primitives only)
- Motion tokens (timing, easing)
- Interaction patterns
- Anti-patterns (what to avoid)
- Development rhythm
- Quality markers

### `style-skill.js`
CLI tool for generating starter HTML files:
```bash
node style-skill.js "Project Name" --accent=cyan
```

Outputs complete HTML with:
- All CSS custom properties
- Canvas setup (Hi-DPI)
- Animation loop
- Design system embedded

### `STYLE-SKILL.md`
Usage guide for the generator tool:
- Command examples
- Accent color reference
- Workflow integration
- CSS token quick reference

---

## Quick Start

**1. Generate a new sketch:**
```bash
node style-skill.js "Particle Field" --accent=cyan
```

**2. Open and code:**
```bash
open particle-field.html
```

**3. Build in the animate() function:**
```javascript
function animate() {
    drawBackground();

    // Your sketch logic here

    requestAnimationFrame(animate);
}
```

---

## Accent Colors

Pick ONE per project:

| Color | Hex | Character |
|-------|-----|-----------|
| cyan | `#00ffaa` | Terminal, growth |
| magenta | `#ff0066` | Error, alert |
| blue | `#00a8ff` | Action, primary |
| green | `#00ff88` | Success, trim |
| amber | `#ffaa00` | Warning, warmth |
| red | `#ff0000` | Rare emphasis |

---

## Design Principles

### Visual Primitives
- Circles, lines, rectangles only
- No organic curves unless algorithmic
- Monospace typography
- Grid-based positioning

### Color System
- Dark backgrounds (#0a0a0a base)
- Text hierarchy (5 levels)
- Single accent color per project
- No gradients or drop shadows

### Typography
- Monospace: JetBrains Mono, IBM Plex Mono, SF Mono
- All lowercase OR uppercase, never mixed
- Discrete sizes: 10px, 11px, 13px, 14px, 16px, 20px
- Wide tracking on labels (0.08em)

### Spacing
- 4px base unit
- Multiples only: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Generous negative space
- Elements float rather than stack densely

### Motion
- RequestAnimationFrame for continuous animation
- Linear interpolation (no easing)
- Instant feedback on interaction
- Binary state changes
- 60fps target

---

## Anti-Patterns

**Never use:**
- Gradients
- Drop shadows
- Rounded corners > 4px
- Decorative borders
- Easing theatrics
- Multiple accent colors
- Mixed case typography
- Emojis or icons (unless functional)

---

## Development Rhythm

1. Wait for idea crystallization
2. Create seed `.md` (concept + constraints)
3. Use `style-skill.js` to generate starter
4. Build minimum viable sketch
5. Iterate on core mechanic
6. Strip unnecessary elements
7. Polish = reduction, not addition
8. Works on first try, no tutorial needed

---

## Quality Markers

- Opens instantly
- Behavior self-evident
- Visually quiet but informationally dense
- Leaves space for interpretation
- 60fps target, degrade gracefully
- <50kb when possible
- No external assets

---

## Influences

- Bauhaus reductionism
- Cybernetic systems thinking
- Early computer graphics (vector displays)
- Technical drawing conventions
- Information theory diagrams
- Scientific visualization
- Casey Reas, Vera Molnár
- Early demoscene
- Oscilloscope aesthetics
- Terminal interfaces

---

## Examples in 100 Days

Projects following this system:
- Day 1: Entropy
- Day 7: Apophenia
- Day 10: Audio-Reactive Agents
- Day 12: Wind Field
- Day 14: Synchronizing Fireflies
- Day 49: Grid Trace
- Day 50: Execution Trace Graph
- Day 51: Resonant Lattice
- Day 52: Reaction-Diffusion
- Day 53: ASCII Animated Grid

See individual `day-*/` folders for implementations.

---

## Usage in Projects

### Option 1: Generate Fresh
```bash
cd computational-minimalism
node style-skill.js "New Sketch" --accent=cyan
mv new-sketch.html ../day-54/index.html
```

### Option 2: Copy CSS Variables
Copy the `:root` block from `style-seed.md` into existing HTML.

### Option 3: Reference as Base
Use generated HTML as starting template, customize as needed.

---

## File Size

Target: <50kb per sketch
- Inline everything (CSS, JS)
- No external dependencies
- Compression through simplicity
- Single HTML file ideal

---

## Performance

Target: 60fps animations
- Use RequestAnimationFrame
- Optimize loops
- Avoid GC pressure
- Typed arrays for large data
- Degrade gracefully (lower resolution, not slower framerate)

---

*Part of the 100 Days of Creative Coding project*
