# Day 22: Directed Network Graph

## Idea
SVG-based force-directed graph with directional edges, rectangular nodes, and drag interaction

## Description
This project creates a force-directed network visualization using D3.js v7 with directed edges shown via arrowheads. Unlike typical circular nodes, this uses rectangular nodes sized to fit text labels, creating a flowchart-like aesthetic. Nodes are grouped by category with color coding, and edges connect from rectangle edges (not centers) using geometric intersection calculations. Users can drag nodes to reposition them, with the simulation reheating to accommodate changes. A collapsible side panel provides additional interface controls.

The implementation includes sophisticated edge routing that calculates intersection points between rectangles and connecting lines, ensuring arrows start and end at rectangle boundaries rather than centers. The angle-based geometric calculation determines which edge (top/bottom/left/right) to intersect based on the direction between nodes.

## Data Concepts
- **Primary**: Network (directed graph, node relationships, hierarchical flow)
- **Secondary**: Spatial (force-directed layout, geometric calculations)

## Conceptual Tags
#directed-graph #force-directed-layout #d3js #network-visualization #rectangular-nodes #edge-routing #flowchart-aesthetic #hierarchical-structure

## Technical Tags
#svg #d3-force #geometric-intersection #drag-interaction #arrow-markers #text-measurement

## Stack
- D3.js v7
- SVG
- Vanilla JavaScript
- External data module (data.js)
- CSS

## Mechanics
- **Force Simulation**: D3 forces - link (distance 80), charge (-240 repulsion), center gravity, collision (radius 50), weak x/y centering (strength 0.05)
- **Node Sizing**: Text measurement via temporary SVG text element; bounding box calculated, then width+28px padding, height fixed at 28px
- **Edge Routing**: Geometric intersection calculation - given angle between nodes, determine which rectangle edge to intersect using ratio test: `|tx| > |ty × hw/hh|` selects horizontal vs vertical edge
- **Arrow Markers**: SVG `<marker>` definition with viewBox, auto-orient, positioned at edge endpoints
- **Drag Behavior**: Three-phase drag - start fixes position and reheats simulation (alpha 0.3), drag updates fixed position, end unfixes and cools simulation
- **Color Coding**: ColorMap object assigns fill colors based on node.group property
- **Window Resize**: Updates force center and x/y forces, restarts simulation with alpha 0.3

## Parameters
- Link distance: 80px
- Charge strength: -240 (strong repulsion)
- Collision radius: 50px
- Center forces: 0.05 strength (weak gravity)
- Node dimensions: dynamic width (text + 28px), fixed height 28px
- Drag alpha target: 0.3 (simulation heat during interaction)

## Notes
- Rectangular nodes create more formal, diagram-like appearance vs typical circular network graphs
- Edge intersection math crucial for visual polish - arrows appear to emerge from rectangle edges not floating in space
- The angle-ratio test (`|tx| > |ty × hw/hh|`) elegantly handles all four rectangle edges with single comparison
- Text measurement before rendering prevents layout shift and enables accurate node sizing
- Group-based coloring supports semantic node categorization (e.g., by type, role, department)
- Strong negative charge (-240) prevents node overlap and maintains readability
- Weak centering forces (0.05) keep graph roughly centered without overpowering other forces
- Collision force with 50px radius provides comfortable spacing for readability
- Arrow markers with auto-orient ensure proper directional indication regardless of edge angle
- The collapsible side panel suggests additional UI (hidden in this code) for controls or data
- Directed edges imply hierarchical or sequential relationships (unlike undirected social networks)
- The implementation supports dynamic data loading via external data.js module
- Drag functionality essential for manual layout refinement in complex networks
- SVG rendering enables crisp scaling and allows individual element inspection/interaction
- The project demonstrates professional data visualization practices with attention to geometric detail
