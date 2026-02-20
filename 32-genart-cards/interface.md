# Day 32: Entropy Patterns

## Idea
Visual taxonomy of creative work rhythms mapping cognitive load oscillations and thinking quality across different production modes

## Description
This project visualizes entropy curves representing different patterns of creative work over time. The taxonomy maps oscillation patterns of cognitive load (from recovery zones to danger zones) against quality of thinking (divergence, exploration, abstraction), revealing sustainable versus pathological work modes. Two views provide complementary perspectives: entropy curves show temporal patterns, while entropy scale provides spectrum ordering. The visualization uses D3.js to render smooth curves with labeled regions indicating different creative states.

The implementation loads entropy pattern data from external module, rendering curves that oscillate between recovery and danger zones. The taxonomy distinguishes sustainable patterns (balanced oscillation, regular recovery) from pathological patterns (chronic high-load, burnout trajectories). The project provides framework for understanding and diagnosing creative work patterns through visual pattern recognition.

## Data Concepts
- **Primary**: Temporal (work rhythm oscillation, cognitive load over time, cyclic patterns)
- **Secondary**: Statistical (pattern classification, mode taxonomy), Visual (curve representation, spatial mapping)

## Conceptual Tags
#creative-work #cognitive-load #work-patterns #entropy #sustainable-practices #burnout #oscillation-patterns #productivity #taxonomy #pattern-recognition

## Technical Tags
#d3js #data-visualization #curve-rendering #tabs #google-fonts #time-series

## Stack
- D3.js v7
- Vanilla JavaScript (modular)
- External data module (data.js)
- External visualization module (visualization.js)
- Google Fonts (Instrument Serif)
- CSS

## Mechanics
- **Entropy Curves**: Time-series visualization of cognitive load oscillations with labeled regions (recovery, optimal, danger zones)
- **Pattern Types**: Taxonomy includes sustainable patterns (balanced oscillation, regular recovery) and pathological patterns (chronic overload, crash cycles)
- **Thinking Quality Mapping**: Curves annotated with thinking modes (divergent, exploratory, abstract, convergent, constrained)
- **Tab Navigation**: Switch between curve view and scale view for different analytical perspectives
- **D3 Rendering**: Smooth curve interpolation, axis scaling, region annotations
- **External Data**: Pattern definitions loaded from data.js enable extensible taxonomy

## Parameters
- Cognitive load range: Recovery → Optimal → Danger
- Thinking quality spectrum: Divergence → Exploration → Abstraction → Convergence
- Temporal scale: Work cycles (hours, days, weeks)
- Pattern categories: Sustainable vs Pathological

## Notes
- The project provides visual framework for diagnosing and improving creative work practices
- Entropy metaphor relates to information theory - high entropy = unpredictable, chaotic patterns
- Sustainable patterns show regular oscillation with recovery periods - work-rest cycles
- Pathological patterns lack recovery, showing chronic high load or extreme volatility
- The visualization makes abstract concepts (cognitive load, thinking quality) concrete through spatial representation
- Curves enable pattern recognition - viewers can identify their own work patterns
- The taxonomy suggests optimal patterns exist - not too flat (underutilization) nor too volatile (burnout)
- Thinking quality dimension acknowledges different modes of creative work require different cognitive states
- Divergent thinking (exploration, ideation) vs convergent thinking (execution, refinement) map to different load patterns
- The project bridges productivity science and design - scientific framework presented through elegant visualization
- Instrument Serif font reinforces conceptual/theoretical framing vs technical data display
- Two-view system (curves + scale) provides temporal and comparative perspectives
- The framework applicable beyond creative work - any cognitively demanding cyclical activity
- Visual taxonomy enables shared language for discussing work patterns
- The project implicitly argues sustainable creativity requires rhythmic oscillation, not constant high output
