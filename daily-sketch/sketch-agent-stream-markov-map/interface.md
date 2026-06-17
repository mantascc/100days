# sketch-agent-stream-markov-map

## idea
A library of agent streaming patterns rendered as small Markov walks — each pattern is a state machine over agent states with transition weights as edge ink; bundled tool calls read as stochastic merges in the graph, not UI affordances.

## patterns
Eight state-machine patterns from [agent-patterns.md](../agent-patterns.md):

| # | Pattern | Graph shape |
|---|---|---|
| 12 | Single tool call (pending → running → done) | 3-node linear |
| 14 | Parallel tool bundle | fan-out + fan-in |
| 15 | Sequential tool chain | DAG with dep edges |
| 17 | Tool error + retry | self-loop |
| 18 | Permission/approval mid-stream | absorbing gate |
| 19 | Nested sub-agent spawn | recursive subgraph |
| 43 | Agent handoff | hand-off between two graphs |
| 44 | Voting / consensus | fan-in convergence |

## tags
agents, streaming, markov, reference-sheet, networks, brownian, design-system

## stack
vanilla · IBM Plex Mono · SVG · single shared rAF

## motion
Each card runs its own walker on its own graph at its own cadence. Walker leaves a fading trail across edges — frequent transitions glow, rare ones dim. The wall reads as a typology by trail density.

## imagination
- veins/design-system-and-reference-sheets
- sources/brownian-markov
- veins/networks-and-graphs
- /spark 2026-06-16 — Collide strategy
