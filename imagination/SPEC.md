# Imagination — A Generative Context Layer

**Version 0.1 — Draft**

Imagination is a context layer for a creative practice. Where a decision
log exists to *narrow* a space toward commitment, Imagination exists to
*widen* one — to keep ideas alive, cross-pollinating, and productive over
time.

It is the memory of the [100days](../) sketchbook: a corpus that has read
every sketch you have made, knows what you keep circling, and can hand you
the next thing to make.

Like the formats it descends from, Imagination is a directory of markdown
files with YAML frontmatter. If you can `cat` a file you can read it; if
you can `git clone` a repo you can ship it. It requires no database and
no tooling beyond a text editor and an agent.

---

## 1. Motivation

A daily sketchbook produces two kinds of artifact. The first is visible:
99 folders, each a sketch. The second is invisible and lives nowhere — the
obsessions that thread across sketches, the techniques you have quietly
mastered, the questions you keep failing to answer, the pairings you have
never dared to try. This second artifact is the actual subject of a
generative practice. Imagination gives it a home.

Imagination departs from decision-log systems in one fundamental way:

- A **decision log** is *convergent*. Its entities (gaps, assumptions)
  exist to be closed. Their lifecycle ends in commitment.
- **Imagination** is *divergent*. Its entities exist to breed. They are
  never closed — they go dormant, revive, and collide.

This single inversion changes everything downstream: the state model, the
link semantics, and the addition of a flow no decision log has —
Imagination reads *back out* to generate work.

### Goals

1. Capture the cross-sketch knowledge a per-sketch note cannot hold.
2. Turn that corpus into a **prompt generator**, not just a memory.
3. Stay readable, diffable, and portable — markdown on disk.

### Non-goals

- Tracking decisions or driving a project to completion.
- Resolving open questions. Imagination *keeps* questions open on purpose.
- Replacing `interface.md`. Each sketch keeps its own note; Imagination
  sits one level up and reads across all of them.

---

## 2. The breathing cycle

Imagination is defined by two flows. A practice that only inhales is an
archive; a practice that only exhales repeats itself. Imagination does both.

- **Inhale (`/inhale`).** After a sketch, weak signals in its
  `interface.md` — a technique discovered, a theme returning, a question
  raised — are lifted into Imagination entities. Backward-looking.

- **Exhale (spark).** Before a sketch, the layer is read as a whole and
  proposes what to make next — by colliding distant entities, reviving a
  charged dormant Seed, or attacking an open Theme with a new Technique.
  Forward-looking.

```
sketch → [inhale] → Imagination → [exhale] → next sketch → …
```

The decision log has only the inhale. The exhale is what makes
Imagination an instrument rather than a notebook.

---

## 3. Bundle structure

Imagination lives in a single `imagination/` directory at the sketchbook
root. It is **not** duplicated per sketch.

```
100days/
├── imagination/
│   ├── SPEC.md              # this document
│   ├── index.md             # progressive-disclosure listing (see §8)
│   ├── log.md               # optional chronological history
│   ├── coverage.md          # optional inhale ledger (see §8.1)
│   ├── seeds/
│   ├── threads/
│   ├── techniques/
│   ├── themes/
│   ├── sources/
│   └── collisions/
├── 01-entropy/
│   └── interface.md         # the sketch's own note — unchanged
├── 02-vicsek-model/
└── …
```

Each entity is one markdown file. Its **Entity ID** is its path within
`imagination/` minus the `.md` suffix — e.g. `threads/emergence.md` has ID
`threads/emergence`.

---

## 4. Entity types

The six types are the primitives of Imagination. Each has a one-line
diagnostic — the question it answers. If an entity answers none of them,
it does not belong in the layer.

| Type | Folder | Answers | Lifecycle |
|------|--------|---------|-----------|
| **Seed** | `seeds/` | "I want to make X" (not yet made) | consumed when it spawns a sketch |
| **Thread** | `threads/` | "I keep returning to X" (cross-sketch theme) | never closes; waxes and wanes |
| **Technique** | `techniques/` | "I now know how to do X" (owned technique) | accrues; reused, refined |
| **Theme** | `themes/` | "How do I X?" (unresolved question) | **never** closes — generative by design |
| **Source** | `sources/` | "X feeds my work" (external influence) | persistent reference |
| **Collision** | `collisions/` | "What if X met Y?" (proposed pairing) | ages until acted on (see §7) |

**Diagnostic notes.**

- A **Seed** is a *desire*, not a gap. A gap is an absence of knowledge; a
  Seed is the presence of an itch. Seeds are the only type meant to be
  consumed — when a Seed becomes a sketch, mark it `spent` and record the
  sketch in `spawned`.
- A **Thread** is recognised, not declared. You do not start a Thread; you
  notice that three sketches were secretly the same sketch.
- A **Theme** that you answer is no longer a Theme — but resist the
  urge to answer. A practice with no open Themes has stopped asking
  questions. Down-state them to `dormant`, never `spent`.
- A **Collision** is the engine. It is the only type the exhale (§6)
  actively manufactures.

---

## 5. Concept documents

Every entity is a UTF-8 markdown file: a YAML frontmatter block, then a
markdown body.

### 5.1 Frontmatter

```yaml
---
id: threads/emergence              # REQUIRED — the entity ID
type: thread                       # REQUIRED — seed | thread | technique | theme | source | collision
title: Emergence from simple rules
state: active                    # dormant | active | spent  (see §6)
charge: high                     # how alive it feels right now: low | medium | high
spawned: [01-entropy, 11-brownian-tree, 18-cellular-automaton]
feeds: [techniques/non-linear-mapping, themes/order-vs-chaos]
sources: [sources/vicsek-model]
date: 2026-06-14                 # first captured
tags: [chaos, agents, generative]
---
```

**Required:** `id`, `type`.

**Recommended:** `title`, `state`, `charge`. The remaining keys are
optional and additive — producers MAY add their own, and a reader MUST
tolerate unknown keys and missing optional ones.

Two keys carry Imagination's distinctive semantics:

- **`charge`** is *vibe, not priority*. It records how alive the entity
  feels right now, and it is allowed to be irrational. Charge is what the
  exhale ranks by.
- **`spawned`** is the productivity trace — the sketch IDs this entity
  produced. It is how you see, months later, which obsessions were fertile
  and which were merely loud.

### 5.2 Body conventions

The body is free-form markdown. These headings have conventional meaning
and SHOULD be used when applicable:

| Heading | Purpose |
|---------|---------|
| `# What` | One-paragraph description of the entity. |
| `# Trace` | The sketches / moments where it surfaced, with links. |
| `# Charge` | Why it feels alive (or has gone quiet). |
| `# Prompts` | Open sketch ideas this entity suggests — raw fuel for the exhale. |

---

## 6. State model

States describe *liveness*, not *completion*. Nothing in Imagination is
ever finished; it composts.

- **`active`** — currently feeding work; surfaces readily in the exhale.
- **`dormant`** — quiet, but intact. May revive at any time. A dormant
  high-`charge` entity is a prime exhale candidate — the thing you have
  been avoiding.
- **`spent`** — consumed (Seeds) or fully worked through for now. **Spent
  is reversible.** A spent Thread can go dormant and return; a spent Seed
  can re-seed a variant.

```
        ┌──────────┐   spark / revival   ┌──────────┐
        │ dormant  │ ─────────────────▶  │  active  │
        └──────────┘ ◀───────────────── └──────────┘
              ▲              quiet              │
              │                                 │ consumed
              └──────────── compost ────────────▼
                                          ┌──────────┐
                                          │  spent   │
                                          └──────────┘
```

There is deliberately no `deleted` state. Imagination keeps everything;
the shape of what you abandoned is itself information.

---

## 7. The two rituals

### 7.1 Inhale — `/inhale`

Run after a sketch, or in a weekly pass.

1. Read the coverage ledger (§8.1) to find every sketch the layer has not
   yet read. The default scope of an inhale is *all of them*.
2. Read each pending `interface.md`, focusing on the *Notes* section.
3. For each weak signal, decide its type (§4) and either **create** a new
   entity or **strengthen** an existing one (append to `Trace`, raise
   `charge`, add the sketch to `spawned`).
4. Promote nothing prematurely. A signal seen once is a note; a signal
   seen twice is a Thread. Because the promotion rule assumes signals
   accrue over *time*, a backlog SHOULD be harvested in clusters rather
   than in one pass — thirty sketches read at once make every recurring
   motif cross the threshold simultaneously.
5. **Extract nothing that is not there.** A sketch that yields no signal is
   recorded as `no-signal`, not given an invented entity. Coverage measures
   what has been *read*, not what has been *mined*.
6. Record the outcome for every sketch read (§8.1). A sketch silently
   skipped is the failure the ledger exists to prevent.

### 7.1.1 Retroactive attachment

`no-signal` closes the **read**, not the sketch. A sketch that surfaces
nothing today may turn out to be the *first* sighting of a signal that a
later sketch makes legible. When a Thread or Technique is created, earlier
`no-signal` sketches that belong to it SHOULD be added to its `spawned`
retroactively. Their ledger outcome becomes `harvested`.

This mirrors §6: nothing in Imagination is closed, only quiet. A sketch
whose meaning arrives late is a normal event in a divergent practice, not a
bookkeeping error.

### 7.2 Exhale — `/spark`

Run before a sketch, when you want the layer to propose work.

1. Read the entire `imagination/` tree.
2. Generate **four** sketch prompts, one per strategy:
   - **Collide** — pair two high-`charge` entities from distant folders.
   - **Revive** — surface a `dormant` entity whose `charge` is still high.
   - **Press** — attack an open `theme` with a recently acquired `technique`.
   - **Break** — deliberately *violate* the highest-`charge` Thread. Name
     the maker's strongest default and propose its opposite. This is the
     anti-echo strategy: a layer that only feeds your obsessions is an
     echo chamber, so `/spark` must also know how to push you off your own
     path. Always included, even when it stings.
3. For each prompt, name the source entities and write one sentence on the
   sketch it implies.
4. Persist every proposed-but-unmade **Collide** as a `collisions/` entity
   (see §7.3).

### 7.3 The aging rule

A Collision that `/spark` proposes but you do not act on is **not
discarded**. It is written to `collisions/` and its `charge` is raised by
one step each time it resurfaces unmade.

```yaml
---
id: collisions/network-x-typography
type: collision
state: dormant
charge: high            # raised each time it is dodged
pair: [threads/networks, 23-interactive-typography]
proposed: [2026-05-02, 2026-05-20, 2026-06-11]
---
```

The pairings you keep dodging accumulate pressure. Avoidance becomes a
signal: Imagination surfaces, with rising insistence, the sketch you are
afraid to make.

---

## 8. Index, log, and coverage

An `index.md` MAY sit at `imagination/` root for progressive disclosure —
a human or agent reads it to see the shape of the layer before opening
files. It groups entities by type and carries each one's `title` and
`charge`. It contains no frontmatter and MAY be regenerated automatically.

A `log.md` MAY record the layer's own history — entities created, charges
shifted, Seeds spent — newest first, under ISO-8601 date headings. It is
the diary of the practice's evolution, distinct from the sketches
themselves.

`index.md`, `log.md`, and `coverage.md` are **reserved** filenames. They
carry no frontmatter and are exempt from §11 rule 1.

### 8.1 The coverage ledger

A `coverage.md` MAY sit at `imagination/` root recording which sketches the
layer has read. It is the precondition for an inhale that can claim
completeness.

Coverage **cannot be derived from the entity graph.** Because §7.1 leaves a
once-seen signal as a note, a correctly-inhaled sketch may produce zero
entities and zero `spawned` entries — indistinguishable, from the graph
alone, from a sketch never opened. *Inhaled* is a property of an event, not
of the graph, and so requires its own record.

One row per sketch, with an outcome drawn from:

| Outcome | Meaning |
|---------|---------|
| `harvested` | Read; entities created or strengthened. |
| `no-signal` | Read; nothing surfaced. Reversible — see §7.1.1. |
| `covered-by <piece>` | A daily sketch promoted to an indexed piece. Harvest the piece; listing both in `spawned` double-counts one work as two. |
| `blocked` | No `interface.md` yet — nothing to read. |
| `pending` | Not yet read. The actionable backlog. |

The row set SHOULD be generated from the filesystem, and the outcome column
SHOULD be written by the inhale. `covered-by` and `blocked` are facts about
the filesystem and are recomputed on each pass; `harvested` and `no-signal`
are records and MUST survive regeneration.

A conforming reader MUST tolerate a missing `coverage.md`; a bundle without
one simply cannot report its own coverage.

---

## 9. Linking and sketch anchoring

- Entities link to one another with standard markdown links and the
  `feeds` / `sources` frontmatter keys. A link asserts a relationship;
  its meaning lives in the prose around it.
- Entities link to **sketches** by folder name (`01-entropy`) in
  `spawned`, and by markdown link in the body (`[entropy](../01-entropy/)`).
- The reverse anchor is optional but recommended: an `interface.md` MAY
  list the Imagination entities it touched, closing the loop between what
  was made and what it fed.
- Readers MUST tolerate broken links. A link to a not-yet-written entity
  is not an error — it marks future fuel.

---

## 10. Relationship to other formats

Imagination is a deliberate **divergent profile** of the decision-log
concept layer, and is structurally close to the
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md):
markdown + frontmatter, bundle-relative links, `index.md` / `log.md`
conventions, permissive consumption.

It differs in *intent*. OKF and the decision log describe what *is* —
assets, or commitments. Imagination describes what *might be*, and what
keeps returning. Its `state` model is built on revival rather than
resolution, and it adds the exhale — generation — which neither parent has.

An Imagination bundle can be made OKF-conformant by treating `type` as the
required field (it already is) and adopting `/`-absolute links. The
generative keys (`charge`, `spawned`, `state`) are legal OKF producer
extensions. Imagination is thus the *generative dialect* of a shared
markdown-knowledge family.

---

## 11. Conformance

An Imagination bundle is conformant with v0.1 if:

1. Every non-reserved `.md` file under `imagination/` has a parseable YAML
   frontmatter block with non-empty `id` and `type`. The reserved names are
   `SPEC.md`, `README.md`, `index.md`, `log.md`, and `coverage.md`.
2. `type` is one of the six defined types, or a producer-defined type a
   reader treats as generic.
3. `index.md`, `log.md`, and `coverage.md`, when present, follow §8.

Readers SHOULD treat all else as soft guidance and MUST NOT reject a
bundle for missing optional keys, unknown keys, broken links, or absent
index files. Imagination is meant to stay useful as it grows messy —
which, being a record of a wandering mind, it will.

---

## 12. Versioning

This document specifies Imagination version **0.1**. Future revisions use
`<major>.<minor>`: minor bumps add backward-compatible keys or
conventions; major bumps may rename required keys or types.

---

## Appendix A — Minimal example bundle

```
100days/imagination/
├── index.md
├── seeds/
│   └── self-portrait-from-backlog.md
├── threads/
│   └── emergence.md
├── techniques/
│   └── non-linear-mapping.md
├── themes/
│   └── audio-reactive-without-gimmick.md
├── sources/
│   └── vicsek-model.md
└── collisions/
    └── network-x-typography.md
```

`threads/emergence.md`:

```markdown
---
id: threads/emergence
type: thread
title: Emergence from simple rules
state: active
charge: high
spawned: [01-entropy, 11-brownian-tree, 18-cellular-automaton]
feeds: [techniques/non-linear-mapping]
sources: [sources/vicsek-model]
date: 2026-06-14
tags: [chaos, agents, generative]
---

# What
Complex, lifelike behaviour arising from a handful of local rules. The
sketches keep proving the same thesis: order is a special case of chaos,
not its opposite.

# Trace
- [01-entropy](../../01-entropy/) — order↔chaos as a continuous slider.
- [11-brownian-tree](../../11-brownian-tree/) — structure from random walk.
- [18-cellular-automaton](../../18-cellular-automaton/) — global pattern, local rule.

# Charge
Still the strongest pull in the whole practice. Has not been pushed into
sound or typography yet — see [the collision](../collisions/network-x-typography.md).

# Prompts
- Emergence in a *legible* medium — letters that self-organise.
- A rule simple enough to fit in a tweet, behaviour rich enough to watch
  for a minute.
```

`themes/audio-reactive-without-gimmick.md`:

```markdown
---
id: themes/audio-reactive-without-gimmick
type: theme
title: Audio-reactive without the gimmick
state: dormant
charge: medium
spawned: [10-audio-reactive-agents, 17-audio-reactive-network]
date: 2026-06-14
tags: [audio, aesthetics]
---

# What
How do you make sound drive a visual so it feels *inevitable* rather than
decorative? Both attempts so far read as "bars that wiggle to music."

# Charge
Quiet right now, but unresolved — and unresolved is the point. Do not
close this; let it press on the next audio sketch.
```
