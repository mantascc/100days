# Case study — a 91-piece daily sketchbook

The reference instance for Imagination v0.1. One maker, one medium, six
months. Everything below is measured from the live bundle rather than
recalled, and the uncomfortable numbers are included because they are the
ones that matter.

---

## The practice

A daily creative-coding sketchbook: 91 indexed pieces plus ~40 loose
sketches, built between February and August 2026. Almost every piece is a
single self-contained `index.html`. Each carries a note (`interface.md`)
recording what it was, how it was built, and what was learned.

The subject drifted over the six months — the early work is physics and
emergence (entropy, flocking, Brownian motion, Schelling segregation), the
later work is interface design for agentic software (thinking states,
streaming patterns, idle states, human-in-the-loop gates). The maker did
not plan this drift and did not notice it until the layer made it visible.

## The layer

Seeded 2026-06-14 by a retroactive harvest of the existing corpus, then
run alongside the practice.

```
55 entities · 249 spawned links across 86 distinct works

type    thread:12  technique:19  theme:6  source:9  seed:7  collision:2
charge  high:18    medium:27     low:10
state   active:49  dormant:6     spent:0
```

The twelve Threads, by how many works each claims:

```
22  Design systems and reference sheets
18  Grids as compositional frame
16  Agents and particle systems
15  Networks and graphs
13  Emergence from local rules
11  Stochastic and noise
 9  ASCII and text rendering
 9  Physics simulation
 7  Generative typography and text
 5  Audio reactivity
 3  Cellular automata and pattern formation
 2  Language and NLP interpretability
```

---

## What worked

**The retroactive harvest.** 44 entities lifted out of 84 existing pieces
in a single pass. This was the moment the layer became worth having, and
it is the strongest argument for adopting Imagination on an existing
practice rather than starting one from scratch. A layer seeded on day one
is a set of guesses; a layer seeded on day eighty is a set of findings.

**Cross-work structure the per-work notes could not hold.** 249
spawned-links across 86 of 91 works. No individual `interface.md`
contained the observation that twenty-two separate pieces were all
circling the same question about reference sheets, because no individual
note could.

**Collide.** `/spark` paired `sources/vicsek-flocking` with
`threads/generative-typography-and-text` — a flocking model against a
typography obsession, two folders apart, never previously combined. The
maker took it and built `sketch-word-flock` within days. One clean
instance of the format doing the job it exists to do.

---

## What did not work

**The aging rule never fired.** Two collisions exist; both carry exactly
one `proposed` date. Nothing has been proposed, dodged, and re-proposed —
so the mechanism that makes avoidance into a signal has never engaged. The
most distinctive idea in the format is, after six months, untested. The
direct cause is the next finding.

**The loop did not run.** `/spark` ran twice — 14 and 16 June — against a
README describing it as a daily ritual. Both runs happened in the two days
after the layer was built, i.e. while it was novel. The aging rule needs
repeated `/spark` runs to have anything to age; two runs cannot produce a
dodge history. A format whose central mechanism requires cadence should
say so, and v0.1 does not.

**`spent` has zero users.** Not one entity, of 55, across six months, has
ever been marked `spent`. And five of the seven Seeds have spawned a work
while remaining `active` or `dormant` — directly contradicting §5, which
says a Seed is "consumed when it spawns a work."

This is the most useful thing the case study produced, because it is a
defect in the specification rather than in the practice. The maker was not
being sloppy. A Seed like *computed-not-curated-thumbnails* spawned
`71-index-100days` and stayed `high` and `active`, because the seed has
four branches and one of them shipped. Real desires are not discharged by
a single work. The binary consumed/not-consumed lifecycle is wrong, and
v0.2 either drops `spent` or gives Seeds a partial-completion semantic.

**Renames leave silent wreckage.** A June 17 type rename
(`veins/`→`threads/`, `moves/`→`techniques/`, `tensions/`→`themes/`) left
seven dangling `feeds` and `pair` references in two entity files. §10 says
readers MUST tolerate broken links, so the bundle stayed conformant and
nothing complained for six weeks. That tolerance is right for a divergent
format and wrong for a structural rename — which is why the validator now
reports dangling references as warnings, and why it exists at all.

---

## Reading the numbers

Two of the three distribution lines look wrong at a glance and are worth
sitting with.

`charge  high:18  medium:27  low:10` is a healthy spread — the layer
discriminates, which is the minimum bar for `charge` to be worth ranking
by.

`state  active:49  dormant:6  spent:0` is not. Ninety percent of the layer
is `active`. A layer where almost nothing has gone quiet is either a
practice with unusually persistent interests or, more likely, a state
field nobody is maintaining. Down-stating costs attention and returns
nothing immediately, so it does not happen. If `state` is to survive into
v0.2 it probably needs to be inferred from recency rather than declared —
an entity whose most recent `spawned` work is four months old is dormant
whether or not anyone said so.

---

## Honest summary

Imagination v0.1 demonstrably captures a practice and demonstrably
produced at least one piece of work that would not otherwise exist. It
does not yet demonstrate its own central mechanism, its own cadence, or
its portability past one medium.

The most valuable next data point is not another sketchbook. It is a
practice in a different medium — writing, research, music — run for long
enough that `/spark` fires ten or more times. That is the minimum for the
aging rule to either work or fail, and either result is publishable.
