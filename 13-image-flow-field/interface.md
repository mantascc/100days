# Day 13: Image Flow Field

## Idea
Upload images transformed into flowing particle fields using Perlin noise displacement

## Description
This project deconstructs uploaded images into grids of colored particles that flow according to fractal Brownian motion. Each grid cell samples its color from the original image, then the particle representing that cell is displaced by multi-octave Perlin noise to create organic wave-like motion. The result is a liquid, breathing version of the source image where colors swim through space while maintaining overall compositional structure. Users can upload custom images via file picker or drag-and-drop, with automatic center-crop to square aspect ratio.

The implementation downsamples images to grid resolution (cols×rows) using an offscreen canvas, storing RGBA values in a typed array for efficient per-frame lookup. Three flow modes provide different motion aesthetics: line mode for vertical waves, ocean mode for 2D turbulence, and radial mode for emanating patterns. The wave intensity slider controls displacement amplitude, noise frequency, and time progression simultaneously. Mobile devices use optimized parameters with the same grid density but adjusted rendering for performance.

## Data Concepts
- **Primary**: Visual (image sampling, color representation, particle rendering)
- **Secondary**: Spatial (vector field displacement, grid-based layout), Statistical (Perlin noise, fractal processes)

## Conceptual Tags
#image-processing #flow-field #perlin-noise #pixel-art #visual-effects #image-deconstruction #particle-representation #fbm #responsive-design

## Technical Tags
#canvas #offscreen-canvas #file-api #drag-drop #image-sampling #typed-arrays #mobile-optimization

## Stack
- HTML5 Canvas (main and offscreen)
- FileReader API
- Vanilla JavaScript
- CSS Flexbox
- Responsive viewport units

## Mechanics
- **Image Loading**: FileReader converts uploaded files to data URLs; Image objects load asynchronously; automatic center-crop to 1:1 aspect ratio before processing
- **Downsampling**: Offscreen canvas at grid resolution (cols×rows) renders image with contain-fit scaling; getImageData extracts RGBA values into Uint8ClampedArray (4×cols×rows length)
- **Grid Sampling**: Each cell (c,r) maps to index (r×cols+c)×4 in RGBA array for O(1) color lookup per frame
- **Flow Modes**:
  - Mode 1 (line): vertical displacement only, horizontal position drives noise
  - Mode 2 (ocean): independent 2D noise for x and y with offset seeds for decorrelation
  - Mode 3 (radial): distance from center drives noise, displacement applied in polar direction
- **Wave Control**: Slider (3-10) linearly scales amplitude (0-40px), frequency (0-0.01), and speed (0-0.02)
- **Alpha Filtering**: Skips rendering particles with alpha < 5 (threshold) to respect transparency
- **Mobile Detection**: innerWidth ≤768 or user agent pattern triggers mobile config with same 4px grid but optimized agent size

## Parameters
- `grid: 4` / `mobileGrid: 4` - Grid cell spacing in pixels (same for both)
- `size: 2` / `mobileSize: 2` - Particle render size (same for both)
- `amplitude: 20` - Maximum displacement (wave-controlled, max 40)
- `frequency: 0.009` - Noise sampling frequency (wave-controlled, max 0.01)
- `speed: 0.012` - Time progression rate (wave-controlled, max 0.02)
- `octaves: 3` - fBm octave count
- `persistence: 0.5` - Amplitude decay per octave
- `lacunarity: 1.5` - Frequency multiplier per octave
- `flowMode: 2` - Displacement mode (1=line, 2=ocean, 3=radial)
- `wave: 6` - Wave intensity slider (3-10 range)
- `alphaThreshold: 5` - Minimum alpha value to render (0-255)

## Notes
- The 4px grid resolution provides good balance between image recognizability and abstract particle aesthetic
- Downsampling to grid resolution before animation eliminates per-frame image sampling overhead - colors are static while positions flow
- Center-crop to square ensures consistent aspect ratio regardless of upload, preventing distortion in square canvas
- The offscreen canvas uses `willReadFrequently: true` context hint to optimize repeated getImageData calls
- Alpha threshold of 5 (not 0) accounts for floating-point rounding in image processing that might leave near-zero but non-zero alpha values
- Ocean mode (mode 2) uses different seed offsets (13.37, 42.42) for x and y noise to prevent correlated displacement that would create diagonal bias
- Image smoothing enabled during downsampling despite low resolution to prevent harsh aliasing in source image
- Drag-and-drop event handlers on both canvas and wrap div provide generous drop target area
- The system caches last loaded image (lastImg) to enable resampling on window resize without requiring re-upload
- Mobile detection includes both viewport width AND user agent for robust device identification
- Flow field approach maintains image's "structural memory" - colors remain generally where they started, just displaced, unlike full particle advection
- The contain-fit scaling during downsampling ensures entire image visible without cropping during render phase (crop only during initial square conversion)
