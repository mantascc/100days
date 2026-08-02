# Design System — a Living Bundle

**Version 0.1 — Draft**

A design system that is allowed to *evolve* rather than freeze. It separates a
slow-moving **core** from forkable **instances**, writes principles as
**tensions** rather than laws, and gives every entity a **status lifecycle** so
permanence is earned by recurrence, not declared by author.

This is the sibling bundle to [Imagination](../imagination/SPEC.md): where
Imagination says *what to make next*, the Design System says *how it should
look and behave when made*. Like Imagination, it is a directory of markdown
files with YAML frontmatter — if you can `cat` a file you can read it; if you
can `git clone` a repo you can ship it. It requires no database and no tooling
beyond a text editor.

---

## 1. Motivation

Most design systems calcify. A token is written, becomes load-bearing, and is
never re-examined; a principle is declared and becomes a rule the maker now
has to break in secret. The result is either a system that drifts into
irrelevance, or a maker who quietly stops using it.

This bundle inverts the failure mode. Three commitments do the work:

1. **Permanence is earned, not declared.** Every token, principle, and
   instance starts `provisional`. It becomes `active` only after recurring
   across multiple projects. The canon is built by observation, not fiat.
2. **The core never edits to chase a project.** A new palette or rule lives
   in an `instances/` fork. The core stays small because nothing project-
   specific can leak into it.
3. **Principles are tensions.** Every principle names the counterforce it
   trades against and the conditions under which breaking it is correct. A
   principle that admits its counterforce cannot pigeonhole the maker.

The result is a system that gets *more* opinionated over time without becoming
brittle, because exceptions are the evolution engine — not the betrayal.

### Goals

1. A small, slow-moving core that captures what has actually recurred.
2. A clean fork model that lets named systems (Clear Channel, Ube Kaizen,
   Aida) coexist without contaminating each other.
3. A principle layer that survives being broken — and uses the breaks to
   improve.
4. Readable, diffable, portable — markdown on disk, like its sibling.

### Non-goals

- Comprehensiveness. A token absent from the bundle is not an error; it has
  simply not earned a place yet.
- Lock-in. Instances are forks, not configurations. They are allowed to
  drift, and the core is allowed not to follow them.
- Replacing per-sketch styling. Each sketch keeps its own `:root`; the
  Design System sits one level up and is the source the sketch quotes from.

---

## 2. The model

Four layers, each a folder.

```
   ┌──────────────────────────────────────────────────┐
   │  CORE  ─  tokens/ + principles/                  │
   │  the slow, recurring substrate                   │
   └────────────┬─────────────────────────────────────┘
                │ fork (never edit) ▼
   ┌──────────────────────────────────────────────────┐
   │  INSTANCES ─ named releases of the core          │
   │  (Clear Channel, Ube Kaizen, Aida, …)            │
   └────────────┬─────────────────────────────────────┘
                │ break + log ▼
   ┌──────────────────────────────────────────────────┐
   │  EXCEPTIONS ─ principle-breaks that worked       │
   │  the evolution engine                            │
   └──────────────────────────────────────────────────┘
```

- **Core** (`tokens/` + `principles/`) is the substrate every instance forks
  from. It changes only when an exception threshold is crossed (§7).
- **Instances** (`instances/`) are named *releases* of the core. They
  override palette, accent, type — never structure. Multiple instances
  coexist; one project picks one.
- **Exceptions** (`exceptions/`) log principle-breaks that worked. Two
  exceptions against the same principle is the signal to rewrite it.

---

## 3. Bundle structure

```
design-system/
├── SPEC.md              # this document
├── README.md            # friendly introduction
├── index.md             # progressive-disclosure listing (§9)
├── log.md               # optional chronological history
├── principles/
├── tokens/
├── instances/
└── exceptions/
```

Each entity is one markdown file. Its **Entity ID** is its path within
`design-system/` minus the `.md` suffix — e.g. `principles/quiet-over-loud.md`
has ID `principles/quiet-over-loud`.

---

## 4. Entity types

Four types are defined. Each has a one-line diagnostic — the question it
answers. If an entity answers none, it does not belong in the bundle.

| Type | Folder | Answers | Lifecycle |
|------|--------|---------|-----------|
| **Token** | `tokens/` | "What is the value of X?" | provisional → active → superseded |
| **Principle** | `principles/` | "How should I trade A against B?" | provisional → active → superseded; rewrites on pressure |
| **Instance** | `instances/` | "Which named release is this?" | provisional → active → superseded; versions per instance |
| **Exception** | `exceptions/` | "Which break, and did it work?" | worked / failed / mixed — accumulates against a principle |

**Diagnostic notes.**

- A **Token** is a *value*, not a meaning. The meaning lives in the prose
  beside it and in the principles that govern its use. `--accent-cyan` is a
  token; "use exactly one accent per project" is a principle.
- A **Principle** is a *tension*, not a rule. It must declare the
  counterforce it trades against and the conditions under which breaking it
  is the correct move. A principle without a counterforce is suspect.
- An **Instance** is a *release*, not a theme. It inherits the core,
  overrides a small set of axes, and carries a version. New looks fork new
  instances; they do not edit the core.
- An **Exception** is *evidence*, not an apology. It records a break that
  worked, why it worked, and what the principle would have to say to absorb
  it. Two on the same principle is the rewrite threshold.

---

## 5. Concept documents

Every entity is a UTF-8 markdown file: a YAML frontmatter block, then a
markdown body.

### 5.1 Frontmatter — shared

All entities share these keys.

| Key | Required | Notes |
|-----|----------|-------|
| `id` | yes | The Entity ID (path minus `.md`). |
| `type` | yes | `token`, `principle`, `instance`, or `exception`. |
| `title` | recommended | Human label for indexes. |
| `status` | recommended | `provisional` \| `active` \| `superseded`. |
| `tags` | optional | Free-form. Readers MAY ignore. |

Producers MAY add their own keys. Readers MUST tolerate unknown keys and
missing optional ones.

### 5.2 Frontmatter — per type

**Token group** (`tokens/color.md`, `tokens/typography.md`, etc.) — a *token
group* file collects related variables; individual token statuses live in the
body table.

```yaml
---
id: tokens/color
type: tokens
title: Color tokens
status: active
tags: [color, ground, accent]
---
```

The body MUST contain at least one table whose rows list `name`, `value`,
`usage`, and `status` per token. Per-row status overrides the group status.

**Principle**

```yaml
---
id: principles/quiet-over-loud
type: principle
title: Quiet systems over loud interfaces
status: active
version: 1.0
tension: "restraint vs presence"
provenance: style-seed Philosophy
tags: [restraint, ui]
---
```

The body SHOULD use the four conventional headings (§5.3): `Stand`,
`Counterforce`, `When to break`, `Provenance / exceptions`.

**Instance**

```yaml
---
id: instances/clear-channel
type: instance
title: Clear Channel
status: active
version: 1.0
core: computational-minimalism
accent: --accent (spectral single)
provenance: 69-clear-channel
tags: [dark, mono, canonical]
---
```

The body SHOULD list overrides as a table: `Axis | Value`. Anything not
overridden is inherited from the core.

**Exception**

```yaml
---
id: exceptions/28-liquid-glass-bloom
type: exception
against: principles/reduction-as-polish
sketch: 28-liquid-glass
verdict: worked        # worked | failed | mixed
date: 2026-06-14
tags: [glass, blur, richness]
---
```

The body SHOULD use `What broke`, `Why it worked` (or `Why it didn't`), and
`Pressure` — the last describes what the principle would have to say to
absorb this break.

### 5.3 Body conventions

| Heading | When | Purpose |
|---------|------|---------|
| `# What` | tokens, instances | One-paragraph description. |
| `# Stand` | principles | The force the principle upholds. |
| `# Counterforce` | principles | The legitimate opposing force. |
| `# When to break` | principles | Concrete break-conditions. |
| `# Provenance / exceptions` | principles | Where it came from; logged breaks. |
| `# Overrides` | instances | The override table vs the core. |
| `# Provenance` | instances, exceptions | The sketch(es) it came from. |
| `# What broke` | exceptions | The principle and the break. |
| `# Why it worked` | exceptions | Why the break was correct here. |
| `# Pressure` | exceptions | Rewrite-pressure on the principle. |

---

## 6. Status lifecycle

Status describes *earned permanence*, not novelty or quality.

```
   ┌──────────────┐   recurs in ≥2 projects   ┌──────────┐
   │ provisional  │ ───────────────────────▶  │  active  │
   └──────────────┘                           └────┬─────┘
                                                   │ displaced by a successor
                                                   ▼
                                            ┌──────────────┐
                                            │  superseded  │
                                            └──────────────┘
```

- **`provisional`** — new. Used once, recently, or in a single instance.
  The default for a freshly written token, principle, or instance.
- **`active`** — has recurred across ≥2 projects (the **promotion rule**).
  Earned permanence. Surfaces in indexes by default.
- **`superseded`** — replaced by a newer entity. **Not deleted.** The
  shape of what was abandoned is information about the practice's drift.

There is deliberately no `deprecated` state. Things either earn permanence
or they don't; if they do and are later displaced, they are `superseded`
with a pointer to the successor.

---

## 7. Promotion rules

Two rules govern movement between states. Both apply by recurrence — the
maker should rarely change status by hand.

### 7.1 The recurrence rule

A `provisional` token, principle, or instance becomes `active` when it has
**recurred across ≥2 distinct projects** (sketches, instances, or
downstream consumers). The body SHOULD record the second occurrence as a
provenance note.

### 7.2 The rewrite threshold

A principle accumulating **two `worked` exceptions in the same direction**
is at its rewrite threshold. The principle SHOULD be rewritten to absorb
the breaks — not removed, but extended with an explicit clause. The
prior version moves to `superseded`; the rewrite increments `version`.

Example (live in the bundle today): `reduction-as-polish` has two
`worked` exceptions ([28-liquid-glass](exceptions/28-liquid-glass-bloom.md)
and [81-lens-wave](exceptions/81-lens-wave-bloom.md)) where "effect *is*
the material." Per §7.2, the principle is ready for an "effect as
material" clause and a v1.1.

---

## 8. Forking instances

Instances are how the system evolves *without* editing the canon.

1. **Fork**. Copy the model into `instances/{name}.md` at `version: 0.1`,
   `status: provisional`. List only the axes you override.
2. **Inherit silently**. Anything not in the override table is inherited
   from the core. Instances MUST NOT silently change inherited values.
3. **Promote on recurrence**. When the instance is used in a second
   project, flip `status: active` and bump toward `version: 1.0` once it
   settles. Provisional → active is when the instance is real.
4. **Coexist**. Multiple instances are normal — the canon is one core,
   N releases. A project picks one and stays in it.
5. **Never edit the core to chase one project.** This is the load-bearing
   rule. If a new accent feels canonical, fork an instance first; wait for
   the recurrence rule to lift it into the core.

Instances may declare their `core:` to be a specific version of the canon.
Default: latest.

---

## 9. Index and log

An `index.md` at the bundle root provides progressive disclosure — a human
or agent reads it to see the shape of the bundle before opening files. It
groups entities by type and carries each one's `title`, `status`, and
`version` (for principles and instances). It contains no frontmatter and
MAY be regenerated automatically.

A `log.md` MAY record the bundle's own history — entities created, statuses
promoted, principles rewritten, instances forked — newest first, under
ISO-8601 date headings. It is the diary of the system's evolution,
distinct from any sketch.

---

## 10. Linking and sketch anchoring

- Entities link to one another with standard markdown links and the
  `against`, `provenance`, `core`, and `feeds` frontmatter keys. A link
  asserts a relationship; its meaning lives in the prose around it.
- Entities link to **sketches** by folder name (e.g. `69-clear-channel`)
  in `provenance`, and by markdown link in the body.
- An exception MUST carry `against:` pointing at the principle it broke.
- A sketch MAY include a `design-system:` block in its `interface.md`
  noting the instance it consumes and any tokens it introduces. This is
  optional and reverse-readable, not required for conformance.
- Readers MUST tolerate broken links. A link to a not-yet-written entity
  marks future fuel.

---

## 11. Relationship to other formats

This bundle is the **normative dialect** of a shared markdown-knowledge
family.

- **[Imagination](../imagination/SPEC.md)** is the sister bundle. Where
  Imagination is *divergent* (entities exist to breed and re-surface), the
  Design System is *convergent within evolution* (entities earn permanence
  by recurrence, but are explicitly allowed to be displaced). They share
  bundle shape, frontmatter idiom, and index/log conventions.
- **[OKF (Open Knowledge Format)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)**
  conformance: this bundle satisfies OKF with `type` as the required key
  (it already is). The `status`, `version`, `against`, `core`, and
  `provenance` keys are legal OKF producer extensions.
- **Decision logs**: the Design System differs by carrying a *rewrite*
  state for principles. A decision log closes gaps; this bundle expects its
  rules to be challenged and updated.

---

## 12. Conformance

A bundle is conformant with Design System v0.1 if:

1. Every non-reserved `.md` file under `design-system/` has a parseable
   YAML frontmatter block with non-empty `id` and `type`.
2. `type` is one of `token` (or `tokens` for a group), `principle`,
   `instance`, or `exception`, or a producer-defined type a reader treats
   as generic.
3. Every `exception` carries an `against:` field naming a principle ID.
4. Every `instance` declares a `core:` reference (default permitted).
5. `index.md` and `log.md`, when present, follow §9.

Readers SHOULD treat all else as soft guidance and MUST NOT reject a bundle
for missing optional keys, unknown keys, broken links, or absent index
files. The bundle is meant to stay useful as it grows messy — which, being
a record of an evolving practice, it will.

---

## 13. Versioning

This document specifies Design System version **0.1**. Future revisions use
`<major>.<minor>`: minor bumps add backward-compatible keys or conventions;
major bumps may rename required keys, alter status names, or change the
core/instance contract.

Each *principle* and each *instance* carries its own `version` independent
of the SPEC. A principle's `version` increments when it is rewritten per
§7.2; an instance's `version` moves from `0.1` (provisional, first sketch)
toward `1.0` (active, has settled across ≥2 projects).

---

## Appendix A — Minimal example bundle

```
design-system/
├── SPEC.md
├── index.md
├── principles/
│   └── quiet-over-loud.md
├── tokens/
│   ├── color.md
│   └── typography.md
├── instances/
│   └── clear-channel.md
└── exceptions/
    └── 28-liquid-glass-bloom.md
```

`principles/quiet-over-loud.md`:

```markdown
---
id: principles/quiet-over-loud
type: principle
title: Quiet systems over loud interfaces
status: active
version: 1.0
tension: "restraint vs presence"
provenance: style-seed
tags: [restraint, ui]
---

# Stand
An interface should recede so the system can be seen. No element competes
for attention it has not earned.

# Counterforce
Restraint can starve. A system so quiet it never declares itself becomes
illegible.

# When to break
Break for a single load-bearing signal: an error that must be obeyed, a
focus ring that must be found. Never break for decoration.

# Provenance / exceptions
No logged exceptions yet. Pressure-tested every time an accent is added.
```

`instances/clear-channel.md`:

```markdown
---
id: instances/clear-channel
type: instance
title: Clear Channel
status: active
version: 1.0
core: computational-minimalism
accent: --accent (spectral single)
provenance: 69-clear-channel
tags: [dark, mono, canonical]
---

# What
The canonical release of the core — dark grounds, monospace, single
spectral accent. If a later instance forks, this is the thing it forks
from.

# Overrides
| Axis | Value |
|------|-------|
| Ground | `--ground-void` → `--ground-modal` |
| Accent | one spectral single per project |
| Type | JetBrains Mono / IBM Plex Mono |
| Motion | physics-first |
```

`exceptions/28-liquid-glass-bloom.md`:

```markdown
---
id: exceptions/28-liquid-glass-bloom
type: exception
against: principles/reduction-as-polish
sketch: 28-liquid-glass
verdict: worked
date: 2026-06-14
tags: [glass, blur, richness]
---

# What broke
Reduction-as-polish forbids gradients and added effects. This sketch
stacks backdrop-filter blur, saturate, and SVG displacement for liquid
distortion.

# Why it worked
The effect *is* the subject. Glass that does not blur is not glass.

# Pressure
First clear case that "strip, don't add" has a blind spot: when the
material is optical, richness is honest. One more like this and the
principle grows an "effect as material" clause.
```
