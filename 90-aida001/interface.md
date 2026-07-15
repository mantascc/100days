# Day 90: AIDA001

## Idea
First audio-visual sketch. An agent swarm animated in real time by the user's own recordings (or live mic), with a media-player-style control island and a settings drawer for the RMS→animation sensitivity vector.

## Description
AIDA001 is a new sketch category — deliberate blends of audio and visual authored together, using field recordings from the a1da instrument diary. Three loops (`01` heartbeat, `02` and `03` pattern experiments) drive an analyser whose RMS loudness modulates agent speed, jitter, and link visibility in a full-viewport swarm. The floating island collapses controls into a single line — Play/Pause · segmented sample picker · Mic · Settings — matching a music-player mental model rather than a debug UI. All animation-mapping parameters (the "sensitivity vector") live behind the gear.

## Data Concepts
- **Primary**: Audio (real-time RMS, buffered playback, live mic)
- **Secondary**: Network (proximity link visualization), Spatial (agent positions), Interaction (media-player UI vocabulary)

## Conceptual Tags
#audio-visual #media-player-ui #sensitivity-vector #self-recorded #agent-swarm #real-time #sonification

## Technical Tags
#web-audio-api #audiobuffersource #media-element #canvas #responsive-defaults #settings-drawer

## Stack
- HTML5 Canvas
- Web Audio API — AnalyserNode, AudioBufferSourceNode with pause-position tracking, MediaStreamSource
- Vanilla JavaScript
- Responsive CSS (mobile detection sets smaller agent count + link radius)

## Mechanics
- **Source model**: `sourceMode ∈ { 'sample' | 'mic' | null }` with an independent `selectedSample`; Play/Pause toggles the buffer node while remembering wrap-around position (`elapsed % duration`) so pausing and resuming preserves phase.
- **Sample loading**: on-demand `fetch → decodeAudioData` per sample, cached in-memory after first play. `SAMPLE_URLS` map allows remapping labels (01/02/03) to different files independently of button order.
- **Audio routing**: sample nodes → gain → analyser + `ac.destination`; mic → analyser only (avoids feedback).
- **Sensitivity vector**: `speed = baseSpeed + rmsSpeed × RMS`; `noise = baseJitter + rmsJitter × RMS`; link distance and agent count also live in the vector.
- **Mobile defaults**: `matchMedia('(max-width: 768px)') || maxTouchPoints > 2` picks smaller `agents` (90) and `linkDist` (42); DEFAULTS is the single source of truth — sliders and Reset both read from it.
- **Keyboard**: Space play/pause, 1/2/3 pick sample, M mic, S settings.

## Parameters (defaults)
- `rmsSpeed: 12` — RMS→speed sensitivity
- `rmsJitter: 100` — RMS→jitter sensitivity
- `baseSpeed: 0.10` · `baseJitter: 0.05`
- `linkDist: 54` desktop · `42` mobile
- `agents: 200` desktop · `90` mobile
- `smoothing: 0.84` — analyser time-smoothing
- `gain: 0.60` — sample playback gain

## Samples
Three loops recorded in the a1da instrument diary (July 15):
- `samples/pattern-1.m4a` — heartbeat
- `samples/pattern-2.wav` — pattern (was `0715-pattern`)
- `samples/pattern-3.wav` — pattern-2 (was `0715-pattern2`)

## Notes
- The pause implementation tracks `pausePosition = (ac.currentTime - playStartTime + pausePosition) % duration`, allowing true resume across loop boundaries.
- The media-player mental model was a deliberate reset from the previous "each button both selects and plays" scheme; separating selection from play made switching samples mid-playback feel obvious.
- The "sensitivity vector" framing collects the audio→motion mapping into a single tunable knob-cluster instead of scattering it across the code.
- First entry in the AIDA (audio-visual) series — subsequent sketches will explore other visual grammars driven by the same instrument diary.
