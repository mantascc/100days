# Roadmap — from archive to imagination system

*Shaping the 100days repo into a system that proposes, builds, critiques,
and remembers. Companion to [`seed-imagine.md`](seed-imagine.md).*

---

## Shape

```
                    ┌─────────────────────────────────────────┐
                    │                 CORPUS                  │
                    │   84 sketches · metadata · loop clips   │
                    └────────┬───────────────────────▲────────┘
                             │ encode                │ absorb
                ┌────────────▼────────────┐          │
                │         MEMORY          │          │
                │ genome · primitives ·   │          │
                │ concept graph · lineage │          │
                └────────────┬────────────┘          │
                             │ sample / retrieve     │
                ┌────────────▼────────────┐          │
                │       GENERATORS        │          │
                │ gap sampler · seed      │          │
                │ compiler · mutation     │          │
                └────────────┬────────────┘          │
                             │ seed.md  ── human gate│
                ┌────────────▼────────────┐          │
                │         AGENTS          │──────────┘
                │ builder · critic ·      │
                │ capture · curator       │
                └─────────────────────────┘
```

Six modules, four phases. Each module ships as a working artifact in the
repo — most of them as numbered days.

---

## Phase 0 — Ground truth (repo hygiene)

The substrate must be trustworthy before anything reads from it.

**M0 · corpus cleanup**
- one canonical index page (keep `index.html`; fold or archive `index2`, `index3`)
- resolve duplicate day `63` (constellation-map / ube-kaizen), document missing `48`
- backfill `interface.md` for every numbered day (84-id-card and others lack it)
- unify the three partial metadata layers — `projects.json`,
  `interface-query/concept-graph-data.json`, `aesthetic-genome/genome-proposed.json` —
  into one canonical `corpus.json`; everything downstream reads only this
- promote root-level loose files (`seed-*.md`, `visual-language.html`) into a
  `system/` or keep-at-root decision, applied consistently

Exit: `corpus.json` lists all 84 days with id, title, idea, tags, primitives,
path — and nothing else disagrees with it.

---

## Phase 1 — Memory (encode the corpus)

**M1 · genome** — `aesthetic-genome/`
Backfill the 8-axis vector + categoricals for all 84 sketches using the
schema's detect heuristics, agent-assisted, human-corrected. Output:
`genome.json` keyed by day id. The lineage graph and editor read live data
instead of proposals.

**M2 · primitives catalog** — `primitives/`
Decompose the corpus into named reusable techniques (ASCII sheet, flow
field, metaball field, pill dock, island controller, spotlight grid…).
One `seed-<primitive>.md` each, following `seed-ascii-sheet.md`: anatomy,
reference implementation, parameters. Target ~12. This is the vocabulary
generators recombine.

**M3 · concept graph refresh** — `interface-query/`
Regenerate the graph from `corpus.json`; extend `query.js` to answer the
retrieval queries generators need (`--near`, `--concept`, `--primitive`).

Exit: any sketch can be located three ways — by coordinate (genome), by
part (primitive), by idea (concept).

---

## Phase 2 — Generators (sample the space)

**M4 · gap sampler + seed compiler** — the core of `/imagine`
- plot occupancy in genome space, surface unoccupied regions
- compile a coordinate + retrieved vocabulary into a `seed.md` in house voice
- modes: gap (no args), stimulus phrase, `--near`, `--cross`, `--axis`
- ships as the `/imagine` skill in `.claude/commands/`, scaffolding through
  the existing `new-sketch` flow

**M5 · mutation operators**
Constrained variation as executable commands: hold a parent's constants,
vary one axis or swap one primitive, render variants simultaneously.
Parents and mutated axis written into the child's `seed.md` at birth.

Exit: `/imagine` produces a scaffolded sketch folder with a seed worth
editing — wrong is fine, generic is not.

---

## Phase 3 — Agents (close the loop)

**M6 · critic**
Promote the schema's detect heuristics into an executable pass: score a
draft on each genome axis, flag off-distribution results (palette breaches,
density spikes), request revision before human review.

**M7 · capture + absorb**
Generalize the `83-video-index` Playwright rig: on graduation to a numbered
day, record the loop clip, re-encode the genome vector, update `corpus.json`,
concept graph, and lineage automatically. The corpus the curator reasons
over is never stale.

**M8 · curator (the daily loop)**
The standing cycle: curator proposes from gaps → human edits seed (the
taste checkpoint; corrections recorded) → builder implements → critic
gates → capture absorbs. Day 100: the system proposes day 101.

---

## Sequence

| order | module | lands as |
|---|---|---|
| 0 | M0 corpus cleanup | maintenance PR |
| 1 | M1 genome backfill | day 85 |
| 2 | M2 primitives catalog | day 86 |
| 3 | M3 concept graph refresh | folded into 85/86 |
| 4 | M4 `/imagine` v1 (gap + stimulus) | day 87 |
| 5 | M5 mutation operators | day 88 |
| 6 | M6 critic | day 89 |
| 7 | M7 capture + absorb | day 90 |
| 8 | M8 curator loop | days 91–100, running |

Dependencies are strictly downward: nothing in phase N starts before
phase N−1's exit condition holds. The one exception: M0 and M1 can run
in parallel, since the genome backfill will surface metadata gaps anyway.

---

## Principles

- **Everything is a sketch.** Each module ships in the daily format —
  a folder, an `index.html`, a seed. The system is built in its own language.
- **One canonical source.** `corpus.json` is the only file generators read.
  Galleries, graphs, and genomes are views of it.
- **The human gate is the product.** Every correction at the seed-editing
  step is recorded. The system's value compounds there, not in the agents.
- **Vanilla stays vanilla.** No build system for sketches; tooling
  (capture, analysis) keeps its dependencies inside its own folder.
