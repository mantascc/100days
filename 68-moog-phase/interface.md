# Day 68: Moog Phase

## Idea
Phase portrait of a Moog loop — the signal plotted against its delayed self

## Description
A looped WAV of a Moog sequence ("windy-hillclimb.wav") plays through a Web Audio AnalyserNode, and every frame 2048 time-domain samples are drawn as a single path where x is `sample[i]` and y is `sample[i + 512]` — the same signal offset by a quarter of the buffer. This is a phase space reconstruction: plotting a signal against a delayed copy of itself reveals the topology of the system that produced it.

A pure sine traces a circle. Harmonics, filter sweeps, and note changes distort it into lobes, spirals, and rotating figures; silence collapses to a dot at the crosshair. Because the Moog is monophonic with a smooth ladder filter, each state of the sequence maps to a recognisable geometry instead of smearing into a cloud.

The canvas fades with a 0.25-alpha fill rather than clearing, so recurrent paths burn brighter and transients ghost out — the portrait shows current state and recent history at once. When paused, an idle state draws a faint slowly rotating circle on the axes. A snapshot button exports the canvas as a timestamped PNG.

## Data Concepts
- **Primary**: Audio (time-domain signal analysis)
- **Secondary**: Temporal (delay embedding, trail persistence)

## Conceptual Tags
#phase-space #delay-embedding #oscilloscope #lissajous #signal-geometry #audio-visualization #moog

## Technical Tags
#web-audio-api #analyser-node #canvas-2d #trail-fade #media-element-source #png-export

## Stack
- Web Audio API: MediaElementSource → AnalyserNode (fftSize 2048, smoothing 0.0) → destination
- HTML5 Canvas with dpr-aware sizing
- `getByteTimeDomainData` normalised to ±1, scaled to 46% of stage
- Looped `<audio>` element, click-to-play (autoplay policy)
- `canvas.toDataURL` snapshot download

## Notes
- `smoothingTimeConstant = 0.0` is deliberate — any averaging would lag the portrait behind the waveform
- the quarter-buffer offset only gives an exact 90° shift for one frequency; everything else distorts the circle, which is where the shapes come from
- explainer.md maps signal properties to portrait geometry (pitch → radius, harmonics → lobes, glide → rotation)
- amber accent on near-black, crosshair axes — oscilloscope as aesthetic object
