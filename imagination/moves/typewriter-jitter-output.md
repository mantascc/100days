---
id: moves/typewriter-jitter-output
type: move
title: Typewriter output with jitter
state: active
charge: medium
spawned: [62-terminal-cli]
feeds: [veins/ascii-and-text-rendering]
sources: []
date: 2026-06-14
tags: [text, typewriter, timing, microinteraction, repl]
---

# What
Stream text character-by-character with *randomised* per-character delay (`speed + random*jitter`) so output reads as typed by a hand rather than pasted by a machine. The whole trick is the jitter: constant-speed reveal reads as machine output; a little variance reads as a person. Implemented with recursive `setTimeout` and a `busy` flag that locks input during playback. A small, high-leverage feel-move — the note flags it explicitly as "worth keeping in the toolkit."

# Trace
- [62-terminal-cli](../../62-terminal-cli/) — REPL responses streamed with jittered typewriter timing.

# Charge
Medium — cheap to deploy, disproportionately effective at making an interface feel alive. The open edge is the `busy` lock: a fast user feels the wait, so a queue or interrupt key would make it friendlier.

# Prompts
- Variable cadence: pause longer at punctuation, rush through filler — typing with a rhythm.
- Two "voices" typing into the same stream at different speeds.
- A typewriter that occasionally "backspaces" and corrects itself.
