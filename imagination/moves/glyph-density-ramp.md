---
id: moves/glyph-density-ramp
type: move
title: Glyph density ramp
state: active
charge: medium
spawned: [53-ascii-grid, 55-ascii-loading, 66-ascii-field-gallery, 72-snapshots-v2, 77-ascii-sheet-documentation, 78-ascii-sheets-docs]
feeds: [veins/ascii-and-text-rendering]
sources: []
date: 2026-06-14
tags: [ascii, glyph, mapping, quantise]
---

# What
Map a continuous 0..1 field across an ordered set of glyphs — from sparse (` . :`) to dense (`@ # █`) — so brightness becomes character. It's the engine under the entire ASCII vein: any field, sine, interference, image, audio, becomes text once it's run through the ramp. The craft is in choosing and ordering the glyph set so the perceived density is monotonic — a poorly ordered ramp banks and banks.

# Trace
- [53-ascii-grid](../../53-ascii-grid/) — the ramp in its founding use.
- [66-ascii-field-gallery](../../66-ascii-field-gallery/) — one ramp across many fields.
- [72-snapshots-v2](../../72-snapshots-v2/) — ramp applied to captured frames.
- [77-ascii-sheet-documentation](../../77-ascii-sheet-documentation/) — ramp as documented primitive.

# Charge
The quiet workhorse of the ASCII house style — refined and reusable, bordering on a personal standard.

# Prompts
- A ramp built from a single typeface's full glyph set, sorted by ink coverage.
- Per-region ramps: different alphabets for different parts of the field.
- A ramp that animates — the glyph set itself cycling under the field.
