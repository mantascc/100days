---
id: seeds/computed-not-curated-thumbnails
type: seed
title: Computed, not curated, thumbnails
state: dormant
charge: medium
spawned: [71-index-100days]
feeds: [veins/ascii-and-text-rendering, veins/design-system-and-reference-sheets]
sources: []
date: 2026-06-14
tags: [generative, identity, catalog, thumbnail, procedural]
---

# What
A catalog whose visual identity is *computed* rather than stored: instead of saving a screenshot per project, each card's thumbnail is generated on the fly from the project's id (hashed to a seed) and its primary theme (which selects a distinct visual grammar). Adding a project instantly earns a unique animated glyph for free, and the grid reads as a typology — you can spot network sketches vs. field sketches by silhouette. The day-71 index proves the idea; the seed is the *generalisation*: a curation-free identity system for any growing collection.

# Trace
- [71-index-100days](../../71-index-100days/) — the founding implementation: per-theme procedural glyphs seeded by id hash.

# Charge
Medium and quietly compelling — "the catalog's visual identity is computed, not curated" is flagged as the strongest idea in the index. It stays dormant because the first cut already works; the itch is to push it past the known ceiling (every card runs its own rAF loop, which will not scale to hundreds of tiles without virtualization).

# Prompts
- A self-portrait of the whole practice: one canvas where every project's glyph coexists in a single field.
- Make the glyph encode *more* of the project — duration, palette, complexity — so the thumbnail is a real fingerprint.
- Solve the scaling ceiling: off-screen pausing or a single shared render loop, so thousands of glyphs animate cheaply.
