# 93-imagination-layers

*Promoted from `daily-sketch/sketch-imagination-layers`.*

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

**The stack, bottom to top.** `sketchbook · sources · techniques · threads ·
themes · seeds · collisions` — a gradient from *what got made* through *what the
practice owns* to *what it still wants*. Seeds and collisions float clear of the
floor because nothing has dropped from them yet; that gap is the point.

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
sheet of every sketch the ledger knows — poster on load, the loop on hover,
lazily fetched so 135 tiles don't pull 135 videos. Filter chips cut it by
coverage state, so `pending` becomes a visual backlog rather than a list of
slugs. Click a tile and it selects that sketch back in the stack. The panel
leads with the same loop, autoplaying, whenever a sketch is open.

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
python3 93-imagination-layers/build.py [root]
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
- The capture pipeline only covers indexed pieces, so all 40 daily sketches sit
  in the gallery as bare `pending` placeholders. They are the larger half of the
  backlog and the half with nothing to look at.
- Gallery tiles are square crops of a 720×720 capture; the wide sketches
  (reference sheets, layout studies) lose their proportions. A 16:9 variant per
  tier might read better than one grid.
- The ledger now carries its first two `no-signal` rows. Whether *read but
  empty* reads differently enough from *harvested* at a glance is still an open
  question — at floor scale they differ only in fill weight.
- The ledger's `touched` column is truncated with `+n`; the panel fills it back
  in from `spawned:` and flags anything named in the ledger that no entity
  claims. That mismatch list should stay empty — it currently does.
