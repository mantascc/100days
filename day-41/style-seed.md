# computational minimalism / style-seed

## visual primitives

**color palette:**
- background: #0a0a0a (near-black void)
- surface: #0f0f0f, #050505 (subtle depth layers)
- primary: #ffffff (pure white, sparingly)
- secondary: #999, #666, #333 (gray gradations)
- accent: #1a1a1a (borders, grid lines)
- error/emphasis: #ff0000 (rare, intentional)

**geometry:**
- circles, lines, rectangles only
- no organic curves unless algorithmically generated
- grid-based positioning
- center-aligned compositions
- symmetric where possible, asymmetric with purpose

**typography:**
- monospace only: 'Courier New', Monaco, 'Lucida Console'
- all lowercase or all uppercase, never mixed
- letter-spacing: 1-3px for headers
- font sizes: 11px, 13px, 14px, 16px (discrete steps)
- line-height: 1.6-1.8 (breathing room)

---

## spatial logic

**layout principles:**
- generous negative space (40-60px margins)
- implicit grid systems (rarely visible, always felt)
- elements float in void rather than stacking densely
- borders as separators, never decoration
- padding: 20px, 40px, 60px (multiples of 20)

**information hierarchy:**
- position over weight (placement conveys importance)
- subtle scale changes (13px → 16px, not dramatic jumps)
- whitespace as hierarchy tool
- minimal use of bold/italic
- color shifts for state, not decoration

---

## interaction patterns

**feedback:**
- instant, no easing curves
- state changes are binary (on/off, visible/hidden)
- hover: subtle color shift (#666 → #999)
- active: no transform, just color
- cursor: crosshair for canvas, default elsewhere

**animation:**
- requestAnimationFrame for continuous motion
- no CSS transitions (too soft)
- linear interpolation, no easing functions
- frame-by-frame updates, computational feel
- particle systems over tweened objects

**controls:**
- mouse position as primary input
- keyboard for discrete states
- no buttons unless necessary
- labels as instructions, minimal UI chrome

---

## code aesthetics

**file structure:**
- single HTML file with inline styles and script
- no external dependencies unless essential
- canvas for dynamic, SVG for static
- minimal DOM, maximal computation

**naming conventions:**
- lowercase with underscores: field_strength, grid_size
- abbreviations: W, H, ctx, px, py
- constants in UPPERCASE: THRESHOLD, GRID_SIZE
- terse but readable

**comments:**
- section headers only: // Field calculation
- no inline explanations (code should be clear)
- ASCII art for complex algorithms welcome

---

## rendering approach

**canvas strategy:**
- pixel-level control
- fill entire canvas per frame
- stroke for contours, fill for fields
- lineWidth: 1-2px (crisp)
- lineCap: 'round' or 'square', never 'butt'

**visual effects:**
- brightness as field strength visualization
- alpha for layering, not blur
- no gradients (use dithering or discrete steps)
- monochrome or near-monochrome
- color only for functional differentiation

**debug visualization:**
- grid lines in #1a1a1a
- center points as 2-3px filled circles
- coordinate markers in #333
- always toggle-able, never permanent

---

## information design

**text blocks:**
- short paragraphs (2-4 sentences)
- line breaks for emphasis
- em dash — for parenthetical
- code inline: `variable_name`
- formulas centered, isolated

**documentation:**
- show, then tell
- diagrams before explanation
- progressive disclosure
- examples over theory
- "why" more important than "how"

**labels:**
- position: absolute, top/left corners
- font-size: 11px
- color: #666
- format: "concept / subconcept"
- line-height: 1.6 for multi-line

---

## conceptual frameworks

**design philosophy:**
- reduction to essence
- algorithmic generation over hand-crafting
- systems over artifacts
- emergence from simple rules
- computational honesty (show the mechanism)

**anti-patterns to avoid:**
- rounded corners
- drop shadows
- gradients (unless computationally derived)
- texture overlays
- decorative icons
- excessive color
- organic hand-drawn aesthetics
- skeuomorphism

**influences:**
- bauhaus reductionism
- cybernetic systems thinking
- early computer graphics (vector displays)
- technical drawing conventions
- information theory diagrams
- scientific visualization

---

## sketch types

**exploratory:**
- single concept focus
- minimal controls
- raw output, no polish
- fast iteration over perfection

**explanatory:**
- paired visualization + text
- progressive complexity
- multiple views of same data
- educational intent

**experiential:**
- mouse-driven exploration
- no instructions needed
- behavior discovery through interaction
- ambient, continuous

---

## technical constraints

**browser compatibility:**
- modern evergreen browsers only
- no fallbacks, no polyfills
- canvas 2D, no WebGL (unless needed)
- ES6+ syntax freely

**performance:**
- 60fps target for animation
- optimize loops, avoid GC pressure
- typed arrays for large data
- worker threads for heavy computation
- degrade gracefully (lower resolution, not slower frame rate)

**file size:**
- keep under 50kb when possible
- inline everything
- no external assets
- compression through simplicity

---

## metadata patterns

**file naming:**
- descriptive, hyphenated: `metaball-sketch.html`
- versioning: append -v2, -v3 if iterating
- related files share prefix: `metaball-seed.md`

**headers:**
```html
<title>concept-name</title>
```

**info overlay:**
```
concept / algorithm-name
brief interaction hint
```

**version notes:**
- embedded in HTML comments if significant
- date format: 2024-12-12
- changes described tersely

---

## development rhythm

1. wait for idea crystallization
2. create seed .md (concept + constraints)
3. draft style-seed or reference existing
4. build minimum viable sketch
5. iterate on core mechanic
6. strip unnecessary elements
7. polish → reduction, not addition
8. document if needed
9. move to next

**quality markers:**
- opens instantly
- behavior self-evident
- visually quiet but informationally dense
- works on first try
- no tutorial needed
- leaves space for interpretation