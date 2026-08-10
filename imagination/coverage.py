#!/usr/bin/env python3
"""
Imagination observability — inhale coverage ledger.

Answers one question the entity graph cannot: *which sketches has the layer
actually read?*

Coverage is not derivable from `spawned:`. SPEC §7.1 says a signal seen once is
just a note — so a correctly-inhaled sketch may legitimately produce zero
entities and zero `spawned:` entries. "Inhaled" is a property of an event (this
sketch was read on this date), not of the graph. It needs a ledger.

Ownership split:
  - this script owns the ROW SET   (adds new sketch folders, drops vanished ones)
  - /inhale owns the OUTCOME COLUMN (harvested / no-signal, date, entities touched)

Outcomes:
  harvested    read, produced or strengthened entities
  no-signal    read, nothing surfaced. Closes the *read*, not the sketch — a
               later inhale may still attach it retroactively to a new entity's
               `spawned:` when it turns out to be an earlier sighting.
  covered-by   a daily sketch promoted to an indexed piece; harvest the piece,
               not both, or `spawned:` double-counts the same work.
  blocked      no interface.md — nothing to read yet.
  pending      actionable backlog.

`blocked` and `covered-by` are facts about the filesystem and are recomputed
every run. `harvested` and `no-signal` are records and are preserved verbatim.

Usage:
    python3 imagination/coverage.py            # rewrite coverage.md, print pending
    python3 imagination/coverage.py --check    # print pending only, write nothing
"""
import os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))       # .../imagination
ROOT = os.path.dirname(HERE)                            # .../100days
LEDGER = os.path.join(HERE, "coverage.md")
TYPES = ["threads", "techniques", "themes", "sources", "seeds", "collisions"]

# Dates for the initial bootstrap only — applied to rows the ledger has never
# seen, then frozen into coverage.md. Editing these after the first run does
# nothing; the ledger is authoritative from then on.
BOOTSTRAP_SWEEP = "2026-06-14"                          # retroactive harvest, log.md
BOOTSTRAP_DATES = {"91-retro-primitives": "2026-08-01"}

INDEXED_RE = re.compile(r"^\d+[a-z]?-")
STEM_RE = re.compile(r"^(?:\d+[a-z]?-|sketch-)")


# ---------- the sketch universe ----------
def sketch_universe():
    """Every sketch folder, indexed and daily, in making order."""
    indexed = sorted(
        (d for d in os.listdir(ROOT)
         if INDEXED_RE.match(d) and os.path.isdir(os.path.join(ROOT, d))),
        key=sketch_key,
    )
    daily = sorted(
        os.path.basename(d) for d in glob.glob(os.path.join(ROOT, "daily-sketch", "*"))
        if os.path.isdir(d)
    )
    return indexed, daily


def sketch_key(sid):
    m = re.match(r"(\d+)([a-z]?)", sid)
    return (int(m.group(1)), m.group(2)) if m else (10**6, sid)


def stem(name):
    return STEM_RE.sub("", name)


def has_interface(name, daily=False):
    base = os.path.join(ROOT, "daily-sketch", name) if daily else os.path.join(ROOT, name)
    return os.path.exists(os.path.join(base, "interface.md"))


# ---------- reverse index: which entities name this sketch ----------
def entity_mentions():
    """sketch id -> sorted list of entity ids that reference it."""
    hits = {}
    for f in glob.glob(os.path.join(HERE, "*", "*.md")):
        rel = os.path.relpath(f, HERE)
        folder = rel.split(os.sep)[0]
        if folder not in TYPES:
            continue
        eid = rel[:-3].replace(os.sep, "/")
        txt = open(f, encoding="utf-8", errors="replace").read()
        for m in set(re.findall(r"\b\d+[a-z]?-[a-z0-9-]+", txt)):
            hits.setdefault(m, set()).add(eid)
        for m in set(re.findall(r"\bsketch-[a-z0-9-]+|\bcat-sprite\b", txt)):
            hits.setdefault(m, set()).add(eid)
    return {k: sorted(v) for k, v in hits.items()}


# ---------- ledger I/O ----------
ROW_RE = re.compile(r"^\|\s*`?([^`|]+?)`?\s*\|(.*)\|\s*$")


def read_ledger():
    """Existing rows: sketch -> (inhaled, outcome, touched). Missing file is fine."""
    rows = {}
    if not os.path.exists(LEDGER):
        return rows
    for line in open(LEDGER, encoding="utf-8"):
        m = ROW_RE.match(line.rstrip("\n"))
        if not m:
            continue
        name = m.group(1).strip()
        cells = [c.strip() for c in m.group(2).split("|")]
        if name in ("sketch", "") or set(name) <= set("-: "):
            continue                                     # header / separator
        while len(cells) < 3:
            cells.append("—")
        rows[name] = tuple(cells[:3])
    return rows


def resolve(name, daily, indexed_set, prior, mentions):
    """(inhaled, outcome, touched) for one sketch, honouring the ownership split."""
    was = prior.get(name)

    # Records win — preserved verbatim, never recomputed.
    if was and was[1].startswith(("harvested", "no-signal")):
        return was

    # Promotion is a filesystem fact and outranks everything but a record:
    # harvesting both the daily sketch and the indexed piece double-counts the
    # same work into `spawned:`.
    if daily:
        promoted = stem(name)
        target = next((i for i in indexed_set if stem(i) == promoted), None)
        if target:
            return ("—", f"covered-by {target}", "—")

    # Never-seen row: bootstrap from the graph, once. Checked *before* the
    # interface.md test — the 2026-06-14 sweep read many sketches straight from
    # the folder, so a missing note does not mean unread.
    if was is None and name in mentions:
        ents = mentions[name]
        shown = ", ".join(f"`{e}`" for e in ents[:3])
        if len(ents) > 3:
            shown += f" +{len(ents) - 3}"
        return (BOOTSTRAP_DATES.get(name, BOOTSTRAP_SWEEP), "harvested", shown)

    # Only genuinely unread sketches can be blocked.
    if not has_interface(name, daily):
        return ("—", "blocked: no interface.md", "—")

    return ("—", "pending", "—")


# ---------- clustering the backlog ----------
def cluster(names):
    """Group pending sketches by leading stem token, so /inhale can batch them."""
    groups = {}
    for n in names:
        groups.setdefault(stem(n).split("-")[0], []).append(n)
    clusters = {k: v for k, v in groups.items() if len(v) > 1}
    singles = sorted(n for k, v in groups.items() if len(v) == 1 for n in v)
    return dict(sorted(clusters.items(), key=lambda kv: -len(kv[1]))), singles


# ---------- render ----------
def table(rows):
    out = ["| sketch | inhaled | outcome | touched |",
           "|---|---|---|---|"]
    for name, (date, outcome, touched) in rows:
        out.append(f"| `{name}` | {date} | {outcome} | {touched} |")
    return "\n".join(out)


def tally(rows):
    c = {"harvested": 0, "no-signal": 0, "covered-by": 0, "blocked": 0, "pending": 0}
    for _, (_, outcome, _) in rows:
        for k in c:
            if outcome.startswith(k):
                c[k] += 1
                break
    return c


def summary(label, rows):
    c = tally(rows)
    parts = [f"{len(rows)} sketches", f"**{c['harvested']} harvested**"]
    for k in ("no-signal", "covered-by", "blocked"):
        if c[k]:
            parts.append(f"{c[k]} {k}")
    parts.append(f"**{c['pending']} pending**" if c["pending"] else "0 pending")
    return f"**{label}** — " + " · ".join(parts)


def main():
    check = "--check" in sys.argv
    indexed, daily = sketch_universe()
    indexed_set = set(indexed)
    prior, mentions = read_ledger(), entity_mentions()

    irows = [(n, resolve(n, False, indexed_set, prior, mentions)) for n in indexed]
    drows = [(n, resolve(n, True, indexed_set, prior, mentions)) for n in daily]

    pending = [n for n, (_, o, _) in irows + drows if o == "pending"]

    if not check:
        doc = f"""# Imagination — Coverage

*Generated by [`coverage.py`](coverage.py). The script owns the row set; `/inhale`
owns the outcome column. Reserved file — no frontmatter, see [SPEC.md](SPEC.md) §8.*

{summary("Indexed pieces", irows)}
{summary("Daily sketches", drows)}

`harvested` read, entities created or strengthened · `no-signal` read, nothing
surfaced — closes the read, not the sketch · `covered-by` promoted; harvest the
indexed piece instead · `blocked` no `interface.md` yet · `pending` backlog.

## Indexed pieces

{table(irows)}

## Daily sketches

{table(drows)}
"""
        open(LEDGER, "w", encoding="utf-8").write(doc)
        print(f"wrote {os.path.relpath(LEDGER, ROOT)}")

    print(summary("Indexed pieces", irows).replace("**", ""))
    print(summary("Daily sketches", drows).replace("**", ""))

    if not pending:
        print("\nnothing pending — the layer has read everything readable.")
        return
    clusters, singles = cluster(pending)
    print(f"\n{len(pending)} pending, in {len(clusters)} clusters + {len(singles)} singletons:")
    for k, v in clusters.items():
        print(f"  {k:<12} {len(v):>2}  {', '.join(v)}")
    if singles:
        print(f"  {'(singletons)':<12} {len(singles):>2}  {', '.join(singles)}")


if __name__ == "__main__":
    main()
