# sketch-phrasing

## idea
One uniform random event stream, read three ways at once. The question is whether *timing alone* can make randomness feel authored — so the amplitude mapping is held constant and only the memory of each event changes.

## tags
generative, stochastic, envelope, randomness, small-multiples, computational-minimalism, canvas

## stack
vanilla · IBM Plex Mono · canvas · xmur3 → mulberry32

## motion
Four lanes scrolling left, oldest to newest, at one column per 12ms simulation step. The top row is the bare impulse train — the shared truth. Below it the same events as raw amplitude, as piecewise-banded amplitude, and as a one-pole attack/release envelope. Continuous; no start or end.

## the experiment
`themes/randomness-feeling-intentional` has one standing answer in this sketchbook: carve the random range with a non-linear mapping so a run reads as phases rather than a gradient. That answer operates in **space** — it changes *what* each event is worth.

This presses the newly-named `techniques/asymmetric-audio-envelope` against the same question from **time** instead. Same events, same instants, same amplitudes; the only difference in the third lane is that each event leaves a decaying trace. Fast attack, slow release, exactly the follower used in the audio sketches — with the audio removed entirely.

What shows up: the raw lane reads as scatter, the mapped lane reads as scatter with categories, and the phrased lane grows clusters and rests. Two events close together sustain into a plateau; an isolated one fades to nothing. Nothing was added to the randomness — only a memory of it.

## controls
- **attack** — 0.4 to 120 ms, exponential
- **release** — 8 to 2400 ms, exponential; 0 at the floor
- **density** — 1 to 30 events/sec
- **collapse release** — drops release to zero, at which point the phrased lane becomes the raw lane *exactly*. This is the falsification control: if the two lanes don't converge, the sketch is lying about sharing a stream.
- **reseed** — new stream, same three readings

## honesty notes
All three lanes are drawn in the same white at the same alpha curve. The accent is reserved for UI only. Colouring the phrased lane would have staged the result.

Randomness enters in exactly one place — the event test and the amplitude draw inside `step()`. Everything downstream is deterministic, so the same seed reproduces the same figure across reloads.

## verified
Collapse converges the phrased lane onto raw (release 0 → `coef` 0 → `env = target`). Simulation steps on a fixed 12ms accumulator, so the figure is frame-rate independent; the accumulator is clamped at 250ms so a backgrounded tab does not burst on return.

## imagination
- presses `techniques/asymmetric-audio-envelope` → `themes/randomness-feeling-intentional` (`/spark` 2026-08-02, Press)
- touches `threads/stochastic-and-noise`, `themes/showing-mechanism-vs-polish`
- first use of the envelope with no audio source — the third prompt in `techniques/asymmetric-audio-envelope`
