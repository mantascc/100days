# Day 28: Liquid Glass Effect

## Idea
Draggable frosted glass pane with liquid distortion filter and customizable backdrop effects

## Description
This project creates a glassmorphism effect using CSS backdrop-filter combined with SVG liquid distortion. A draggable glass rectangle floats over a background image and text, applying blur, saturation, brightness, and contrast adjustments to the content behind it. The liquid effect uses SVG feTurbulence and feDisplacementMap filters to create organic warping. A side control panel provides real-time adjustment of all glass properties plus intensity presets (low/medium/high) for liquid distortion. Users can randomize settings or export the generated CSS.

The implementation uses CSS custom properties (--blur, --saturation, etc.) for dynamic updates without DOM manipulation. Drag functionality calculates offset and updates transform position. The liquid filter combines fractal noise turbulence with displacement mapping for fluid visual distortion. Control sliders provide fine-grained parameter tweaking while segmented intensity buttons offer quick presets.

## Data Concepts
- **Primary**: Visual (image processing, filter effects, glassmorphism aesthetic)
- **Secondary**: Spatial (drag interaction, element positioning)

## Conceptual Tags
#glassmorphism #backdrop-filter #liquid-effect #svg-filters #visual-effects #interactive-controls #css-custom-properties #generative-design

## Technical Tags
#svg-filters #feturbulence #fedisplacementmap #backdrop-filter #drag-interaction #css-variables #parameter-export

## Stack
- HTML5
- CSS (backdrop-filter, custom properties)
- SVG Filters (feTurbulence, feDisplacementMap)
- Vanilla JavaScript
- Google Fonts (Instrument Serif)

## Mechanics
- **Backdrop Filter**: Combines blur(2px), saturate(180%), brightness(110%), contrast(100%) applied to background content
- **Liquid Distortion**: SVG filter chain - (1) feTurbulence generates fractal noise, (2) feDisplacementMap warps source graphic using noise as displacement map
- **Intensity Presets**:
  - Low: scale 8, frequency 0.008
  - Medium: scale 15, frequency 0.01
  - High: scale 25, frequency 0.012
- **Drag System**: Mousedown initiates drag, mousemove updates translate transform, mouseup releases; drag handle appears on hover
- **Control Updates**: Range input events update CSS custom properties which immediately affect glass styling
- **Randomization**: Generates random values within parameter ranges and applies to all controls
- **CSS Export**: Captures computed styles and filter parameters, formats as CSS with inline SVG documentation

## Parameters
- `--blur: 2px` (range 0-50px)
- `--saturation: 180%` (range 50-300%)
- `--brightness: 110%` (range 50-200%)
- `--contrast: 100%` (range 50-200%)
- `--bg-alpha: 0.1` (range 0-1)
- `--shape: 16px` (border-radius)
- Liquid displacement scale: 8-25 (low-high)
- Liquid base frequency: 0.008-0.012 (low-high)

## Notes
- Backdrop-filter creates "frosted glass" by processing background pixels, not foreground
- SVG filters enable effects impossible with CSS alone - organic warping, distortion, turbulence
- FeTurbulence generates Perlin/simplex noise patterns for natural-looking randomness
- FeDisplacementMap interprets noise as vector field, displacing pixels based on noise values
- The combination creates "liquid" aesthetic - glass appears to warp and flow
- CSS custom properties enable instant visual feedback as sliders move
- Drag handle (⋮⋮ icon) only appears on hover to reduce visual clutter
- Segmented control for intensity mirrors iOS/macOS design patterns
- Export function demonstrates how to capture and document procedurally generated styles
- The project bridges CSS design tools and actual CSS output - interactive style editor
- Background image (1.avif) uses modern AVIF format for efficient loading
- Instrument Serif font for text overlay adds elegance against technical aesthetic
- Box shadow with inset highlight creates depth and dimensional quality
- The liquid effect intensity directly affects displacement scale and turbulence frequency
- Randomize feature enables exploratory design - generate variants quickly
- The tool demonstrates professional glassmorphism implementation with advanced liquid distortion
