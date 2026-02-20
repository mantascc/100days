# Day 46: OKLCH vs HSL Gradient Comparison

## Idea
Side-by-side comparison of color gradients using OKLCH and HSL color spaces

## Description
This project visualizes the perceptual difference between OKLCH and HSL color spaces through gradient comparisons. OKLCH (Oklab Lightness Chroma Hue) provides perceptually uniform colors while HSL (Hue Saturation Lightness) shows uneven perceived brightness. The comparison demonstrates why OKLCH creates smoother, more natural-feeling gradients. Space Mono font and dark monochrome interface (#0a0a0a) frame the technical/analytical nature. Button interaction allows cycling through different gradient examples.

## Data Concepts
- **Primary**: Visual (color perception, color space comparison, gradient quality)
- **Secondary**: Statistical (perceptual uniformity, color metrics)

## Conceptual Tags
#color-science #oklch #hsl #color-spaces #perceptual-uniformity #gradient-comparison #color-theory

## Technical Tags
#css-color-spaces #oklch-color #gradient-rendering #color-comparison

## Stack
- HTML/CSS (OKLCH color functions)
- Vanilla JavaScript
- Google Fonts (Space Mono)

## Notes
- OKLCH designed for perceptual uniformity - equal numeric changes produce equal perceived changes
- HSL gradients often show muddy midtones due to non-uniform lightness
- The comparison educates on modern CSS color spaces vs legacy HSL
- OKLCH enables better gradient design, accessible color palettes, and color manipulation
- Space Mono reinforces technical/scientific framing of color comparison
- The project demonstrates practical implications of color space choice
