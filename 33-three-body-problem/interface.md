# Day 33: Slit-Scan Camera

## Idea
Webcam-based slit-scan photography tool that captures 30-second temporal slices with programmatic color effects and cinematic post-processing

## Description
This project implements slit-scan photography - a technique that captures time as space by reading a vertical slice from the webcam center and building it column-by-column into a final image. Over 30 seconds, the system samples 1-pixel-wide vertical slices at ~33fps, compositing them horizontally into a 1000px wide final image. Movement during capture creates warped, flowing effects as time becomes x-axis position. The implementation applies sophisticated post-processing: programmatic hue shifts (70% cyan at middle, transitions to magenta and yellow at edges), dynamic vignette spike at 60% position, film grain (15% intensity), contrast adjustment, and posterization.

The interface includes onboarding with live preview showing the center scan line, then transitions to full scan mode with visual progress indicator. After completion, users can copy the image to clipboard (desktop) or download (mobile fallback). The color effects use smooth interpolation with custom easing, creating gradient transitions between distinct hue zones. Film grain applies luminance-based intensity for photorealistic texture.

## Data Concepts
- **Primary**: Temporal (time-to-space mapping, 30-second capture window, sequential sampling)
- **Secondary**: Visual (image processing, color effects, slit-scan aesthetic), Spatial (column-based composition, vertical slicing)

## Conceptual Tags
#slit-scan #temporal-photography #time-distortion #webcam-effects #image-processing #color-grading #film-grain #procedural-effects #creative-photography

## Technical Tags
#webrtc #canvas #getusermedia #image-processing #hsl-color #posterization #vignette #film-grain #clipboard-api

## Stack
- HTML5 Canvas
- WebRTC (getUserMedia)
- Vanilla JavaScript
- RGB-HSL color conversion
- Clipboard API / Download fallback

## Mechanics
- **Slit-Scan**: Each frame, sample 1px wide vertical slice from video center (videoWidth/2), paste as column at currentX position on canvas
- **Time Control**: ~33 captures/second via CAPTURE_INTERVAL (30ms) for 30-second total duration = 1000px width
- **Hue Distribution**: Programmatic mapping with smooth transitions:
  - 0-15%: Hue 250 (magenta) with 5% blend zones
  - 15-85%: Hue 150 (cyan) - majority of scan
  - 85-90%: Hue 60 (yellow)
  - 90-100%: Transition back to 250
- **Vignette Spike**: Dynamic strength based on position - 0 until 50%, ramps to 70 at 60%, ramps down to 0 by 70%, then stays 0
- **Film Grain**: Pseudo-random noise (sin-based) at 15% intensity, luminance-weighted (peaks in midtones), grain multiplier = 1 - |luminance-0.5|×2
- **Contrast**: Standard formula using factor (259×(level+255))/(255×(259-level)), applied before other effects
- **Posterization**: Quantize RGB to numColors levels (150) via round(value/255×(levels-1))×(255/(levels-1))
- **Copy/Download**: Clipboard API (ClipboardItem) on desktop, blob download fallback for mobile

## Parameters
- `MAX_WIDTH: 1000` - Final image width in pixels
- `CAPTURE_INTERVAL: 30ms` - Time between slice captures (~33fps)
- `numColors: 150` - Posterization levels (out of 256)
- `contrastLevel: 155` - Contrast adjustment (0-255 range, 128=no change)
- `grainIntensity: 15` - Film grain strength (percentage)
- Hue zones:
  - Magenta (250°): 20% of scan
  - Cyan (150°): 70% of scan
  - Yellow (60°): 10% of scan
- `vignetteStrength: 0-70` - Dynamic, peaks at 60% position
- `blendWidth: 5%` - Hue transition zone width

## Notes
- Slit-scan technique invented for 2001: A Space Odyssey's psychedelic star-gate sequence
- Time-as-space mapping creates motion trails - stationary objects appear as vertical bands, moving objects create diagonal smears
- The 30-second duration provides good balance - long enough for interesting movement, short enough to maintain engagement
- Programmatic hue distribution creates visual narrative - magenta intro, cyan body, yellow-magenta ending
- Smooth interpolation using smoothstep (t²(3-2t)) prevents harsh hue boundaries
- Vignette spike at 60% creates dramatic focal point in final image's temporal center
- Film grain with luminance weighting mimics real photographic grain distribution
- Pseudo-random noise using sin function provides deterministic but unpredictable patterns
- RGB↔HSL conversion enables hue manipulation while preserving luminance and saturation
- Posterization reduces color levels creating graphic, illustration-like aesthetic
- Center-crop to 1:1 could be added but current implementation uses full video height
- Mobile fallback demonstrates progressive enhancement - try modern API, fall back to universal download
- Onboarding video preview with indicator line teaches the interaction before committing to 30-second capture
- The technique reveals usually-invisible temporal dimension through spatial distortion
- Mirror transform (scaleX(-1)) on onboarding video provides natural preview for front-facing cameras
- Copy button feedback (temporary "Copied"/"Downloaded" text) provides completion confirmation
- The project transforms everyday webcam into creative tool for experimental photography
