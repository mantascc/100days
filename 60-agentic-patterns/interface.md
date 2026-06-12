# Day 60: Agentic Patterns

## Idea
37 agentic AI design patterns, each with a playable scripted UX demo

## Description
An interactive browser reference for agentic system design — how agents reason, act, remember, and collaborate. 37 patterns across 7 groups (Reasoning & Planning, Grounding & Action, Memory & Knowledge, Quality & Verification, Multi-Agent Coordination, Control Flow & Reliability, Coding Agent Patterns), each presented as prose plus bullets plus an "expression": a terminal-chrome panel with a play button that runs a choreographed simulation of the pattern in action.

Every demo is a deterministic fake — no LLM calls, just `await pause(ms)` sequencing DOM insertions. ReAct plays out as thought/action/observation messages; Tree of Thoughts scores and prunes branches on progress bars; context distillation fills a token meter, fades old messages, and replaces them with a summary block; swarm and event-driven patterns fill per-agent inbox queues; checkpoint surfaces an approve/deny dialog; prompt caching shows hot/cool token bars with cost math.

The 1500-line `app.js` builds all 37 handlers from a small shared widget vocabulary — `addMsg`, `addTask`, `addProgress`, `addTl`, `addKv`, `addSearchResult`, `addAgentCard`, `addStages` — which is what keeps the demos visually coherent. `patterns-dataset.json` holds the design source: 37 entries with an `expression` name and an `expression_detail` paragraph specifying each visualization before it was coded.

## Data Concepts
- **Primary**: Temporal (scripted event sequences simulating agent runs)
- **Secondary**: Network (coordination topologies — pipelines, hierarchies, swarms, handoffs)

## Conceptual Tags
#agentic-systems #design-patterns #pattern-language #llm-agents #orchestration #memory-architectures #simulation-as-documentation

## Technical Tags
#vanilla-js #dom-animation #async-await #json-dataset #single-page #css-custom-properties

## Stack
- Vanilla JavaScript, no framework — async functions choreographed with a `pause()` promise helper
- Hand-built DOM widget vocabulary (~15 builder functions) shared across all demos
- `patterns-dataset.json` as the pattern catalog / demo spec
- CSS custom properties, dark terminal aesthetic with `#00a8ff` accent

## Notes
- the demos document behavior the way pseudocode documents algorithms: each one fakes a plausible run (ETH price lookup, N+1 audit fan-out, git-blame root-causing) with concrete numbers
- the dataset's `expression_detail` fields read as specs the handlers then implement — design-first, dataset-as-source-of-truth
- one shared widget set across 37 demos is the constrained-variation move applied to UI: hold the vocabulary constant so the patterns themselves differ
- the checkpoint / approval-gate / confidence demos seed day 61, which expands human oversight into its own four-pattern page
