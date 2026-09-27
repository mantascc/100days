# 96-beautiful-illusion

> Promoted from [sketch-a-beautiful-illusion](../daily-sketch/sketch-a-beautiful-illusion/).

## idea
A perspective study in language and perceived mind. Scattered language fragments align into a human face from one viewpoint, then separate as the observer moves. The accompanying essay considers how the observer contributes to the sense of a mind behind fluent language.

## tags
language, perception, cognition, llm, anamorphosis, typography, observer, editorial

## interaction
Move the pointer across the illustration to shift perspective. On touch, drag sideways; vertical swipes scroll the essay. Focus the canvas and use the arrow keys for keyboard navigation. Reduced-motion preferences remove easing. The face is composed of text fragments, without an underlying image.

## visual direction
Dark graphite background, muted green-gray text, warm accents, serif editorial typography, and a quiet monospace masthead. The masthead reads “Mintis” and “001”. “FIELDWORK” sits beside separate language and perception tags. The illustration has no visible figure label or interaction caption. The perspective instrument remains in the lower right.

## content
The essay uses the approved copy beginning “Large language models operate through language. Human cognition does not.” and ending “What feels like presence emerges in the encounter between the pattern and the observer.”

## stack
Standalone HTML, CSS, and Canvas 2D with pinhole projection. System fonts; no runtime dependencies or installation required.

## editing
The editable React source remains in `../daily-sketch/sketch-a-beautiful-illusion/app/`. Run `node scripts/export-sketch.mjs` from that daily sketch folder after editing its source, then copy the generated `index.html` into this directory to update the numbered edition.
