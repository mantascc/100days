---
id: principles/physics-over-easing
type: principle
title: Physics over easing, linear over theatrical
status: active
version: 1.0
tension: "real integration vs theatrical timing"
provenance: style-seed Philosophy / Motion — "Physics over easing, linear over theatrical"
tags: [motion, physics, timing]
---

# Stand
Motion should be simulated, not choreographed. Use Euler or Verlet
integration for gravity, springs, and inertia; let things drift and settle
under their own forces rather than ride a hand-tuned cubic-bezier. State
changes are instant or linear. Things breathe, never bounce — the truth of
the motion is in the math, not in a designer's idea of "snappy."

# Counterforce
Simulation has no taste. A spring tuned only by physics can feel sluggish,
overshoot annoyingly, or take longer than a user will wait; choreographed
easing exists because real physics is not always pleasant. Theatrical
timing is a legitimate tool for legibility — a deliberate ease-out can
communicate causality faster than honest inertia.

# When to break
Break for interaction feedback that must land inside a human reaction
window — a 150ms ease-out on a panel beats a physically honest 600ms
settle. Break when simulation produces motion that reads as a bug rather
than a behavior. The default is integration; easing is the exception you
reach for when physics fights the user.

# Provenance / exceptions
No logged exceptions yet. The `--ease-out` token exists precisely as the
sanctioned exception lane for this principle.
