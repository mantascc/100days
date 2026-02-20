# Day 15-2: Binary Camera Grid (Variant)

## Idea
Real-time webcam feed converted to binary grid visualization with adjustable threshold and cell size

## Description
This project is functionally identical to Day 15, transforming live webcam video into a stark binary grid representation where each cell is either fully on (white) or off (black) based on luminance threshold. The camera feed downsamples to a grid of cells, computes luma (perceived brightness) for each cell, and applies threshold comparison to create a high-contrast pixelated effect. Users control the threshold value (0-255) to adjust how much light is required to activate a cell, and cell size (1-10) to change resolution. The video is always horizontally mirrored for natural preview.

The implementation uses a two-canvas approach: an offscreen canvas at grid resolution performs the expensive per-frame video sampling and pixel analysis, while the main canvas renders the binary grid at full device pixel ratio. Cover-fit cropping ensures the video fills the square canvas without letterboxing. Luma calculation uses the standard NTSC coefficients (0.299R + 0.587G + 0.114B) for perceptually accurate brightness measurement.

## Data Concepts
- **Primary**: Visual (image processing, luminance, binary representation)
- **Secondary**: Spatial (grid-based sampling, resolution control)

## Conceptual Tags
#camera-input #image-processing #threshold #binary-image #luminance #real-time-video #grid-sampling #pixelation #computer-vision #iteration

## Technical Tags
#canvas #webcam-api #offscreen-canvas #getusermedia #image-data #luma-calculation #cover-fit

## Stack
- HTML5 Canvas (main and offscreen)
- getUserMedia API
- HTML5 Video element
- Vanilla JavaScript
- CSS Flexbox

## Mechanics
- **Camera Access**: getUserMedia with 'user' facing mode (front camera); video set to autoplay with playsinline for mobile
- **Grid Resolution**: Cell size (1-10 scale factor × DPR) determines cols and rows; offscreen canvas sized to exact grid dimensions (cols×rows pixels)
- **Cover-Fit Cropping**: Aspect ratio comparison determines crop region in video; wider videos crop horizontally, taller videos crop vertically; always centered
- **Mirroring**: Scale(-1,1) transform applied to offscreen canvas before drawing video for mirror effect
- **Downsampling**: drawImage() scales cropped video region to offscreen grid resolution in single operation
- **Luma Computation**: NTSC formula (299R + 587G + 114B)/1000 converts RGB to perceptual brightness (0-255)
- **Threshold**: Binary decision per cell - if luma ≥ threshold, fill white square; otherwise leave black
- **Grid Overlay**: Optional grid lines drawn at cell boundaries with dark grey color (#1a1a1f)

## Parameters
- `threshold: 128` - Luminance threshold for binary decision (0-255, slider range 0-255, default 128)
- `gridSize: 5` - Cell size multiplier (1-10, slider range 1-10, default 5)
- `DPR: 1-2` - Device pixel ratio capped at 2 for performance
- Luma coefficients: `R×0.299 + G×0.587 + B×0.114` (NTSC standard)

## Notes
- This appears to be a duplicate or iterative version of Day 15 with identical code
- The two-canvas architecture separates concerns: offscreen for compute-heavy sampling, main for rendering
- Using `willReadFrequently: true` context hint on offscreen canvas optimizes repeated getImageData calls
- Luma formula weights green channel highest (0.587) reflecting human eye's peak sensitivity to green wavelengths
- Binary representation eliminates all gradation - forces high contrast aesthetic reminiscent of early computer graphics
- The project may represent iteration/refinement during the 100 days challenge, or exploration of the same concept on a different day
