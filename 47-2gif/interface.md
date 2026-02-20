# Day 47: 2GIF

## Idea
Browser-based tool for converting screen recordings into polished, shareable gifs with styled backgrounds

## Description
2GIF transforms raw screen captures into presentation-ready animated gifs without leaving the browser. Design teams can upload video files (drag/drop), trim to key moments, crop/zoom to highlight specific UI interactions, and apply professional backgrounds (solid colors, gradients, blur effects, procedural patterns). The tool uses ffmpeg.wasm for client-side video processing, eliminating server uploads and privacy concerns.

Three-panel interface: canvas preview (video + background composite), settings panel (zoom, crop, background controls, export options), and timeline with trim markers. The workflow emphasizes speed—from screen recording to shareable gif in under a minute. Designed for creating assets for Slack, Twitter, presentations, and documentation.

## Data Concepts
- **Primary**: Visual (video processing, image export)
- **Secondary**: Temporal (timeline editing, trimming)

## Conceptual Tags
#video-processing #gif-export #screen-recording #design-tools #browser-tool #asset-creation #presentation-graphics #ui-documentation

## Technical Tags
#ffmpeg-wasm #canvas #video-api #file-api #timeline-ui #drag-drop #client-side-processing

## Stack
- ffmpeg.wasm (browser-based video processing)
- HTML5 Canvas (preview rendering)
- File API (drag/drop upload)
- RequestAnimationFrame (playback)
- OKLCH color space (gradients)
- No server required (fully client-side)

## Feature Tiers

### Baseline (Week 1)
- Video file upload (drag/drop, 500MB limit)
- Timeline trim (start/end markers)
- Crop/zoom controls (scale + position)
- Canvas preview with playback
- Export to .gif with basic settings

### Tier 2 (Week 2)
- Background system: solid color, 2-point gradient (OKLCH), blur from edges
- Timeline thumbnail strip
- Export presets (Slack, Twitter, Custom)
- File size estimator
- Resolution controls

### Tier 3 (Week 3)
- Procedural backgrounds (dot matrix from palette)
- Manual cursor placement with keyframe interpolation
- Speed controls (slow-mo on interactions)
- Loop options

## Interface Architecture

**Three-panel layout:**
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

**State model:**
- videoFile: File object
- timeline: {start, end, duration}
- canvas: {zoom, offsetX, offsetY}
- background: {type, params}
- export: {fps, quality, width, height}

## Workflow

1. Drag video file → auto-load preview
2. Scrub timeline to interesting moment
3. Zoom slider + drag to frame UI interaction
4. Select background style
5. Trim unnecessary frames
6. Export with size/quality balance

**Keyboard shortcuts:**
- Spacebar: play/pause
- I/O: set in/out points
- Arrow keys: frame advance
- +/−: zoom

## Background Types

1. **Solid color**: Single color fill
2. **2-point gradient**: Linear gradient (OKLCH color space)
3. **Edge blur**: Blur derived from video edges
4. **Procedural**: Dot matrix generated from video palette

## Performance Targets

- 60fps preview during editing
- <3 seconds export time per output second
- Smooth scrubbing with 100+ frame videos
- Memory: load video chunks for timeline thumbnails
- Canvas pooling for composite rendering

## Export Optimization

- Dithering for quality/size balance
- Color quantization (64-256 palette)
- Resolution caps (practical max: 800px)
- Preset formats: Slack (optimized), Twitter (compressed), Custom

## Notes
- Fully browser-based—no server uploads, privacy-friendly
- 500MB video file limit (client-side processing constraint)
- Designed for design teams sharing UI interactions
- Computational minimalism aesthetic: dark interface (#0a0a0a), monospace typography
- Background philosophy: intentional, not templated—derive from video content
- Out of scope (v1): auto cursor detection, audio, batch processing, collaboration
- Future: save/load project state, preset management, direct Slack/Figma upload
- Success metrics: workflow faster than desktop alternatives, team reaches for it first
- Evolution path: browser extension for quick capture → edit workflow
