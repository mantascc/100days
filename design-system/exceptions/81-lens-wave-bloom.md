---
id: exceptions/81-lens-wave-bloom
type: exception
against: principles/reduction-as-polish
sketch: 81-lens-wave
verdict: worked
date: 2026-06-14
tags: [bloom, chromatic-aberration, shader, richness]
---

# What broke
Same rule, deeper violation. A WebGL fragment shader takes Clear Channel's
own typeface and adds a three-ring additive bloom (warm-white → blue-cyan),
chromatic aberration splitting R/G/B, sine-wave warp, and non-uniform lens
scaling. Glow, fringe, and gradient-tinted light — three named
anti-patterns at once — over a core-instance type texture.

# Why it worked
The bloom and aberration read as *optics*, not styling: the text behaves
like a luminous material seen through a lens, so the fringe reads as a
consequence of physics rather than a chosen color. It stays disciplined —
single text, void ground, mono typeface — and spends its one indulgence on
the thing the sketch is actually about: light passing through a material.

# Pressure
This is the second logged break of reduction-as-polish in the same
direction, both verdict `worked`, both where the effect is the material.
Two exceptions is the recurrence threshold. Reduction-as-polish should now
be rewritten to name an "effect-as-material" exception explicitly instead
of leaving makers to violate it quietly each time.
