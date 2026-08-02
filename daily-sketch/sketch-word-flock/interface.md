# Word Flock — Vicsek typography

## Idea
A paragraph whose words are flocking agents: each word steers to match its nearest neighbours' heading, and the text self-sorts into reading-lanes while trying to stay legible. The first sketch of the collision `vicsek-flocking × generative-typography`.

## Description
Every word in a self-describing paragraph is a Vicsek agent with a position and a heading. On each frame a word averages the headings of all neighbours within radius `r`, adds a noise kick `η`, and steps forward at speed `v` — the canonical Vicsek alignment rule, nothing more. The field wraps toroidally, so a flock that leaves one edge re-enters the other and lanes can run unbroken. Colour encodes the *local* order parameter: a word whose neighbourhood is disordered renders cool and faint; as a local consensus forms it warms toward terracotta, bolds, and grows, so emergent reading-lanes appear as hot streams of aligned glyphs cutting through cooler noise. A live global φ (order parameter) reads out top-right with an ASCII bar. The central control is the **legibility lock**: on, words stay upright (a hair of lean to feel the flow) and you can still read them; off, each word rotates fully to its bearing — alignment wins and reading breaks. That toggle *is* the collision's question made operable.

## Data Concepts
- **Primary**: Spatial (agent positions, headings, neighbour search), Text (words as the substrate)
- **Secondary**: Temporal (per-frame alignment dynamics), Categorical (local vs global order)

## Conceptual Tags
#flocking #vicsek #emergence #typography #alignment #legibility #order-parameter #self-organization

## Technical Tags
#vanilla-js #canvas #requestanimationframe #toroidal-wrapping #vicsek-model #css-vars

## Stack
- Single HTML file, vanilla JS, canvas 2D, JetBrains Mono via Google Fonts
- O(n²) neighbour sum each frame (n≈40 words — cheap, exact, no spatial hash needed)
- Toroidal nearest-image distance; headings averaged via summed sin/cos then `atan2`
- Local order parameter `|Σ heading| / count` eased per-word to drive a cool→hot colour ramp
- Warm paper palette, CSS-var driven; live φ bar in ASCII

## Notes
- The legibility lock is the whole point — it makes the alignment-vs-legibility tension a single toggle. Locked is the more interesting state: you watch lanes form *and* keep reading, which is the harder, better half of the collision. Unlocked is a good control showing what pure Vicsek would do to text.
- Colour-by-*local*-order (not global) is what makes lanes legible as they form; a global tint would wash everything together. The per-word ease (`disp += (φ_local - disp)*0.08`) stops the colour from flickering frame to frame.
- Reuses `toroidal-wrapping` (high-charge move) directly — and the wrap is load-bearing here: without it lanes collide with walls and the flock never sustains a current.
- Honest-bearing tick: even when a word is held upright, a short line shows its true heading, so the mechanism stays visible (showing-mechanism-vs-polish) without sacrificing the read.
- Open: words never repel, so dense clumps overlap and become unreadable knots. A soft separation force (Reynolds, not Vicsek) would protect legibility — but it would also dilute the "alignment only" purity. That trade is the next fork.
- Open: the corpus is fixed and self-referential. Letting the viewer type their own sentence would test whether *any* text survives flocking, or only text written to be read in any order.
