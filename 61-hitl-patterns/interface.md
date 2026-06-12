# Day 61: Human-in-the-Loop Patterns

## Idea
Four patterns for placing humans in agentic systems, ordered along one autonomy axis

## Description
A companion page to day 60 that isolates a single dimension: where the human sits relative to an autonomous agent. Four patterns run from maximum control to full independence — Approval Gate (halt before irreversible actions; deterministic, action-driven), Interrupt on Uncertainty (agent self-monitors confidence and escalates with a specific question; probabilistic, query-driven), Post-hoc Review (agent runs at full speed, outputs staged in a review buffer, human commits or rejects), and Async Audit (full autonomy with structured trace logs, anomaly flags, and rollback as the safety net).

Each pattern gets prose, design bullets, and a playable scripted demo with concrete stakes: a deploy pipeline freezing at a prod-push approval dialog (47,000 users, IRREVERSIBLE in red); a clinical assistant whose confidence meter drops to 38% over conflicting eGFR values and asks the human which lab result to trust; a 48-document contract batch staged, two committed, one rejected and requeued with corrective context; a trace log where an auditor flags a 91,847-record bulk export to an unapproved S3 bucket and triggers rollback.

Like day 60, the demos are deterministic `pause()`-choreographed DOM sequences — no model, no backend. The page argues its taxonomy through the demos: the gate reviews an action, the interrupt answers a question, the review judges output, the audit reads history.

## Data Concepts
- **Primary**: Temporal (scripted oversight sequences — gates, interrupts, staged batches, audit trails)
- **Secondary**: Statistical (confidence thresholds, anomaly detection against run history)

## Conceptual Tags
#human-in-the-loop #autonomy-spectrum #approval-gates #uncertainty-calibration #oversight #auditability #irreversibility

## Technical Tags
#vanilla-js #dom-animation #async-await #scripted-demos #css-custom-properties

## Stack
- Vanilla JavaScript, no framework — same `pause()` + widget-builder approach as day 60
- ~340-line app.js, four handlers wired to play buttons by `data-target`
- Static HTML for all pattern prose; JS only drives the demo panels
- Dark terminal aesthetic shared with day 60

## Notes
- a deliberate spin-off: day 60's checkpoint and confidence-gated patterns expanded into a dedicated single-axis taxonomy
- the key distinction the page draws: approval gates fire on action type (deterministic), interrupts fire on ambiguity (calibration-dependent) — different triggers, different failure modes
- each demo picks a domain where the pattern's cost is legible: prod deploys, warfarin dosing, legal contracts, bulk data exfiltration
- the async-audit demo quietly notes the trade: errors propagate before detection, so rollback must be a first-class primitive
