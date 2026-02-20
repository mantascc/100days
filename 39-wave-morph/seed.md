# Wave Morph Sketch

## Concept
One wave. Four shapes. Smooth transitions between them.

Visual and audio in sync — see what you hear.

---

## Wave Types

| Key | Type | Character |
|-----|------|-----------|
| 1 | Sine | Pure, smooth |
| 2 | Triangle | Linear, soft |
| 3 | Square | Binary, buzzy |
| 4 | Sawtooth | Bright, full |

---

## Structure

```
SETUP
  canvas: 800 x 300
  audioContext: Web Audio API
  oscillator: starts as sine, 220Hz
  gainNode: for volume control
  
STATE
  currentWave: 'sine'
  morphProgress: 0..1 (for visual interpolation)
  
DRAW LOOP
  clear canvas
  draw single wave cycle across width
  wave shape = interpolate based on currentWave + morphProgress
  
AUDIO
  oscillator.type = currentWave (instant switch)
  // Note: Web Audio doesn't interpolate types
  // Visual can smooth, audio snaps
  
INTERACTION
  keys 1-4: switch wave type
  click: toggle sound on/off
```

---

## Visual Wave Functions

```
sine(x):
  return sin(x * TWO_PI)

triangle(x):
  return 1 - 4 * abs(round(x) - x)

square(x):
  return x < 0.5 ? 1 : -1

sawtooth(x):
  return 2 * (x - floor(x + 0.5))
```

Where `x` is normalized 0..1 across the wave cycle.

---

## Morphing Approach

Two options:

**A. Crossfade (simple)**
```
y = lerp(waveA(x), waveB(x), t)
```

**B. Harmonic morph (truer)**
Blend the Fourier components — more complex but acoustically honest.

Start with A.

---

## Extensions

- Drag to change frequency
- Show harmonic spectrum alongside
- Multiple waves, phase offset
- Record a "wave journey" sequence

---

## Stack
- Vanilla JS + Canvas
- Web Audio API OscillatorNode
- No dependencies