# sketch-idle

## Idea
A landing page for **Idle** (theater-rename character) that *performs* the
character: it recharges the longer you leave it alone and quiets when you
fidget. Doing nothing is the interaction.

## Description
Idle is the one figure in the archive with *no vector* — filed under system
vectors, status `candidate`, deliberately unresolved between "refusal to move"
and "recharge." This page commits to the recharge reading. A serene, closed-eyes,
happy-neutral face breathes inside a held ring with a slow cool-blue bloom.
A charge meter fills while the pointer is still and drains when it moves; the
face brightens with charge; a `load` readout does the inverse (rises when
disturbed, decays to zero at rest). Copy is minimal — Idle talks as little as
possible.

Built from the vocabulary in `79-idle-states`: the breath motif (sine, opacity+
scale), the named "reads as loading spinner" risk (dodged here with a slower
5.5s period, labelled *not a spinner*), the claim/signal/motion metadata
register, corner ticks, and the `#00a8ff` idle accent.

## Data Concepts
- **Primary**: Temporal (idle time as the input; charge as accumulated stillness)
- **Secondary**: State (a single figure rendered as an ambient system state)

## Conceptual Tags
#idle #recharge #decompression #ambient-state #do-nothing #anti-engagement
#breath #character-landing #reward-stillness #ui-state-as-character

## Technical Tags
#canvas #hi-dpi #requestanimationframe #radial-bloom #pointer-idle-timer
#single-file

## Stack
- HTML5 Canvas (device-pixel-ratio aware)
- Vanilla JavaScript
- IBM Plex Mono · #0a0a0a ground · #00a8ff accent (idle-states palette)

## Mechanics
- **Face**: a breathing head-ring; two closed content-eye arcs (˘ ˘) and a soft
  upturned mouth. Brightness = 0.42 + 0.58·charge.
- **Breath**: sine, 5.5s period (intentionally slower than a 4s spinner);
  scales the ring ~4.5% and modulates the bloom.
- **Charge loop**: still (>650ms no pointer) → charge climbs over ~34s;
  moving → drains over ~9s. At 100% the subtitle flips to `recharged` and a tiny
  accent breath-dot rests at center.
- **Load**: inverse mood — rises toward 100% while disturbed, decays to 0 at rest.
- **Copy states**: signal `nothing needed` ⇄ `leave me be`; nudge `do nothing`
  ⇄ (hidden while stirred) ⇄ `recharged`.

## Notes
- Design-system principles in play: quiet-over-loud (near-empty frame),
  physics-over-easing (sine breath, time-integrated charge), effect-as-material
  (the bloom is the charge, not decoration).
- The interaction is a small argument: in a system full of Drive figures
  (Kometa, High Performer, Strength, Motion) that tie worth to output, Idle is
  worth with the eyes closed — so the page rewards *absence* of input.
- Open thread: a "disturbed" micro-expression (eyes crack open a hair when you
  move fast) would make the resistance legible without adding copy.
