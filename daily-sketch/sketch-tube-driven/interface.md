# sketch-tube-driven

## idea
Audio drives the **tube**, not the picture. One CRT filling the frame, showing a
test card and a probe dot that orbits at a fixed rate and is never touched by the
signal. What the sound moves is the tube's physical condition — emission, bloom,
persistence, convergence, focus, grain. Silence returns every axis to nominal, so
a correct tube is always one quiet moment away.

## tags
crt, audio-reactive, optics, canvas, webaudio, texture, single-tube

## stack
vanilla · canvas 2d · Web Audio · IBM Plex Mono · single file, no deps

---

## the argument

The standing complaint against audio-reactive work is that the sound gets *drawn*
— bars, rings, a waveform that wiggles. The reaction is bolted on, and it reads as
decoration because nothing about the image required it.

So nothing here is drawn from the signal. The card is identical at silence and at
full scale: same circles, same crosshatch, same probe at the same angle for a
given moment. The audio only ever reaches the **treatment**, and the treatment is
optics — which is the one thing in the pipeline that has a physical excuse to
respond to being driven harder.

## the mapping

| band | axis | why that is what a tube would do |
|---|---|---|
| **bass** | emission, bloom | more drive current: the beam burns brighter and the halo swells around it |
| **bass, slow** | persist | an overdriven phosphor lets go slowly — the trail is thermal, not musical |
| **mid** | spot | focus wanders under load |
| **treble** | noise, converge | HF trash in the supply; the guns drift out of registration |
| **level** | geometry | a little high-voltage sag pulls the raster |

**phosphor does not move.** The coating colour is a property of the tube, not of
the signal, and letting it chase the audio would be exactly the gimmick this is
arguing against.

Each band has its own attack/release, so the axes settle at different rates:
`emission` snaps (0.50 / 0.13) while `persist` lags badly (0.07 / 0.020). On a
beat the brightness hits first and the comet catches up two or three hits later —
the tube is visibly slower than the music, which is the tell that it is a physical
object and not a meter.

## proof

**bypass** freezes every axis at nominal while the audio keeps running. This is
the control that makes the claim falsifiable: if the picture still moves under
bypass, the picture was reacting. It does not. The only thing that changes is the
tube.

Silence is the same test from the other side — stop the signal and the tube walks
home to a clean, correct reference.

## the signal

Two sources, one analyser, so there is exactly one analysis path.

- **internal** (default) — a small silent generator: kick with a pitch envelope,
  filtered noise hats, and a detuned three-voice saw pad through a slow LFO'd
  lowpass, at 96bpm over a four-chord loop. Routed to the analyser but not to the
  speakers. **hear it** opens a 0.28 monitor gain if you want the sound too.
- **mic** — `getUserMedia`, swapped onto the same analyser. Monitoring is forced
  off and disabled on this path; a live mic through the speakers is a feedback
  loop.

The internal generator exists so the sketch is fully alive from `file://`.
`getUserMedia` needs https or localhost, and the **mic** button says so plainly
rather than failing silent.

## reading the tube

The right-hand readout is the tube's condition, not the music: eight axes, each
with a tick marking nominal and a bar showing where the signal has pushed it.
Values are the real render parameters (`0.80px`, `112ms`, `+2.4px`), so what you
read is what the pipeline got. Under bypass the bars go grey.

## the pipeline
Inherited from [91-retro-primitives](../../91-retro-primitives/) and
[92-tube-tolerance](../../92-tube-tolerance/), unchanged: phosphor buffer faded
not cleared, per-gun composite with offset *and* scale, 12-strip pincushion,
bloom → bloom → subject all `screen`, vignette, shared grain, `color` blend for
the coating, CSS shell with bevel and scanlines. The governing rule still holds —
**subtract sharpness, add light.**

## motion
The probe orbits at a constant `0.0016 rad/ms`, independent of everything. Grain
regenerates every third frame. Under `prefers-reduced-motion` the clock freezes
and grain stops regenerating; the tube still responds to audio, because that is
the subject of the piece rather than decoration.

## notes
- `devicePixelRatio` capped at 1.5, two bloom passes, one 2048-point FFT.
- The card is redrawn and re-split into three gun buffers every frame. It only
  changes where the probe is, so this is wasteful — a static card plus a separate
  probe layer would cut it, but the guns have to be rebuilt for the probe anyway.
- **Open:** `converge` is driven unsigned, so treble only ever pushes the guns
  one way. Signed drive off a spectral-centroid delta would let the fringe swing
  through zero, which is where it looks most like a real fault.
- **Open:** no way to record. The interesting artefact is a *take* — thirty
  seconds of a specific tube reacting to a specific sound — and there is
  currently no way to keep one.

## imagination
Came from `/spark` on 2026-08-09 as the **Press**:
[`techniques/crt-tube-treatment`](../../imagination/techniques/crt-tube-treatment.md)
→ [`themes/audio-reactive-without-gimmick`](../../imagination/themes/audio-reactive-without-gimmick.md).
Also takes the technique's own standing prompt — *"a single tube filling the
viewport, one subject, no grid — commit fully to the reference."* Lands on
[`threads/audio-reactivity`](../../imagination/threads/audio-reactivity.md),
whose note already named the cure: the work is best when the motion is *"a
consequence of optics, not a reaction bolted on."* The bypass control answers
[`themes/showing-mechanism-vs-polish`](../../imagination/themes/showing-mechanism-vs-polish.md)
— it is a polished piece that ships the switch which disproves its own effect.

**Harvest 2026-08-09 — `no-signal`.** The mapping holds and `bypass` proves it,
but the maker's read is that it lands cold: the theme was answered as an argument
rather than felt as a piece. Nothing lifted into the layer, and in particular the
theme stays open — a sketch that satisfies a question on paper has not closed it.
Per SPEC §7.1.1 this closes the read, not the sketch.
