---
id: collisions/kuramoto-x-bundled-tool-calls
type: collision
title: Kuramoto sync × bundled tool calls
state: dormant
charge: medium
pair: [sources/kuramoto-fireflies, veins/design-system-and-reference-sheets]
proposed: [2026-06-16]
date: 2026-06-16
tags: [agents, streaming, sync, oscillators, bundling]
---

# What
Parallel tool calls as Kuramoto oscillators: each pending call is a phase, the "bundle" is the moment they snap into phase-lock and flush together. Different bundling strategies (eager, windowed, backpressure-driven) become different coupling regimes — visible as the rate at which the field synchronises. The library card for "bundled tool calls" *is* a small Kuramoto field finding its phase.

# Why unmade
Proposed in [/spark 2026-06-16](../log.md) alongside the Brownian-Markov collide; the maker took the Brownian one (and Revive + Press) but skipped this. The trajectory metaphor won over the sync metaphor — for now.

# Charge
Medium on first proposal. Per §7.3, raise on each subsequent dodge.
