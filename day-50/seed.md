# Execution Graph

## Concept

A single AI response is not a monolithic event — it's a **traversal through a graph of capabilities**. The execution graph makes this visible.

- **Skill graph** = possibility space. All capabilities and their potential connections.
- **Execution trace** = the specific path lit up by one prompt. A subgraph. A diagram.
- **Data flow** = what moves between steps. The payload on each edge.

Graph is territory. Diagram is journey. View is lens.

## Core Structure

Three layers, always:

```
skill_graph    → nodes: skills, edges: potential connections (enables, chains_into, validates_via)
execution_trace → ordered steps with: skill, action, input, output, duration, triggered_by
data_flow       → from/to/payload — what actually moved between steps
```

A step is not just "which skill" but **why it fired** — triggered_by links create the causal chain. Parallel branches (multiple steps sharing the same trigger) reveal concurrency. Backward edges (validates_via) reveal loops.

## Schema

```json
{
  "meta": {
    "id": "string",
    "prompt": "string",
    "timestamp": "ISO-8601",
    "total_duration_ms": "number",
    "skills_used": ["skill_id"],
    "status": "completed | failed | partial"
  },
  "skill_graph": {
    "nodes": [
      { "id": "string", "type": "skill", "label": "string" }
    ],
    "edges": [
      { "source": "skill_id", "target": "skill_id", "type": "delegates_to | chains_into | feeds_data_to | produces | validates_via" }
    ]
  },
  "execution_trace": [
    {
      "step": "number",
      "id": "string",
      "skill": "skill_id",
      "action": "string",
      "input": { "type": "string", "value": "any" },
      "output": { "type": "string", "value": "any" },
      "duration_ms": "number",
      "triggered_by": "step_id | [step_id] | null",
      "reason": "string (optional — why this step exists)"
    }
  ],
  "data_flow": [
    { "from": "step_id", "to": "step_id", "payload": "string" }
  ]
}
```

## Edge Types

**Skill graph edges** (potential):
- `delegates_to` — reasoning hands off to a specialized skill
- `chains_into` — output of one skill becomes input trigger for next
- `feeds_data_to` — data transfer without activation dependency
- `produces` — creates an artifact or deliverable
- `validates_via` — backward edge, feedback loop, quality check

**Data flow edges** (actual):
- Always directed, always carry a payload description
- Multiple inputs converge at merge nodes
- Branching outputs indicate parallel delegation

## Patterns to Detect

- **Fan-out**: one step triggers many (task decomposition)
- **Fan-in**: many steps feed one (data merge / synthesis)
- **Linear chain**: sequential deepening (search → fetch → process)
- **Loop**: validation cycle (execute → check → re-search → re-execute)
- **Orphan**: skill activated but output unused (wasted work)
- **Bottleneck**: single step with highest duration blocking downstream
- **Parallel branches**: steps sharing same trigger (concurrent execution)

## Visual Encoding

```
Node position   → topological order (top to bottom = time flow)
Node color      → skill type
Node size       → duration (optional)
Edge color      → inherits from source node skill
Edge thickness  → payload size or importance (optional)
Edge curvature  → distinguish overlapping paths
Opacity         → dim unconnected on hover, highlight active path
Ring animation  → selected / inspected node
```

## Layers of Reading

**Execution view**: what happened, in what order, how long
**Data flow view**: what moved where, payload lineage
**Skill map view**: which capabilities were used vs. available
**Decision view**: where branches occurred and why (reason field)
**Performance view**: duration heatmap, bottleneck identification

## Design Principles

- The graph is always a **subgraph** of the full skill graph — show both: the lit path and the dim possibility space behind it
- Every node answers: **what skill, what action, what came in, what went out, how long, why**
- Parallel branches should be visually parallel (same y-position)
- Backward edges (validation loops) are the most interesting — make them visually distinct
- The prompt is the root. The delivered artifact is the leaf. Everything between is the reasoning made structural.

## Open Questions

- Can users **replay** an execution trace step by step?
- Can two execution traces be **diffed** — same prompt, different paths?
- What does a **failed** execution look like? Where does the graph break?
- Can the user **intervene** mid-execution — redirect the graph while it's being traversed?
- How does this connect to observability dashboards for production agent systems?

## Connections

- → Skill graph as knowledge graph (skills = entities, edges = semantic relationships)
- → Dependency graph (triggered_by = depends_on)
- → Context Companion (real-time rendering of this trace as it happens)
- → Agent schema / sys7em (objects = skills, relationships = edges, views = lenses on execution)
- → Diagram vs. graph distinction (execution = diagram, skill map = graph)