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

Every token in this table is a **text** colour and every one of them clears
4.5:1 on `--ground-void` through `--ground-surface`. See [Contrast](#contrast).

| Token | Hex | Usage | Status |
|-------|-----|-------|--------|
| `--text-primary` | `#ffffff` | Titles, essential | active |
| `--text-default` | `#f5f5f7` | Body text | active |
| `--text-secondary` | `#a8aab8` | Labels, metadata | active |
| `--text-tertiary` | `#8f919d` | Hints, disabled | active |
| `--text-ghost` | `#80828d` | The quiet floor — smallest type, HUDs | active |

**Revised 2026-08-09.** `--text-tertiary` was `#666666` (3.45:1) and
`--text-ghost` was `#333333` (1.57:1) — the two most-used text colours in the
sketchbook, at 489 and 252 `color:` declarations respectively, and both
illegible. `--text-ghost` was documented as "barely visible", which read as
permission; in practice it carried 9–10px HUD labels, the type that needs the
*most* contrast. Both were raised to the floor above.

`#333333` remains a good hairline. Where `--text-ghost` was used for a
`border-color`, `background`, or `stroke` rather than for text, move it to
`--border-default` — those uses were never about legibility.

# Contrast

Restraint is a colour decision, not a legibility budget. `quiet-over-loud`
earns quiet through *hue and weight*, never by making type unreadable.

| Token | void `#0a0a0a` | surface `#1a1a1a` | modal `#242424` |
|-------|---------------|-------------------|-----------------|
| `--text-primary` | 19.80 | 17.40 | 15.52 |
| `--text-default` | 18.18 | 15.98 | 14.26 |
| `--text-secondary` | 8.59 | 7.55 | 6.73 |
| `--text-tertiary` | 6.32 | 5.56 | 4.96 |
| `--text-ghost` | 5.18 | 4.55 | 4.06 |

Rules:

1. **No text token below 4.5:1** on the ground it sits on. `--text-ghost` is
   the floor; there is nothing quieter that is still text.
2. **Type under 12px may not go below `--text-tertiary`.** Small type needs
   more contrast, not less — the old ramp had this exactly backwards.
3. `--text-ghost` on `--ground-modal` lands at 4.06. On that ground only, step
   up to `--text-tertiary`.
4. Structural tokens (`--border-*`, `--stroke-ghost`) are exempt — they draw
   lines, not language. Never set `color:` from one.

A near-black ground compresses the legible range into roughly `#808080`–
`#ffffff`, so the lower ramp has less separation than it looks like it should.
That is the ground's constraint, not a reason to reach below the floor.

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
