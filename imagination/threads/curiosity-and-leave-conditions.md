---
id: threads/curiosity-and-leave-conditions
type: thread
title: Curiosity and leave conditions
state: active
charge: high
spawned: [04-random-walk, daily-sketch/sketch-alice-walk, daily-sketch/sketch-walks-thread]
feeds: [threads/agents-and-particle-systems, threads/stochastic-and-noise]
sources: [sources/brownian-markov, sources/graph-theory-algorithms]
date: 2026-08-09
tags: [agents, curiosity, search, dwell, taxonomy, walk]
---

# What
An agent that moves is defined less by how it travels than by *what makes it
stop travelling here and start travelling there*. The leave condition is the
character. Random leaves on a coin flip; Lévy leaves on a heavy tail; Search
leaves on arrival; Gradient leaves at a convergence peak; Alice leaves when
local information gain flattens; Flâneur leaves when something else brightens;
Ant leaves along a pheromone it laid itself.

Same environment, seven creatures — and the difference between them is a
single predicate. This reframes a large part of the earlier agent work: the
flocking and particle sketches specified motion and let the stopping fall out,
where these specify the stopping and let the motion fall out.

# Trace
- [04-random-walk](../../04-random-walk/) — the null case, before the question was asked.
- [sketch-alice-walk](../../daily-sketch/sketch-alice-walk/) — LOCK → SAMPLE → SATURATE → LEAP, with one dial setting the band between skimming and fixating.
- [sketch-walks-thread](../../daily-sketch/sketch-walks-thread/) — seven walks indexed explicitly by leave condition; the taxonomy that named the thread.

# Charge
High and new — it arrived fully formed as a taxonomy rather than accreting,
which is unusual here and slightly suspect. Worth a third and fourth sketch
before trusting that the seven categories are real and not just a tidy list.

The saturation-triggered leap (a meter that fills as information gain
diminishes, firing a jump at threshold) is a candidate Technique but has been
authored once, in one family. Leave it here until it is reached for cold.

# Prompts
- A walk whose leave condition *changes* mid-run — the creature becomes a different creature without the environment changing.
- Two agents with different leave conditions sharing one attractor field; the field is the only thing they can communicate through.
- Leave conditions applied to something that is not an agent — a reader's attention across a page, a cursor, a paragraph.
