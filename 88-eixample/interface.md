# 88-eixample

## idea
A hand-painted 16×16 pictograph (256 glyphs) reframed as a generative *grid language* — an ode to Barcelona's Eixample, whose city plan is itself a near-uniform mesh of chamfered blocks. Each cell of the original drawing is one letter of a 256-glyph alphabet; each numbered **edition** is a deterministic re-addressing of the whole city.

## modes
| mode | behaviour |
|---|---|
| **original** | the canonical 16×16 drawing — no parameters, the home address |
| **shuffle** | seeded Fisher–Yates over all 256 glyphs — a bijection; every glyph appears once |
| **sampling** | draws with replacement from a *K-tile palette* — shrink K to densify the pattern into a wallpaper-like field |

Edition № (1–256) seeds a PRNG (`xmur3` → `mulberry32`); the same number always redraws the same arrangement, so a print can be signed, sold, and re-pressed from its number alone. There are 256! shuffle permutations; "1–256" is just the named edition.

## controls
- **Mode** — Original / Shuffle / Sampling (exposes only the params each mode uses)
- **Edition №** — type 1–256, or prev / next / random
- **Block size** — 4×4 pocket · 8×8 *illa* (one block) · 16×16 full district
- **Palette** (sampling only) — slider from 2 to 256; smaller pool = stronger repetition, monoculture at the floor
- **Orientation** — upright / allow 90° turns (independent seed stream)
- **↓ PNG** — rasterize the current edition to canvas and download
- **⎙ print** — print-view for a numbered plate

## responsive
Desktop renders a 300px sidebar of controls; below 768px the controls collapse into a **bottom sheet** with a peek bar showing the current edition. Tap the handle to expand. Canvas reflows on resize and pixel-grid-aligns to the available width.

## verified
Deterministic per (mode, №, K); shuffle is a true bijection (256 unique); 256 shuffle editions distinct; sampling palette is a deterministic K-subset (prefix of a seeded shuffle of all 256).

## stack
vanilla · DepartureMono · CSS grid · canvas/PNG export · 256 raster glyph tiles in `images/`
