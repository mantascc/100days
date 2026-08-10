# Imagination

The generative context layer for [100days](../). Not a record of what you
built — a map of what you keep returning to, and an instrument for finding
what to make next. Full design in [SPEC.md](SPEC.md).

## What's here

```
imagination/
├── SPEC.md        the format definition (v0.1)
├── index.md       at-a-glance listing of every entity, by charge
├── log.md         chronological history of the layer
├── coverage.md    which sketches the layer has read — and what came of it
├── coverage.py    regenerates the ledger, prints the pending backlog
├── rituals/       the /spark and /inhale prompts
├── threads/         what you keep making (11)
├── techniques/         techniques you own (13)
├── themes/      questions you keep asking (6)
├── sources/       what feeds the work (9)
├── seeds/         dormant ideas (5)
└── collisions/    proposed pairings (grows via /spark)
```

Seeded 2026-06-14 by a retroactive harvest of the existing sketchbook.

## The daily loop

A breathing cycle. Two steps, both lightweight.

- **Morning — `/spark` (exhale).** Before you sketch, run it. It reads the
  whole layer and proposes four prompts: **Collide** two distant
  obsessions, **Revive** a dormant one, **Press** a new technique against
  an old question, and **Break** — deliberately violate your strongest
  habit. Pick one, or free-sketch.
- **Make the sketch.** Write its `interface.md` as usual. The layer stays
  out of the way.
- **Evening — `/inhale` (harvest).** Run it. It checks
  [`coverage.md`](coverage.md) for every sketch the layer has not read yet —
  not just today's — and proposes small diffs, one cluster at a time: a new
  technique, a thread gaining a member, a charge ticking up. Approve and it
  updates the files. A sketch that yields nothing is marked `no-signal`
  rather than mined for an entity that isn't there.
- **Weekly — skim `index.md`.** See the shape of the field. Notice what's
  gone quiet, what keeps resurfacing unmade.

To see the backlog without harvesting anything:

```
python3 imagination/coverage.py --check
```

## Using the rituals as slash commands

The prompts live in `rituals/` so they travel with the layer. To use them
as `/spark` and `/inhale` in Claude Code / Cowork, copy them into your
commands folder:

```bash
mkdir -p .claude/commands
cp imagination/rituals/spark.md  .claude/commands/spark.md
cp imagination/rituals/inhale.md .claude/commands/inhale.md
```

Or just paste a ritual file's contents into a session when you want to run
it manually.

## The one rule worth remembering

Nothing here closes. Entities go **dormant** and **revive**; they never
get deleted. Themes are kept open on purpose. The shape of what you
abandoned is information too.
