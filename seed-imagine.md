# /imagine — Seed

*One command that turns 84 days of taste into a proposal engine.*

---

## What it is

`/imagine` samples the aesthetic genome, finds territory the corpus hasn't
occupied, and compiles a `seed.md` + scaffolded sketch in the house language.
It doesn't generate from nothing — it recombines the existing vocabulary
(flow fields, ASCII sheets, pill docks, metaballs) under the existing taste
(low density, palette restraint, monospace, dark void).

The 84 sketches are the dataset. `/imagine` is the inference step.

---

## Usage

```
/imagine                                  # gap mode: propose from unoccupied genome space
/imagine "notifications that breathe"     # stimulus mode: translate a phrase into the language
/imagine --near=79-idle-states            # neighborhood mode: extend a known region
/imagine --cross 12-wind-field 53-ascii-grid   # crossbreed two parents
/imagine --axis=agency+0.3 --from=41-metaball  # mutate one axis, hold the rest
```

---

## Pipeline

```
corpus            genome.json · concept-graph-data.json · interface.md × 84
   │
1  LOCATE         embed the prompt (or sample a gap) in genome space
2  RETRIEVE       nearest sketches + their primitives become the vocabulary
3  COMPILE        coordinates + vocabulary → seed.md (idea, axes, primitives, motion)
   │
   ── human gate ── edit the seed; corrections are recorded as taste data
   │
4  BUILD          scaffold via new-sketch, implement against the seed
5  CRITIQUE       score draft on genome axes; off-distribution → revise
6  ABSORB         capture loop clip, re-encode genome, add lineage node (parents, axis)
```

Step 3→4 is the only checkpoint. Everything else runs unattended.

---

## Output

```
daily-sketch/sketch-<name>/
├── index.html        running sketch, starter template + primitives
├── seed.md           the proposal: coordinates, parents, intent
└── interface.md      stub, filled on graduation to a numbered day
```

Every output records **parents** and **mutated axis** — lineage is not
retrospective, it's written at birth.

---

## What it needs

| dependency | state | gap |
|---|---|---|
| genome schema | `aesthetic-genome/schema.json` | vectors not yet backfilled for all 84 |
| concept graph | `interface-query/` | regenerate from current corpus |
| primitives catalog | `seed-ascii-sheet.md` (1 of ~12) | extract the rest |
| scaffolder | `new-sketch` skill | done |
| critic | detect heuristics in schema | promote to executable pass |

Build order: backfill genome → extract primitives → gap sampler → compile →
critic. Each step is one day's sketch (85–89). Day 90: the loop closes.

---

## Why it holds

Constrained variation, applied to the practice itself: the **constants** are
the genome, the palette, the primitives — the reference frame. The **variable
axis** is the daily idea. The system can range freely because the taste is
fixed; the taste stays alive because every correction at the human gate
feeds back into it.

The measure of success is small and specific: the first morning a proposal
is wrong, you say why, and the next one is better.
