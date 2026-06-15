# Day 62: Terminal REPL

## Idea
A minimal in-browser shell — boot sequence, typewriter command output, and an ASCII cat that crystallizes out of noise.

## Description
A self-contained fake terminal that reads, evaluates, and prints. It boots with a version banner and a hint, then accepts a small command set: `hello [name]`, `date`, `whoami`, `clear`, `cat`, and `help`. Output streams character-by-character through a typewriter effect with jittered timing, so responses feel typed rather than dumped. Command history is navigable with the up/down arrows, and unknown commands fade out silently instead of erroring loudly. The centerpiece is `cat`: a seven-row ASCII cat that resolves from random chaos glyphs through a "settling" phase into the final figure, with the cat cells crystallizing before the background — a per-cell threshold animation borrowed from the day-55 crystallization study. The whole thing lives in one HTML file, peach-toned, with a title bar and a live status bar.

## Data Concepts
- **Primary**: Text (command parsing, REPL loop, streamed output)
- **Secondary**: Temporal (typewriter pacing, boot choreography), Spatial (per-cell ASCII crystallization grid)

## Conceptual Tags
#terminal #repl #command-line #typewriter #ascii-art #crystallization #skeuomorphism #microinteraction

## Technical Tags
#vanilla-js #dom #requestanimationframe #async-await #typed-arrays #keyboard-handling #google-fonts

## Stack
- Single HTML file, vanilla JS, JetBrains Mono via Google Fonts
- DOM-appended line nodes; typewriter via recursive `setTimeout` with random jitter
- `cat` animation uses flat `Uint8Array`/`Float32Array` cell buffers and a `requestAnimationFrame` threshold loop
- CSS variables drive a warm peach palette; flexbox terminal card with title bar, scrollable output, input row, status bar

## Notes
- The `clear` command keeps a `#boot-end` sentinel node and only deletes children after it, so the banner survives clears. Small, tidy decision — preserves the "this is a session" illusion.
- Crystallization thresholds are biased so foreground cells (cat: 8–60%) resolve before background (55–100%). That ordering is what makes the figure appear to emerge *from* the noise rather than fade in uniformly — the single best detail here.
- Typewriter jitter (`speed + random*14`) is what sells the human-typed feel; constant-speed output reads as machine paste. Worth keeping in the toolkit.
- The `busy` flag locks input during async command playback so you can't queue commands mid-animation. Correct, but it means a fast user feels the wait — a queue or interrupt key would be friendlier.
- Genuinely minimal command set — this is a feel/aesthetic study more than a useful shell. The interesting reusable parts are the typewriter, the crystallization loop, and the sentinel-based clear, not the commands themselves.
- Unknown-command fade-out is a charming choice but quietly hides typos; a real shell would echo "command not found." Trade-off favors mood over feedback.
