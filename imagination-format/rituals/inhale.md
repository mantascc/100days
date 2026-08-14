---
description: Inhale — harvest finished work into the Imagination layer
---

# /inhale — the harvest

Read one or more finished works and lift their weak signals into the
Imagination layer. This is the backward-looking half of the breathing
cycle (see `imagination/SPEC.md` §8.1). Propose diffs; write only after
the maker confirms.

## Arguments

`/inhale {folder}` — harvest one work. With no argument, harvest the most
recently modified work folder.

`/inhale --all` — the **retroactive harvest**: sweep every work in the
practice at once. Use this to seed a new layer from an existing body of
work (see below).

## Steps

1. Read the work's note — whatever file the practice keeps alongside each
   piece (`interface.md`, `README.md`, `notes.md`). Focus on the sections
   that record *observations* rather than description: what was learned,
   what was hard, what it resembled, what it raised.
2. For each signal, decide its type (§5): seed, thread, technique, theme,
   source, collision.
3. For each, choose one action:
   - **Create** a new entity (only if the signal is genuinely new).
   - **Strengthen** an existing entity: append to its `Trace`, add the work
     to `spawned`, and/or raise its `charge`.
4. Apply the promotion rule: a signal seen **once** is just a note — leave
   it. A signal seen **twice or more** across works earns a Thread.
5. If this work fulfils a pending `collisions/` entity, mark that collision
   `spent` and add the work to its `spawned`.

## Retroactive harvest (`--all`)

Seeding a layer from an existing practice is the highest-value single run
of this ritual, and the rules differ slightly.

1. Read every work note in the practice, oldest first.
2. Do not create an entity on first sighting. Hold signals in a working
   tally and promote only what recurs — the threshold that matters is
   **three** appearances for a Thread on a retroactive pass, not two. A
   corpus read all at once produces false patterns that a day-by-day read
   would not.
3. Prefer fewer, denser entities. Twelve Threads that each cite six works
   describe a practice; forty Threads citing two works each describe
   nothing.
4. Set `charge` by *recency and pull*, not by count. A thread with twenty
   old members and nothing in three months is `medium` and `dormant`. A
   thread with four members, three of them last month, is `high`.
5. Leave `collisions/` empty. Collisions are generated forward by `/spark`;
   manufacturing them retroactively invents an avoidance history that
   never happened, and the aging rule (§8.3) depends on that history being
   real.
6. Report coverage explicitly — how many works were read, how many are
   cited by at least one entity, and which were unreadable.

## Output format

Present a diff list grouped by action, then ask for confirmation:

```
## /inhale — {work}

### Create
- threads/{slug} — {title} · charge: {…}  ({why})

### Strengthen
- techniques/{slug} — +spawned: {work}, charge {old}→{new}

### Close
- collisions/{slug} → spent (fulfilled by {work})
```

Do not write files until the maker confirms. After writing, update
`index.md`, append a line to `log.md`, and run `validate.py` if the change
touched entity IDs or link fields.
