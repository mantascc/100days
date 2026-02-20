# Day 30: Thinking States

## Idea
Experimental iteration exploring "thinking" metaphor through animated loading indicators

## Description
This project reimagines the 100 progress indicators concept with a focus on cognitive states and "thinking" metaphors. Building on Day 29's comprehensive loading animation library, this iteration explores how visual feedback can represent computational thinking, processing, and contemplation states. The title "Thinking..." suggests a more philosophical approach to loading animations - representing not just waiting, but active computation.

The project includes two documented experiments exploring different approaches to representing thinking/processing states through animation and interaction.

## Data Concepts
- **Primary**: Visual (animation patterns, thinking metaphors)
- **Secondary**: Temporal (processing states, cognitive timing)

## Conceptual Tags
#thinking-states #cognitive-metaphors #loading-indicators #processing-feedback #computational-thinking #animation-library #experimental-ui

## Technical Tags
#vanilla-javascript #canvas-animation #animation-groups #modular-architecture #pure-functions

## Stack
- HTML5
- Vanilla JavaScript (modular)
- Canvas 2D API
- CSS

## Mechanics
- **Animation Engine**: Similar architecture to Day 29 with engine.js managing render loops
- **Group System**: 10 thematic groups of indicators (geometric, organic, particle, lineart, grid, symbolic, physics, glitch, minimalist, hybrid)
- **Experiment Documents**: Includes Experiment1.md and Experiment2.md exploring different approaches
- **Pure Function Loaders**: Each indicator is a pure function `(ctx, t) => {...}` for deterministic rendering

## Parameters
- Size: 24×24 px indicators
- Duration: 1-second animation loops
- Groups: 10 conceptual categories
- Single color palette per indicator

## Notes
- This appears to be an experimental fork/iteration of Day 29's progress indicators
- The "Thinking..." title suggests focus on cognitive/computational metaphors
- Two experiment documents indicate exploration of different conceptual approaches
- May explore how animation represents different types of thinking (analytical, creative, processing)
- The folder structure includes an experiment-2 subdirectory suggesting multiple iterations
- Represents evolution from pure loading feedback to representing computational states
