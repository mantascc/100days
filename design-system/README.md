# Design System — a living bundle

A design system that is allowed to *evolve* instead of pigeonholing the work.
It separates a slow-moving core from forkable instances, writes principles as
tensions rather than laws, and gives every token and principle a status
lifecycle so permanence is earned, not declared.

Like [Imagination](../imagination/SPEC.md), this is just markdown with YAML
frontmatter. `cat` a file to read it; no database, no build.

---

## The model

- **Core — "Computational Minimalism."** The philosophy plus the structural
  tokens. Slow-moving, near-constant. The thing everything else forks from.
  Captured in [tokens/](tokens/) and the [principles/](principles/).

- **Instances — named *releases* of the core.** Clear Channel, Ube Kaizen,
  Aida. Evolution happens by **forking a new instance**, never by editing the
  canon. An instance overrides palette/accent/type while inheriting the
  structure. Each carries a **version** (Clear Channel v1.0, Aida v0.1).

- **Principles are tensions, not laws.** Every principle names the force it
  upholds *and* the legitimate counterforce it trades against, plus the
  concrete conditions under which breaking it is correct. A principle that
  admits its counterforce cannot pigeonhole the maker.

- **Exceptions are the evolution engine.** When a sketch breaks a principle
  and it works, it gets logged in [exceptions/](exceptions/). Accumulated
  exceptions are the signal that a principle is ready to be rewritten.

---

## Status lifecycle

```
provisional ──recurs across ≥2 projects──▶ active ──displaced by──▶ superseded
```

- **`provisional`** — new. A token or principle starts here. Used once, or
  recently, or in a single instance.
- **`active`** — it has **recurred across ≥2 projects**. This is the
  **promotion rule**: permanence is earned by recurrence, not by decree.
- **`superseded`** — replaced by a newer token/principle/instance. Kept, not
  deleted — the shape of what was abandoned is information.

The promotion rule applies to exceptions too: **two** logged breaks of the
same principle, same direction, both `worked`, is the threshold to rewrite
that principle. (Reduction-as-polish is currently at that threshold — see
its two glass/bloom exceptions.)

---

## How to evolve the system

1. **Fork an instance.** New look? Copy the model into a new
   `instances/{name}.md` at `version: 0.1`, `status: provisional`, list only
   what you override. Never edit the core to chase one project's palette.
2. **Log exceptions.** Broke a principle and liked the result? Add an
   `exceptions/` entry: what broke, why it worked, what it implies.
3. **Promote on recurrence.** When a provisional token/color/instance shows
   up in a second project, flip it to `active`. When two exceptions pile up
   against one principle, rewrite the principle to absorb them.
4. **Bump versions.** Instances move 0.1 → 1.0 as they settle; principles
   carry a `version` that increments when a rewrite lands.

---

## Layout

```
design-system/
├── README.md            # this file
├── index.md             # the listing
├── principles/          # each principle as a tension
├── tokens/              # color, typography, spacing, geometry, motion
├── instances/           # clear-channel, ube-kaizen, aida
└── exceptions/          # logged principle-breaks-that-worked
```
