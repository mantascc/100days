# 100days — the manual

*One page. Everything else is detail.*

This is a sketchbook that grew a nervous system. The visible layer is the
work: 93 indexed pieces and ~44 daily sketches — entropy sliders, Vicsek
flocks, Brownian trees, ASCII fields, audio-reactive networks, a spinning
globe. The invisible layer is the practice itself — the obsessions that
thread across sketches, the questions that won't resolve, the pairings
never dared. The `imagination/` directory gives that second artifact a
home, and a pulse.

**The aesthetic:** computational minimalism — *the aesthetic of watching
something think.* Quiet systems, visible logic, data as material. Show the
mechanism; skip the polish.

## The two shelves

| Shelf | What it is | Who creates it |
|-------|-----------|----------------|
| `daily-sketch/sketch-<name>/` | The workbench. Every new thing starts here: an `index.html` plus an `interface.md` note. | Default for all new work — sketch first, always. |
| `NN-name/` | The curated, indexed sketchbook. | The maker, by explicit promotion. **Never auto-created.** An agent asks; it does not number. |

Each sketch keeps its own `interface.md`. Imagination never replaces it —
it sits one level up and reads across all of them.

## The imagination layer

Six entity types, each a markdown file with YAML frontmatter. Each answers
one diagnostic question; if it answers none, it doesn't belong.

| Type | Answers | Lifecycle |
|------|---------|-----------|
| **Seed** | "I want to make X" | The only consumable — spent when it spawns a sketch |
| **Thread** | "I keep making X" | Never closes; waxes and wanes (`emergence-from-local-rules`, `networks-and-graphs`…) |
| **Technique** | "I now own X" | Accrues (`toroidal-wrapping`, `perlin-fbm-displacement`…) |
| **Theme** | "I keep asking X" | **Never allowed to close** (`audio-reactive-without-gimmick`, `randomness-feeling-intentional`…) |
| **Source** | "X feeds my work" | Persistent reference |
| **Collision** | "What if X met Y?" | Ages until acted on — the engine |

Two keys carry the distinctive semantics. **`charge`** is vibe, not
priority — how alive an entity feels right now, allowed to be irrational.
**`spawned`** is the productivity trace — which obsessions were fertile
and which were merely loud. States (`active` / `dormant` / `spent`)
describe liveness, not completion. Nothing is deleted; everything
composts. A spent Seed can re-seed; a dormant Thread can wake.

## The breathing cycle

A practice that only inhales is an archive; one that only exhales repeats
itself.

```
sketch → [/inhale] → imagination → [/spark] → next sketch → …
```

**`/inhale`** — after a sketch. Reads every uninhaled `interface.md`,
lifts weak signals into entities. A signal seen once is a note; seen
twice, a Thread. Extract nothing that isn't there — a quiet sketch is
recorded `no-signal`, not given an invented entity. `coverage.md` ledgers
every read, because "inhaled" is a property of an event, not of the graph.

**`/spark`** — before a sketch. Reads the whole layer and proposes four
prompts, one per strategy:

- **Collide** — pair two high-charge entities from distant folders.
- **Revive** — surface a dormant entity whose charge is still high.
- **Press** — attack an open Theme with a newly owned Technique.
- **Break** — deliberately violate the strongest Thread. The anti-echo
  strategy: a layer that only feeds your obsessions is an echo chamber,
  so `/spark` must also push you off your own path. Always included,
  even when it stings.

## The aging rule

A Collision you dodge is not discarded. It is written down, and its
charge rises one step each time it resurfaces unmade
(`vicsek-flocking-x-typography` is waiting). Avoidance itself becomes a
signal: the sketchbook slowly builds pressure toward the sketch you are
afraid to make.

## House rules

1. **Sketch first.** New work goes to `daily-sketch/`, with an
   `interface.md` so it can be inhaled back.
2. **Never auto-index.** Promotion to a numbered piece is the maker's
   call.
3. **Themes never close.** Down-state to dormant, never spent — a
   practice with no open questions has stopped asking.
4. **Keep everything.** The shape of what you abandoned is itself
   information.

*Full specification: [imagination/SPEC.md](imagination/SPEC.md).*
