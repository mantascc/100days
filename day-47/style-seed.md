# 2GIF — Style Seed

## Visual Language

**Computational minimalism meets professional tooling**

Dark, precise, geometric. Interface recedes to let content dominate. Controls feel like instruments—tactile, immediate, honest about what they do.

---

## Color System

### Base palette (OKLCH for perceptual uniformity)
```
Background layers:
  #0a0a0a — primary surface
  #141414 — elevated panels
  #1a1a1a — interactive surfaces
  #242424 — hover states

Borders/dividers:
  #2a2a2a — subtle structure
  #404040 — emphasis borders

Text hierarchy:
  #f5f5f5 — primary text
  #a0a0a0 — secondary labels
  #606060 — disabled/meta

Accent (functional):
  #00a8ff — primary action (export, play)
  #ff006e — destructive (delete, reset)
  #00ff88 — success state (export complete)
  #ffaa00 — warning (file size, processing)
```

### Usage rules:
- No gradients in UI (reserve for user content)
- Accent color only on interactive elements
- Success/warning states appear, then fade
- Borders at 1px, never more

---

## Typography

### System:
- **Monospace:** JetBrains Mono / SF Mono / Consolas
- **Interface:** -apple-system / Segoe UI / system-ui

### Hierarchy:
```
H1: 24px mono, 140% line, 0.02em tracking — panel titles
H2: 16px mono, 140% line, 0.02em tracking — section headers
Body: 14px system, 150% line — descriptions, help text
Label: 12px mono, 140% line, 0.04em tracking — data, settings
Code: 13px mono, 140% line — file names, technical values
```

### Voice:
- Labels are nouns: "Zoom" not "Zoom level"
- Values show units: "1.5×" "24fps" "2.4MB"
- No pleasantries: "Export" not "Export your gif"
- Technical but not academic

---

## Spatial System

### Grid:
```
Base unit: 8px
Component padding: 16px
Panel margins: 24px
Section gaps: 32px
```

### Rhythm:
- Tight grouping for related controls (8px)
- Breathing room between sections (24-32px)
- Canvas gets maximum space, controls compress

### Borders & radius:
```
Border radius: 4px (subtle, never round)
Border weight: 1px
Divider opacity: 0.1 (almost invisible)
Focus ring: 2px, accent color at 40% opacity
```

---

## Components

### Buttons
```
Primary (export):
  bg: #00a8ff, text: #000, height: 36px
  hover: +10% lightness
  active: scale(0.98)

Secondary (actions):
  bg: #1a1a1a, text: #f5f5f5, height: 32px
  border: 1px #2a2a2a
  hover: bg #242424

Tertiary (subtle):
  bg: transparent, text: #a0a0a0
  hover: text #f5f5f5
```

### Sliders
```
Track: 4px height, #242424 bg
Fill: accent color (#00a8ff)
Thumb: 16px circle, #f5f5f5, 2px border accent
Values display inline right: "1.5×"
```

### Timeline
```
Background: #141414
Playhead: 2px wide, accent color, with timestamp
Trim markers: Draggable handles, 4px wide, #00ff88
Thumbnails: 48px height, 4px gap, slight border
Duration labels: 10px mono, #606060
```

### Canvas preview
```
Checkerboard for transparency (8px squares, #0a0a0a/#141414)
Video centered, maintains aspect
Crop overlay: dashed 2px #00a8ff at 60% opacity
Zoom level indicator: bottom-right corner, "2.3×"
```

### Panels
```
Settings panel: 320px fixed width, right side
Scrollable if content exceeds viewport
Sections separated by 1px divider (#2a2a2a)
Collapse/expand with subtle chevron
```

---

## Motion

### Principles:
- Instant feedback on interaction
- Smooth preview playback (60fps target)
- Export progress visible, not distracting
- No decoration motion, only functional

### Timings:
```
Instant: 0ms — value changes, playback
Fast: 100ms ease-out — hover states, reveals
Medium: 200ms ease-in-out — panel transitions
Slow: 300ms ease-out — export progress, success states
```

### Transitions:
```css
/* Standard easing */
transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);

/* Focus states */
outline: 2px solid rgba(0, 168, 255, 0.4);
outline-offset: 2px;
transition: outline 100ms;
```

---

## States

### Interactive elements:
```
Default → border subtle, text secondary
Hover → border emphasis, text primary, bg lift
Active → scale(0.98), border accent
Disabled → opacity 40%, cursor not-allowed
Focus → outline ring, no other change
```

### Processing states:
```
Idle: "Export" button at rest
Processing: Spinner inline, percentage counter
Complete: Green checkmark, fade to idle after 2s
Error: Red indicator, message below, retry option
```

---

## Background Previews

### In settings panel:
```
Each background type shows 80×80px preview
Hover reveals parameters (color, gradient stops, blur radius)
Active selection: 2px accent border
Grid layout, 2 columns, 8px gap
```

### Preview styles:
```
Solid: Simple color swatch, hex value below
Gradient: Two-stop visual, angle indicator
Blur: Miniature of actual video edge blur
Procedural: Live preview of pattern generation
```

---

## Data Display

### File information:
```
Format: "1920×1080 • 30fps • 4.2MB • 0:08"
Monospace, single line, #a0a0a0
Updates live during trim
```

### Export estimate:
```
"~2.1MB at 24fps, 256 colors"
Warning if >5MB: "(May be slow to share)"
Live recalculation as settings change
```

---

## Responsive Behavior

### Breakpoints:
```
Desktop: 1280px+ (default, three-panel)
Laptop: 1024-1279px (compressed settings)
Tablet: 768-1023px (stacked panels)
Mobile: <768px (not supported, show message)
```

### Adaptation:
- Canvas always maximizes available space
- Settings collapse to tabs on smaller screens
- Timeline height fixed at 80px minimum
- No mobile version for v1 (focus on desktop workflow)

---

## Accessibility

### Keyboard navigation:
- All controls tabbable in logical order
- Visible focus indicators (2px accent ring)
- Spacebar reserved for playback
- Arrow keys for frame-by-frame
- Escape closes modals/resets state

### Screen reader:
- ARIA labels on icon-only buttons
- Live region for export status
- Role="slider" on all range inputs
- Alt text on background previews

### Contrast:
- All text meets WCAG AA (4.5:1 minimum)
- Interactive elements 3:1 against background
- Accent colors chosen for visibility

---

## Technical Constraints

### Performance optimizations:
```
Canvas renders at 60fps via RequestAnimationFrame
Debounce slider input (16ms)
Lazy-load timeline thumbnails (intersection observer)
Worker thread for export (keeps UI responsive)
```

### Browser targets:
```
Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
(Modern evergreen, no IE11)
```

---

## Inspiration References

**Aesthetic:**
- Figma's precision and restraint
- Linear's speed and clarity
- Vercel's technical elegance
- Terminal interfaces (information density)

**Not like:**
- Consumer video editors (too playful)
- Adobe Creative Cloud (too complex)
- Social media tools (too casual)

---

## Implementation Notes

### CSS architecture:
```
Custom properties for theming
No CSS-in-JS, plain CSS modules
BEM naming for clarity
Scoped component styles
```

### Design tokens:
```javascript
// tokens.css
:root {
  --surface-0: #0a0a0a;
  --surface-1: #141414;
  --surface-2: #1a1a1a;
  
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  
  --accent: #00a8ff;
  --success: #00ff88;
  --warning: #ffaa00;
  
  --radius: 4px;
  --unit: 8px;
  
  --timing-fast: 100ms;
  --timing-medium: 200ms;
}
```

---

## Evolution Path

**Future style considerations:**
- Light mode (if team requests, not default)
- Custom accent color per user
- Preset style "skins" for different workflows
- Expanded procedural background system
- Animation curves as visual language

**Philosophy:**
Style serves function. Every pixel earns its place. Reduce, reveal, refine.