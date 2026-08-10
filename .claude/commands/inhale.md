---
description: Inhale — harvest every uninhaled sketch into the Imagination layer
---

# /inhale — the harvest

Read finished sketches and lift their weak signals into the Imagination layer.
This is the backward-looking half of the breathing cycle (see
`imagination/SPEC.md` §7.1). Propose diffs; write only after the maker confirms.

The layer tracks what it has read in [`coverage.md`](../coverage.md). Nothing
stays unread by accident.

## Arguments

`/inhale` — harvest **everything pending**, cluster by cluster (default).
`/inhale {sketch-folder}` — harvest one sketch (e.g. `/inhale 92-tube-tolerance`).

## Steps

1. **Read coverage.** Run:

   ```
   python3 imagination/coverage.py
   ```

   It rewrites the ledger from the filesystem and prints the pending set,
   already grouped into clusters. With an argument, harvest that sketch only.
   With none, harvest every pending sketch — but see step 6.

2. Read each sketch's `interface.md`, focusing on the **Notes**, **Conceptual
   Tags**, and **Technical Tags** sections. A sketch with no `interface.md` is
   `blocked`, not pending — write the note first, or read the folder directly
   and say so.

3. For each signal, decide its type (§4): seed, thread, technique, theme,
   source, collision.

4. For each, choose one action:
   - **Create** a new entity (only if the signal is genuinely new).
   - **Strengthen** an existing entity: append to its `Trace`, add the
     sketch to `spawned`, and/or raise its `charge`.

5. Apply the promotion rule: a signal seen **once** is just a note — leave
   it. A signal seen **twice or more** across sketches earns a Thread.

6. **One cluster per diff.** The promotion rule assumes signals accrue over
   time; harvesting a whole backlog in one pass makes every recurring motif
   cross the "twice" line simultaneously and inflates the layer. Propose one
   cluster, get confirmation, write, update the ledger, then move to the next.
   Do not put thirty sketches in a single diff — it cannot be reviewed.

7. **Force nothing.** A sketch that yields no signal is marked `no-signal`, not
   given an invented entity. That closes the *read*, not the sketch: if it later
   turns out to have been an earlier sighting of something, add it to the new
   entity's `spawned` retroactively (§7.4).

8. If a sketch fulfils a pending `collisions/` entity, mark that collision
   `spent`.

9. **Never harvest both a daily sketch and the indexed piece it was promoted
   to.** The ledger marks the daily one `covered-by`; harvest the piece. Listing
   both in `spawned` double-counts one piece of work as two.

## Output format

Present a diff list grouped by action, then ask for confirmation:

```
## /inhale — {cluster or sketch}   ({n} of {total} pending)

### Create
- threads/{slug} — {title} · charge: {…}  ({why})

### Strengthen
- techniques/{slug} — +spawned: {sketch}, charge {old}→{new}

### Close
- collisions/{slug} → spent (fulfilled by {sketch})

### No signal
- {sketch} — {one line on what was read and why nothing surfaced}
```

Do not write files until the maker confirms.

## After writing

1. Update the outcome column in [`coverage.md`](../coverage.md) for every
   sketch in the batch — `harvested` (with the entities touched) or
   `no-signal`. Every sketch read must leave a row; a silent skip is the one
   failure mode this ledger exists to prevent.
2. Update `index.md`.
3. Append a line to `log.md`.
4. Re-run `python3 imagination/coverage.py` to refresh the counts and confirm
   the batch left the pending set.
