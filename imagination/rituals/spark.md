---
description: Exhale — read the Imagination layer and propose what to sketch next
---

# /spark — the exhale

Read the entire `imagination/` tree and propose **four** sketch prompts,
one per strategy below. This is the generative half of the breathing cycle
(see `imagination/SPEC.md` §7.2). Do not write any files — `/spark` only
proposes.

## Steps

1. Read every entity under `imagination/` (seeds, veins, moves, tensions,
   sources, collisions). Pay attention to `state` and `charge` in the
   frontmatter.
2. Produce one prompt per strategy. For each, **name the source entities**
   and write a single sentence describing the sketch it implies.
3. After the four, note any new pairing you invented that the maker does
   not act on — it should be logged as a `collisions/` entity (the maker
   confirms; see §7.3 aging rule).

## The four strategies

- **Collide** — pair two high-`charge` entities from *distant* folders
  (e.g. a Vein × a Source, or two unrelated Veins). The further apart, the
  better the spark.
- **Revive** — surface a `dormant` entity whose `charge` is still high —
  the thing that has been quietly waiting.
- **Press** — aim a recently acquired `move` at an open `tension`. Use the
  new tool on the old unanswered question.
- **Break** — deliberately **violate** the highest-charge Vein. Name the
  maker's strongest default, then propose its opposite ("you always reach
  for emergence — make something fully authored, every pixel placed by
  hand"). This strategy exists so the layer pushes the maker off their own
  path instead of echoing it. Always include it, even when it stings.

## Output format

```
## /spark — {date}

**Collide** — {entity A} × {entity B}
> {one-sentence sketch}

**Revive** — {dormant entity}
> {one-sentence sketch}

**Press** — {move} → {tension}
> {one-sentence sketch}

**Break** — against {strongest vein}
> {one-sentence sketch}
```

End by asking which (if any) the maker will take, so unmade Collides can
be logged.
