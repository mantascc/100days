# Day 26 - Widget Dashboard

A dynamic widget dashboard with drag-and-drop reordering and data visualizations.

## Features

- **Dynamic Height Layout** - Widgets automatically size based on content with consistent 16px gaps
- **Drag & Drop Reordering** - Reorder widgets with visual drop placeholder indicator
- **Widget Types:**
  - Chart (placeholder)
  - Metric (placeholder)
  - Moon Phase - Displays lunar phase data with visualization
  - Agent Usage - Heatmap visualization of agent interaction data

## Architecture

- `index.html` - Main layout engine with drag/drop logic
- `widgets.js` - Modular widget type definitions and rendering
- `styles.css` - Dark theme design system with CSS custom properties
- `moonphase.json` - Moon phase data
- `agent.json` - Agent usage interaction data (600KB+)

## Design System

- **Dark Mode** - Base color #151621 with progressive surface elevation
- **Typography** - System font stack with defined scale (11px-32px)
- **Colors** - Consistent border, text, and surface colors using CSS variables

## Usage

Open `index.html` in a browser. Click toolbar buttons to add widgets, drag handle icons (⋮⋮) to reorder, expand icons (⛶) to view modal details.
