# Day 44: Whiff

## Idea
Command-line tool that instantly visualizes JSON data as tables, line graphs, or bar charts in the browser

## Description
Whiff bridges the terminal and browser for rapid data exploration. Send JSON files from the command line and see them instantly rendered as interactive visualizations—no coding required. The tool consists of a bash CLI, Node.js WebSocket server, and React frontend. Data flows from terminal → WebSocket → browser in real-time, enabling fast iteration on data visualization without writing visualization code.

Supports tables (default), line graphs (single or multi-series), and bar charts. Multi-series line graphs allow comparing multiple metrics with custom colors and automatic legend generation. The system auto-detects appropriate visualization types based on data structure, with manual overrides available via CLI flags.

## Data Concepts
- **Primary**: Temporal (time-series data, line graphs)
- **Secondary**: Network (WebSocket communication), Visual (data rendering)

## Conceptual Tags
#data-visualization #command-line-tools #real-time-updates #exploratory-data-analysis #json-visualization #developer-tools #rapid-prototyping

## Technical Tags
#websocket #react #vite #node-js #cli #svg-rendering #real-time-data

## Stack
- React 19 + Vite 7 (frontend)
- WebSocket server (ws library, Node.js)
- Bash script (CLI interface)
- Custom SVG-based visualization components
- Port 8081 (WebSocket), Port 5173 (Vite dev)

## Architecture

**Four-component system:**

1. **canvas.sh** - Bash CLI entry point
2. **send-to-canvas.js** - Node.js data parser & WebSocket sender
3. **ws-server.js** - WebSocket server (port 8081)
4. **React app** - Visualization frontend (port 5173)

**Data flow:**
```
JSON file → CLI → Parser → WebSocket → Browser → Render
```

## Mechanics

### CLI Commands

**Display as table:**
```bash
./canvas.sh data.json
```

**Line graph (single series):**
```bash
./canvas.sh data.json --type line --xKey team --yKey wins
```

**Multi-series line graph:**
```bash
./canvas.sh data.json --type line --xKey team --yKeys wins,losses --colors "#4ade80","#f87171"
```

**Bar chart:**
```bash
./canvas.sh data.json --type bar --xKey team --yKey wins
```

### Visualization Types

- **Table**: Default for arrays of objects, displays all fields
- **LineGraph**: Single or multi-series with custom colors, automatic scaling, legend
- **BarChart**: Vertical bars for categorical comparisons

### File Discovery

1. Checks `data/` folder first
2. Falls back to project root
3. Auto-wraps raw JSON with visualization metadata

## Parameters

**CLI Options:**
- `--type` - Visualization type (line, bar, table)
- `--xKey` - Data field for X-axis
- `--yKey` - Single Y-axis field
- `--yKeys` - Comma-separated Y fields (multi-series)
- `--colors` - Comma-separated hex colors
- `--label` - Chart title

**Constraints:**
- WebSocket port: 8081
- Vite dev port: 5173
- File location: data/ folder or project root

## Use Cases

**Data exploration:**
- View JSON structure as table
- Graph time-series metrics
- Compare multiple data series

**Development workflow:**
- Debug API responses visually
- Monitor data changes in real-time
- Share quick visualizations with team

**Analysis tasks:**
- Compare performance metrics
- Visualize trends over time
- Explore dataset relationships

## Notes
- Real-time updates via WebSocket—no page refresh needed
- Automatic data structure detection (arrays → tables)
- Multi-series support with independent colors and automatic legend
- SVG-based rendering for crisp, scalable charts
- Flexible file discovery avoids hardcoded paths
- Terminal-native workflow for developers
- Example datasets included: basketball standings, bar data, line data
- Future enhancements: scatter plots, pie charts, data filtering, zoom/pan
- MIT licensed, designed as customizable development tool
- Component-based React architecture enables easy extension
