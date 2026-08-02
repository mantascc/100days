# Design System — Snapshot

*2026-06-16 · pause point*

A bookmark to come back to. What this work is for, what's on disk now,
what this session changed, and the ranked queue of next moves.

---

## Goal

Turn `design-system/` from a documentation bundle into a **robust, shareable,
reusable artifact**. The thread that produced it — *design systems &
reference sheets* — is the live edge of the practice, not a side-effect of
polish. The point isn't to "finish" the system; it's to make it the kind of
thing someone else could read, import, fork, and cite.

Three properties to optimize for:
- **Robust** — the model survives evolution. Tokens promote by recurrence,
  principles get rewritten by exception pressure, instances coexist without
  contaminating the canon.
- **Shareable** — one URL renders the whole system. Has a SPEC. Versioned.
  Forkable.
- **Reusable** — sketches `<link>` the tokens; they don't redefine `:root`
  from scratch. Pattern libraries are addressable specimens, not
  one-off catalog cards.

---

## Where we are

The bundle on disk:

```
design-system/
├── SPEC.md            # ← new this session, v0.1
├── README.md          # friendly intro, now points at SPEC
├── index.md           # progressive listing
├── snapshot.md        # ← this file
├── principles/  (5)   # quiet-over-loud, visible-logic, reduction-as-polish,
│                      # data-as-material, physics-over-easing
├── tokens/      (5)   # color, typography, spacing, geometry, motion
├── instances/   (3)   # clear-channel v1.0, ube-kaizen v1.0, aida v0.1
└── exceptions/  (3)   # 2× reduction-as-polish (at threshold), 1× quiet-over-loud
```

Plus the sibling [`imagination/`](../imagination/) bundle, which already
tracks the design-systems-and-reference-sheets thread as the highest-spawn
thread in the layer (21 sketches).

---

## What this session shipped

1. **`design-system/SPEC.md` v0.1** — normative document. Four entity types
   (token / principle / instance / exception), per-type frontmatter, status
   lifecycle, two promotion rules (recurrence and rewrite threshold), the
   forking contract, RFC-style conformance, versioning rules,
   minimal-bundle appendix.

2. **`README.md` repositioned** — now a friendly intro that points at the
   SPEC for normative content. Same shape as the Imagination bundle.

3. **`imagination/snapshots/2026-06-16-state.html`** — a Clear-Channel-style
   editorial snapshot of the Imagination layer. Five sections: patterns
   emerging, hot zones, pressure (open themes), dodged & dormant, the field.
   Served at `localhost:8840`.

4. **Memory updated** — recorded that the design-systems thread is
   *genuine curiosity*, not work-creep. Future `/inhale` and `/spark` runs
   should propose extensions, not correctives. See
   `feedback_design_systems_thread.md`.

5. **`/inhale sketch-agent-streaming-patterns`** — diff proposed but **not
   written**. Pending confirmation. See "Open threads" below.

---

## What's next — ranked queue

Five moves, in build order. Doing them in this sequence avoids rework:
the SPEC pins the contract, then everything downstream complies with it.

### 1. Compile tokens to a working artifact *(highest leverage)*
- **What:** `design-system/build.py` reads `tokens/*.md`, emits
  `dist/tokens.css` and `dist/tokens.json`. Same script emits
  `dist/instances/{name}.css` for each instance.
- **Why:** today every sketch redefines `:root` from scratch (86×
  duplication). One `<link>` would unify the vocabulary and make the
  status lifecycle *enforceable* — `superseded` tokens disappear from
  `dist/`, `provisional` ones are flagged.
- **Cost:** ~80 lines of Python + one round of sketch refactoring.

### 2. Promote `patterns/` to a first-class folder
- **What:** harvest the four pattern libraries (hitl-patterns,
  agentic-patterns, agent-streaming-patterns, thinking-states/idle-states/
  progress-indicators) into typed pattern documents. Define the schema:
  *prose + minimal vanilla snippet + provenance + computed glyph*. Each
  pattern is addressable (e.g. `patterns/streaming/bundled-tool-calls.md`).
- **Why:** the streaming-patterns sketch is the proof — reference sheets
  ARE shareable publications. Pin the form so the next one composes from
  reusable cells instead of starting from zero.
- **Cost:** one weekend; schema + 4 library migrations.

### 3. Instances as code, not just markdown
- **What:** `instances/clear-channel.css` (the actual variable set)
  alongside `instances/clear-channel.md` (the prose). Same for ube-kaizen
  and aida. Add a tiny contract test: every instance exposes the same
  variable names so they stay substitutable.
- **Why:** an instance becomes installable — `<link>` it and the sketch
  *is* in that instance. Swapping instances becomes one line.
- **Cost:** ~3 instance files; reuses the build from #1.

### 4. Live index page — `design-system/index.html`
- **What:** Clear-Channel-style page rendering tokens, principles, all
  three instances side-by-side, and every pattern with a live preview.
  One URL = the whole system.
- **Why:** this is the shareable artifact. A link you can post. The system
  dogfooding itself. Also surfaces drift visually.
- **Cost:** half a day if #1–#3 are done first.

### 5. Reference sheets as a publication unit
- **What:** define a `sheets/` template — canonical layout, glyph,
  download flow. Streaming-patterns is the prototype; lift the form so
  any future pattern library ships as a standalone URL.
- **Why:** the maker's strongest output format. Making it repeatable means
  each future burst produces a publishable artifact, not a sketch that
  goes quiet.
- **Cost:** template + one back-port; depends on #2.

---

## Open threads

These are pending decisions or unfinished work, not next-action items.

- **/inhale not yet written.** The proposal at the start of this session
  (sketch-agent-streaming-patterns) was: create
  `threads/agent-ux-streaming` and `techniques/typology-spine-multiple-lenses`;
  strengthen design-system-and-reference-sheets, searching-vs-mapping,
  showing-mechanism-vs-polish. Still awaiting confirmation.

- **Snapshot framing.** The Imagination snapshot's "interaction designer
  arrives, late / day-job creep" reading is wrong (per memory note). The
  text in `imagination/snapshots/2026-06-16-state.html` §01 should be
  rewritten to frame the thread as the live edge of curiosity. Quick fix.

- **`tokens` vs `token` frontmatter type.** Existing files use `type: tokens`
  (plural). SPEC §5.2 accepts it but ideally one form is canonical. Sweep
  to singular, or fold the plural into the SPEC explicitly.

- **`reduction-as-polish` is at rewrite threshold.** Two `worked`
  exceptions logged (28-liquid-glass, 81-lens-wave) — same direction
  ("effect as material"). Per SPEC §7.2 the principle should be rewritten
  to v1.1 with an explicit "effect as material" clause. The exception
  files already foreshadow the rewrite.

- **`ube-kaizen` triad vs single-accent rule.** The instance overrides
  "single spectral accent" into a harmonized triad. `exceptions/63-ube-kaizen-triad.md`
  logs this with verdict `mixed`. Not at threshold yet; watch for one
  more case before deciding whether the rule grows a "muted multi-accent"
  clause.

---

## When picking back up

The cleanest restart point is **build #1 (`dist/tokens.css`)**. It's
self-contained, ~80 lines, unlocks #3 and #4, and makes the SPEC's status
field do real work. After that, the queue is mostly compositional —
patterns, instances, index, sheets — each one a small surface on top of the
same compiled core.

If energy is low, the cheapest useful move is the **snapshot framing fix**
(swap the "pivot / crowds out" reading for "live edge of curiosity"). One
edit, two paragraphs, big alignment win.

---

*Sibling reads: [SPEC.md](SPEC.md) · [README.md](README.md) ·
[index.md](index.md) · [imagination/SPEC.md](../imagination/SPEC.md) ·
[imagination snapshot](../imagination/snapshots/2026-06-16-state.html)*
