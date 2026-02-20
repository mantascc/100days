# 2GIF — Video to Styled Gif Converter

## Purpose
Browser-based tool for design teams to convert screen recordings into polished, shareable gifs with professional backgrounds and precise cropping for highlighting UI interactions.

## Core Value
Transform raw screen captures into presentation-ready assets without leaving the browser or fighting with clunky desktop tools.

---

## Technical Foundation

**Runtime:** Browser-only (ffmpeg.wasm)
**Constraint:** 500MB video limit
**Output:** Optimized .gif files for Slack/Twitter/presentations

**Processing Pipeline:**
```
Video Upload → Canvas Preview → Timeline Edit → Export Render
     ↓              ↓                ↓              ↓
  File API    RequestAnimFrame   Trim/Crop    ffmpeg.wasm
```

---

## Feature Tiers

### BASELINE (Week 1)
- Video file upload (drag/drop)
- Timeline trim (start/end markers)
- Crop/zoom controls (scale + position)
- Canvas preview with playback
- Export to .gif (basic settings)

**Success:** Team can convert video → gif with custom framing

### TIER 2 (Week 2)
- Background system:
  - Solid color
  - 2-point gradient (OKLCH)
  - Blur from video edges
- Timeline thumbnail strip
- Export presets (Slack, Twitter, Custom)
- File size estimator
- Resolution controls

**Success:** Gifs look polished enough to share externally

### TIER 3 (Week 3)
- Procedural backgrounds (one type: dot matrix from palette)
- Manual cursor placement with keyframe interpolation
- Speed controls (slow-mo on interactions)
- Loop options

**Success:** Tool feels professional, not prototype

### OUT OF SCOPE (v1)
- Auto cursor detection
- Audio preservation
- Batch processing
- Collaboration features
- Advanced effects/filters

---

## Interface Architecture

### Three-panel layout:
```
┌─────────────────┬──────────────┐
│                 │   Settings   │
│   Canvas        │   - Zoom     │
│   Preview       │   - Crop     │
│                 │   - BG type  │
│   (Video +      │   - Export   │
│    Background)  │              │
├─────────────────┴──────────────┤
│   Timeline with trim markers   │
└─────────────────────────────────┘
```

### State model:
```javascript
{
  videoFile: File,
  timeline: {start, end, duration},
  canvas: {zoom, offsetX, offsetY},
  background: {type, params},
  export: {fps, quality, width, height}
}
```

---

## Interaction Patterns

**Primary workflow:**
1. Drag video → auto-load preview
2. Scrub timeline to interesting moment
3. Zoom slider + drag to frame interaction
4. Select background style
5. Trim unnecessary frames
6. Export with size/quality balance

**Keyboard shortcuts:**
- Spacebar: play/pause
- I/O: set in/out points
- Arrow keys: frame advance
- +/−: zoom

---

## Technical Considerations

**Performance targets:**
- 60fps preview during editing
- <3 seconds export time per output second
- Smooth scrubbing with 100+ frame videos

**Memory management:**
- Load video in chunks for timeline thumbnails
- Canvas pooling for composite rendering
- Progressive export feedback

**Export optimization:**
- Dithering for quality/size balance
- Color quantization (64-256 palette)
- Resolution caps (practical max: 800px)

---

## Aesthetic Direction

**Computational minimalism:**
- Dark interface (#0a0a0a base)
- Monospace typography for data
- Subtle grid systems
- Geometric precision in controls
- Background presets reveal system logic

**Background philosophy:**
Each background type should feel *intentional*, not templated. Procedural options derive from video content (palette, motion, energy) rather than arbitrary decoration.

---

## Success Metrics

**Week 1:** Does it work?
- Upload → trim → export completes
- Output gif plays correctly

**Week 2:** Does it look good?
- Backgrounds enhance presentation quality
- Export size appropriate for sharing

**Week 3:** Does it feel right?
- Team reaches for it over alternatives
- Workflow feels faster than previous tools
- Edge cases handled gracefully

---

## Open Questions

1. Default output dimensions? (600×600, 800×600, user-defined?)
2. Should zoom be linked to output aspect ratio?
3. File naming convention for exports?
4. How to handle vertical videos (mobile recordings)?
5. Background preview during scrubbing or only on pause?

---

## Evolution Path

**Post-v1 considerations:**
- Save/load project state
- Preset management (team styles)
- Direct upload to Slack/Figma
- Browser extension for quick capture → edit
- API for programmatic gif generation