# Day 43: Computational Minimalism Style Seed

## Idea
Design system document defining visual language for creative coding sketches

## Description
A comprehensive style guide establishing the aesthetic and technical framework for the 100 Days project. Documents visual primitives (color, geometry, typography), spatial logic (layout, hierarchy), interaction patterns (feedback, animation), and code aesthetics (structure, naming). The guide prioritizes reduction to essence, algorithmic generation, and computational honesty—showing mechanisms rather than hiding them. Influences include Bauhaus reductionism, early computer graphics, and technical drawing conventions.

## Data Concepts
- **Primary**: Visual (design system, aesthetic framework)
- **Secondary**: Conceptual (design philosophy, anti-patterns)

## Conceptual Tags
#design-system #style-guide #computational-minimalism #bauhaus #algorithmic-aesthetics #reduction #visual-framework #design-philosophy

## Technical Tags
#css-variables #monospace #canvas #svg #no-dependencies #single-file-html

## Stack
- Markdown documentation
- CSS custom properties
- Canvas 2D / SVG primitives
- Monospace typography
- No external dependencies

## Visual Primitives

**Color Palette:**
- Background: #0a0a0a (near-black void)
- Surface layers: #0f0f0f, #050505
- Text: #ffffff (primary), #999/#666/#333 (gradations)
- Accent: #1a1a1a (borders, grids)
- Error/emphasis: #ff0000 (rare, intentional)

**Geometry:**
- Circles, lines, rectangles only
- No organic curves unless algorithmic
- Grid-based positioning
- Center-aligned compositions

**Typography:**
- Monospace only: Courier New, Monaco
- All lowercase OR uppercase, never mixed
- Letter-spacing: 1-3px for headers
- Discrete font sizes: 11px, 13px, 14px, 16px

## Interaction Principles

**Feedback:**
- Instant, no easing
- Binary state changes (on/off)
- Subtle hover color shifts
- Cursor: crosshair for canvas

**Animation:**
- RequestAnimationFrame for continuous motion
- No CSS transitions
- Linear interpolation, no easing
- Frame-by-frame, computational feel

## Anti-Patterns

**Avoid:**
- Rounded corners
- Drop shadows
- Gradients (unless computational)
- Texture overlays
- Decorative icons
- Excessive color
- Skeuomorphism

## Development Rhythm

1. Wait for idea crystallization
2. Create seed .md (concept + constraints)
3. Reference this style-seed
4. Build minimum viable sketch
5. Iterate on core mechanic
6. Strip unnecessary elements
7. Polish = reduction, not addition

## Notes
- This document defines the visual language used across Days 1-53
- Establishes consistency while allowing individual project variation
- Prioritizes computational honesty over decoration
- Influences: Bauhaus, cybernetic systems, early vector displays
- File size target: <50kb when possible
- Performance target: 60fps for animations
- Philosophy: Show the mechanism, don't hide it
- Quality markers: opens instantly, behavior self-evident, no tutorial needed
- Referenced in day-50/style-seed.md and other project documentation
