#!/usr/bin/env python3
"""
Imagination — conformance validator.

Checks a bundle against SPEC.md §12 and reports two classes of finding:

  ERROR    — the bundle is non-conformant (§12 rules 1-3).
  WARNING  — drift. Dangling links, unknown charge/state values, collisions
             that have never aged. Not failures; several of these are just
             what an honest layer looks like.

Exits 1 if any ERROR is found, 0 otherwise. Warnings never fail the run.

Usage:
    python3 validate.py imagination/
    python3 validate.py imagination/ --works .      # also check spawned refs
    python3 validate.py imagination/ --quiet        # findings only, no summary
"""
import os, re, sys, argparse
from collections import Counter

TYPES = {"seed", "thread", "technique", "theme", "source", "collision"}
FOLDERS = {"seeds", "threads", "techniques", "themes", "sources", "collisions"}
STATES = {"dormant", "active", "spent"}
CHARGES = {"low", "medium", "high"}
RESERVED = {"SPEC.md", "README.md", "index.md", "log.md", "coverage.md",
            "CASE-STUDY.md"}
RESERVED_DIRS = {"rituals", "snapshots"}
REF_KEYS = ("feeds", "sources", "pair")


def parse_fm(text):
    """Minimal frontmatter reader — scalars and inline lists, no deps."""
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m:
        return None
    fm = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"([\w-]+):\s*(.*)", line)
        if not mm:
            continue
        k, v = mm.group(1), mm.group(2).strip()
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip().strip("'\"") for x in v[1:-1].split(",") if x.strip()]
        else:
            v = v.strip("'\"")
        fm[k] = v
    return fm


def listify(v):
    if isinstance(v, list):
        return v
    return [v] if v else []


def collect(bundle):
    """Walk the bundle, returning (entities, errors) where entities is
    a list of (relpath, frontmatter) and errors are §12 violations."""
    entities, errors = [], []
    for dirpath, dirnames, filenames in os.walk(bundle):
        dirnames[:] = [d for d in dirnames if d not in RESERVED_DIRS
                       and not d.startswith(".")]
        for fn in sorted(filenames):
            if not fn.endswith(".md") or fn in RESERVED:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, bundle)
            fm = parse_fm(open(full, encoding="utf-8").read())

            if fm is None:
                errors.append((rel, "no parseable frontmatter block"))
                continue
            if not fm.get("id"):
                errors.append((rel, "missing required key: id"))
            if not fm.get("type"):
                errors.append((rel, "missing required key: type"))

            expect = rel[:-3].replace(os.sep, "/")
            if fm.get("id") and fm["id"] != expect:
                errors.append((rel, f"id '{fm['id']}' does not match path "
                                    f"(expected '{expect}')"))
            entities.append((rel, fm))
    return entities, errors


def check(entities, works_root=None):
    """Drift checks. Returns a list of (relpath, message)."""
    warnings = []
    known = {fm["id"] for _, fm in entities if fm.get("id")}

    for rel, fm in entities:
        t = fm.get("type")
        if t and t not in TYPES:
            warnings.append((rel, f"unknown type '{t}' — readers will treat "
                                  f"it as generic"))
        folder = rel.split(os.sep)[0]
        if folder not in FOLDERS:
            warnings.append((rel, f"entity outside a defined folder "
                                  f"('{folder}')"))
        if not fm.get("title"):
            warnings.append((rel, "no title — it will render as a raw id "
                                  "in index.md"))

        st, ch = fm.get("state"), fm.get("charge")
        if st and st not in STATES:
            warnings.append((rel, f"state '{st}' not in {sorted(STATES)}"))
        if ch and ch not in CHARGES:
            warnings.append((rel, f"charge '{ch}' not in {sorted(CHARGES)}"))

        for key in REF_KEYS:
            for ref in listify(fm.get(key)):
                # pair/spawned may name works, not entities; only flag refs
                # that look like entity ids (folder/slug) and fail to resolve.
                if "/" in ref and ref not in known:
                    warnings.append((rel, f"{key}: dangling reference "
                                          f"'{ref}'"))

        if works_root:
            for ref in listify(fm.get("spawned")):
                if not os.path.isdir(os.path.join(works_root, ref)):
                    warnings.append((rel, f"spawned: no such work "
                                          f"'{ref}'"))

        # Seeds and Collisions are the consumable types (§5): once they have
        # spawned something they should be `spent`, not still in flight.
        if t in ("seed", "collision") and listify(fm.get("spawned")) \
                and st != "spent":
            warnings.append((rel, f"{t} has spawned but state is '{st}' — "
                                  f"consumable types should go spent (§5)"))

        if t == "collision":
            if not fm.get("pair"):
                warnings.append((rel, "collision without a pair"))
            proposed = listify(fm.get("proposed"))
            if len(proposed) == 1 and st != "spent":
                warnings.append((rel, "proposed once and never re-proposed "
                                      "— the aging rule has not engaged"))
    return warnings


def summarize(entities):
    by_type = Counter(fm.get("type", "?") for _, fm in entities)
    by_charge = Counter(fm.get("charge", "?") for _, fm in entities)
    by_state = Counter(fm.get("state", "?") for _, fm in entities)

    spawn_links = sum(len(listify(fm.get("spawned"))) for _, fm in entities)
    works = {w for _, fm in entities for w in listify(fm.get("spawned"))}

    collisions = [fm for _, fm in entities if fm.get("type") == "collision"]
    aged = [c for c in collisions if len(listify(c.get("proposed"))) > 1]

    print(f"\n  {len(entities)} entities · {spawn_links} spawned links "
          f"across {len(works)} distinct works")
    print("  type    " + "  ".join(f"{k}:{v}" for k, v in sorted(by_type.items())))
    print("  charge  " + "  ".join(f"{k}:{v}" for k, v in sorted(by_charge.items())))
    print("  state   " + "  ".join(f"{k}:{v}" for k, v in sorted(by_state.items())))

    if collisions:
        print(f"\n  collisions: {len(collisions)} · {len(aged)} have aged "
              f"(re-proposed at least once)")
        if not aged:
            print("  the aging rule has never fired in this bundle — "
                  "see SPEC.md §8.3")


def main():
    ap = argparse.ArgumentParser(description="Validate an Imagination bundle.")
    ap.add_argument("bundle", help="path to the imagination/ directory")
    ap.add_argument("--works", metavar="DIR",
                    help="practice root, to verify spawned references resolve")
    ap.add_argument("--quiet", action="store_true", help="skip the summary")
    args = ap.parse_args()

    if not os.path.isdir(args.bundle):
        sys.exit(f"not a directory: {args.bundle}")

    entities, errors = collect(args.bundle)
    warnings = check(entities, args.works)

    for rel, msg in errors:
        print(f"ERROR    {rel}: {msg}")
    for rel, msg in warnings:
        print(f"WARNING  {rel}: {msg}")

    if not errors and not warnings:
        print("clean — no errors, no drift.")

    if not args.quiet:
        summarize(entities)
        print(f"\n  {len(errors)} error(s) · {len(warnings)} warning(s)")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
