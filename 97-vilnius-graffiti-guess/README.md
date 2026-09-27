# Vilnius Graffiti Guess

A static seven-round photo guessing game. From this directory, run `python3 -m http.server 5189 --directory dist` and visit http://127.0.0.1:5189.

## Images and locations

The seven user-supplied numbered photographs correspond directly to IDs 1–7 in `dist/photos.json`. That manifest stores the supplied coordinates, source filenames, image dimensions, and provenance. Photographer, capture dates, and licenses were not supplied; the previous Wikimedia metadata does not apply to these images.

Web-ready images live in `dist/assets/photos/graffiti-01.webp` through `graffiti-07.webp`. Their orientation is normalized, their longest edge is at most 1800 pixels, and embedded metadata is omitted. Original uploads remain in the main checkout; this working copy contains only the optimized game assets. The five previous JPEG game photos have been removed. Landmark illustrations are kept separately in `dist/assets/landmarks/`.

All seven photo locations are available as anonymous dots each round. Photos shuffle on replay; each photo appears once. Adding or replacing a photo requires a unique ID, title, local image path, latitude, and longitude. Round logic follows the manifest length.

## Mobile

The screen opens with one question and the instruction to pick a lime map dot. The active Pick a dot button opens/focuses the map without submitting a guess. After guessing, the button advances to the next photo or results. Phones show Photo and Map view buttons, a full-width round action, safe-area spacing, and a full-screen photo viewer. Map controls and landmark targets are at least 44 pixels; the mobile landmark artwork is smaller to keep the map legible. Drag and pinch gestures never submit a guess. Reduced-motion preferences are respected. Wider screens show photo and map side by side.

## Map

Local OpenStreetMap geometry covers 54.66,25.195 to 54.715,25.315, obtained 2026-09-27. Attribution remains visible. Pan, pinch/wheel zoom, zoom buttons, arrow keys, +/- and Home are supported. Each round starts with central Vilnius at a useful guessing scale. Fit All / Home includes every photo and all nine landmarks, including TV bokštas to the west. Center returns to the guessing area without resetting the round. Sprites stay anchored to their geographic coordinates during pan and zoom, including at the viewport edges. Names appear only on hover, keyboard focus, or tap. Nine pixel landmarks provide orientation; their sources are in `dist/landmarks.json` and illustration prompts in `LANDMARK-ART.md`.

## Validation

Run `node --test tests/*.test.mjs` for the seven-round lifecycle, invalid guesses, distances, photo assets, coordinate plausibility, camera geometry, landmark coverage, stable geographic anchoring, and gesture separation. Browser checks at 320 px and 390 px phone widths and 1440 px desktop cover landmark names, Fit All, Center, keyboard controls, pan/pinch without submitting a guess, and a complete seven-round session, replay, and the enlarged photo viewer. Optional WebMCP registration is feature-detected; a supported WebMCP host is required to exercise those tools.

Map provenance and bounds are recorded in `dist/map-provenance.json`. Run `python3 scripts/update-map.py` to refresh the unlabelled OSM geometry. Minor service roads and paths are omitted to reduce visual density.

With Playwright installed, run `node tests/browser-check.cjs` against the local server. `PREVIEW_URL` overrides the URL and `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. Screenshots are written to `/tmp/landmarks-*.png`.

`node tests/minimal-ui-check.cjs` checks the primary action and seven-round flow on phone and desktop layouts with Playwright.
