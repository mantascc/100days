---
id: moves/css-vars-live-controls
type: move
title: CSS vars as live controls
state: active
charge: medium
spawned: [25-spotlight-grid, 26-widget-dashboard, 28-liquid-glass, 43-style-seed, 57-color-themes, 62-terminal-cli, 69-clear-channel, 82-z-axis]
feeds: [veins/design-system-and-reference-sheets]
sources: []
date: 2026-06-14
tags: [css, controls, tokens, ui]
---

# What
CSS custom properties used as a live control surface: a `--var` set once, threaded through styles, and updated from JS or a slider to retune the whole piece without touching the render loop. It collapses the gap between design token and runtime knob — the same property that defines a theme is the one a control mutates. It's the connective tissue of the design-system vein, where every sketch wants to be tweakable.

# Trace
- [43-style-seed](../../43-style-seed/) — a seed feeding a tree of CSS vars.
- [57-color-themes](../../57-color-themes/) — themes as swappable variable sets.
- [69-clear-channel](../../69-clear-channel/) — a token system driven entirely by vars.
- [82-z-axis](../../82-z-axis/) — depth parameters exposed as live properties.
- [26-widget-dashboard](../../26-widget-dashboard/) — an elevation palette and type scale threaded as tokens.
- [62-terminal-cli](../../62-terminal-cli/) — a warm peach terminal palette driven entirely by vars.

# Charge
Increasingly central as the work turns toward systems and toolkits — the natural control plane for tweakable artifacts.

# Prompts
- A piece controlled *only* by editing CSS vars in devtools — no UI at all.
- CSS vars that animate themselves via `@property` — a self-tuning system.
- Expose every var as a URL param so a state is shareable as a link.
