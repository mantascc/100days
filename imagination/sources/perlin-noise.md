---
id: sources/perlin-noise
type: source
title: Perlin noise
state: active
charge: medium
spawned: [12-wind-field, 13-image-flow-field]
date: 2026-06-14
tags: [noise, perlin, procedural]
---

# What
Ken Perlin's gradient noise — the procedural texture that defines the look of "organic randomness" in computer graphics. The improved version uses the quintic fade curve `6t⁵ − 15t⁴ + 10t³` for continuous second derivatives, and a permutation table to hash lattice gradients cheaply. Unlike white noise it's smooth and spatially coherent, which is exactly why it reads as natural — wind, terrain, flow. The maker re-implements it by hand, which makes it a source they can reach inside and bend, not just a black box.

# Trace
- [12-wind-field](../../12-wind-field/) — Perlin field as an invisible steering breeze.
- [13-image-flow-field](../../13-image-flow-field/) — coherent noise advecting pixels.

# Charge
Steady, mid-charge — the technical source behind the smooth-noise moves. Understood well enough now to be modified rather than merely called.
