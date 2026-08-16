# sketch-imagination-layers

## idea
The `imagination/` layer rendered as a literal stack of planes — one per entity
type, with the coverage ledger as the ground — so structure is browsed spatially
and details are read in place. Two datasets, deliberately kept apart: the entity
graph above, what the layer has actually *read* below.

## tags
graph, network, z-axis, information-design, self-referential, interactive,
dataviz, coverage, video, gallery

## stack
vanilla · IBM Plex Mono · canvas 2D, hand-rolled projection · `build.py` bakes
`imagination/**.md` + `coverage.md` + `projects.json` + the `83-video-index`
gallery manifest into `data.js` (no fetch — the page runs from `file://`)

## motion
Slow auto-yaw on load, killed by the first interaction — the stack introduces
itself, then hands over. Drag orbits (x → yaw, y → tilt); tilt past ~1.38 rad
snaps to flatten, where the focused plane reads top-down as a flat field and the
rest fall away. Camera moves are all critically-damped eases toward a target, so
focus changes glide rather than cut. Selecting anything draws gradient filaments
along its spawn edges — downward from an entity to the sketches it produced,
upward from a sketch to the entities it fed.

## notes

**The stack, bottom to top.** `sketchbook · collisions · seeds · sources ·
themes · techniques · threads` — a gradient from *speculative* to *established*.

The order is an editorial decision, and it was wrong at first. The original ran
made → owned → wanted, which put collisions and seeds on top. But the camera
looks down, so the top of the stack is the nearest and most-read position, and
those are the two thinnest layers in the corpus: 2 and 7 entities, 8 spawn
edges between them, most of it dormant. Threads — 12 entities, **130** of the
249 spawn edges, and the terminus of nearly every link in the graph — sat
buried mid-stack and fourth in the rail.

So the fringe sinks to the bottom, furthest from the eye and partly occluded by
everything above it, and the layers that carry the practice take the near
positions. The cost is that a thread's filaments now fall the full height of
the stack to reach the floor. That turned out to be a gain: you watch an
obsession pass through every other layer on its way to the work it made.

Layer indices are derived from this array rather than hardcoded — `MID_LAYER`
for the camera's rest position, `HOME_LAYER` for where focus and flatten start —
so reordering again is a one-line change.

**The floor is the coverage ledger, not a contact sheet.** SPEC §8.1 is explicit
that coverage cannot be derived from the graph: §7.1 leaves a once-seen signal as
a note, so a correctly-inhaled sketch can produce zero entities and look, from
`spawned:` alone, exactly like one never opened. So the floor reads
`imagination/coverage.md` directly — two bands, indexed pieces above daily
sketches, each tick styled by ledger outcome: filled `harvested`, dim-filled
`no-signal`, **hollow amber `pending`**, small hollow `covered-by`, ghost dot
`blocked`. Amber is the seeds colour on purpose — unread work and unmade desire
are the same kind of debt. Without a `coverage.md` the build falls back to the
indexed pieces alone and the coverage encoding switches off.

**Layout is not arbitrary.** Each plane relaxes deterministically under two
pulls: linked entities drift over one another so cross-plane filaments read
near-vertical, and every entity is dragged toward the centre of mass of the
sketches it spawned. A node ends up hovering above its own output.

**Encoding.** Node area = `spawned` count. Fill alpha = `charge`
(high/medium/low). `state: dormant` renders hollow. Colour = type. The accent
is reserved for selection, not decoration.

**Details in place.** The panel renders the real `What / Why unmade / Charge /
Prompts / Trace` sections from the source markdown, plus a clickable connection
list (walks the graph without losing the camera) and spawn chips tinted by the
coverage state of each sketch they name.

**Both directions.** Selecting an entity drops filaments to the sketches it
spawned; selecting a floor tick runs the same edges *upward* to the entities that
piece of work fed, with its ledger row — outcome, inhale date, what it touched —
in the panel. Spawn chips and connection rows both navigate, so you can walk
graph→floor→graph without touching the camera.

**A third view: the gallery.** `G` (or the rail button) opens a flat contact
sheet of every sketch — poster on load, the loop on hover, lazily fetched so
136 tiles don't pull 136 videos. Filter chips cut it by coverage state, so
`pending` becomes a visual backlog rather than a list of slugs. Click a tile
and it selects that sketch back in the stack. The panel leads with the same
loop, autoplaying, whenever a sketch is open.

It runs **newest first**, opposite to the floor. The floor is a contact sheet
of the work in the order it was made and its layout depends on that; the
gallery is for looking at what exists now, and that wants the most recent
first. Indexed pieces sort on their `NN-` prefix. Daily sketches have no
number, so `build.py` lifts the dates out of the daily-sketch index for them.
Tiers stay grouped under headings rather than interleaved — a numbered piece
and a daily sketch made the same week are not the same kind of thing.

The floor also carries sketches the ledger has not caught up to. A piece can be
made and captured before `coverage.py` next runs, and the gallery would
otherwise be missing the newest thing in it — including, at the time of
writing, this piece.

Media is borrowed, not duplicated: `build.py` reads
`83-video-index/assets/gallery.json` and stores paths **relative to this page**,
so the same `data.js` shape works from `daily-sketch/` and from the numbered
piece. Media resolves against the checkout the page is served from, not the data
root — those can differ, and pointing them at the same tree is how the posters
404'd the first time.

**Filling the gaps.** 14 indexed pieces had no capture. 13 now do — the
scenarios live in `83-video-index/capture/scenarios/`, and `capture.mjs` gained
a `meta.path` so a sketch whose page sits in a subfolder (`44-whiff/canvas-app`,
`47-2gif/2gif`) can be shot at all; both are marked `disabled`, which is honest
— one needs a websocket feed, the other a dropped file. `43-style-seed` stays
uncaptured because it has no `index.html` anywhere: it is a written document.

**Data caveats.** `imagination/graph.json` is stale — 52 nodes, generated
2026-08-01. `build.py` reparses the markdown directly and finds 55, so the
sketch is always current against the folder. It also remaps 7 links whose targets
still carry the old `veins/` prefix, and matches `spawned:` entries on their last
path segment because some carry a `daily-sketch/` prefix the ledger keys without.

## rebuild
```
python3 daily-sketch/sketch-imagination-layers/build.py [root]
```
`root` defaults to this sketchbook. Pass another checkout to bake from there —
used while `coverage.md` still lived on a different branch.

## open
- The floor is ordered by sketch number, so time is already on the ground plane
  — a horizon-on/off toggle could merge this with the barcode timeline in
  `imagination/snapshots/`.
- Filaments currently draw straight. Bowing them would separate overlapping
  runs, but straight lines make the "hovers above its own output" claim legible.
- Nothing yet visualises `log.md` — the exhale history is the one part of the
  layer this view cannot see.
- The capture pipeline now covers daily sketches too — 130 of 135 rows have a
  loop. The five without are honest gaps: `43-style-seed` is a written document
  with no page, `cat-sprite` has no `index.html`, and `92-tube-tolerance` /
  `sketch-torus-sheet` / `sketch-tube-driven` live on branches this one has not
  merged. Most daily scenarios are a generic mouse arc rather than a considered
  interaction; they prove the sketch exists more than they show what it does.
- Gallery tiles are square crops of a 720×720 capture; the wide sketches
  (reference sheets, layout studies) lose their proportions. A 16:9 variant per
  tier might read better than one grid.
- The ledger now carries its first two `no-signal` rows. Whether *read but
  empty* reads differently enough from *harvested* at a glance is still an open
  question — at floor scale they differ only in fill weight.
- The ledger's `touched` column is truncated with `+n`; the panel fills it back
  in from `spawned:` and flags anything named in the ledger that no entity
  claims. That mismatch list should stay empty — it currently does.
