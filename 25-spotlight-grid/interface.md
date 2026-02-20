# Day 25: Spotlight Grid

## Idea
Interactive dot grid where dots near mouse cursor illuminate with adjustable density and color

## Description
This project creates a dynamic spotlight effect using a grid of dots that activate when the mouse approaches. Dots within a radius of the cursor transition to an active state with colored glow, creating a flashlight or spotlight aesthetic. Users control grid density (15-32px spacing) and dot color (0-360° hue) via sliders. The effect responds to mouse movement with a brief timeout - dots remain active briefly after the cursor stops moving, then the active radius shrinks slightly.

The implementation generates dots dynamically based on spacing parameter, positioning each absolutely within a container. Mouse position tracking triggers distance calculations for all dots each frame, toggling active class for dots within threshold. CSS custom properties enable dynamic color updates without regenerating DOM elements.

## Data Concepts
- **Primary**: Spatial (grid layout, proximity detection, distance calculation)
- **Secondary**: Visual (color variation, dynamic styling)

## Conceptual Tags
#interactive-grid #proximity-detection #spotlight-effect #dynamic-styling #mouse-tracking #distance-field #generative-ui

## Technical Tags
#css-custom-properties #dynamic-dom #distance-calculation #slider-controls #hue-manipulation

## Stack
- HTML5
- Vanilla JavaScript
- CSS (absolute positioning, CSS variables)
- External stylesheets (styles.css)

## Mechanics
- **Grid Generation**: Calculate cols and rows from container dimensions divided by spacing; create dot divs positioned at (col×spacing + spacing/2, row×spacing + spacing/2)
- **Distance Calculation**: Euclidean distance from mouse position to each dot's position: `sqrt((mouseX - dotX)² + (mouseY - dotY)²)`
- **Active Toggle**: Add .active class if distance < radius (50px while moving, 45px after stopping); CSS handles visual transition
- **Density Control**: Slider inverted - value 15 gives spacing 32 (sparse), value 32 gives spacing 15 (dense) via formula: `spacing = 47 - sliderValue`
- **Color Control**: Hue slider (0-360) updates CSS custom property `--dot-hue`, which HSL color references for active dot color
- **Timeout Mechanism**: Clear and reset 200ms timeout on each mousemove; when timeout fires, reduce active radius from 50 to 45px
- **Grid Regeneration**: Density changes trigger full grid rebuild - clear innerHTML, recalculate grid dimensions, recreate dots

## Parameters
- `spacing: 15-32px` - Grid cell size (inverse of density slider value)
- `hue: 0-360°` - Color hue for active dots (default 330° - magenta/pink)
- `activeRadius: 50px` (moving) / `45px` (stopped) - Distance threshold for dot activation
- `timeout: 200ms` - Delay before reducing active radius after movement stops
- Initial values:
  - density: 20 (spacing 27px)
  - hue: 330° (magenta/pink)

## Notes
- The inverted density slider (high value = dense grid) matches user intuition - "more density" creates more dots
- Hue-based color control provides full spectrum exploration while maintaining consistent saturation/lightness via HSL
- The 50px→45px radius reduction after stopping creates subtle feedback - spotlight contracts slightly when cursor idles
- Dynamic grid generation allows responsive density changes without page reload
- Distance calculation happens every frame for all dots - O(n) per frame where n = dot count; acceptable for grid sizes up to ~5000 dots
- CSS transitions handle visual smoothing - JavaScript only toggles class, CSS animates the color/size change
- Absolute positioning of dots within container enables precise grid alignment independent of CSS grid/flexbox
- The spotlight metaphor relates to human attention - we illuminate what we focus on, darkness surrounds periphery
- 200ms timeout balances responsiveness with stability - prevents flickering from tiny movements while feeling immediate
- CSS custom property approach (--dot-hue) enables performant color updates - no DOM manipulation, just variable change
- Grid centering via spacing/2 offset ensures symmetric layout even with non-integer col/row counts
- The project demonstrates proximity-based interaction paradigm common in modern UIs (hover states, tooltips, focus indicators)
- Fullscreen grid creates immersive effect - cursor becomes tool for revealing hidden structure
- Control bar at bottom provides non-intrusive parameter adjustment without obscuring main interaction area
