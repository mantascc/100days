# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a self-contained single-file implementation of **Schelling's Segregation Model** - an agent-based simulation demonstrating emergent spatial segregation patterns. The entire application lives in `index.html` with embedded JavaScript and CSS.

## Architecture

**Single-file application structure:**
- HTML markup defines the UI controls (tolerance, density, radius, grid size sliders) and canvas element
- Embedded CSS using CSS variables for theming (mintis agent style color palette)
- Vanilla JavaScript simulation engine (no frameworks or build tools)

**Core simulation logic:**
- Grid stored as `Uint8Array` where 0=empty, 1=agent A, 2=agent B
- Agent happiness determined by checking neighborhood (radius R) for similar agents vs tolerance threshold T
- Each iteration: identify unhappy agents, shuffle them with empty cells, update positions
- Canvas rendered via `createImageData()` and `putImageData()` for direct pixel manipulation

**Key data structures:**
- `gridArr`: Uint8Array of N×N cells representing agent types
- `empties`: Array tracking indices of empty cells for efficient agent relocation
- Parameters: T (tolerance), D (density), R (radius), N (grid size)

## Development

**Running the application:**
```bash
# Simply open index.html in a browser, or serve with:
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

**No build process** - this is a static HTML file with no dependencies, transpilation, or bundling required.

## Simulation Parameters

- **Tolerance** (0.00-1.00): Fraction of similar neighbors needed for happiness
- **Density** (0.30-0.98): Percentage of grid cells occupied by agents
- **Radius** (1-3): Neighborhood size for checking similar agents
- **Grid** (40-200): NxN grid dimensions

## Code Modifications

When modifying the simulation:
- Color constants are defined at lines 65-67 (COL_A, COL_B, COL_BG)
- Core happiness logic is in `happyAt()` function (lines 120-137)
- Agent movement occurs in `step()` function (lines 140-167)
- Canvas rendering happens in `draw()` (lines 171-181)
- All state is maintained in closure scope within the IIFE starting at line 63
