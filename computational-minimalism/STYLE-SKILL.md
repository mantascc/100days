# Style Skill - Computational Minimalism Generator

Generates starter HTML files following the style-seed design system.

---

## Usage

```bash
cd computational-minimalism
node style-skill.js <project-name> [--accent=color]
```

Or from project root:
```bash
node computational-minimalism/style-skill.js <project-name> [--accent=color]
```

---

## Examples

**Create with default (blue) accent:**
```bash
node style-skill.js "Particle Field"
```

**Create with specific accent:**
```bash
node style-skill.js "Data Flow" --accent=cyan
node style-skill.js "Network Graph" --accent=green
node style-skill.js "Error Monitor" --accent=magenta
```

---

## Output

Generates a complete HTML file with:

### ✓ Design System Baked In
- All CSS custom properties from style-seed
- Ground layers, text hierarchy, borders
- Typography scale and rhythm
- Spacing tokens (4px base unit)
- Motion timing and easing
- Chosen accent color

### ✓ Starter Canvas Setup
- Responsive stage (80vmin)
- Hi-DPI canvas ready
- Animation loop initialized
- Background drawing helper
- Info label positioned

### ✓ Comments & Guidelines
- Development rhythm reminders
- Quality markers checklist
- Animation principles
- Philosophy notes

---

## Accent Colors

| Color | Hex | Character |
|-------|-----|-----------|
| cyan | `#00ffaa` | Terminal, growth |
| magenta | `#ff0066` | Error, alert |
| **blue** | `#00a8ff` | Action, primary (default) |
| green | `#00ff88` | Success, trim |
| amber | `#ffaa00` | Warning, warmth |
| red | `#ff0000` | Rare emphasis |

**Rule:** Pick ONE accent per project. High contrast, intentional.

---

## Generated Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* All CSS custom properties */
      /* Stage and canvas styles */
      /* Info label styling */
    </style>
  </head>
  <body>
    <div id="stage">
      <canvas id="canvas"></canvas>
      <div id="info">project name</div>
    </div>
    <script>
      /* Canvas setup */
      /* Animation loop */
      /* Your sketch here */
    </script>
  </body>
</html>
```

---

## Design Philosophy

**Core Principles:**
- Quiet systems over loud interfaces
- Visible logic, emergent complexity
- Reduction as polish (strip, don't add)
- Data as material — show the grain
- Physics over easing, linear over theatrical

**Quality Markers:**
- Opens instantly
- Behavior self-evident
- Visually quiet but informationally dense
- 60fps target, degrade gracefully
- <50kb when possible
- No external assets

**Anti-Patterns (never use):**
- Gradients
- Drop shadows
- Rounded corners > 4px
- Decorative borders
- Easing theatrics
- Multiple accent colors
- Mixed case typography
- Dense layouts without breathing room
- Emojis or icons (unless functional)

---

## Development Rhythm

1. Wait for idea crystallization
2. Create seed `.md` (concept + constraints)
3. **Use this skill** to generate starter HTML
4. Build minimum viable sketch
5. Iterate on core mechanic
6. Strip unnecessary elements
7. Polish = reduction, not addition
8. Works on first try, no tutorial needed

---

## Workflow Integration

### Quick Start
```bash
# Generate starter file
node style-skill.js "My Sketch" --accent=cyan

# Open in browser
open my-sketch.html

# Edit and iterate
```

### With Existing Projects
```bash
# Generate reference file
node style-skill.js "Reference" --accent=blue

# Copy CSS custom properties
# Adapt to existing structure
```

---

## CSS Custom Properties Reference

**Ground Layers:**
```css
--ground-void: #0a0a0a;      /* Canvas, deepest background */
--ground-base: #0f0f0f;      /* Primary surface */
--ground-raised: #141414;    /* Elevated panels */
--ground-surface: #1a1a1a;   /* Cards, widgets */
--ground-float: #202232;     /* Alternative base */
--ground-modal: #242424;     /* Hover states, overlays */
```

**Text Hierarchy:**
```css
--text-primary: #ffffff;     /* Titles, essential */
--text-default: #f5f5f7;     /* Body text */
--text-secondary: #a8aab8;   /* Labels, metadata */
--text-tertiary: #666666;    /* Hints, disabled */
--text-ghost: #333333;       /* Barely visible */
```

**Spacing (4px base):**
```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px; --space-12: 48px;
--space-16: 64px;
```

**Typography Scale:**
```css
--text-xs: 10px;   /* Timestamps, labels */
--text-sm: 11px;   /* Secondary info */
--text-base: 13px; /* Body text */
--text-md: 14px;   /* Primary content */
--text-lg: 16px;   /* Headings */
--text-xl: 20px;   /* Titles */
```

**Motion Timing:**
```css
--duration-instant: 0ms;   /* Value changes */
--duration-fast: 100ms;    /* Hover, reveals */
--duration-base: 150ms;    /* State changes */
--duration-slow: 300ms;    /* Panel transitions */
--duration-drift: 800ms;   /* Ghost trails */
```

---

## Related Files

- `day-50/style-seed.md` - Full design system documentation
- `day-43/style-seed.md` - Original comprehensive guide
- `interface-schema.md` - Project documentation schema

---

## Tips

**Choosing Accent Color:**
- cyan: Data, terminal, growth themes
- blue: General purpose, action, primary
- green: Success states, organic, nature
- amber: Warnings, warmth, energy
- magenta: Errors, alerts, disruption
- red: Rare emphasis, danger, critical

**Customization:**
- Edit generated file directly
- All tokens use CSS custom properties
- Easy to override without breaking system
- Add project-specific variables as needed

**Performance:**
- Hi-DPI scaling handled automatically
- RequestAnimationFrame loop ready
- Resize observer pattern included
- Canvas cleared efficiently

---

*See `day-50/style-seed.md` for complete design system reference.*
