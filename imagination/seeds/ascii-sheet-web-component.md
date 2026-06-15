---
id: seeds/ascii-sheet-web-component
type: seed
title: ASCII sheet web component
state: dormant
charge: medium
spawned: [78-ascii-sheets-docs]
date: 2026-06-14
tags: [ascii, web-component, tooling]
---

# What
Package the ASCII-sheet primitive as a real custom element — `<ascii-sheet>` — with an embed API so any page could drop in a field-rendered glyph block declaratively. Proposed while documenting the sheets but not implemented. The desire is to turn a repeated house-style technique into a distributable component: write the field once, reuse it everywhere, let others embed it. It's the ASCII vein wanting to escape the sketchbook and become a shippable artifact.

# Trace
- [78-ascii-sheets-docs](../../78-ascii-sheets-docs/) — where the `<ascii-sheet>` API was sketched in prose, not code.

# Charge
Medium — clearly desirable and well-scoped, but it's tooling work rather than play, so it keeps losing to the next day's sketch. Intact and ready.

# Prompts
- Ship the minimal `<ascii-sheet field="sine">` and nothing else — prove the embed.
- A component gallery page that is itself built only from `<ascii-sheet>` elements.
- Let the field be a slot's text content, so the markup *is* the source signal.
