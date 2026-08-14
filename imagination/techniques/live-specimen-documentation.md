---
id: techniques/live-specimen-documentation
type: technique
title: Live specimen documentation
state: active
charge: high
spawned: [77-ascii-sheet-documentation, 78-ascii-sheets-docs, 85-agent-stream-glyphs, 89-sprite-states, daily-sketch/sketch-field-notes, daily-sketch/sketch-walks-thread]
feeds: [threads/design-system-and-reference-sheets, threads/the-sketchbook-as-its-own-subject]
sources: []
date: 2026-08-09
tags: [documentation, reference, specimen, meta, canvas]
---

# What
Document a move by running it, not by picturing it. A reference sheet is laid
out as a grid of small live canvases, each one an actual instance of the thing
being described, each captioned with the sketch it came from. The specimen is
the documentation — no screenshot, no code block, no prose standing in for
behaviour.

The cost is that a reference sheet becomes a performance: every cell is a real
loop, so the page has a frame budget and the specimens have to be small enough
to coexist. The payoff is that the sheet cannot lie. A static swatch can
describe motion it no longer produces; a running one cannot.

# Trace
- [77-ascii-sheet-documentation](../../77-ascii-sheet-documentation/) — the first sheet built this way.
- [78-ascii-sheets-docs](../../78-ascii-sheets-docs/) — twelve use-cases, all live.
- [85-agent-stream-glyphs](../../85-agent-stream-glyphs/) — hash-seeded animated thumbnails as the index itself.
- [89-sprite-states](../../89-sprite-states/) — four-state atlas with the demo packed alongside the tool.
- [sketch-field-notes](../../daily-sketch/sketch-field-notes/) — specimens cited back to the sketches that spawned them.
- [sketch-walks-thread](../../daily-sketch/sketch-walks-thread/) — seven walks in parallel, each with its leave-condition made legible.

# Charge
High, and arguably the house documentation move now — it has appeared in every
reference artifact since 77. Worth watching for the moment it becomes reflex:
the grid-of-live-cells layout is starting to answer questions before they are
asked, which is how a technique turns into a default.

# Prompts
- A sheet where the specimens *interact* — the cells share one substrate rather than nine isolated loops.
- Documentation that degrades honestly: a specimen that fails to run says so in place, rather than rendering nothing.
- Invert it — a static sheet generated *from* the live specimens, so the print and the page cannot drift apart.
