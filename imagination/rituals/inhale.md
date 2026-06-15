---
description: Inhale — harvest a finished sketch into the Imagination layer
---

# /inhale — the harvest

Read one or more finished sketches and lift their weak signals into the
Imagination layer. This is the backward-looking half of the breathing
cycle (see `imagination/SPEC.md` §7.1). Propose diffs; write only after
the maker confirms.

## Arguments

`/inhale {sketch-folder}` — harvest one sketch (e.g. `/inhale 100-emergent-type`).
With no argument, harvest the most recently modified sketch folder.

## Steps

1. Read the sketch's `interface.md`, focusing on the **Notes**,
   **Conceptual Tags**, and **Technical Tags** sections.
2. For each signal, decide its type (§4): seed, vein, move, tension,
   source, collision.
3. For each, choose one action:
   - **Create** a new entity (only if the signal is genuinely new).
   - **Strengthen** an existing entity: append to its `Trace`, add the
     sketch to `spawned`, and/or raise its `charge`.
4. Apply the promotion rule: a signal seen **once** is just a note — leave
   it. A signal seen **twice or more** across sketches earns a Vein.
5. If this sketch fulfils a pending `collisions/` entity, mark that
   collision `spent`.

## Output format

Present a diff list grouped by action, then ask for confirmation:

```
## /inhale — {sketch}

### Create
- veins/{slug} — {title} · charge: {…}  ({why})

### Strengthen
- moves/{slug} — +spawned: {sketch}, charge {old}→{new}

### Close
- collisions/{slug} → spent (fulfilled by {sketch})
```

Do not write files until the maker confirms. After writing, update
`index.md` and append a line to `log.md`.
