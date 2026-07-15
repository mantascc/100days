# AIDA001 — audio-reactive agents

## idea
Full-bleed audio-reactive swarm; media-player-style island (Play · 01·02·03 · Mic · ⚙); settings drawer exposes the RMS→animation sensitivity vector. Mobile-tuned defaults (fewer agents, smaller link radius).

## tags
audio-reactive, particles, network, ui-drawer, samples, mic

## stack
vanilla · Web Audio API · Canvas · IBM Plex Mono

## motion
Agents drift and jitter as a function of RMS loudness. Two sensitivity knobs (RMS→speed, RMS→jitter) plus base drift/jitter and connection distance form a "sensitivity vector" the user can retune live. Two pre-decoded loops (pattern-1, pattern-2) or the mic can drive the analyser; only one source is active at a time.

## layout
- Canvas + underlying grid fill the viewport.
- Floating island (bottom-center): Pattern-1 · Pattern-2 · Mic · ⚙.
- Settings drawer slides up from the island when ⚙ is toggled; contains sliders for the sensitivity vector.

## samples
- `samples/pattern-1.wav` — a1da / july / 0715-pattern
- `samples/pattern-2.wav` — a1da / july / 0715-pattern2
