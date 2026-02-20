Brief for Claude Code
Build a 2-column grid canvas system for data widget placement.
Core Requirements:

Canvas fits viewport width, grows vertically with content
2 fixed columns, widgets span 1 or 2 columns wide
Vertical grid snapping (40px rows)
Drag widgets up/down only (no horizontal movement)
Collision detection: auto-push widgets down, tight packing
Toolbar to add widget types (Chart 1col, Table 2col, Metric 1col)

Technical Approach:

HTML5 Canvas for rendering
Track widgets as objects: {id, type, col, row, colSpan, rowSpan, color}
Pack algorithm: sort by row, check collisions, push down if needed
Mouse events: detect widget clicks, track drag, repack on position change
Canvas height updates based on lowest widget + padding

Styling:

Dark theme (#0a0a0a background)
Minimal grid lines between columns
Widget cards with colored top bar, type label
Fixed toolbar at top

Keep it simple, functional. Focus on smooth drag behavior and reliable packing logic.