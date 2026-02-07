# Feature: Background & Rounded Corners Context

## Objective
Implement a feature to allow users to export GIFs with a solid background color, padding, and rounded corners.

## High-Level Approach

The implementation touches three main areas: State/UI, Preview Rendering, and FFmpeg Export.

### 1. State & UI (`App.jsx`)
-   **State**: Added `backgroundSettings` object (`{ enabled, color, padding, borderRadius }`).
-   **UI**: Simplified control panel used to toggle the feature and select a color.
-   **Defaults**:
    -   Padding: Fixed at **10%** (0.1).
    -   Roundness: Fixed at **16px**.
    -   Color: Default `#292929` (Dark Gray).

### 2. Preview Rendering (`VideoCanvas.jsx`)
-   **Logic**: The canvas rendering loop was refactored to handle the "padded" view.
-   **Implementation**:
    -   Instead of drawing the video full-canvas, we calculate an "inner" rectangle based on the padding.
    -   We fill the canvas with the background color.
    -   We use `ctx.roundRect()` and `ctx.clip()` to draw the video with rounded corners inside that inner rectangle.
-   **Interaction Fixes**:
    -   **Crop Tool**: The crop selection tool had to be updated to respect the "inner" video coordinates.
    -   **Coordinate Mapping**: Visual coordinates (mouse clicks on canvas) are mapped to actual video coordinates (for FFmpeg) by subtracting the padding offset and scaling.

### 3. Export Pipeline (`App.jsx` & `ffmpegFilters.js`)
-   **Strategy**: We interact with FFmpeg using a generated mask file rather than complex geometric filters.
-   **Mask Generation**:
    -   Before export, `App.jsx` creates a hidden HTML Canvas.
    -   It draws a white rounded rectangle on a transparent background matching the video aspect ratio.
    -   This is saved as `mask.png` to the FFmpeg virtual filesystem.
-   **Filter Chain**:
    -   **Input**: The filter graph takes `input.mp4` [0:v] and `mask.png` [1:v].
    -   **Alpha Merge**: The mask is scaled to match the video and applied using the `alphamerge` filter.
    -   **Padding**: The `pad` filter is then applied to expand the canvas and fill the extra space with the background color.
-   **Crop Handling**:
    -   If a crop is active, coordinates are clamped to the video dimensions to prevent `FS error` crashes in FFmpeg.

## Key Files
-   `src/App.jsx`: State, UI, Mask Generation, Export Orchestration.
-   `src/VideoCanvas.jsx`: Real-time preview and crop interaction logic.
-   `src/utils/ffmpegFilters.js`: Filter string construction (`alphamerge`, `pad`).
