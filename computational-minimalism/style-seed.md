# Computational Minimalism / Style Seed

*The aesthetic of watching something think.*

---

## Philosophy

- Quiet systems over loud interfaces
- Visible logic, emergent complexity
- Reduction as polish (strip, don't add)
- Data as material — show the grain
- Physics over easing, linear over theatrical

---

## Color Tokens

### Ground Layers (Elevation)

| Token | Hex | Usage |
|-------|-----|-------|
| `--ground-void` | `#0a0a0a` | Canvas, deepest background |
| `--ground-base` | `#0f0f0f` | Primary surface |
| `--ground-raised` | `#141414` | Elevated panels |
| `--ground-surface` | `#1a1a1a` | Cards, widgets collapsed |
| `--ground-float` | `#202232` | Alternative base (cool shift) |
| `--ground-modal` | `#242424` | Hover states, overlays |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#ffffff` | Titles, essential |
| `--text-default` | `#f5f5f7` | Body text |
| `--text-secondary` | `#a8aab8` | Labels, metadata |
| `--text-tertiary` | `#666666` | Hints, disabled |
| `--text-ghost` | `#333333` | Barely visible |

### Structural

| Token | Hex | Usage |
|-------|-----|-------|
| `--border-subtle` | `#1a1a1a` | Grid lines, faint dividers |
| `--border-default` | `#2a2a2a` | Standard borders |
| `--border-strong` | `#3a3d52` | Emphasized dividers |
| `--stroke-primary` | `#ffffff` | Main geometry |
| `--stroke-ghost` | `rgba(255,255,255,0.2)` | Trails, echoes |

### Accent (Spectral Singles)

Pick ONE per project. High contrast, intentional.

| Name | Hex | Character |
|------|-----|-----------|
| `--accent-cyan` | `#00ffaa` | Terminal, growth |
| `--accent-magenta` | `#ff0066` | Error, alert |
| `--accent-blue` | `#00a8ff` | Action, primary |
| `--accent-green` | `#00ff88` | Success, trim |
| `--accent-amber` | `#ffaa00` | Warning, warmth |
| `--accent-red` | `#ff0000` | Rare emphasis |

### Overlay

| Token | Value | Usage |
|-------|-------|-------|
| `--overlay-dim` | `rgba(10,10,10,0.85)` | Modal backgrounds |
| `--overlay-ghost` | `rgba(255,255,255,0.1)` | Hover states |

---

## Typography Tokens

### Font Families

```css
--font-mono: 'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', Monaco, 'Courier New', monospace;
--font-system: system-ui, -apple-system, sans-serif;
```

Monospace only in sketches. System for production UI if needed.

### Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 10px | Timestamps, labels |
| `--text-sm` | 11px | Secondary info |
| `--text-base` | 13px | Body text |
| `--text-md` | 14px | Primary content |
| `--text-lg` | 16px | Headings |
| `--text-xl` | 20px | Titles |

### Rhythm

| Token | Value |
|-------|-------|
| `--leading-tight` | 1.25 |
| `--leading-base` | 1.5 |
| `--leading-loose` | 1.75 |
| `--tracking-tight` | -0.02em |
| `--tracking-normal` | 0 |
| `--tracking-wide` | 0.08em |

### Case Rules

- All lowercase OR all uppercase
- Never mixed case in headers
- Labels: uppercase + wide tracking

---

## Spacing Tokens

Base unit: 4px (multiply)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Tight padding |
| `--space-3` | 12px | Element gaps |
| `--space-4` | 16px | Standard margin |
| `--space-5` | 20px | Section padding |
| `--space-6` | 24px | Component gaps |
| `--space-8` | 32px | Large margins |
| `--space-10` | 40px | Canvas edges |
| `--space-12` | 48px | Major sections |
| `--space-16` | 64px | Generous breathing |

---

## Geometry Rules

### Primitives Only

- Circles, lines, rectangles, points
- No organic curves unless algorithmically generated
- Polygons through code, not drawing

### Stroke

| Token | Value |
|-------|-------|
| `--stroke-thin` | 1px |
| `--stroke-default` | 2px |
| `--stroke-heavy` | 3px |

No fills unless essential. Let density create form.

### Grid

- 8px base grid (optional 4px for fine work)
- Grid as underlying logic, rarely visible
- When shown: 5-10% opacity max

---

## Motion Tokens

### Timing

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 0ms | Value changes |
| `--duration-fast` | 100ms | Hover, reveals |
| `--duration-base` | 150ms | State changes |
| `--duration-slow` | 300ms | Panel transitions |
| `--duration-drift` | 800ms | Ghost trails, floaty |

### Easing

```css
--ease-snap: linear;
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-physics: none; /* use actual integration */
```

**Physics > easing.** Use Euler/Verlet for gravity, springs, inertia. Let things drift rather than bounce.

### Animation Principles

- Instant feedback on interaction
- Binary state changes (on/off, visible/hidden)
- No theatrical entrances
- Things breathe, never bounce
- Ghost trails: 12-15fps intentional stutter

---

## Interaction Patterns

### States

| State | Visual |
|-------|--------|
| Default | Base stroke, no fill |
| Hover | Subtle color shift, never dramatic |
| Active | `scale(0.98)` or immediate color |
| Disabled | 50% opacity, dashed stroke |
| Focus | 2px ring, accent at 40% opacity |

### Cursor

- Cursor as subtle actor, not protagonist
- Click initiates, then step back
- Hover reveals, doesn't shout

---

## Anti-Patterns

Never use:

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
3. Reference this style-seed
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
- < 50kb when possible
- No external assets

---

## Reference

Casey Reas, Vera Molnár, early demoscene, oscilloscope aesthetics, terminal interfaces, data sonification displays.

---

## CSS Custom Properties (Copy-Paste)

```css
:root {
  /* Ground */
  --ground-void: #0a0a0a;
  --ground-base: #0f0f0f;
  --ground-raised: #141414;
  --ground-surface: #1a1a1a;
  --ground-float: #202232;
  --ground-modal: #242424;
  
  /* Text */
  --text-primary: #ffffff;
  --text-default: #f5f5f7;
  --text-secondary: #a8aab8;
  --text-tertiary: #666666;
  --text-ghost: #333333;
  
  /* Borders */
  --border-subtle: #1a1a1a;
  --border-default: #2a2a2a;
  --border-strong: #3a3d52;
  
  /* Accent — pick one */
  --accent: #00a8ff;
  
  /* Typography */
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  --text-base: 13px;
  --leading-base: 1.5;
  
  /* Spacing */
  --space-unit: 4px;
  --space-4: 16px;
  --space-8: 32px;
  
  /* Motion */
  --duration-fast: 100ms;
  --duration-base: 150ms;
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```