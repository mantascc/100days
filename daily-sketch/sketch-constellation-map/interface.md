# sketch-constellation-map

## idea
The 100 days as a constellation — concept hubs, project stars, a temporal trail

## tags
constellation, force-directed, concept-graph, temporal-trail, navigation, ghost-nodes, canvas

## stack
single-file canvas + vanilla JS, inlined concept-graph JSON (days 1–54 plus 8 extras), hand-rolled spring/repulsion/centering physics, hover tooltips, click-through to each day's folder

## motion
160 pre-settle simulation steps, then a ~3.5s day-by-day trail sweep (indigo → teal → amber) with a glow pulse on the current day; missing days render as dashed links to ghost dots; replay button re-runs the sweep
