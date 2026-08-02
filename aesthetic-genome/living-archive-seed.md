# Living Archive Seed

## Premise

The 100days archive becomes a living map of visual taste.

Each sketch is not only a page, poster, or video preview. It is a specimen with traits, neighbors, ancestors, and possible descendants. The archive can be browsed chronologically, but it can also be explored as an aesthetic field: dense to sparse, reactive to autonomous, legible to abstract, physical to diagrammatic.

The goal is not to score taste with false precision. The genome is a curatorial language: a way to notice patterns, argue with them, and generate better next prompts.

## Core Object

```js
project = {
  id: "67-audio-reactive-ascii",
  day: 67,
  title: "Audio-reactive ASCII",
  href: "../67-audio-reactive-ascii/",
  poster: "assets/posters/67-audio-reactive-ascii.jpg",
  video: "assets/videos/67-audio-reactive-ascii.mp4",
  themes: ["audio", "ascii", "field"],
  genome: {
    density: 0.72,
    agency: 0.88,
    legibility: 0.34,
    determinism: 0.42,
    complexity: 0.64,
    physicality: 0.28,
    palette_restraint: 0.81,
    motion_character: 0.9,
    material: "glyph",
    temporal_mode: "reactive",
    referent: "self-contained",
    scale: "meso"
  },
  lineage: {
    parents: ["66-ascii-field-gallery", "10-audio-reactive-agents"],
    siblings: ["68-moog-phase", "53-ascii-grid"],
    descendants: []
  }
}
```

## Views

### Grid

The existing video index remains the front door.

- Tiles show poster to video on hover.
- Each tile gains a small genome radar or bar-strip.
- Hovering a tile highlights nearest neighbors.
- Clicking opens the sketch.
- Secondary action opens the specimen panel.

### Specimen Panel

A focused readout for one project.

- Video preview.
- Genome radar.
- Trait bars with plain-language labels.
- Nearest neighbors by genome distance.
- Lineage notes: what this sketch inherits, mutates, or rejects.
- Descendant prompt: a generated brief for a next sketch.

### Lineage Map

A canvas or SVG field where projects become nodes.

- X axis can default to time.
- Y axis can be selected: agency, density, legibility, etc.
- Edges connect manually declared lineage and computed nearest neighbors.
- Node color comes from primary theme.
- Node size can represent complexity, density, or confidence.
- Hover previews poster/video.

### Genome Space

A scatterplot browser for taste-space.

- Select any two continuous axes.
- Filter by material, temporal mode, theme, or day range.
- Brush a region to create a collection.
- Compare selected projects as averaged genome shapes.

### Descendant Studio

A small prompt machine for future sketches.

- Pick one to three ancestors.
- Choose a mutation: invert, intensify, restrain, hybridize, translate material, change temporal mode.
- Generate a brief.
- Optionally generate a starter `interface.md` and folder scaffold.

## Genome Language

Continuous axes:

- `density`: how full the surface feels.
- `agency`: how much user input constitutes the piece.
- `legibility`: how readable/explanatory the piece is.
- `determinism`: how repeatable the output is.
- `complexity`: how many interacting rules or layers exist.
- `physicality`: how strongly it simulates force, mass, collision, flow, or material.
- `palette_restraint`: how narrow and disciplined the color system is.
- `motion_character`: how continuous, fluid, and animated the piece is.

Categorical axes:

- `material`: pixel, glyph, geometry, data, dom, hybrid.
- `temporal_mode`: loop, evolve, equilibrium, static, reactive.
- `referent`: self-contained, data-mapped, metaphorical, educational.
- `scale`: micro, meso, macro, multi.

## Distance

Nearest neighbors should combine hard and soft similarity.

```js
distance =
  euclidean(continuousAxes) * 0.7 +
  categoricalMismatch(categoricalAxes) * 0.2 +
  themeMismatch(themes) * 0.1
```

This should stay adjustable. Sometimes the most interesting neighbor is not the closest one, but the closest one with a different material.

## Lineage Notes

Each project can carry short curatorial notes.

```md
inherits:
- ASCII field grammar from 66-ascii-field-gallery
- audio agency from 10-audio-reactive-agents

mutates:
- turns passive wave fields into microphone-reactive instrument
- shifts from gallery comparison to single immersive surface

rejects:
- explanatory panels
- multi-palette exploration
```

These notes matter because computed similarity can find relatives, but it cannot explain why the relationship feels true.

## Descendant Prompt Shape

```text
Create a new 100days sketch descended from:
- 66-ascii-field-gallery: glyph field material
- 67-audio-reactive-ascii: reactive agency
- 49-grid-trace: palette restraint

Mutation:
Make it more legible and less dense.

Brief:
Build a quiet diagnostic instrument that renders microphone input as a sparse ASCII topology map. Use one accent color, minimal labels, and a visible calibration phase. Avoid full-screen saturation. The piece should feel like measuring a signal, not performing to music.
```

## Build Sequence

1. Merge `83-video-index/assets/gallery.json` with `aesthetic-genome/genome-proposed.json`.
2. Add a tiny per-tile genome strip to the video index.
3. Implement nearest-neighbor calculation in browser JavaScript.
4. Add hover links between related tiles with a canvas overlay.
5. Add the specimen panel.
6. Add a standalone lineage map.
7. Add hand-written lineage notes for the strongest 15 projects.
8. Add descendant prompt generation from selected ancestors.

## Open Questions

- Should genome scores be fully generated, manually curated, or hybrid?
- Should lineage be declared by the maker, inferred by distance, or both?
- Is the primary experience an archive grid or an exploratory map?
- Should descendant prompts generate only briefs, or also starter folders?
- How much should this expose the process versus preserve mystery?

## Quality Bar

- The archive still opens instantly.
- Motion previews stay lazy-loaded.
- The genome never blocks basic browsing.
- Every generated relationship can be inspected and questioned.
- The interface feels like a research instrument, not a dashboard.
- The system produces at least one surprising next-sketch brief that feels worth making.
