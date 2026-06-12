# Day 79: Idle States

## Idea
Eight visual interpretations of idle — present without proactive — as a typology

## Description
An ideation board exploring what "idle" can look like: patience, here but not asking, ready whenever you are. Eight directions are arranged as two 2×2 typologies on facing pages — set I "ambient" (breath, caret, drift, lean-toward) and set II "instrumented" (hover, orbit, listening bars, elapsed counter) — switched via a floating pill dock at bottom-center.

Each cell is structurally identical: header (name + index), stage (canvas or HTML), and a four-row `<dl>` of metadata — `claim / signal / motion / risk`. That metadata block is what makes the page a typology rather than a demo reel: each direction has to declare what kind of idle it claims to be and how it can be misread.

Motion is per cell: six canvas cells run self-contained IIFEs with their own rAF loops; two (caret, elapsed counter) are pure HTML/CSS. Only cell 04 (lean-toward) is wired to the cursor — the figure orients subtly toward the pointer anywhere on screen and settles back when input stops. The other seven ignore presence entirely; that asymmetry is the point. No two animations share a period, phase, or noise seed.

## Data Concepts
- **Primary**: Temporal (slow loops, decoupled rhythms, elapsed time)
- **Secondary**: Visual (motion as state signal)

## Conceptual Tags
#idle-states #patience #typology #ambient-motion #presence #attention #ideation-board

## Technical Tags
#canvas #css-keyframes #raf #summed-sines #pseudo-noise #dpr-scaling

## Stack
- Two static HTML pages sharing a shell (index.html = set I, set-b.html = set II)
- One IIFE + rAF loop per canvas cell, with a shared `setupCanvas` DPR helper
- CSS keyframes for the caret blink (`steps(1, end)`), `setInterval` + `performance.now()` for the counter
- Summed mutually-prime-ish sines as library-free pseudo-noise
- 2×2 CSS grid capped at 920×620, elevated dock with stacked shadows + backdrop blur

## Notes
- "Pair every motion with a still anchor" — breath has a held ring, drift a crosshair, hover a horizon; without an anchor, motion reads as loading, not presence
- Reactivity is spent on exactly one cell; if everything responded to the cursor, nothing would be idle
- The caret blinks at 1.1s, deliberately slower than the macOS default (~530ms) — the slowness is what makes it patient
- Sibling typology to 30-thinking-states; cell 06 borrows the pixel-orbit aesthetic from 06-orbital
- interaction.md in this folder catalogs the borrowable principles and anti-patterns (spinner energy, synchronized blinks, hard reset on hover-out)
