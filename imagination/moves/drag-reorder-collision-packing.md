---
id: moves/drag-reorder-collision-packing
type: move
title: Drag-reorder with collision packing
state: active
charge: low
spawned: [26-widget-dashboard]
feeds: [veins/grids-as-compositional-frame]
sources: []
date: 2026-06-14
tags: [drag-drop, layout, packing, interaction, ui]
---

# What
Let the user drag elements to reorder them, then *repack* the layout automatically: sort items by position, detect collisions, push intervening items down into a tight stack, and renormalise the order. Position is the source of truth and the array reorders to match. The reusable kernel is the pack loop — sort by row, walk down resolving overlaps — plus a drag handle to separate "grab to move" from "interact with content," and temporary off-DOM elements measured for exact heights before final render.

# Trace
- [26-widget-dashboard](../../26-widget-dashboard/) — a widget dashboard where dragging a card repacks the column with collision-driven push-down.

# Charge
Low — one use, and squarely day-job-flavoured UI mechanics rather than generative play. But it is a genuinely reusable layout primitive: any modular, rearrangeable canvas (dashboards, kanban, tiling) wants exactly this pack loop.

# Prompts
- Apply the pack loop to a *generative* grid — let emergent elements jostle for space.
- Animate the repack so the push-down reads as a physical settling, not a jump.
- Two-axis packing: drag freely, then watch a masonry algorithm reclaim the gaps.
