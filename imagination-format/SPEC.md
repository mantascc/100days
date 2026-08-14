# Imagination — A Generative Context Layer

**Version 0.1 — Draft**

Imagination is a context layer for a creative practice. Where a decision
log exists to *narrow* a space toward commitment, Imagination exists to
*widen* one — to keep ideas alive, cross-pollinating, and productive over
time.

It is the memory of a practice: a corpus that has read everything you have
made, knows what you keep circling, and can hand you the next thing to
make.

Like the formats it descends from, Imagination is a directory of markdown
files with YAML frontmatter. If you can `cat` a file you can read it; if
you can `git clone` a repo you can ship it. It requires no database and
no tooling beyond a text editor and an agent.

---

## 0. Status

This is a **design proposal with one case study**, not a settled format.
Read it as an RFC.

What has been demonstrated: a single practice — a 91-piece daily
sketchbook — ran a live Imagination layer for six months. The retroactive
harvest works: 44 entities were lifted out of existing work in one pass,
and they describe that practice accurately enough that its maker learned
things about it. The **Collide** strategy works: a proposed pairing became
a piece within days of being written down.

What has **not** been demonstrated:

- **The aging rule (§7.3) has never fired.** No collision in the reference
  instance has been proposed, dodged, and re-proposed. The most distinctive
  idea in this document is, at time of writing, entirely theoretical.
- **Sustained cadence.** The rituals ran twice in the reference instance,
  not daily. Whether the loop survives contact with a normal week is
  untested.
- **A second practice.** Everything here was designed by one maker, for one
  corpus, in one medium. The entity types are claimed to be
  domain-general; that claim is unverified.

These gaps are recorded rather than smoothed over because the format's
value depends on them resolving. A v0.2 informed by three practices
disagreeing with v0.1 is the goal.

---

## 1. Motivation

A sustained practice produces two kinds of artifact. The first is visible:
a folder of finished work. The second is invisible and lives nowhere — the
obsessions that thread across pieces, the techniques you have quietly
mastered, the questions you keep failing to answer, the pairings you have
never dared to try. This second artifact is the actual subject of a
generative practice. Imagination gives it a home.

### 1.1 The divergent inversion

Imagination departs from decision-log systems in one fundamental way:

- A **decision log** is *convergent*. Its entities (gaps, assumptions)
  exist to be closed. Their lifecycle ends in commitment.
- **Imagination** is *divergent*. Its entities exist to breed. They are
  never closed — they go dormant, revive, and collide.

This single inversion changes everything downstream: the state model, the
link semantics, and the addition of a flow no decision log has —
Imagination reads *back out* to generate work.

### 1.2 The nearer ancestor

The closest relative is not a note system. It is **Oblique Strategies**,
the deck Brian Eno and Peter Schmidt printed in 1975 to break a stuck
session — draw a card, get an instruction slantwise to whatever you were
about to do.

Imagination does that job, with one difference that is the whole point:
Oblique Strategies is *context-free*. The same hundred-odd cards, in the
same box, for every practice on earth, forever. It has to be, because a
deck cannot read.

The exhale (§7.2) is context-*aware*. It knows what you have made, which
obsessions are warm, which question you have left open since spring, and
which pairing you have flinched away from three times. It proposes the
next move against your actual corpus rather than against the general
condition of being stuck.

**Imagination is Oblique Strategies that has read your work.**

### 1.3 Why this is possible now

Every prior system in this space is inhale-only. Zettelkasten, evergreen
notes, PARA, digital gardens, commonplace books, decision logs — all of
them accumulate, none of them generate. This is not an oversight. The
exhale requires a reader that can hold an entire corpus at once and
synthesize a specific proposal from it, and until recently no such reader
existed outside the maker's own head.

The workarounds are visible in the ancestors. Luhmann described his
Zettelkasten as a partner that surprised him — but the surprise was
emergent and unreliable, a property of scale rather than design. Eno and
Schmidt reached for randomness because randomness was the only
context-independent way to break a pattern. Both were approximating a
function neither could implement.

That function is now implementable. Imagination is what a note system
looks like when the exhale stops being impossible.

### Goals

1. Capture the cross-work knowledge a per-work note cannot hold.
2. Turn that corpus into a **prompt generator**, not just a memory.
3. Stay readable, diffable, and portable — markdown on disk.

### Non-goals

- Tracking decisions or driving a project to completion.
- Resolving open questions. Imagination *keeps* questions open on purpose.
- Replacing the per-work note. Each work keeps its own; Imagination sits
  one level up and reads across all of them.
- Productivity. `charge` (§5.1) is deliberately not a priority field, and
  nothing here is a backlog.

---

## 2. Vocabulary

Two terms are used throughout and mean whatever your practice means by
them.

- A **work** is one unit of finished output — a sketch, an essay, a study,
  a track, an experiment, a build. The reference instance calls them
  sketches. Substitute freely.
- A **work note** is the markdown file a practice keeps *alongside* each
  work, recording what it was and what was learned. The reference instance
  calls it `interface.md`. Imagination does not specify its format and
  requires only that one exist and be readable.

Everything else in this document is Imagination's own vocabulary and is
normative.

---

## 3. The breathing cycle

Imagination is defined by two flows. A practice that only inhales is an
archive; a practice that only exhales repeats itself. Imagination does both.

- **Inhale (`/inhale`).** After a work, weak signals in its work note — a
  technique discovered, a thread returning, a question raised — are lifted
  into Imagination entities. Backward-looking.

- **Exhale (`/spark`).** Before a work, the layer is read as a whole and
  proposes what to make next — by colliding distant entities, reviving a
  charged dormant Seed, or attacking an open Theme with a new Technique.
  Forward-looking.

```
work → [inhale] → Imagination → [exhale] → next work → …
```

The decision log has only the inhale. The exhale is what makes Imagination
an instrument rather than a notebook.

---

## 4. Bundle structure

Imagination lives in a single `imagination/` directory at the practice
root. It is **not** duplicated per work.

```
practice/
├── imagination/
│   ├── SPEC.md              # this document
│   ├── index.md             # progressive-disclosure listing (see §9)
│   ├── log.md               # optional chronological history
│   ├── rituals/             # the /spark and /inhale prompts
│   ├── seeds/
│   ├── threads/
│   ├── techniques/
│   ├── themes/
│   ├── sources/
│   └── collisions/
├── 01-first-work/
│   └── <work note>          # the work's own note — unchanged
├── 02-second-work/
└── …
```

Each entity is one markdown file. Its **Entity ID** is its path within
`imagination/` minus the `.md` suffix — e.g. `threads/emergence.md` has ID
`threads/emergence`.

The bundle is expected to sit inside the practice it describes, but
nothing depends on that. A bundle is portable on its own; only `spawned`
links (§10) point outward.

---

## 5. Entity types

The six types are the primitives of Imagination. Each has a one-line
diagnostic — the question it answers. If an entity answers none of them,
it does not belong in the layer.

| Type | Folder | Answers | Lifecycle |
|------|--------|---------|-----------|
| **Seed** | `seeds/` | "I want to make X" (not yet made) | consumed when it spawns a work |
| **Thread** | `threads/` | "I keep returning to X" (cross-work theme) | never closes; waxes and wanes |
| **Technique** | `techniques/` | "I now know how to do X" (owned technique) | accrues; reused, refined |
| **Theme** | `themes/` | "How do I X?" (unresolved question) | **never** closes — generative by design |
| **Source** | `sources/` | "X feeds my work" (external influence) | persistent reference |
| **Collision** | `collisions/` | "What if X met Y?" (proposed pairing) | ages until acted on (see §8.3) |

**Diagnostic notes.**

- A **Seed** is a *desire*, not a gap. A gap is an absence of knowledge; a
  Seed is the presence of an itch. Seeds are the only type meant to be
  consumed — when a Seed becomes a work, mark it `spent` and record the
  work in `spawned`.
- A **Thread** is recognised, not declared. You do not start a Thread; you
  notice that three works were secretly the same work.
- A **Technique** is craft you *own*, not craft you have heard of. The test
  is whether you could reach for it tomorrow without looking it up.
- A **Theme** that you answer is no longer a Theme — but resist the urge to
  answer. A practice with no open Themes has stopped asking questions.
  Down-state them to `dormant`, never `spent`.
- A **Source** is external. If it came out of your own work it is a
  Technique or a Thread.
- A **Collision** is the engine. It is the only type the exhale (§8.2)
  actively manufactures.

These six are claimed to be medium-independent: a writer has Threads and
Techniques and unanswered Themes exactly as a programmer or a composer
does. That claim is untested (§0) and is the first thing a second practice
should try to break.

---

## 6. Concept documents

Every entity is a UTF-8 markdown file: a YAML frontmatter block, then a
markdown body.

### 6.1 Frontmatter

```yaml
---
id: threads/emergence              # REQUIRED — the entity ID
type: thread                       # REQUIRED — seed | thread | technique | theme | source | collision
title: Emergence from simple rules
state: active                    # dormant | active | spent  (see §7)
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
  exhale ranks by. It is explicitly not an importance score, not a
  deadline, and not a measure of how much work remains — an entity may sit
  at `high` for months without anything being owed.
- **`spawned`** is the productivity trace — the work IDs this entity
  produced. It is how you see, months later, which obsessions were fertile
  and which were merely loud.

### 6.2 Body conventions

The body is free-form markdown. These headings have conventional meaning
and SHOULD be used when applicable:

| Heading | Purpose |
|---------|---------|
| `# What` | One-paragraph description of the entity. |
| `# Trace` | The works / moments where it surfaced, with links. |
| `# Charge` | Why it feels alive (or has gone quiet). |
| `# Prompts` | Open ideas this entity suggests — raw fuel for the exhale. |

---

## 7. State model

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

## 8. The two rituals

The rituals ship as markdown prompt files in `rituals/`, so they travel
with the bundle. They are written to be run by an agent with filesystem
read access, and can be installed as slash commands or pasted into a
session by hand. Nothing in this specification depends on a particular
agent or vendor.

### 8.1 Inhale — `/inhale`

Run after a work, or in a weekly pass.

1. Read the new work note(s), focusing on whatever section records
   observations rather than description.
2. For each weak signal, decide its type (§5) and either **create** a new
   entity or **strengthen** an existing one (append to `Trace`, raise
   `charge`, add the work to `spawned`).
3. Promote nothing prematurely. A signal seen once is a note; a signal
   seen twice is a Thread.

### 8.2 Exhale — `/spark`

Run before a work, when you want the layer to propose work.

1. Read the entire `imagination/` tree.
2. Generate **four** prompts, one per strategy:
   - **Collide** — pair two high-`charge` entities from distant folders.
   - **Revive** — surface a `dormant` entity whose `charge` is still high.
   - **Press** — attack an open `theme` with a recently acquired
     `technique`.
   - **Break** — deliberately *violate* the highest-`charge` Thread. Name
     the maker's strongest default and propose its opposite. This is the
     anti-echo strategy: a layer that only feeds your obsessions is an
     echo chamber, so `/spark` must also know how to push you off your own
     path. Always included, even when it stings.
3. For each prompt, name the source entities and write one sentence on the
   work it implies.
4. Persist every proposed-but-unmade **Collide** as a `collisions/` entity
   (see §8.3).

**Break** is load-bearing and easy to drop. A generative layer built on
`charge` is a recommender trained on a single user, with the failure mode
every recommender has: it will find your groove and deepen it until it is
a rut. Break exists to spend some of the layer's output arguing with its
owner. An implementation that quietly omits it because the other three
feel more useful has built the echo chamber this format was designed to
avoid.

### 8.3 The aging rule

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
signal: Imagination surfaces, with rising insistence, the work you are
afraid to make.

`proposed` is a list, and its length is the mechanism. An implementation
that overwrites the date rather than appending to it has removed the only
thing the aging rule measures.

**This rule is unproven.** See §0. It is the most distinctive claim in the
format and has not yet fired in any practice. Two failure modes are
anticipated and neither has been observed: collisions may always be taken
immediately (in which case aging never engages and the rule is dead
weight), or they may accumulate uniformly (in which case `charge` on
collisions carries no signal and needs a decay term). A practice that
runs the loop long enough to distinguish these has the most valuable
finding available to v0.2.

---

## 9. Index and log

An `index.md` MAY sit at `imagination/` root for progressive disclosure —
a human or agent reads it to see the shape of the layer before opening
files. It groups entities by type and carries each one's `title` and
`charge`. It contains no frontmatter and MAY be regenerated automatically.

A `log.md` MAY record the layer's own history — entities created, charges
shifted, Seeds spent — newest first, under ISO-8601 date headings. It is
the diary of the practice's evolution, distinct from the works
themselves.

---

## 10. Linking and work anchoring

- Entities link to one another with standard markdown links and the
  `feeds` / `sources` frontmatter keys. A link asserts a relationship;
  its meaning lives in the prose around it.
- Entities link to **works** by folder name (`01-entropy`) in `spawned`,
  and by markdown link in the body.
- The reverse anchor is optional but recommended: a work note MAY list the
  Imagination entities it touched, closing the loop between what was made
  and what it fed.
- Readers MUST tolerate broken links. A link to a not-yet-written entity
  is not an error — it marks future fuel.

The tolerance in that last rule is deliberate but has a cost: a renamed
entity type leaves dangling `feeds` references that no reader will
complain about. Bundles SHOULD be run through a validator (§12) after any
structural rename.

---

## 11. Relationship to other formats

Imagination is a deliberate **divergent profile** of the decision-log
concept layer, and is structurally close to the
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md):
markdown + frontmatter, bundle-relative links, `index.md` / `log.md`
conventions, permissive consumption.

It differs in *intent*. OKF and the decision log describe what *is* —
assets, or commitments. Imagination describes what *might be*, and what
keeps returning. Its `state` model is built on revival rather than
resolution, and it adds the exhale — generation — which neither parent
has.

Against the wider field:

| System | Direction | Unit | Generates? |
|---|---|---|---|
| Zettelkasten | inhale | atomic note | emergently, by accident |
| Evergreen notes | inhale | concept note | no |
| PARA / second brain | inhale, convergent | project / area | no |
| Digital garden | inhale, publishing | page | no |
| Decision log / ADR | convergent | decision | no |
| OKF | descriptive | asset | no |
| Oblique Strategies | exhale only | card | yes, context-free |
| **Imagination** | **both** | **entity** | **yes, corpus-aware** |

The two cells that matter are the bottom row. Every inhale-only system
above is better than Imagination at recall; none of them will hand you a
proposal. Oblique Strategies will hand you a proposal but cannot know
what you have made. Imagination's whole bet is that the intersection is
worth a format.

An Imagination bundle can be made OKF-conformant by treating `type` as the
required field (it already is) and adopting `/`-absolute links. The
generative keys (`charge`, `spawned`, `state`) are legal OKF producer
extensions. Imagination is thus the *generative dialect* of a shared
markdown-knowledge family.

---

## 12. Conformance

An Imagination bundle is conformant with v0.1 if:

1. Every non-reserved `.md` file under `imagination/` has a parseable YAML
   frontmatter block with non-empty `id` and `type`.
2. `type` is one of the six defined types, or a producer-defined type a
   reader treats as generic.
3. `id` equals the file's path within the bundle, minus `.md`.
4. `index.md` and `log.md`, when present, follow §9.

Reserved files — exempt from rule 1 — are `SPEC.md`, `README.md`,
`index.md`, and `log.md`, plus anything under `rituals/`.

Readers SHOULD treat all else as soft guidance and MUST NOT reject a
bundle for missing optional keys, unknown keys, broken links, or absent
index files. Imagination is meant to stay useful as it grows messy —
which, being a record of a wandering mind, it will.

A reference validator ships with this bundle as `validate.py`. It reports
conformance failures as errors and drift — dangling links, unknown
`charge` or `state` values, collisions with a single `proposed` date — as
warnings. Warnings are not failures; several of them are just what an
honest layer looks like.

---

## 13. Versioning

This document specifies Imagination version **0.1**. Future revisions use
`<major>.<minor>`: minor bumps add backward-compatible keys or
conventions; major bumps may rename required keys or types.

Changes under consideration for 0.2:

- **The Seed lifecycle is wrong.** §5 says a Seed is "consumed when it
  spawns a work." The reference instance contradicts this: five of its
  seven Seeds have spawned a work and remain `active` or `dormant`, and
  `spent` has zero users across six months and 55 entities. A Seed in
  practice is not a single itch discharged by a single work — it is a
  standing desire with branches, which produces repeatedly and stays
  alive. Either `spent` should be dropped, or Seeds should carry a
  partial-completion semantic rather than a binary one. This is the
  clearest evidence-backed defect in v0.1.
- A decay term for `charge`, if collisions are found to age uniformly.
- Whether `Source` and `Technique` collapse into one type in
  non-technical practices.
- Whether the four exhale strategies are the right four.

---

## Appendix A — Minimal example bundle

```
practice/imagination/
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
│   └── vicsek-flocking.md
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
sources: [sources/vicsek-flocking]
date: 2026-06-14
tags: [chaos, agents, generative]
---

# What
Complex, lifelike behaviour arising from a handful of local rules. The
works keep proving the same thesis: order is a special case of chaos,
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
close this; let it press on the next audio work.
```
