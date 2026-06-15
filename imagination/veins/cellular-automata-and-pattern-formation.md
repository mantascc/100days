---
id: veins/cellular-automata-and-pattern-formation
type: vein
title: Cellular automata and pattern formation
state: active
charge: medium
spawned: [18-cellular-automaton, 40-cube-grid-rules, 52-reaction-diffusion]
feeds: [moves/imagedata-double-buffer, tensions/iteration-vs-original-rules]
sources: [sources/turing-gray-scott]
date: 2026-06-14
tags: [cellular-automata, pattern, turing, rules]
---

# What
A focused sub-thread of emergence: discrete and continuous systems where slight changes to a local rule produce dramatically different global patterns. A custom Conway-variant, a 3D rule engine with programmable birth/survival, and Gray-Scott reaction-diffusion. The fascination is the cliff-edge sensitivity — how a tiny edit to the rule table reorganises the entire visual field. The honest counter-note is that the custom rules so far lack the deep, surprising library that makes Conway's Life endlessly rewarding.

# Trace
- [18-cellular-automaton](../../18-cellular-automaton/) — a hand-rolled Conway variant.
- [40-cube-grid-rules](../../40-cube-grid-rules/) — birth/survival rules lifted into 3D.
- [52-reaction-diffusion](../../52-reaction-diffusion/) — Gray-Scott / Turing patterns.

# Charge
Warm but not blazing — the systems work, yet the "rich library of behaviours" payoff is still elusive. A revival candidate if a genuinely surprising rule turns up.

# Prompts
- A rule-search interface: mutate the rule table live and bookmark the keepers.
- Reaction-diffusion seeded by an image, dissolving a portrait into Turing spots.
- A CA whose neighbourhood *itself* changes over time.
