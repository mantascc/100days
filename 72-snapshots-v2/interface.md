# 72-snapshots-v2

## idea
Snapshots gallery reimagined through the Clear Channel design system — year-grouped square tiles with ASCII glyph loaders (chaos → settling → locked) and chaotic, bursty image loading.

## tags
gallery, design-system, ascii-loading, clear-channel, dark, photography

## stack
vanilla · JetBrains Mono · Typed.js · Leaflet · CSS custom properties

## motion
Per-tile ASCII grid cycling at 12fps through CHAOS `!@#$%^&*+=-~<>|/?\;:` → SETTLING `░▒▓▪▫` → LOCKED `·`; chaotic shuffled load order in bursts of ~6 every ~90ms; 320ms crossfade from skeleton to image; typed title with blinking `_` cursor in accent cyan; popover with dark basemap and cyan marker.
