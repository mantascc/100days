# Day 70: Clear Channel — Introduction

## Idea
Manifesto page for the Clear Channel design system, with live canvas demos

## Description
The introduction document for "Clear Channel" — the design system that has been emerging across the series, here written down as a single scrollable page. Hero title in Instrument Serif ("like watching something think."), a statement section, six numbered principles (quiet systems over loud interfaces, visible logic, reduction as polish, data as material, physics over easing, one accent with total discipline), and a closing grid of twelve anti-patterns: no gradients, no drop shadows, no easing theatrics, no sans-serif body.

The system itself is specified in the middle sections: a dark ramp anchored on #0a0a0a (named tokens void/base/raised/surface/float/modal), text foreground steps, an eight-colour accent spectrum with the rule "pick one per project", semantic colours for status only, and a 10–28px monospace type scale with serif reserved for display moments.

The page demonstrates rather than just describes: a live flow-field particle canvas sits in the hero, and the motion section runs three small canvas sketches — brownian particles with trails, layered sine waves over a grid, and a Game of Life automaton — each following the rules the page states. A fixed tick nav on the right tracks scroll position and highlights the active section.

## Data Concepts
- **Primary**: Visual (design system, color and type specification)
- **Secondary**: Emergence (flow field, brownian motion, game of life demos)

## Conceptual Tags
#design-system #computational-minimalism #manifesto #self-documentation #anti-patterns #reduction #data-as-material

## Technical Tags
#canvas-2d #css-variables #scroll-spy #flow-field #game-of-life #design-tokens

## Stack
- Single HTML file, vanilla JS
- CSS custom properties as the token source (colors, type scale, spacing, durations)
- JetBrains Mono + Instrument Serif via Google Fonts
- Four independent canvas IIFEs (hero flow field, brownian, signal wave, life grid)
- Scroll-driven tick nav with active-section detection

## Notes
- v2 of the system intro — successor to the day-43 style-seed and the earlier clear channel page; footer reads "v2 / 2026"
- the page obeys its own rules: 1px hairline grids, single #00ffaa accent, no border-radius, trail-fade canvases
- "the system is defined as much by what it refuses as by what it includes" — the anti-pattern grid is the most useful section
- principle 05 (euler integration beats css transitions) is the series' motion philosophy in one line
- links out to the visual-language, component-kit, and landing-variant pages of the same system
