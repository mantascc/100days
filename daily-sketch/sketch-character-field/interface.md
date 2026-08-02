# sketch-character-field

## Idea
The 76 figures of the `theater-rename` character archive as one floating node
field, where **grouping is a lens you switch** rather than a fixed structure.
Same cast, re-clustered live around group hubs by whichever question you ask.

## Description
A force-directed field (d3-force) of every character in `characters.md`. In the
default **Free** state there are no hubs — all 76 float as one cloud, one psyche.
Pick a lens and the figures migrate into labelled hubs with animated physics.
Five lenses, five ways to cut the same cast:

- **Free** — no grouping. The undifferentiated cloud.
- **Archive** — the maker's own 8 sections (system vectors, inner characters,
  bar/theater, relational, candidates, personified forces, places, adjacent).
- **Ontology** — Being / Force / Place. What *kind* of thing is it?
- **Function** — the interpretive map: Drive · Feel · Guard · Know · Hold ·
  Move · Depth. The psychological job each figure does, read across the
  archive's own vector labels.
- **Charge** — Established / Candidate / Unrecovered. How solid the figure is,
  echoing the design-system status lifecycle (provisional → active).

Hovering a node dims the field to its cluster and opens a panel with its
subtitle, description, and its membership in **all four** lenses at once — so
you can see how one figure lives differently depending on the question. Nodes
are draggable; the field re-settles.

## Data Concepts
- **Primary**: Network (multi-lens hub-spoke, re-groupable topology)
- **Secondary**: Relational (one entity, many simultaneous groupings)

## Conceptual Tags
#character-map #multi-lens-grouping #force-directed #hub-spoke #re-clustering
#ontology #interpretive-map #status-lifecycle #inner-cast #psyche-as-theater

## Technical Tags
#d3-force #canvas #hi-dpi #pointer-drag #hover-detail #single-file

## Stack
- HTML5 Canvas (device-pixel-ratio aware)
- d3-force v7 from CDN
- Vanilla JavaScript
- IBM Plex Mono · near-black ground · muted spectral accents (design-system core)

## Mechanics
- **Nodes**: 76 persistent character objects; positions carry across lens
  switches so regrouping reads as migration, not teleport.
- **Lens apply**: rebuilds hub nodes (fixed at ellipse anchors) + a link from
  each character to its group hub, then reheats the sim (`alpha 0.9`).
- **Free state**: no hubs/links; charge repulsion + gentle centering →
  one breathing cloud.
- **Encoding**: character = small dot tinted by its current hub's accent (white
  in Free); hub = accent square with faint halo, uppercase label, live count.
- **Interaction**: nearest-node hover picks within 16px → dim-to-cluster +
  detail panel with cross-lens memberships; pointer drag fixes/reheats a node.
- **Physics**: forceManyBody, forceLink (dist 58), forceCollide, forceX/Y
  centering; low alphaMin keeps the settled field faintly alive.

## Notes
- "Interested in any kind of grouping" → the grouping *scheme itself* became the
  interaction, not any single taxonomy.
- Function and Charge lenses are interpretive (assigned by reading each figure's
  vector + description), not present in the source archive — they're the part
  meant to expand the map rather than reproduce it.
- Open threads for a v2: a "polarity" lens pairing each figure with its opposite
  pull (Drive↔Feel, Guard↔Open, Know↔Unknown); a "tongue" lens splitting
  Lithuanian names from English concept-words; edges between *characters* (not
  just to hubs) where the archive states a relation ("became", "close to",
  "may overlap with").
