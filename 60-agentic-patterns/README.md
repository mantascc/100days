# Agentic Patterns

An interactive browser-based reference for agentic AI system design patterns — how agents reason, act, remember, and collaborate. 37 patterns across 7 dimensions, each with a web/native UX expression.

## Groups

### Reasoning & Planning
**Prompt Chaining** — Sequential LLM calls where each pass narrows or transforms the output of the previous. One model, one thread, no coordination overhead.

**ReAct** — Interleaves reasoning traces with tool calls: think, call a tool, observe the result, think again. The backbone of most agents.

**Plan-and-Execute** — Separates planning from execution. A planner decomposes the goal upfront; an executor works through steps, optionally with its own ReAct loop.

**Tree of Thoughts** — Branching + backtracking reasoning. Agent explores multiple candidate paths, scores each branch, and prunes dead ends.

**State Machine** — Agent operates through explicit states and labeled transitions. Current state determines which actions are available.

---

### Grounding & Action
**Tool Use / Function Calling** — Agent operates on a typed schema of tools. Model selects a tool, fills in parameters, gets results injected back as observations.

**Sandboxed Execution** — Code runs in an isolated environment with no access to host filesystem, network, or env vars. Output safely captured and returned.

**Agentic RAG** — Agent steers retrieval: decides what to fetch, evaluates chunk relevance, refines its query, and iterates until context is sufficient.

**Citation / Attribution** — Every claim linked to a retrieved source. A verification pass checks accuracy. Ungrounded claims flagged as uncertain.

---

### Memory & Knowledge
**In-Context Memory** — The active prompt window. Zero latency, bounded by context length, lost when the session ends.

**Context Distillation** — When the context window fills up, agent compresses older history into a dense summary block and continues from there.

**Semantic Memory** — Agent-curated structured fact storage. Profile model (single JSON) or collection model (many narrow documents).

**Episodic Memory** — Persistent log of past runs and outcomes. Agent retrieves relevant episodes before acting to avoid known failure modes.

**Procedural Memory** — Operating instructions stored as updateable text. Agent evaluates its own process and writes better procedures over time.

**External Memory (RAG)** — Documents chunked, embedded, and retrieved by nearest-neighbor search. Static: one retrieval pass, then generate.

**Memory Write Strategies** — Hot path (synchronous, immediate) vs background (async, eventual). Trades latency for consistency.

---

### Quality & Verification
**Reflection / Self-Critique** — Agent evaluates its own output against criteria and retries if score falls below threshold. Same model generates and critiques.

**Evaluator-Optimizer** — Two separate LLMs: one generates, one evaluates with structured feedback. Not a self-loop — separate roles, separate prompts.

**Debate / Critique** — Two agents argue opposing positions; a judge synthesises a resolution. Surfaces assumptions a single agent misses.

**Guardrails** — Validation layer on every input and output. Passive mode flags; active mode blocks and escalates. Always on, not event-driven.

---

### Multi-Agent Coordination
**Pipeline** — Output of one agent becomes input to the next. Single well-defined transformation per stage. Failed stage halts the pipeline.

**Fan-out / Parallel** — Orchestrator dispatches N independent chunks simultaneously. Collects results when all complete, then reduces.

**Routing / Triage** — Classify the request and dispatch to the right specialist. Pure dispatch — once routed, the classifier is done.

**Orchestrator + Subagents** — One coordinator delegates focused subtasks to specialists and synthesises outputs into a final result.

**Hierarchical** — Multi-level delegation tree: manager → supervisors → workers. Each tier receives only the context it needs.

**Handoff** — Explicit transfer of control and conversation state from one specialist to the next. State packet travels with the handoff.

**Swarm / Decentralised** — Agents communicate peer-to-peer with no central coordinator. Resilient — no single point of failure.

**Event-Driven / Actor Model** — Each agent has an inbox queue and processes messages independently. No blocking — fully async.

---

### Control Flow & Reliability
**Retry with Fallback** — Classify failures as transient (retry with backoff) or structural (fallback strategy). Avoids hitting the same wall repeatedly.

**Checkpoint / Approval Gate** — Agent runs autonomously until an irreversible action is reached. Surfaces plan to human and waits for approval.

**Confidence-Gated Autonomy** — Agent scores its own confidence before acting. Below threshold: escalate. Above: proceed. Thresholds vary by action type.

**Speculative Execution** — Spawn N agents with different strategies in parallel. First to succeed wins; remaining branches cancelled.

**Prompt Caching** — Cache repeated long prefixes (system prompt, tool schemas, document context) across calls. Significant latency and cost reduction.

---

### Coding Agent Patterns
**Code → Test → Fix Loop** — Write code, run tests in sandbox, parse failures, apply targeted patches, repeat. The tightest feedback loop in coding agents.

**Linter-in-the-Loop** — Static analysis after code generation and before execution. Lint errors parsed and fed back as observations for targeted fixes.

**Scaffolded Execution** — Agent writes code into an isolated runtime, executes it, and reads stdout/stderr/exit code as structured observations.

**Git-Aware Agent** — Agent reads git log, diff, and blame as context before acting. Understands what changed and why, not just the current state.
