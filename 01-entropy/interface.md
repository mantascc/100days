# Day 1: Entropy

## Idea
Interactive visualization of entropy as a gradient from perfect order to total chaos

## Description
A single square particle moves through different motion patterns controlled by an entropy slider (0-100). The motion transitions from predictable horizontal oscillation (0) → perfect ellipse (35) → wobbly ellipse (50) → chaotic ellipse (75) → complete chaos (100). The visualization demonstrates entropy as a continuous spectrum rather than a binary state.

## Data Concepts
- **Primary**: Statistical / Entropy
- **Secondary**: Temporal (motion over time)

## Conceptual Tags
#entropy #order-chaos #parametric-motion #interpolation #deterministic-to-stochastic

## Technical Tags
#vanilla-js #css-animation #lissajous #elliptical-orbit #smooth-transitions

## Stack
- Pure HTML/CSS/JS
- CSS transforms for rendering
- Parametric equations (ellipse + Lissajous curves)
- RequestAnimationFrame for smooth 60fps

## Motion Design
- Elliptical orbit with cos/sin parametric
- Lissajous curves with randomized frequencies for unpredictability
- Piecewise interpolation between motion states
- Constant tempo across all entropy levels
- Rotation speed tied to wander intensity

## Notes
- No canvas - pure DOM/CSS for simplicity
- Entropy mapped non-linearly (piecewise) to create distinct phases
- Random frequency initialization makes each session unique
- Demonstrates that chaos can emerge from simple rules
- Visual metaphor: order is a special case of chaos, not its opposite
