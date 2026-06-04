# Day 80: Network — Multi-Relationship Graph

## Idea
Force-directed graph where each of four relationship types (follows / friends / mentions / blocked) is encoded as its own visual layer, and multiple relationships between the same pair fan out as offset curves.

## Description
A 15-node social-ish network drawn in D3 v7. Four edge types coexist on the same nodes, each with its own color, stroke width, dash pattern, and arrow rule — so the visual language carries meaning beyond color alone. When two nodes share more than one relationship, the edges are not stacked: they're spread symmetrically as quadratic Bézier curves whose midpoints are perpendicular-offset from the straight line, indexed so a bucket of `n` edges spans `[-(n-1)/2 … +(n-1)/2]`.

A legend in the bottom-left doubles as a layer toggle. Clicking a relationship type zeroes that type's link force and hides its edges; the simulation reheats (`alpha = 0.6`) and the layout re-settles around the remaining ties. With friendship on, four clusters form; turn friendship off and the graph dilates into a follow-driven hub structure. The point is to feel how each relationship type contributes to the geometry.

## Data Concepts
- **Primary**: Network (multi-relational graph, edge encoding, force-directed layout)
- **Secondary**: Interaction (layer toggling, drag)

## Conceptual Tags
#network-visualization #multi-relational-graph #force-directed #edge-encoding #layer-toggle #multi-edge-curving #d3 #social-graph

## Technical Tags
#d3-force #svg #quadratic-bezier #pair-bucketing #seeded-prng #arrow-markers #drag-interaction

## Stack
- D3.js v7 (CDN)
- SVG
- Vanilla JavaScript
- IBM Plex Mono
- Inline CSS variables (Clear Channel tokens)

## Mechanics

### Data generation
Deterministic via a seeded LCG (`seed = (seed * 9301 + 49297) % 233280`) so the graph is identical on every load. Each relationship has its own generator:

| Type | Count | Generator |
|---|---|---|
| `follows` | ~22 | Preferential attachment — weight by current in-degree; popular nodes accrue more incoming follows. |
| `friends` | ~12 | Four pre-defined clusters with 65% intra-cluster probability; 3 cross-cluster bridges. |
| `mentions` | ~18 | Random source → one of four "hubs" (`ada`, `jun`, `sol`, `eli`). |
| `blocked` | ~6 | Sparse random. |

### Pair bucketing
All raw links are grouped by an **undirected** pair key (`a|b` with `a < b`) regardless of direction or type. Exact `(source, target, type)` triples are deduped within the bucket. Each surviving link is assigned `curveIdx = i - (n-1)/2` and `pairSize = n`. This produces symmetric offsets around the straight midpoint and means a pair with 3 edges curves out as `[-1, 0, +1]`, a pair with 4 as `[-1.5, -0.5, +0.5, +1.5]`.

### Edge rendering
On every tick:
1. Unit vector from source → target.
2. Both endpoints shrunk by 15px so arrow heads sit at the halo edge, not the node center.
3. If `pairSize === 1` → straight `M…L…` path.
4. Otherwise → quadratic Bézier `M sx,sy Q mx,my tx,ty` where the control point is the midpoint displaced by `curveIdx * 14` along the perpendicular (`-uy, ux`).

### Force simulation
D3 forces:
- `link` — distance 70 for friends, 110 for others; strength 0.9 for friends, 0.35 for others (zeroed when layer off).
- `charge` — `forceManyBody().strength(-260)`.
- `center` — viewport center, re-anchored on resize.
- `collide` — radius 22, prevents node overlap.

Friends gets a shorter distance + stronger strength deliberately — it's what drives the visible clustering.

### Layer toggle
Click a `.legend-item`:
1. Add or remove the type from `activeTypes` (a `Set`).
2. Toggle `.hidden` on matching paths (CSS opacity 0).
3. Re-evaluate `linkForce.strength` — disabled types contribute zero.
4. `sim.alpha(0.6).restart()` to reheat and let the layout re-settle.

### Arrow markers
Two `<marker>` elements in `<defs>` (`arrow-follows`, `arrow-blocked`), `markerUnits: userSpaceOnUse` so the arrow size doesn't scale with stroke width. `marker-end` is applied only to types whose config has `arrow: true`. `mentions` is directed but arrow-less — direction is implied by the data, not drawn.

### Drag
Standard D3 three-phase drag: start fixes position + reheats; drag updates `fx/fy`; end unfixes + cools.

## Parameters
- Nodes: 15
- Link distance: 70 (friends) / 110 (other)
- Link strength: 0.9 (friends) / 0.35 (other) / 0 (disabled)
- Charge: -260
- Collide radius: 22
- Endpoint padding: 15px
- Curve offset per index: 14px
- Reheat alpha: 0.6 on layer toggle, 0.3 on resize / drag start
- PRNG seed: 7

## Visual Language

The four relationships are distinguishable on four dimensions, not just color — so the encoding survives colorblind viewers and low contrast:

| Type | Color | Width | Dash | Arrow | Semantic |
|---|---|---|---|---|---|
| `follows` | blue `#6c8cff` | 1.1 | solid | yes | information / direction |
| `friends` | green `#4ade80` | 1.8 | solid | no | mutual / strong |
| `mentions` | yellow `#f5d76e` | 1.0 | dotted (1 3) | no | soft signal |
| `blocked` | red `#ef4444` | 1.2 | dashed (5 3) | yes | hard stop |

Width carries structural importance (friends is thickest because it shapes the layout most). Dashing carries certainty (dotted = soft, dashed = hard). The legend swatches use CSS pseudo-elements with the same dash rules, so they literally preview the edge style.

## Notes
- Pair bucketing by **undirected** key is the key trick. Bucketing by directed key would draw A→B and B→A as separate straight lines on top of each other.
- The midpoint perpendicular offset assumes the graph isn't too dense per pair. With 6+ relationships between one pair, curvature stacks and the outer arcs swing wide — would need an arc-radius adjustment by `pairSize`.
- `markerUnits: userSpaceOnUse` is important — without it, the thicker friend stroke would balloon its arrowhead.
- Friends as the dominant clustering force is deliberate: when you toggle it off, the layout dilates and the follow-graph's hub structure becomes legible. That contrast is the lesson.
- Mentions deliberately has no arrow despite being directed — it shows that "directed" is a data property, not a rendering imperative. The hub-shape (everything pointing inward) is information enough.
- A seeded PRNG (vs `Math.random()`) makes the visualization stable across reloads — important for teaching, since you can talk about specific nodes.
- The legend doubles as a count display (`02` / `12` / `18` / `22`). Counts surface the density imbalance without requiring a separate histogram.

## Possible Extensions
- Hover a node → highlight its neighborhood, fade everything else.
- Layout swap: force ↔ matrix ↔ arc, same data, three encodings.
- Hover an edge → tooltip with both endpoints and the relationship type.
- Replace the synthetic dataset with a real one (GitHub follows, Twitter mentions, etc.) loaded from JSON.
- Animate edge "flow" — moving dots along directed edges to reinforce direction without arrows.
