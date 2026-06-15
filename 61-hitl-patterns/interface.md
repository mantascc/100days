# Day 61: Human-in-the-Loop Patterns

## Idea
Four oversight patterns for agentic systems, ordered along a single axis from maximum human control to full agent autonomy.

## Description
An interactive reference that lays out four ways to place a human in an agent's execution: Approval Gate, Interrupt on Uncertainty, Post-hoc Review, and Async Audit. Each pattern pairs a written explainer (what it is, when it fires, what it suits) with a scripted "play" demo that animates a representative scenario — a deploy pipeline halting at a prod gate, a clinical assistant escalating on conflicting lab values, a document batch staged for review, an audit log flagging an anomalous bulk export and rolling it back. The demos are deterministic timelines built from chained `await pause()` steps, not live simulations; replay re-runs the same choreography. The four sit deliberately on one continuum: the gate is preventive and action-driven, uncertainty is query-driven, review is retrospective per-item, audit is retrospective at scale.

## Data Concepts
- **Primary**: Process (control flow, oversight checkpoints, autonomy gradient)
- **Secondary**: Temporal (scripted event sequences, staged reveals), Decision (approve/reject, escalation, rollback)

## Conceptual Tags
#human-in-the-loop #agentic-systems #oversight #autonomy-axis #approval-gates #uncertainty-calibration #post-hoc-review #async-audit

## Technical Tags
#vanilla-js #dom-construction #async-await #scripted-animation #promise-sequencing #imperative-ui

## Stack
- Vanilla JavaScript, no framework or canvas — pure DOM nodes built via a small `mk()` element factory
- `async`/`await` over `setTimeout`-based `pause()` for timeline choreography
- CSS for the "browser chrome" framing, message bubbles, confidence meters, dialogs, and trace rows

## Notes
- Each pattern reframes the human's role: decision gate (intent) vs. quality gate (output) vs. retrospective auditor (traces). That role distinction is the real content — the autonomy axis is the spine the whole piece hangs on.
- The demos are theatre, not simulation: confidence scores, eGFR conflicts, and the 91,847-record export are hardcoded narrative beats. Reads as a system but commits to nothing dynamic. Worth being honest that this is an explainer, not a working harness.
- Nice detail: the uncertainty demo carries a *specific question* ("which eGFR value?"), not just a confidence number — reinforces the written claim that a good interrupt is query-driven.
- The async-audit demo is the most production-true: it explicitly stages that rollback must be a first-class primitive, and that errors can propagate before detection. That tension (scales well / detects late) is the most interesting unresolved point.
- Open question for a future iteration: could these four be a single composable pipeline rather than four separate exhibits? A real agent might use all four at different action tiers.
- Replay just clears the body and re-runs the same fn — no seed, no variation. Fine for a reference, but a generative variant (random confidence, random anomaly placement) would make repeat viewing richer.
