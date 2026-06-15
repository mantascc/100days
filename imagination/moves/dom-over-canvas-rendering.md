---
id: moves/dom-over-canvas-rendering
type: move
title: DOM over canvas rendering
state: active
charge: medium
spawned: [01-entropy, 23-interactive-typography, 25-spotlight-grid, 53-ascii-grid, 55-ascii-loading, 61-hitl-patterns, 62-terminal-cli]
feeds: [veins/ascii-and-text-rendering, veins/generative-typography-and-text]
sources: []
date: 2026-06-14
tags: [dom, css, rendering, constraint]
---

# What
Render generative work in pure DOM — `<span>`, `<pre>`, CSS transforms — with a deliberate "no canvas" rule. The constraint forces a different aesthetic: everything is selectable text, inspectable in devtools, and inherits the browser's typographic machinery. It pairs naturally with the ASCII and typography veins, where the medium *is* characters, and it produces a distinctly crisp, document-like quality that canvas pixels can't fake.

# Trace
- [53-ascii-grid](../../53-ascii-grid/) — a field rendered as a `<pre>` block.
- [23-interactive-typography](../../23-interactive-typography/) — per-letter `<span>` manipulation.
- [25-spotlight-grid](../../25-spotlight-grid/) — CSS masks instead of canvas compositing.
- [55-ascii-loading](../../55-ascii-loading/) — animated text nodes as loader.
- [61-hitl-patterns](../../61-hitl-patterns/) — entire UI built from a tiny `mk()` element factory, no canvas.
- [62-terminal-cli](../../62-terminal-cli/) — DOM-appended line nodes as the terminal's output stream.

# Charge
A pointed, identity-forming constraint — the "no canvas" rule keeps the work honest and legible. Limited by performance ceilings on big fields.

# Prompts
- A DOM-only particle system — thousands of spans, see where it breaks.
- Selectable generative art: the artwork is also copy-pasteable text.
- Use CSS `@property` and transitions as the entire animation engine.
