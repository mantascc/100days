---
id: seeds/computed-not-curated-thumbnails
type: seed
title: Computed, not curated, thumbnails
state: active
charge: high
spawned: [71-index-100days]
feeds: [threads/ascii-and-text-rendering, threads/design-system-and-reference-sheets, themes/randomness-feeling-intentional, themes/searching-vs-mapping]
sources: []
date: 2026-06-14
tags: [generative, identity, catalog, thumbnail, procedural, fingerprint]
---

# What
A catalog whose visual identity is *computed* rather than stored: instead of saving a screenshot per project, each card's thumbnail is generated on the fly from the project's id (hashed to a seed) and its primary theme (which selects a distinct visual grammar). Adding a project instantly earns a unique animated glyph for free, and the grid reads as a typology — you can spot network sketches vs. field sketches by silhouette. The day-71 index proves the idea; the seed is the *generalisation*: a curation-free identity system for any growing collection.

The slogan is the thesis: **the index doesn't *show* the work, it *is* the work** — the same generative logic that produced the sketches now produces their depiction. A curated grid is a museum; a computed grid is a colony.

# Trace
- [71-index-100days](../../71-index-100days/) — the founding implementation: per-theme procedural glyphs seeded by id hash.

# Charge
High and active. The first cut already works; the itch is to push it past the known ceiling — every card runs its own rAF loop, which will not scale to hundreds of tiles without virtualization — and to push the idea past *thumbnails* into a full computed identity that reaches every surface (favicon, og-image, masthead, page title, audio cue).

# Branches

The seed has four live directions. Each is a sketch (or a small sequence) on its own.

## A. Fingerprint — encode more
The glyph today encodes id + primary theme. Push it until the thumbnail is a real biometric of the project.

- **Multi-theme blends.** Most projects have 2–3 tags. Today only the first picks the grammar; the rest are wasted information. Compose grammars: a `network`+`audio` glyph orbits nodes whose edges pulse on a sine field. A blend rule (lerp, max, alternating frames) is itself a design choice.
- **Day-as-time.** Day number is a strong axis; map it to *something* — orbital radius, glyph density, hue rotation, line weight. The grid then reads as a timeline at a glance, even without ordering.
- **Duration & complexity.** File size, line count, dependency count, words-in-interface-md — pick one signal that survives across stacks. Bigger pieces literally weigh more on the card.
- **Palette extraction.** Pull the dominant colours from the live `index.html` of each project (sample first paint via headless capture) and feed them back as the glyph's palette. The thumbnail becomes a self-portrait the moment the sketch is published.
- **A "DNA strip" view.** Strip the time axis out — one row per project, 64 columns of computed-from-id values rendered as a band. The grid becomes a comparative genome.

## B. Scale — one loop, many cells
The ceiling is real and gets in the way of the *self-portrait of the whole practice* idea. Solving it is also a sketch.

- **Shared render loop with an `IntersectionObserver`.** One rAF, one `requestIdleCallback`-scheduled queue; off-screen tiles pause. Direct lift of `techniques/offscreen-canvas-downsample`.
- **Single canvas, tiled.** Drop per-card canvases entirely — the grid is one big canvas; each cell paints to its rect. Layout in DOM, paint in one buffer.
- **Static-by-default, animated on hover.** Each glyph renders one seed-frame as SVG/PNG at build time; the live rAF only spins up on focus or hover. Cheap, and the still frame is a usable favicon / og-image.
- **The "self-portrait" piece.** Once scale is solved: one canvas, *every* project's glyph alive at once, arranged by similarity (UMAP-on-seed-vector) rather than by day. The whole practice as a single field.

## C. Reach — the same seed everywhere
Right now the glyph lives only in the thumbnail. The same seed should drive every surface a project has.

- **Project favicon = glyph at 32px.** The render function takes a size; the constraint forces the grammar to degrade gracefully. A glyph that doesn't survive 32px isn't really a glyph.
- **OG / share card.** A 1200×630 render of the same seed, with the title typeset over it. Sharing the project page gets you a fresh image every time, computed.
- **Masthead.** The serif "Hej." on each project page is itself a glyph stamped from that project's seed — title and brand-mark are the same object.
- **Page title in Unicode.** The tab title carries a couple of generated glyph chars from a reduced ASCII grammar. Identity reaches the browser chrome.
- **Audio fingerprint.** Same seed → a 1-second sonic stamp (FM ratio, envelope, two-note motif). Click any card and hear the project. Cross with `themes/audio-reactive-without-gimmick` from the opposite direction: visual *seeds* sound rather than sound driving visuals.

## D. Generalise — beyond this catalogue
The strongest version of the seed isn't "thumbnails for 100days" — it's an identity primitive for any growing collection.

- **`computed-identity.js` as a tiny library.** One function: `(id, themes, opts) → {drawGlyph(canvas), favicon(), ogCard(), audioBlob()}`. The 100days index becomes its first user, not its definition.
- **Changelog entries get glyphs.** Every commit, message, or note in another bundle (mintis, the Imagination layer itself) earns the same auto-identity.
- **Theme detection.** Drop the manual `themes:` tags — infer the grammar from the project's text. Then the catalogue truly self-curates; adding a folder is enough.
- **Anti-curation manifesto piece.** A sketch that *argues* the position by demonstrating it — a page where the only authored elements are the words, and every visual is computed from the words themselves.
- **Seed-from-glyph reversal.** Draw a glyph in a sandbox, get the project id whose seed would have produced it. Useful for nothing; satisfying as proof the mapping is real.

# Open questions
- Where's the line between "fingerprint" and "noise"? Too many signals and the glyph becomes a smear; too few and it's just decoration. The Fingerprint branch needs a Theme behind it — see [themes/randomness-feeling-intentional](../themes/randomness-feeling-intentional.md).
- The "computed identity reaches everywhere" branch is design-system thinking; the "self-portrait field" branch is generative-art thinking. They want different ceremonies. Worth splitting into two seeds if both stay live.

# Prompts (legacy — kept; see Branches above for the live set)
- A self-portrait of the whole practice: one canvas where every project's glyph coexists in a single field. *(Branch B + A)*
- Make the glyph encode *more* of the project — duration, palette, complexity — so the thumbnail is a real fingerprint. *(Branch A)*
- Solve the scaling ceiling: off-screen pausing or a single shared render loop, so thousands of glyphs animate cheaply. *(Branch B)*
