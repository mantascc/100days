---
id: tokens/typography
type: tokens
title: Typography tokens
status: active
tags: [typography, scale, rhythm]
---

# Font Families

```css
--font-mono: 'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', Monaco, 'Courier New', monospace;
--font-system: system-ui, -apple-system, sans-serif;
```

Monospace only in sketches. System for production UI if needed.

| Token | Status |
|-------|--------|
| `--font-mono` | active |
| `--font-system` | provisional |

# Scale

| Token | Size | Usage | Status |
|-------|------|-------|--------|
| `--text-xs` | 10px | Timestamps, labels | active |
| `--text-sm` | 11px | Secondary info | active |
| `--text-base` | 13px | Body text | active |
| `--text-md` | 14px | Primary content | active |
| `--text-lg` | 16px | Headings | active |
| `--text-xl` | 20px | Titles | active |

# Rhythm

| Token | Value | Status |
|-------|-------|--------|
| `--leading-tight` | 1.25 | active |
| `--leading-base` | 1.5 | active |
| `--leading-loose` | 1.75 | provisional |
| `--tracking-tight` | -0.02em | provisional |
| `--tracking-normal` | 0 | active |
| `--tracking-wide` | 0.08em | active |

# Case Rules

- All lowercase OR all uppercase
- Never mixed case in headers
- Labels: uppercase + wide tracking
