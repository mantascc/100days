# 86 · agent-stream scrub

## idea
A scrubbable two-track reference for agent-streaming patterns. The top track shows what the user sees; the bottom track exposes the mechanism — debounce gates, batch boundaries, retry windows, interrupt points, compression cycles. Polish on top, mechanism beneath, both in one frame.

## patterns
Eight surface-vs-mechanism patterns from [../daily-sketch/agent-patterns.md](../daily-sketch/agent-patterns.md):

| # | Pattern | What the two tracks show |
|---|---|---|
| 6  | mid-stream edits | rewritten line / revise→delete→resume |
| 10 | self-correction | strikethrough+replace / doubt→correct |
| 13 | streaming JSON | syntax-tinted output / parser commits |
| 17 | tool error + retry | calm card cycling / error tick + backoff band |
| 18 | permission gate | prompt UI / gate→wait→flush |
| 49 | cancel mid-stream | freeze + dim / interrupt point |
| 55 | retry countdown | countdown UI / backoff band |
| 60 | compression / summary | text shrinks / compress band |

## interactions
- **Sidebar** — pick a pattern
- **Playhead drag** — scrub both tracks in lockstep
- **Speed control** — 0.5× / 1× / 2×
- **Mech-tick hover** — exact firing time
- **Keyboard:**
  - `space` — play / pause
  - `← →` — step 200ms · `shift+← →` — step 1s
  - `↑ ↓` — change pattern
  - `[ ]` — speed down/up
  - `0` — reset to start

## stack
vanilla · IBM Plex Mono · DOM · hand-authored event arrays

## motion
A playhead sweeps left-to-right at the chosen rate; each pattern's surface re-renders for the current `t` and each mechanism tick lights up the moment the playhead crosses it. Ticks marked `fire: true` switch to accent color when triggered. Bands draw a yellow window where the mechanism is "waiting on something the user does not see."

## imagination
- moves/scripted-await-timeline (proven in 61-hitl-patterns)
- tensions/showing-mechanism-vs-polish
- veins/design-system-and-reference-sheets
- /spark 2026-06-16 — Press strategy
- drafted in [../daily-sketch/sketch-agent-stream-scrub/](../daily-sketch/sketch-agent-stream-scrub/)
