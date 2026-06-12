# Day 76: Layout Depth

## Idea
Wireframe app shell where layout depth comes from shadow and contrast, not 3D

## Description
A greeked desktop app mockup ("Mintis") — titlebar with traffic lights, collapsible left sidebar, elevated center canvas card, and a right tool window — built to study how an interface communicates depth without any 3D transforms. The center card floats on stacked shadows (inset top highlight + three drop tiers) over a darker shell; side panels sit flat and transparent so the focal surface reads as nearest.

The sidebar toggles between a 44px icon rail and a full 240px panel with a choreographed two-phase transition: content fades out first, the frame resizes, then the other content fades in after a 0.42s delay. The right window expands from an icon stack into a detail panel with a pointer-captured drag handle that resizes it between 320 and 880px, writing a `--window-width` custom property. The center canvas yields to both via `:has()` selectors — no JS layout code.

All labels are greeked bars (rounded rects of `currentColor`), keeping attention on structure and elevation rather than content. On mobile the sidebar becomes a burger-triggered slide-in drawer with a scrim, the tool window folds away, and the canvas stays primary.

## Data Concepts
- **Primary**: Spatial (layout, elevation, layered panels)
- **Secondary**: Visual (shadow tiers, contrast hierarchy)

## Conceptual Tags
#layout #depth #elevation #shadow-hierarchy #app-shell #wireframe #progressive-disclosure

## Technical Tags
#css-transitions #has-selector #custom-properties #pointer-capture #lucide-icons #responsive

## Stack
- Single-file HTML/CSS, minimal vanilla JS (drawer toggle, panel expand, resize drag)
- Lucide icons via CDN, JetBrains Mono
- `:has()` for sibling-aware layout (canvas yields when sidebar/window expand)
- Pointer capture + `--window-width` custom property for panel resizing
- `is-resizing` class kills transitions during drag so resize tracks 1:1

## Notes
- Depth is sold entirely by contrast and shadow stacks — the side panels have no background at all, so the lit center card reads as the top layer
- The fade-resize-fade choreography (opacity delays 0s / 0.42s) prevents text from squishing during the sidebar collapse
- Only one tool-window icon can be active at a time; clicking the active one collapses the panel back to the rail
- Sibling sketch to 82-z-axis, which does the same study with real `translateZ` instead of shadows
