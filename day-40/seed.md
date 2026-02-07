# Live Signal

## Concept
Focusrite input → raw waveform → minimal drawing.

Nothing else.

---

## Structure

```
SETUP
  canvas: full viewport, dark ground
  audioContext: new AudioContext()
  analyser: fftSize = 2048
  dataArray: Uint8Array(analyser.frequencyBinCount)
  
  getUserMedia({ audio: true })
    → createMediaStreamSource
    → connect to analyser
    
STATE
  stream: active/inactive
  
DRAW LOOP
  analyser.getByteTimeDomainData(dataArray)
  
  clear canvas (or don't — trail)
  
  beginPath
  for i in dataArray:
    x = map(i, 0, length, 0, width)
    y = map(dataArray[i], 0, 255, height, 0)
    lineTo(x, y)
  stroke
```

---

## Style

- Stroke: 1px, white or off-white
- No fill
- No grid, no labels, no UI
- Optional: slight transparency for ghosting

---

## Variation Knobs (for later)

| Param | Effect |
|-------|--------|
| fftSize | Detail level (512 = chunky, 4096 = smooth) |
| Line alpha | Trail / persistence |
| Y scale | Amplify quiet signals |
| Stroke color | Map to frequency or amplitude |

---

## Notes

- Click to start (AudioContext requires user gesture)
- Select Focusrite as input in browser/system
- Localhost or HTTPS only