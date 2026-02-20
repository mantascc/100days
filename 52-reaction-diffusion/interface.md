# Day 52: Reaction-Diffusion (Gray-Scott)

## Idea
Gray-Scott reaction-diffusion system simulating pattern formation through chemical reactions

## Description
This project implements the Gray-Scott model, a reaction-diffusion system that generates organic patterns through simulated chemical reactions. Two virtual chemicals (U and V) diffuse and react according to feed and kill rate parameters. Sliders control feed rate (0.01-0.1) and kill rate (0.04-0.07), with presets for classic patterns: coral, maze, spots, and dendrite. Drag to seed new reaction centers. The system demonstrates how simple local rules create complex global patterns - spirals, spots, stripes, and maze-like structures emerge from uniform initial conditions.

## Data Concepts
- **Primary**: Spatial (pattern formation, diffusion, reaction zones)
- **Secondary**: Temporal (pattern evolution, reaction dynamics), Statistical (concentration gradients, equilibrium states)

## Conceptual Tags
#reaction-diffusion #gray-scott #pattern-formation #morphogenesis #self-organization #turing-patterns #chemical-simulation #emergence

## Technical Tags
#canvas #numerical-simulation #partial-differential-equations #grid-computation

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- CSS

## Mechanics
- **Gray-Scott Equations**: dU/dt = Du∇²U - UV² + f(1-U), dV/dt = Dv∇²V + UV² - (f+k)V
- **Parameters**: f (feed rate) controls U supply, k (kill rate) controls V removal
- **Diffusion**: Laplacian operator spreads chemicals to neighbors
- **Reaction**: U and V react according to UV² term (autocatalytic)
- **Presets**: Coral (f=0.0545, k=0.062), Maze (f=0.029, k=0.057), Spots (f=0.025, k=0.06), Dendrite (f=0.01, k=0.047)

## Notes
- Gray-Scott model explains pattern formation in chemical systems and biological morphogenesis
- Turing patterns (named after Alan Turing's 1952 paper) show how chemistry creates biological patterns
- Different f/k combinations produce dramatically different patterns: spots, stripes, spirals, chaos
- The system demonstrates self-organization - ordered patterns from random initial conditions
- Drag interaction adds localized V concentration, seeding new pattern growth
- Real-time simulation runs at interactive rates through optimized grid updates
- The model has applications in developmental biology, material science, and visual effects
