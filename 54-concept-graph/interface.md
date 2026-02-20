# Day 54: Concept Graph Visualization

## Idea
Interactive force-directed graph visualizing relationships between 100 Days projects and their data concepts

## Description
This visualization represents the entire 100 Days collection as an interactive network graph. Eight data concept nodes (Network, Clustering, Statistical, Temporal, Spatial, Audio, Visual, Emergence) form the core structure, with individual project nodes positioned around their primary concepts. The force-directed physics simulation creates organic clustering while maintaining readability.

The graph is generated from interface.md metadata across all projects, parsing data concepts and building a relationship network. Hover interactions reveal project details and highlight connections. The collapsible legend shows project counts per concept. This meta-visualization demonstrates how the collection explores different data domains and reveals patterns in the creative coding journey.

## Data Concepts
- **Primary**: Network & Graph (force-directed layout, node relationships)
- **Secondary**: Statistical (concept distribution analysis)

## Conceptual Tags
#meta-visualization #force-directed-graph #project-network #data-concepts #interactive-visualization #physics-simulation #self-documentation #portfolio-visualization

## Technical Tags
#canvas-2d #force-simulation #spring-physics #node-graph #hover-interaction #json-data #metadata-parsing

## Stack
- HTML5 Canvas
- Vanilla JavaScript
- Force-directed physics engine
- JSON data loading
- Custom graph rendering

## Mechanics
- **Force-Directed Layout**:
  - Spring forces between connected nodes (projects → concepts)
  - Repulsion between all nodes (stronger for concept-concept, weaker for project-project)
  - Center gravity for concept nodes
  - Cooling schedule: high damping (0.70) → low damping (0.92) over 200 steps
- **Node Types**:
  - Concept nodes: Large (radius 10), colored, labeled, positioned in circle
  - Project nodes: Small (radius 3), gray, positioned near primary concept
- **Interaction**:
  - Hover to highlight node and connections
  - Tooltip shows project/concept details
  - Drag to reposition nodes
  - Mouse interaction with tooltip following cursor
- **Pre-simulation**: 120 physics steps before display for stable initial layout
- **Data Pipeline**:
  - interface-query/generate-concept-graph.js parses all interface.md files
  - Generates concept-graph-data.json with projects grouped by concepts
  - Visualization loads JSON and builds interactive graph

## Parameters
- Concept node radius: 10px
- Project node radius: 3px
- Spring length: 120
- Spring strength: 0.008
- Repulsion: 4000
- Center strength: 0.0008
- Cooling steps: 200
- Pre-simulation: 120 steps
- Initial concept positioning: circular at radius 250

## Notes
- This is a meta-project - a visualization of the 100 Days collection itself
- Demonstrates self-documentation: projects document themselves via interface.md
- The graph reveals which concepts are most explored (Visual: 16, Spatial: 14)
- Force-directed layout naturally clusters related projects
- Smart initial positioning reduces jumpiness (projects start near primary concept)
- Cooling schedule prevents chaotic motion on load
- Reduced project-project repulsion (30%) prevents excessive spreading
- The eight data concepts emerged organically from surveying all projects
- This visualization makes the collection's structure visible and navigable
- Serves as both portfolio piece and analytical tool
- The concept distribution shows emphasis on visual/spatial exploration
- Network and temporal concepts form substantial secondary themes
- Emergence has only 1 project (Day 2: Vicsek Model) - rarest concept
- The graph is interactive documentation - hover to learn about any project
- Built with computational minimalism aesthetic (dark background, subtle UI)
- The legend is collapsible to reduce UI clutter during exploration
- Project shows how metadata enables automated visualization
- This type of meta-analysis could extend to show temporal evolution, tag relationships, etc.
