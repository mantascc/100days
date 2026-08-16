# 94-relationships

## idea
A specimen sheet of relationship *itself*. Sixteen live micro-simulations in a
4×4 grid, each isolating one type of edge and nothing else — same white nodes,
same dark ground, same yellow pulse; only the rule binding the nodes changes.

The thesis, and the only text on the page:

> **a relationship is a constraint on how two things change together.**

A node alone can do anything. An edge is what forbids some of that freedom.
The sheet is an argument that the *type* of a relationship is exactly the shape
of that restriction — which is why the same two dots can sit in almost any cell.

## tags
graph, taxonomy, edges, specimen-sheet, generative, canvas, motion, concept

## stack
vanilla · canvas 2d · CSS grid · IBM Plex Mono · single file, no deps, no interaction

---

## the four rows

Each row asks a different question of the edge.

| row | question | specimens |
|---|---|---|
| **elemental** | what can a single edge *be*? | directed · mutual · asymmetric · ephemeral |
| **temporal** | how does it behave in *time*? | latent · cycle · transitive · broken |
| **structural** | what shapes appear when edges *compose*? | hierarchy · hub · peer · broker |
| **ecological** | what does the edge *do to its ends*? | dependency · mutualism · parasitic · similarity |

Rows 1–2 are properties of a pair. Row 3 is what emerges from many. Row 4 asks
what an edge costs or gives.

## the sixteen

| # | name | one line | how it moves |
|---|---|---|---|
| 01 | **directed** | flow with a direction; A acts on B, B cannot answer | pulse leaves A only; B flashes on arrival, never sends |
| 02 | **mutual** | both ways at once — exchange, handshake | two parallel channels, pulses cross mid-edge, both ends flash together |
| 03 | **asymmetric** | both ways, unequal — most real relationships | three fast pulses one way, one slow dim trickle back; giver drawn larger |
| 04 | **ephemeral** | exists only while it happens — a glance, a transaction | sharp bright contact, then the edge decays to nothing until the next |
| 05 | **latent** | there all along, visible only when they come close | nodes drift; edge and traffic fade in with proximity, out with distance |
| 06 | **cycle** | output returns to origin — feedback, ritual, grudge | one pulse circles A→B→C→A forever, lighting each node in turn |
| 07 | **transitive** | friend of a friend — two edges imply a third | pulse A→B, then B→C, then a *dashed* A→C blooms: inferred, not built |
| 08 | **broken** | an edge that *was* — the stubs remember | pulse still tries, reaches the gap and dies there; a rare flicker crosses |
| 09 | **hierarchy** | one above many, recursively | cascade root→children→grandchildren; tiers light as reached; nothing sideways |
| 10 | **hub** | one speaks, many listen — broadcast | every spoke pulses at once; leaves flash but never talk to each other |
| 11 | **peer** | all equal, all connected — community as full mesh | staggered traffic on every edge; no node is special |
| 12 | **broker** | two worlds joined by one node — power lives in the gap | all crossing traffic passes the broker, who flashes on every handoff, alternating direction |
| 13 | **dependency** | B runs on A | while A transmits, B glows; when A goes quiet, B dims to near nothing |
| 14 | **mutualism** | both are more because the edge exists | nodes breathe and swell together; rings expand; the edge brightens with them |
| 15 | **parasitic** | the edge feeds one by draining the other | flow B→A; A grows, B shrinks and fades; then it resets |
| 16 | **similarity** | no edge at all — yet they move together; correlation | two nodes bob and pulse in perfect sync; the dotted line is deliberately almost invisible |

## the visual grammar

Deliberately tiny, so the *only* variable across cells is the relation:

- **node** — white disc. Size = current "amount" of the thing (only rows 3–4
  vary it). Grey/dim = passive or depleted.
- **edge** — hairline. Ghost grey = structural, exists; brighter = active;
  dashed = inferred; broken = two stubs with a jittering gap.
- **pulse** — accent-yellow comet with a fading tail. Direction of travel *is*
  the direction of influence. Count and speed = weight.
- **glow / flash** — radial bloom on a node the instant a pulse arrives, so
  cause→effect reads at a glance across sixteen cells at once.

Accent is sunset yellow `#f5a623` (was ube, was blue — the yellow reads
warmest against the void and separates best from the white nodes).

## motion
Every cell runs continuously off a shared clock `t` (seconds, clamped ≥ 0 —
rAF's first timestamp can precede `performance.now()` and a negative `t`
indexed a triangle vertex at `-1`). Cycles are chosen so no two cells beat in
sync: 3.2s (ephemeral), 5s (transitive, parasitic), 6s (dependency), plus
free-running phases at 0.5–0.8 Hz. `devicePixelRatio` capped at 2. Sixteen
small canvases rather than one big one, so each specimen is self-contained
and could be lifted out alone.

## responsive
4 columns → 2 below 900px → 1 below 480px. Cells hold 5:4. Header and thesis
footer are fixed; the grid scrolls under them.

## notes
- Grew out of wanting to *understand* relationship as a phenomenon — nodes,
  workflows, segments, communities, people — before drawing any particular
  graph. The move that made it work: stop drawing graphs, draw the *rule*.
- Hover-to-isolate with a per-cell gloss was built and then cut. Sixteen at
  once *is* the piece; isolating one made it a slideshow.
- Everything here is a pair or a small group. Untouched: edges with weight that
  changes over time (learning), edges of edges (meta-relations), and negative
  edges (avoidance, rivalry) — the sheet has no "repel".
- **Open:** the specimens don't interact. The next move is letting them —
  drag a node from one cell into another and watch a new edge type
  reinterpret it — which would turn a taxonomy into an instrument.

## imagination
Lands on
[`threads/design-system-and-reference-sheets`](../imagination/threads/design-system-and-reference-sheets.md)
as a *conceptual* reference sheet rather than a visual one — the same
one-variable-per-cell discipline as
[92-tube-tolerance](../92-tube-tolerance/), applied to an idea instead of a
texture. Sibling of the earlier graph sketches in `daily-sketch/` but the
first to treat the edge, not the node, as the subject. Daily-sketch origin:
`daily-sketch/sketch-relationship-types/`.
