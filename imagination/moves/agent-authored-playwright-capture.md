---
id: moves/agent-authored-playwright-capture
type: move
title: Agent-authored Playwright capture
state: active
charge: low
spawned: [83-video-index]
feeds: [veins/design-system-and-reference-sheets]
sources: []
date: 2026-06-14
tags: [automation, capture, agent, video]
---

# What
Use LLM subagents to script headless-browser interactions — drive a sketch through Playwright, record the canvas, then transcode with ffmpeg. The maker frames it as "the producer briefs the camera operator": the human sets intent, the agent performs the capture choreography. It's a meta-move, automation pointed at the practice's own output, turning interactive sketches into a browsable video index without manual screen-recording.

# Trace
- [83-video-index](../../83-video-index/) — agents capturing the whole sketchbook on film.

# Charge
New and lightly used — one sketch deep, but conceptually fertile. The seed of a whole "tooling for the practice" direction.

# Prompts
- Agent-directed *cinematography*: briefs that specify camera moves, not just frames.
- Auto-generate a contact sheet of every sketch's most active frame.
- Let an agent A/B two parameter settings of a sketch and edit the comparison.
