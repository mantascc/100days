# agent-patterns

A working inventory of agent streaming patterns. Shared reference for the three streaming-patterns sketches ([markov-map](sketch-agent-stream-markov-map/), [glyphs](sketch-agent-stream-glyphs/), [scrub](sketch-agent-stream-scrub/)).

## Text streaming
1. Token-by-token reveal (typewriter)
2. Word-by-word reveal (chunked)
3. Sentence-by-sentence reveal
4. Markdown progressive render (headings/lists materialize as parsed)
5. Code block with syntax highlighting catching up to the cursor
6. Streaming with mid-stream edits (model rewrites a prior line)

## Reasoning / cognition
7. Thinking trace — dimmed italic stream
8. Collapsed thought summary ("thought for 3s")
9. Numbered chain-of-thought steps
10. Self-correction (strikethrough + replace)
11. Confidence/uncertainty inline hints

## Tool calls
12. Single tool call card (pending → running → done)
13. Streaming tool arguments (JSON builds key-by-key)
14. Parallel tool bundle (fan-out, independent resolves)
15. Sequential tool chain (dependency arrows)
16. Tool result expansion / collapse toggle
17. Tool error + retry
18. Permission/approval prompt mid-stream
19. Nested sub-agent spawn

## File operations
20. File edit diff stream (+/− lines)
21. File create (whole file streams)
22. File read header + truncated preview
23. Multi-file edit batch (stack of diffs)
24. Patch hunk with @@ headers
25. Search/grep results streaming in

## Web / research
26. Inline citation [1] appearing post-claim
27. Source card materializing
28. URL fetch with favicon load
29. Web search results listing in

## Status / progress
30. Spinner with phase label
31. Determinate progress bar
32. Step indicator (1/5 → 5/5)
33. Breathing ellipsis / heartbeat
34. Token counter ticking
35. Cost meter
36. Elapsed time + ETA

## Long-running / background
37. Background task chip
38. Live log tail
39. Streaming metric chart
40. Completion toast/notification

## Multi-agent
41. Sub-agent nested card
42. Parallel agent fleet grid
43. Agent handoff transition
44. Voting / consensus reveal
45. Judge verdict card

## Multimodal
46. Image generation tile (blur → resolve)
47. Audio waveform building
48. Video frame-by-frame

## Control / interruption
49. Cancel mid-stream (freeze + dim)
50. Resume / continue
51. Edit-and-retry
52. Branch / fork conversation
53. Undo last action

## Errors / recovery
54. Error banner mid-stream
55. Retry countdown
56. Rate-limit pause
57. Fallback model switch indicator

## Memory / state
58. Memory write chip
59. Context-loaded indicator
60. Compression/summarization animation
61. Plan mode update

## UI affordances
62. Skeleton → content
63. Shimmer load
64. Progressive image (LQIP blur-up)
65. Fade-in stagger
66. Slide-in from below
