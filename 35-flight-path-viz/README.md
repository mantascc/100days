# Flight Path Prototype

Minimalist flight path visualization animating a single route on a dark monochrome map.

## Setup

**No API keys or accounts required!**

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari)

## Configuration

Edit `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
    // Change the route
    origin: [-122.4194, 37.7749],      // San Francisco
    destination: [0.1278, 51.5074],    // London

    // Adjust animation speed (milliseconds)
    animationDuration: 45000,          // 45 seconds

    // Visual customization
    pathColor: '#ffffff',
    pathWidth: 2,
    markerRadius: 8
};
```

## Features

- ✓ Great circle path calculation for accurate flight routes
- ✓ Smooth 45-second animation from origin to destination
- ✓ Pure black and white monochrome aesthetic
- ✓ Landscape orientation lock
- ✓ Minimal computational design
- ✓ No interaction controls (pure observation)

## Technical Stack

- Leaflet 1.9.4 - Open-source mapping library
- CARTO Dark Matter tiles - Free, no API key required
- Canvas-based path animation for smooth rendering
- Turf.js for geospatial calculations
- Pure JavaScript (no framework dependencies)

## Design Philosophy

This prototype embodies computational minimalism: clean geometry, high contrast, and contemplative pacing. The flight path appears as pure information against a stark background, revealing the arc of movement through space over time.
