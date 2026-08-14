---
description: Exhale — read the Imagination layer and propose what to make next
---

# /spark — the exhale

Read the entire `imagination/` tree and propose **four** prompts, one per
strategy below. This is the generative half of the breathing cycle (see
`imagination/SPEC.md` §8.2). Do not write any files — `/spark` only
proposes.

## Steps

1. Read every entity under `imagination/` (seeds, threads, techniques,
   themes, sources, collisions). Pay attention to `state` and `charge` in
   the frontmatter.
2. Check `collisions/` first. Any collision whose `proposed` list has more
   than one date has been dodged before — it outranks a fresh pairing, and
   its accumulated pressure is the point. Lead with it.
3. Produce one prompt per strategy. For each, **name the source entities**
   and write a single sentence describing the work it implies.
4. After the four, note any new pairing you invented that the maker does
   not act on — it should be logged as a `collisions/` entity (the maker
   confirms; see §8.3 aging rule).

## The four strategies

- **Collide** — pair two high-`charge` entities from *distant* folders
  (e.g. a Thread × a Source, or two unrelated Threads). The further apart,
  the better the spark.
- **Revive** — surface a `dormant` entity whose `charge` is still high —
  the thing that has been quietly waiting.
- **Press** — aim a recently acquired `technique` at an open `theme`. Use
  the new tool on the old unanswered question.
- **Break** — deliberately **violate** the highest-charge Thread. Name the
  maker's strongest default, then propose its opposite ("you always reach
  for emergence — make something fully authored, every element placed by
  hand"). This strategy exists so the layer pushes the maker off their own
  path instead of echoing it. Always include it, even when it stings.

**Do not drop Break.** The other three rank by `charge`, which makes them a
recommender trained on one user — and every recommender finds a groove and
deepens it into a rut. Break is the quarter of the output that argues with
the maker. If it feels less useful than the others, that is the strategy
working, not failing.

## Output format

```
## /spark — {date}

**Collide** — {entity A} × {entity B}
> {one-sentence description of the work}

**Revive** — {dormant entity}
> {one-sentence description of the work}

**Press** — {technique} → {theme}
> {one-sentence description of the work}

**Break** — against {strongest thread}
> {one-sentence description of the work}
```

If a re-proposed collision is among these, say how many times it has now
been dodged and since when.

End by asking which (if any) the maker will take, so unmade Collides can be
logged and aged.
