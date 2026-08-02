# sketch-character-sandbox

## Idea
A sandbox holding all 76 theater-rename characters as autonomous agents
floating in space. Each is an anonymous drifting dot with an ID; hover freezes
one and opens its ID card (full information access). A group-highlight layer
lets you light up any grouping while the rest fall back.

## Description
76 agents wander slowly on a canvas (independent low-velocity drift, edge-wrap).
By default they're anonymous — a faint dot + 3-digit ID. Hovering the nearest
agent **freezes** it (halts its motion), draws a freeze ring in its group color,
reveals `NNN · Name`, and materializes an ID card: agent number, status chip,
name, vector, description, function/archive/ontology, and live `x · y · frozen`
coordinates.

**Group highlighting** (v2): a lens switcher — function / archive / ontology /
charge — with a chip legend for the active lens (swatch + label + count).
Clicking chips lights every agent in those groups in the group color and dims
the rest to near-invisible; multiple groups can be highlighted at once; hovering
a chip previews. Highlighting is opt-in, so the default field stays minimal.
The freeze ring recolors to the active lens, so inspect and grouping stay in
sync.

## Data Concepts
- **Primary**: Multi-agent (each character an autonomous drifting agent)
- **Secondary**: Network/Set (group membership across four lenses)

## Conceptual Tags
#agent-field #floating-agents #hover-to-inspect #id-card #group-highlight
#lens-switch #anonymous-until-hover #information-access #drift

## Technical Tags
#canvas #hi-dpi #wander-motion #nearest-pick #dom-overlay-card #single-file

## Stack
- HTML5 Canvas (device-pixel-ratio aware)
- Vanilla JavaScript
- IBM Plex Mono · #0a0a0a ground · muted spectral group palette · ID-card tones
  (borrowed from `84-id-card`)

## Mechanics
- **Agents**: per-agent angle/speed (7–18 px/s) + slow sine steering; wrap at a
  24px margin. Hovered agent is skipped (frozen).
- **Pick**: nearest agent within 20px of cursor.
- **ID card**: DOM panel placed beside the agent, clamped to viewport; refills
  every frame while hovering (coordinates update live).
- **Lenses**: function (Drive/Feel/Guard/Know/Hold/Move/Depth), archive (8
  sections), ontology (Being/Force/Place), charge (Established/Candidate/
  Unrecovered). Each group has a color; chips show counts.
- **Highlight**: `lit = hoverGroup match || highlighted.has(group)`. Lit agents
  render in group color; non-lit dimmed ×0.18; freeze always wins.

## Notes
- Highlighting doubles as a soft identify: lit agents show their names, so a
  lens becomes a legible constellation without needing to hover each one.
- Open threads (offered, not built): flocking/boids motion; cursor repulsion;
  clustering highlighted groups spatially; a "trace" action drawing edges to a
  frozen agent's related characters (became / close to / overlaps).
