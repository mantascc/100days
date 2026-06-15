---
id: exceptions/28-liquid-glass-bloom
type: exception
against: principles/reduction-as-polish
sketch: 28-liquid-glass
verdict: worked
date: 2026-06-14
tags: [glass, blur, svg-filters, richness]
---

# What broke
Reduction-as-polish forbids gradients, drop shadows, and added effects —
form should come from density, not coats of paint. This sketch does the
opposite on purpose: a draggable frosted pane stacks `backdrop-filter`
blur, saturate, brightness, contrast, *and* an SVG `feTurbulence` →
`feDisplacementMap` liquid distortion. Pure additive richness.

# Why it worked
Because the effect *is* the subject. The sketch is a glass simulator; glass
that does not blur, saturate, and warp is not glass. The richness is not
decoration applied to content — it is the content. Reduction here would
have deleted the entire idea, not polished it.

# Pressure
First clear case that "strip, don't add" has a blind spot: when the
material being depicted is optical, richness is honest. One more like this
and reduction-as-polish should grow an explicit "effect as material" clause
rather than treating all added effect as ornament. See its sibling,
[81-lens-wave](81-lens-wave-bloom.md).
