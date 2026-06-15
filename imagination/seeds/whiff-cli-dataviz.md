---
id: seeds/whiff-cli-dataviz
type: seed
title: Whiff — CLI data-viz tool
state: dormant
charge: medium
spawned: [44-whiff]
date: 2026-06-14
tags: [tooling, dataviz, cli]
---

# What
A terminal-to-browser data-visualisation tool: pipe data from the command line and get an interactive chart in the browser. The first cut shipped, but the note "Future: scatter, pie, filtering, zoom/pan" marks a clear backlog of unbuilt capability. The desire is a genuinely useful personal instrument — a fast bridge from CLI data to legible visuals — that outgrows being a sketch and becomes a tool the maker actually reaches for.

# Trace
- [44-whiff](../../44-whiff/) — the working first version, with its roadmap left open.

# Charge
Medium and practical — this one has a chance of becoming real infrastructure rather than art, which is part of its appeal and part of why it stalls against day-job priorities.

# Prompts
- Build just the scatter mode end-to-end and dogfood it on real data this week.
- Make whiff stream — a live chart that updates as the pipe keeps flowing.
- Generative defaults: whiff picks an encoding from the data's shape automatically.
