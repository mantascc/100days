# 87-attention-distribution

## idea
Nine ways to read the same simulation — 100 dot-agents distributing finite attention across 5 competing voices (pulse, echo, spark, drift, murmur). Each cell of a 3×3 grid is a different visual lens on the same shared state.

## tags
agents, simulation, attention, generative, small-multiples, days-1-20-callback

## stack
vanilla · IBM Plex Mono · canvas/CSS · ResizeObserver · DPR-aware

## lenses
- 01 beams · agents wander, beam to a right-rail voice when focused
- 02 bars · horizontal share of listeners per voice
- 03 bubbles · circle area scales smoothly with listener count
- 04 units · 100-dot unit chart, sorted by voice allegiance
- 05 lines · overlaid sparklines, last 240 frames of voice share
- 06 pulse · concentric rings emitted from each voice, frequency ∝ listeners
- 07 orbit · voices at pentagon vertices, agents spring toward target
- 08 tide · vertical columns, smoothed height = listener count
- 09 radial · spokes from center, length = listener count

## motion
One stepSim per rAF advances the shared agent/voice state; each cell renders that state in its own visual language. Beams and orbit cells maintain their own per-agent positions; bars/bubbles/tide smooth toward targets; lines reads a history ring buffer; pulse emits rings on a cadence inversely proportional to listener count.
