# 87 · eixample

## idea
Turn a hand-painted 16×16 pictograph (256 glyphs) into a generative *grid language* — an ode to Barcelona's Eixample, whose city plan is itself a near-uniform mesh of chamfered blocks. The drawing has exactly 256 cells, so each cell becomes one letter of a 256-glyph alphabet, and each **edition** is a deterministic re-addressing of the whole city.

## rule
Edition № (1–256) seeds a PRNG (`xmur3` → `mulberry32`). Two composition rules:

| rule | behaviour |
|---|---|
| permutation | seeded Fisher–Yates over all 256 glyphs — a bijection; every glyph appears once |
| sampling | 256 draws with replacement — some glyphs recur, some rest |

Edition 1 (permutation) is the original drawing. The № *is* the artwork's address: the same number always redraws the same arrangement, so a print can be signed, sold, and re-pressed from its number alone. There are 256! permutations; "1–256" is just the named edition.

## interactions
- **Edition №** — type 1–256, or prev / next / random / original
- **Block size** — 4×4 pocket · 8×8 *illa* (one block) · 16×16 full district
- **Rule** — permutation / sampling
- **Orientation** — upright / allow 90° turns (independent seed stream)
- **↓ SVG** — export current edition (tiles referenced relative to `images/`)
- **⎙ print** — print-view for a numbered plate

## verified
Deterministic per №; permutation is a true bijection (256 unique); all 256 editions distinct (zero collisions); edition 1 == original.

## stack
vanilla · DepartureMono · CSS grid · 256 raster glyph tiles in `images/`

## source
Master artwork + sliced tiles in `../../hello-world/eixample/`. Palette pulled from the drawing: indigo field · orange-red · gold · pink · cream.

## product directions
- generative editions sold by address ("Carrer de l'Eixample, Nº 042")
- textile bolt (all-over repeat) · kitchen tiles · silk scarf · *panot* floor tile
- hybrid SVG: image-trace the 256 glyphs; re-author only the geometric subset as parametric functions
