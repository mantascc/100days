---
id: tokens/color
type: tokens
title: Color tokens
status: active
tags: [color, ground, accent, named]
---

Status records whether a token has *recurred* across projects (`active`) or
is newer / used in a single instance (`provisional`). Permanence is earned.

# Ground Layers (Elevation)

| Token | Hex | Usage | Status |
|-------|-----|-------|--------|
| `--ground-void` | `#0a0a0a` | Canvas, deepest background | active |
| `--ground-base` | `#0f0f0f` | Primary surface | active |
| `--ground-raised` | `#141414` | Elevated panels | active |
| `--ground-surface` | `#1a1a1a` | Cards, widgets collapsed | active |
| `--ground-float` | `#202232` | Alternative base (cool shift) | provisional |
| `--ground-modal` | `#242424` | Hover states, overlays | active |

# Text

| Token | Hex | Usage | Status |
|-------|-----|-------|--------|
| `--text-primary` | `#ffffff` | Titles, essential | active |
| `--text-default` | `#f5f5f7` | Body text | active |
| `--text-secondary` | `#a8aab8` | Labels, metadata | active |
| `--text-tertiary` | `#666666` | Hints, disabled | active |
| `--text-ghost` | `#333333` | Barely visible | provisional |

# Structural

| Token | Hex | Usage | Status |
|-------|-----|-------|--------|
| `--border-subtle` | `#1a1a1a` | Grid lines, faint dividers | active |
| `--border-default` | `#2a2a2a` | Standard borders | active |
| `--border-strong` | `#3a3d52` | Emphasized dividers | provisional |
| `--stroke-primary` | `#ffffff` | Main geometry | active |
| `--stroke-ghost` | `rgba(255,255,255,0.2)` | Trails, echoes | active |

# Accent (Spectral Singles)

Pick ONE per project. High contrast, intentional.

| Name | Hex | Character | Status |
|------|-----|-----------|--------|
| `--accent-cyan` | `#00ffaa` | Terminal, growth | active |
| `--accent-magenta` | `#ff0066` | Error, alert | active |
| `--accent-blue` | `#00a8ff` | Action, primary | active |
| `--accent-green` | `#00ff88` | Success, trim | provisional |
| `--accent-amber` | `#ffaa00` | Warning, warmth | active |
| `--accent-red` | `#ff0000` | Rare emphasis | provisional |

# Named Colors

Specific colors with provenance or recurring identity across projects.
`active` ones have recurred enough to be part of an instance's identity;
`provisional` ones are tied to a single, newer sketch.

| Name | Hex | Origin | Instance | Status |
|------|-----|--------|----------|--------|
| `ube-violet` | `#7b6fa5` | Ube Kaizen — primary accent, muted purple-violet | [ube-kaizen](../instances/ube-kaizen.md) | active |
| `ube-lavender` | `#9d91b0` | Ube Kaizen — secondary, desaturated lilac | [ube-kaizen](../instances/ube-kaizen.md) | active |
| `ube-terra` | `#9e6240` | Ube Kaizen — tertiary, warm brown terra cotta | [ube-kaizen](../instances/ube-kaizen.md) | active |
| `cph-yellow` | `#ffaa00` | Copenhagen — Aida 01 phase portrait, oscilloscope warmth | [aida](../instances/aida.md) | provisional |

# Overlay

| Token | Value | Usage | Status |
|-------|-------|-------|--------|
| `--overlay-dim` | `rgba(10,10,10,0.85)` | Modal backgrounds | active |
| `--overlay-ghost` | `rgba(255,255,255,0.1)` | Hover states | active |
