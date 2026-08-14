---
id: techniques/asymmetric-audio-envelope
type: technique
title: Asymmetric audio envelope (fast attack, slow release)
state: active
charge: high
spawned: [10-audio-reactive-agents, 17-audio-reactive-network, 67-audio-reactive-ascii, 90-aida001, daily-sketch/sketch-audio-agents-grid]
feeds: [threads/audio-reactivity, themes/audio-reactive-without-gimmick]
sources: []
date: 2026-08-09
tags: [audio, envelope, rms, webaudio, mapping]
---

# What
Take RMS off the analyser and run it through an envelope follower whose attack
is much faster than its release. The visual snaps awake on a transient and
decays slowly through the silence after it, so a field *blooms* on a sound and
sustains as it fades instead of tracking the waveform frame by frame.

This is the difference between audio-reactive and audio-*tracking*. Mapping
amplitude directly gives the wiggling-bars failure — the visual is a readout,
and a readout is never surprising. The asymmetry introduces memory: the image
at any moment depends on what just happened rather than on what is happening,
which is the same reason a room with reverb feels alive and an anechoic one
does not.

The first audio entity in the layer, despite audio-reactivity being a
high-charge thread since June. It went unnamed because it was never the
subject of a sketch — only ever the mechanism underneath one.

# Trace
- [10-audio-reactive-agents](../../10-audio-reactive-agents/) — first use, before it was deliberate.
- [17-audio-reactive-network](../../17-audio-reactive-network/) — threshold pulsing on the link mesh.
- [67-audio-reactive-ascii](../../67-audio-reactive-ascii/) — envelope driving a glyph ramp rather than geometry.
- [90-aida001](../../90-aida001/) — the RMS→animation sensitivity vector exposed in a drawer, i.e. the mapping made editable.
- [sketch-audio-agents-grid](../../daily-sketch/sketch-audio-agents-grid/) — one shared envelope across nine different movement rules; the clearest isolation of the technique, since only the envelope is held constant.

# Charge
High. `sketch-audio-agents-grid` is close to a controlled experiment for it —
nine rules, one signal, one envelope — and the uniform start/stop across all
nine cells is the technique showing rather than the rules showing.

# Prompts
- Per-band envelopes with different release times — lows that sustain, highs that snap.
- Release time as the exposed control instead of sensitivity; let a viewer tune the memory of the image.
- Use it with no audio at all — drive the envelope from an unrelated event stream (tool calls, scroll, keystrokes) and see whether the aliveness survives the source.
