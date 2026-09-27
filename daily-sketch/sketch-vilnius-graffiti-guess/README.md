# Vilnius Graffiti Guess

A small, static five-round game. Run `python3 -m http.server 5178 --directory dist`, then visit http://127.0.0.1:5178.

## Content

Five real Vilnius graffiti photographs from 2010–2012, licensed CC BY 2.0 / 3.0. `dist/photos.json` records original sources, photographers, capture dates, camera coordinates, licenses, confidence, and modifications. Images are resized, with embedded metadata omitted from the game assets. Full-image viewing preserves environmental clues. No accounts or persistent player data.

All coordinates are published camera geotags from Wikimedia Commons. `confidence: approximate` reflects that original geotag accuracy has not been independently surveyed. These are archival camera locations, not claims that the artwork still exists. All five candidates are the five photo locations; the image order is shuffled on each replay. This first set concentrates on central Vilnius, rather than covering the entire city.

Map geometry is from OpenStreetMap via Overpass, obtained 2026-09-27, bounding box 54.67,25.25,54.704,25.31. Roads and rivers are projected locally without street labels or tile services. The map supports drag, wheel/pinch zoom, zoom buttons, keyboard arrows/+/-/Home, a metric scale, and Fit All. Gestures do not submit guesses. Five geographically anchored pixel landmarks show their names on hover, focus, or tap; their coordinate sources are recorded in `dist/landmarks.json`. OSM attribution remains visible; data is ODbL. Fonts load from Google Fonts with local system fallbacks; photos, map, and application logic are local assets.

## Validation

`node --test tests/*.test.mjs` checks all five rounds, one guess per round, invalid actions, distance, completion, photo provenance/assets, pointer-centered zoom, consistent geographic panning, viewport fitting, gesture bounds, and tap/drag/pinch separation. JavaScript syntax and local HTTP response also checked. Browser visual/interaction testing was not requested and was not performed. Optional WebMCP tools are feature-detected; no supported WebMCP validation context was available, so their registration and execution were not runtime-verified.

## Changing the archive

Keep exactly five unique records in `dist/photos.json`. Each needs `id`, `image`, `lat`, `lng`, `year`, `title`, `fileTitle`, `sourceUrl`, `photographer`, `license`, `licenseUrl`, and `confidence`. Preserve provenance fields. If adding locations outside the current center, adjust the projection and exploration bounds in `dist/map-camera.mjs` and fetch a matching map extent. Use exact or sufficiently confident approximate positions; exclude neighborhood-only guesses.

Landmark illustration prompts and saved asset paths are recorded in `LANDMARK-ART.md`; images were generated using built-in ImageGen.

## Sketchbook location

Moved to `100days/daily-sketch/sketch-vilnius-graffiti-guess`. The root entry opens the static application in `dist/`. The previous standalone Git metadata is preserved at `/Users/mantas/Desktop/min8is/.archive/vilnius-graffiti-guess.git`; this sketch is now ordinary content in the 100days repository.
