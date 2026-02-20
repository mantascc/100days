# Day 53: ASCII Animated Grid (Refined UI)

## Idea
Character-based animation grid with five distinct modes: ripple, wave, rain, breath, and worm

## Description
This project creates ASCII art animations using text characters in a grid layout. Five animation modes provide different visual effects: ripple (concentric expanding circles), wave (sinusoidal motion), rain (falling characters), breath (pulsing expansion/contraction), and worm (snake-like movement). Mode selector UI uses numbered keyboard shortcuts (1-5) with visual active state indication. The pre element ensures monospace character alignment, critical for ASCII art coherence. Pure text-based rendering creates retro terminal aesthetic.

## Data Concepts
- **Primary**: Visual (ASCII art, character animation, text-based graphics)
- **Secondary**: Temporal (animation loops, character cycling), Spatial (grid layout, pattern movement)

## Conceptual Tags
#ascii-art #text-animation #character-graphics #retro-computing #terminal-aesthetics #mode-switching #procedural-animation

## Technical Tags
#pre-element #monospace #dom-manipulation #animation-modes #keyboard-shortcuts

## Stack
- HTML (pre element for monospace grid)
- Vanilla JavaScript
- CSS

## Mechanics
- **Ripple Mode**: Characters change based on distance from center, creating expanding rings
- **Wave Mode**: Sinusoidal function determines character intensity across grid
- **Rain Mode**: Characters fall from top, accumulating or disappearing at bottom
- **Breath Mode**: Entire grid expands/contracts rhythmically from center
- **Worm Mode**: Snake-like entity moves through grid leaving trail

## Notes
- ASCII art relies on monospace fonts for character alignment
- Pre element preserves whitespace and prevents character wrapping
- Different characters (density: ., -, +, #, @) represent intensity/depth
- Mode switching via keyboard (1-5) enables rapid exploration of effects
- Active state highlighting provides visual feedback for current mode
- The project demonstrates how constrained medium (text-only) forces creative solutions
- Text-based approach highly performant - no canvas/GPU overhead
- Retro aesthetic appeals to terminal/command-line culture
- Each mode likely uses different mathematical functions (distance fields, waves, cellular automata, procedural paths)
- The refined UI suggests iteration from earlier version, improving mode selection UX
