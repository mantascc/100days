#!/usr/bin/env python3
"""
Bake the Imagination layer into a single data.js the sketch can read under file://.

fetch() cannot read a sibling directory from a file:// page, so the whole corpus
— frontmatter, body sections, links, the coverage ledger, and the sketch order
from projects.json — gets inlined as `window.IMAGINATION`.

Two independent things get baked, and the difference matters:

  * the entity GRAPH  — what the layer knows, from the markdown frontmatter
  * the coverage LEDGER — what the layer has *read*, from imagination/coverage.md

SPEC §8.1 is explicit that the second cannot be derived from the first: §7.1
leaves a once-seen signal as a note, so a correctly-inhaled sketch can produce
zero entities and look, from the graph alone, exactly like one never opened.

Usage:
    python3 daily-sketch/sketch-imagination-layers/build.py [root]

`root` defaults to the sketchbook this file lives in. Pass another checkout to
bake from there (useful while the ledger lives on a different branch).
"""
import os, re, sys, json, datetime

HERE = os.path.dirname(os.path.abspath(__file__))


def find_root(start):
    """Walk up until a directory holding imagination/ turns up.

    The same script runs from daily-sketch/<name>/ and from the numbered piece
    at the sketchbook root, so the depth up to the root is not fixed.
    """
    d = start
    while True:
        if os.path.isdir(os.path.join(d, "imagination")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            return os.path.dirname(start)           # give up; caller degrades
        d = parent


ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else find_root(HERE)
IMAG = os.path.join(ROOT, "imagination")
TYPES = ["threads", "techniques", "themes", "sources", "seeds", "collisions"]
SECTIONS = ["what", "trace", "charge", "prompts", "why unmade"]


def parse_fm(text):
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    if not m:
        return None, text
    fm, body = {}, m.group(2)
    for line in m.group(1).splitlines():
        mm = re.match(r"([\w-]+):\s*(.*)", line)
        if not mm:
            continue
        k, v = mm.group(1), mm.group(2).strip()
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip() for x in v[1:-1].split(",") if x.strip()]
        fm[k] = v
    return fm, body


def split_sections(body):
    """# What / # Trace / # Charge / # Prompts -> {what: "...", ...}"""
    out, cur, buf = {}, None, []
    for line in body.splitlines():
        h = re.match(r"^#\s+(.*)", line)
        if h:
            if cur:
                out[cur] = "\n".join(buf).strip()
            cur, buf = h.group(1).strip().lower(), []
        elif cur:
            buf.append(line)
    if cur:
        out[cur] = "\n".join(buf).strip()
    return {k: v for k, v in out.items() if k in SECTIONS and v}


def listify(v):
    if isinstance(v, list):
        return v
    return [v] if v else []


nodes, seen = [], set()
for folder in TYPES:
    d = os.path.join(IMAG, folder)
    if not os.path.isdir(d):
        continue
    for fn in sorted(os.listdir(d)):
        if not fn.endswith(".md"):
            continue
        fm, body = parse_fm(open(os.path.join(d, fn), encoding="utf-8").read())
        if not fm or "id" not in fm:
            continue
        nid = fm["id"]
        seen.add(nid)
        nodes.append({
            "id": nid,
            "type": fm.get("type", folder.rstrip("s")),
            "title": fm.get("title", nid.split("/")[-1].replace("-", " ")),
            "state": fm.get("state", "active"),
            "charge": fm.get("charge", "medium"),
            "date": fm.get("date", ""),
            "tags": listify(fm.get("tags")),
            "spawned": listify(fm.get("spawned")),
            "feeds": listify(fm.get("feeds")),
            "sources": listify(fm.get("sources")),
            "pair": listify(fm.get("pair")),
            "sections": split_sections(body),
            "file": "imagination/%s/%s" % (folder, fn),
        })

# Links between entities. `feeds`, `sources` and `pair` all point at entity IDs;
# some are stale (an old `veins/` prefix), so remap onto what actually exists.
alias = {}
for nid in seen:
    alias[nid.split("/")[-1]] = nid

links, ldone = [], set()
for n in nodes:
    for key in ("feeds", "sources", "pair"):
        for raw in n[key]:
            tgt = raw if raw in seen else alias.get(raw.split("/")[-1])
            if not tgt or tgt == n["id"]:
                continue
            k = tuple(sorted((n["id"], tgt)))
            if k in ldone:
                continue
            ldone.add(k)
            links.append({"source": n["id"], "target": tgt, "kind": key,
                          "stale": raw != tgt})

# One-line blurbs for the indexed pieces, keyed by folder name.
blurbs = {}
pj = os.path.join(ROOT, "projects.json")
if os.path.exists(pj):
    for p in json.load(open(pj, encoding="utf-8")):
        sid = p.get("id", "")
        if sid:
            blurbs[sid] = p.get("description", "").split("—")[0].strip()

# Daily sketches have no number to sort by, so recency comes from the dates in
# the daily-sketch index. Indexed pieces don't need this — their NN- prefix is
# already the making order.
daily_dates = {}
di = os.path.join(ROOT, "daily-sketch", "index.html")
if os.path.exists(di):
    for m in re.finditer(r"\['(\d{4}-\d{2}-\d{2})',\s*'([a-z0-9-]+)'",
                         open(di, encoding="utf-8").read()):
        daily_dates[m.group(2)] = m.group(1)


def parse_coverage(path):
    """coverage.md -> ordered [(tier, id, inhaled, outcome, [entity ids])].

    Two pipe tables under `## Indexed pieces` and `## Daily sketches`. The
    outcome column is prose written by /inhale, so it's matched by prefix, not
    equality — `covered-by 85-agent-stream-glyphs` and `blocked: no
    interface.md` both carry their reason inline.
    """
    if not os.path.exists(path):
        return []
    tier, out = "indexed", []
    for line in open(path, encoding="utf-8"):
        line = line.rstrip("\n")
        if line.startswith("## "):
            tier = "daily" if "daily" in line.lower() else "indexed"
            continue
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 4:
            continue
        sid = cells[0].strip("`").strip()
        if sid in ("sketch", "") or set(sid) <= set("-: "):
            continue                                   # header / separator
        outcome = cells[2]
        state = next((k for k in ("harvested", "no-signal", "covered-by",
                                  "blocked", "pending") if outcome.startswith(k)),
                     "unknown")
        touched = re.findall(r"`([a-z]+/[a-z0-9-]+)`", cells[3])
        extra = re.match(r"\+(\d+)$", cells[3].split(",")[-1].strip())
        out.append({
            "id": sid, "tier": tier,
            "inhaled": cells[1] if cells[1] != "—" else "",
            "state": state,
            "detail": outcome[len(state):].strip(" :") if state != "unknown" else outcome,
            "touched": touched,
            "touched_more": int(extra.group(1)) if extra else 0,
        })
    return out


# The sketchbook floor. When the coverage ledger exists it defines the universe
# — it is the only file that knows about daily sketches and about reads that
# produced nothing. Without it, fall back to the indexed pieces alone.
ledger = parse_coverage(os.path.join(IMAG, "coverage.md"))
if ledger:
    sketches = ledger
else:
    indexed = sorted((s for s in blurbs if re.match(r"\d", s)),
                     key=lambda s: (int(re.match(r"\d+", s).group()), s))
    sketches = [{"id": s, "tier": "indexed", "state": "unknown",
                 "inhaled": "", "detail": "", "touched": [], "touched_more": 0}
                for s in indexed]

for s in sketches:
    s["desc"] = blurbs.get(s["id"], s["id"].replace("sketch-", "").replace("-", " "))
    s["made"] = daily_dates.get(s["id"].split("/")[-1], "")

# `spawned:` sometimes carries a `daily-sketch/` prefix the ledger keys without,
# so every id is matched on its last path segment.
stem = lambda s: s.split("/")[-1]

# Read the capture manifest early — it is a second, independent list of which
# sketches exist, and the ledger can lag behind it.
VIDEO_PIECE = "83-video-index"
LOCAL = find_root(HERE)
_gj = os.path.join(LOCAL, VIDEO_PIECE, "assets", "gallery.json")
gallery_pre = json.load(open(_gj, encoding="utf-8")) if os.path.exists(_gj) else []

# Anything an entity claims to have spawned that the ledger doesn't list still
# needs a slot, or its filament has nowhere to land.
known = {stem(s["id"]) for s in sketches}
for extra in sorted({x for n in nodes for x in n["spawned"] if stem(x) not in known}):
    sketches.append({"id": extra, "tier": "daily", "state": "unknown",
                     "inhaled": "", "detail": "", "touched": [], "touched_more": 0,
                     "made": daily_dates.get(stem(extra), ""),
                     "desc": stem(extra).replace("sketch-", "")})

# A sketch can exist and be captured before coverage.py has generated its row —
# a piece added since the ledger was last regenerated. Show it rather than
# silently dropping it; `unknown` already reads as "not in the ledger".
for g in sorted(gallery_pre, key=lambda x: x["slug"]):
    if stem(g["slug"]) in known:
        continue
    known.add(stem(g["slug"]))
    sketches.append({"id": g["slug"], "tier": g.get("tier", "indexed"),
                     "state": "unknown", "inhaled": "", "detail": "",
                     "touched": [], "touched_more": 0,
                     "made": daily_dates.get(stem(g["slug"]), ""),
                     "desc": blurbs.get(g["slug"], "")})

# Reverse index: which entities name each sketch in `spawned`. The ledger's
# `touched` column is truncated for readability, so the graph fills it back in.
for s in sketches:
    k = stem(s["id"])
    s["spawned_by"] = sorted(n["id"] for n in nodes
                             if any(stem(x) == k for x in n["spawned"]))

# Poster / loop per sketch, borrowed from the 83-video-index capture pipeline
# rather than duplicated. Paths are stored relative to THIS page so the same
# data.js works from daily-sketch/<name>/ and from the numbered piece.
# Media resolves against the checkout this page is served from, not the data
# root — the page can only load files that sit under its own tree.
media_base = os.path.relpath(os.path.join(LOCAL, VIDEO_PIECE), HERE).replace(os.sep, "/")
gallery = {g["slug"]: g for g in gallery_pre}

for s in sketches:
    g = gallery.get(s["id"]) or gallery.get(stem(s["id"]))
    s["poster"] = "%s/%s" % (media_base, g["poster"]) if g and g.get("poster") else ""
    s["video"] = "%s/%s" % (media_base, g["video"]) if g and g.get("video") else ""
    # `disabled` in the gallery means the harness could not drive the sketch —
    # webcam, mic, or a build step. The poster is still real.
    s["media_disabled"] = bool(g and g.get("disabled"))

payload = {
    "generated": datetime.date.today().isoformat(),
    "root": os.path.basename(ROOT),
    "has_ledger": bool(ledger),
    "has_media": bool(gallery),
    "nodes": nodes,
    "links": links,
    "sketches": sketches,
}

out = os.path.join(HERE, "data.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("// generated by build.py — do not edit\nwindow.IMAGINATION = ")
    json.dump(payload, f, ensure_ascii=False, indent=1)
    f.write(";\n")

stale = sum(1 for l in links if l["stale"])
tally = {}
for s in sketches:
    tally[s["state"]] = tally.get(s["state"], 0) + 1
print("%s\n  root %s\n  %d entities, %d links (%d remapped)\n  %d sketches — %s"
      % (out, ROOT, len(nodes), len(links), stale, len(sketches),
         ", ".join("%d %s" % (v, k) for k, v in sorted(tally.items(), key=lambda kv: -kv[1]))))
if not ledger:
    print("  no imagination/coverage.md — coverage view unavailable")
withmedia = sum(1 for s in sketches if s["video"])
print("  media — %d posters, %d loops (from %s)"
      % (sum(1 for s in sketches if s["poster"]), withmedia, VIDEO_PIECE)
      if gallery else "  no %s/assets/gallery.json — gallery unavailable" % VIDEO_PIECE)
