---
id: collisions/vicsek-flocking-x-typography
type: collision
state: active
charge: high
pair: [sources/vicsek-flocking, threads/generative-typography-and-text]
proposed: [2026-06-14]
spawned: [daily-sketch/sketch-word-flock]
date: 2026-06-14
tags: [flocking, typography, emergence, text]
---

# What
What if a paragraph were a flock? Each word becomes a Vicsek agent carrying
a heading; on every step it steers to match the average heading of its
neighbours, with a little noise. Run it and the text stops being lines you
set and starts self-sorting — words drift into shared lanes, sentences
emerge as flocks rather than as a layout. The pairing collides a high-charge
*source* (Vicsek alignment, `sources/vicsek-flocking`) with a high-charge
*thread* (`threads/generative-typography-and-text`) from distant folders: the
flocking rule is usually spent on dots and boids, never on something that
also has to stay *readable*. That constraint — alignment vs. legibility — is
the whole interest.

# Trace
- Proposed by `/spark` on 2026-06-14 (Collide strategy).
- **Made** 2026-06-14 → [`daily-sketch/sketch-word-flock`](../../daily-sketch/sketch-word-flock/) —
  words as Vicsek agents, with a "legibility lock" toggle that operationalises
  the alignment-vs-legibility question.
- Relatives: `02-vicsek-model` (alignment-only agents) and the typography
  sketches under `threads/generative-typography-and-text`.

# Charge
High — born from two high-charge parents, and it sits on a live unanswered
question (does flocking survive the demand for meaning?). Per the §7.3 aging
rule, raise it one step each time it resurfaces unmade.

# Prompts
- Words as agents: alignment-only flocking, but the substrate is a real
  sentence that must stay legible while it sorts.
- Let punctuation be obstacles the flock must steer around.
- Two paragraphs, two flocks, one field — let them interleave and fight for
  the same reading-lane.
