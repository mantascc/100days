# Day 26: Dynamic Widget Dashboard

## Idea
Drag-and-drop widget dashboard with charts, metrics, moon phase, and agent usage displays

## Description
This project creates a customizable dashboard where users can add, reorder, and expand various widget types through drag-and-drop interaction. Widgets include charts, metrics, moon phase information with energy keywords, and agent usage analytics. Each widget has a drag handle for reordering and an expand button for modal view. The layout uses single-column stacking with automatic height calculation and smooth placeholder indicators during drag operations.

The implementation tracks widget order and positions dynamically, temporarily creating elements to measure heights before final rendering. Moon phase data is embedded with astrological energy keywords like "refine, polish, prepare" for Waxing Gibbous phase. Agent usage data loads from external JSON. The system uses order property for widget sequencing and calculates insertionY based on mouse position during drag.

## Data Concepts
- **Primary**: Visual (dashboard interface, widget composition, data display)
- **Secondary**: Temporal (moon phase cycles, agent usage over time), Network (agent interaction data)

## Conceptual Tags
#dashboard #widgets #drag-drop #data-visualization #modular-ui #dynamic-layout #responsive-design #moon-phase #analytics

## Technical Tags
#drag-api #dynamic-rendering #json-data #modal-overlay #height-calculation #widget-system

## Stack
- HTML5 Drag and Drop API
- Vanilla JavaScript
- External CSS and widget modules
- JSON data loading

## Mechanics
- **Widget Types**: Chart, Metric, MoonPhase (with energy metadata), Agent Usage
- **Drag System**: Drag handle enables dragging; dragstart stores offset and widget reference; dragover calculates insertion position; drop reorders widget array
- **Layout Engine**: Sorts widgets by order property, calculates Y positions with VERTICAL_GAP (16px), measures heights via temporary elements
- **Reordering Logic**: Compares old vs new order, shifts intermediate widgets up/down, normalizes sequential order after drop
- **Modal System**: Expand button creates fullscreen overlay with larger widget view, closes on overlay click or close button
- **Dynamic Rendering**: Clears DOM, recreates all widgets, recalculates positions on resize/add/reorder

## Parameters
- `MAX_WIDTH: 800` - Maximum container width
- `CONTAINER_PADDING: 16` - Edge padding
- `VERTICAL_GAP: 16` - Space between widgets
- Moon phase data includes:
  - `illumination_fraction: 0.78`
  - `age_days: 11.5`
  - `energy keywords: refine, polish, prepare`
  - `focus: iterate, QA/crit, prepare launch`

## Notes
- Moon phase widget includes astrological/energetic interpretation beyond astronomical data
- Order-based system allows arbitrary resequencing without position constraints
- Temporary element creation for height measurement ensures accurate layout
- Drag handle pattern prevents accidental widget dragging during content interaction
- Single-column layout simplifies mobile responsiveness
- Modal expansion allows detailed data exploration without cluttering dashboard
- The project demonstrates widget architecture pattern common in dashboard frameworks
- Drop placeholder provides visual feedback during reorder operation
- External widget module (widgets.js) suggests extensible widget system
