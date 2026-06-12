# Day 62: Terminal REPL

## Idea
Fake terminal REPL with typewriter output and a crystallising ascii cat

## Description
A self-contained shell emulator in a warm peach palette — title-bar-less terminal card, `$` prompt, monospace everything. A short boot sequence prints the version line and a hint, then hands over the input. Six commands are implemented: `hello [name]`, `date`, `whoami`, `clear`, `help`, and `cat`. Output never just appears: every response streams in character by character with randomised per-tick delay, so even `whoami` feels like the machine is typing.

Unknown commands get a quiet failure mode — the echoed line fades to transparent and removes itself, leaving no error noise in the scrollback. `clear` wipes everything back to a sentinel node, preserving the boot lines. Arrow keys walk command history.

The centrepiece is `cat`: a 7-row ascii cat materialises through a per-cell crystallisation animation. Each character cell gets a random threshold (cat cells resolve at 8–60% progress, background cells at 55–100%), and below threshold it cycles through chaos glyphs (`!@#$%^&*`) then settling dots (`·•∘`) before locking into its final character. The cat emerges from noise over 1.3 seconds, then types "meow."

## Data Concepts
- **Primary**: Visual (text rendering, terminal interface)
- **Secondary**: Temporal (staggered reveal, typewriter timing)

## Conceptual Tags
#terminal #repl #skeuomorphism #typewriter #crystallisation #order-from-noise #micro-interaction

## Technical Tags
#vanilla-js #dom-rendering #async-await #requestanimationframe #css-variables #ascii-art

## Stack
- Pure HTML/CSS/JS, no canvas — output is DOM nodes
- JetBrains Mono via Google Fonts
- Promise-based typewriter with randomised tick delay
- Per-cell `<span>` grid + rAF loop for the cat crystallisation
- Command table as a plain object map

## Notes
- the crystallisation effect is lifted from sketch 55 — flat threshold arrays, chaos → settling → locked phases
- unknown commands fading out instead of erroring is the nicest detail; the terminal refuses to accumulate junk
- a `busy` flag locks the keyboard while output streams, so the typewriter can't be interrupted mid-command
- breaks the series' dark palette — terracotta/peach chrome instead of #0a0a0a
