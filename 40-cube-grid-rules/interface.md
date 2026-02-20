# Day 40: Cube Grid Rules Engine

## Idea
3D cube grid governed by customizable cellular automaton-like rules with parameter controls

## Description
This project creates a 3D grid of cubes that evolve according to programmable rules similar to cellular automata but in three dimensions. A floating action button (FAB) opens parameters panel to adjust rule sets controlling cube behavior (birth/survival conditions, colors, update rates). The monospace aesthetic and minimal UI emphasize the algorithmic nature. Overlay text provides initial instruction that fades after first interaction.

## Data Concepts
- **Primary**: Spatial (3D grid, neighbor detection, cellular rules)
- **Secondary**: Temporal (evolution steps, update cycles), Statistical (rule application, state transitions)

## Conceptual Tags
#cellular-automata #3d-simulation #procedural-rules #generative-systems #rule-engine #algorithmic-art #computational-art

## Technical Tags
#webgl #three-js #3d-rendering #rule-systems #parameter-control

## Stack
- WebGL/Three.js (likely)
- Vanilla JavaScript
- Canvas

## Notes
- 3D cellular automata extend Conway's Game of Life principles into volumetric space
- Rules engine allows experimentation with different evolution patterns
- FAB UI pattern minimizes visual clutter while keeping controls accessible
- Monospace typography reinforces systematic/computational aesthetic
- The project explores emergence in 3D - how local rules create global patterns
