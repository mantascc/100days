# sketch-agent-stream-scrub

## idea
A scrubbable timeline of agent streaming patterns: each pattern is a hand-choreographed await-timeline of visible output, with a parallel track underneath that exposes the *mechanism* — debounce gates, batch boundaries, flush triggers, retry pauses. Polish on top, mechanism beneath, both in one frame.

## patterns
Eight surface-vs-mechanism patterns from [agent-patterns.md](../agent-patterns.md):

| # | Pattern | What the two tracks show |
|---|---|---|
| 6 | Mid-stream edits | rewritten line / decision tick |
| 10 | Self-correction | strikethrough+replace / "I changed my mind" |
| 13 | Streaming JSON arguments | clean text / parser state |
| 17 | Tool error + retry | calm card / retry tick |
| 18 | Permission gate | prompt UI / wait window |
| 49 | Cancel mid-stream | freeze + dim / interrupt point |
| 55 | Retry countdown | countdown UI / backoff band |
| 60 | Compression/summarization | output shrinks / cycle |

## tags
agents, streaming, timeline, scrubbable, hitl, reference-sheet, mechanism

## stack
vanilla · IBM Plex Mono · DOM · scripted event arrays

## motion
A playhead sweeps left-to-right. Top track types/streams/edits visibly. Bottom track shows ticks when mechanism fires. Drag the playhead — both tracks scrub in lockstep. Pattern picker on the left switches recipes.

## imagination
- moves/scripted-await-timeline (proven in 61-hitl-patterns)
- tensions/showing-mechanism-vs-polish
- veins/design-system-and-reference-sheets
- /spark 2026-06-16 — Press strategy
