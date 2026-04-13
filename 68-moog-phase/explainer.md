# Phase Portrait — Signal to Behavior

## What the visualization does

Every frame, the code reads a buffer of 2048 audio samples from the Web Audio analyser node. It then draws a single continuous path where:

- **X axis** = `sample[i]` — the signal's amplitude at moment *i*
- **Y axis** = `sample[i + 512]` — the same signal, shifted forward by a quarter of the buffer (quarter-period offset)

Each sample pair becomes one point. The 2048 points are connected in order, tracing a curve across the canvas. The canvas is not cleared between frames — it fades slowly (`rgba(15,15,15,0.25)` fill) so recent traces persist and older ones ghost out.

## Why the offset matters

The quarter-period shift is the core mechanic. Without it, you'd plot amplitude against itself — a diagonal line, no information. By offsetting, you're plotting the signal against a slightly-delayed version of itself. This is the definition of a **phase space reconstruction**: using a single observed variable (the audio signal) to reconstruct the topology of the underlying system.

For a pure sine wave at frequency *f*, the offset at exactly one quarter period produces a 90° phase difference. Sine and cosine plotted against each other trace a perfect circle. Any deviation from a pure sine — harmonics, modulation, transients — distorts that circle into richer shapes.

## How Moog sequences produce distinct forms

A Moog synthesizer produces notes with a small, stable set of harmonics filtered through the ladder filter. Each harmonic adds a predictable distortion to the circle:

| signal character | portrait shape |
|---|---|
| pure sine | circle or ellipse |
| triangle wave | four-lobed figure |
| sawtooth | tight spiral with tail |
| filter opening | loops grow and split outward |
| new note (frequency change) | figure rescales and rotates |
| portamento / glide | shape continuously rotates |
| silence / rest | collapses to a dot at center |

Because the Moog is monophonic and the filter is smooth, the portrait stays legible — each state maps to a recognizable geometry. A full mix or percussive signal would smear into a cloud.

## From audio property to visual behavior

| audio property | visual consequence |
|---|---|
| pitch (fundamental frequency) | size of the figure — higher pitch = larger radius |
| harmonic content | number and shape of inner loops |
| amplitude / volume | scale of the whole figure |
| filter cutoff sweep | progressive morphing of loop geometry |
| rhythmic gating | figure appears and collapses on beat |
| sequence step change | discontinuous jump to new shape |

## The trail mechanic

The partial-opacity fill (`alpha 0.25`) means each frame partially overwrites previous frames but doesn't erase them. The figure builds up density where the signal spends the most time — recurrent paths burn brighter. Transient paths fade in a few frames. This makes the portrait show both the current state and the recent history simultaneously, giving the impression of a physical object with inertia.

## Code path

```
AudioContext → AnalyserNode (fftSize 2048, smoothing 0.0)
  → getByteTimeDomainData(timeData)         // 2048 uint8 samples, range 0–255
  → normalize: v = sample / 128.0 - 1.0    // range -1.0 to +1.0
  → x = W/2 + timeData[i]        * W * 0.46
    y = H/2 + timeData[i + 512]  * H * 0.46
  → ctx.lineTo(x, y) for i = 0..1535
  → ctx.stroke()
```

`smoothingTimeConstant = 0.0` is intentional — no temporal averaging so the portrait responds to each frame's exact waveform without lag.
