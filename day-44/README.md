# Whiff

A real-time data visualization tool for the command line. Send JSON data and see it instantly visualized in your browser as tables, line graphs, or bar charts.

## What is Whiff?

Whiff is a lightweight visualization tool that bridges the gap between your data files and visual representations. It provides a simple command-line interface to instantly render JSON data in various formats without writing any visualization code.

## Problem It Solves

During development, data analysis, or debugging, you often need to:
- Quickly visualize data from JSON files
- Switch between different visualization types (table, line, bar)
- Compare multiple data series with different visual properties
- Avoid writing repetitive visualization code for one-off data exploration

Whiff solves this by providing:
- **Instant visualization** - No code needed, just point to your JSON file
- **Flexible rendering** - Same data file can be displayed as table, line graph, or bar chart
- **Multi-series support** - Display multiple metrics with custom colors
- **Live updates** - Changes appear in real-time via WebSocket
- **Command-line workflow** - Integrates seamlessly with your terminal-based workflow

## Architecture

Whiff consists of four main components working together:

```
┌─────────────────┐
│   canvas.sh     │  Command-line interface
│   (bash)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│send-to-canvas.js│  Data parser & sender
│   (Node.js)     │  - Reads JSON files
└────────┬────────┘  - Parses CLI options
         │           - Sends via WebSocket
         ▼
┌─────────────────┐
│  ws-server.js   │  WebSocket server
│   (Node.js)     │  Port 8081
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   React App     │  Visualization frontend
│   (Vite)        │  Port 5173
│                 │  - Table component
│                 │  - LineGraph component
│                 │  - BarChart component
└─────────────────┘
```

### Component Details

#### 1. Command-Line Interface (`canvas.sh`)
- Entry point for all visualization commands
- Passes arguments to the Node.js sender script
- Usage: `./canvas.sh <filename> [options]`

#### 2. Data Sender (`send-to-canvas.js`)
- Reads JSON files from `data/` folder or project root
- Parses command-line options (type, xKey, yKey, colors, etc.)
- Wraps raw data with visualization metadata
- Sends formatted payload via WebSocket to server

#### 3. WebSocket Server (`ws-server.js`)
- Runs on port 8081
- Receives data from sender script
- Broadcasts to all connected browser clients
- Maintains persistent connection for real-time updates

#### 4. React Frontend (`canvas-app/`)
- Vite development server on port 5173
- Connects to WebSocket server on mount
- Renders data based on type:
  - **Table**: Default for array of objects
  - **LineGraph**: Single or multi-series line charts with custom colors
  - **BarChart**: Vertical bar charts
- Auto-detects visualization type from data structure

## Installation

1. Install dependencies for the canvas app:
```bash
cd canvas-app
npm install
```

2. Make the canvas script executable:
```bash
chmod +x canvas.sh
```

## Running Whiff

Start both required servers:

```bash
# Terminal 1: Start the WebSocket server
cd canvas-app
npm run ws

# Terminal 2: Start the Vite dev server
cd canvas-app
npm run dev
```

Open your browser to `http://localhost:5173`

## Usage

### Basic Commands

**Display as table (default):**
```bash
./canvas.sh basketball-standings.json
```

**Display as line graph:**
```bash
./canvas.sh bar-data.json --type line --xKey team --yKey wins --label "Team Wins"
```

**Display as bar chart:**
```bash
./canvas.sh bar-data.json --type bar --xKey team --yKey wins --label "Team Wins"
```

### Advanced: Multi-Series Line Graphs

Display multiple metrics with custom colors:

```bash
./canvas.sh basketball-standings.json \
  --type line \
  --xKey team \
  --yKeys wins,losses \
  --colors "#4ade80","#f87171" \
  --label "Wins and Losses"
```

This creates a line graph with:
- Green line for wins
- Red line for losses
- Automatic legend showing which color represents each metric

### Command-Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--type` | Visualization type: `line`, `bar`, or `table` | `--type line` |
| `--xKey` | Data field for X-axis | `--xKey team` |
| `--yKey` | Data field for Y-axis (single series) | `--yKey wins` |
| `--yKeys` | Comma-separated fields for multiple series | `--yKeys wins,losses` |
| `--colors` | Comma-separated hex colors for each series | `--colors "#4ade80","#f87171"` |
| `--label` | Chart title/label | `--label "Team Performance"` |

## Data Structure

### File Organization

Data files should be placed in the `data/` folder:

```
day-44/
├── data/
│   ├── basketball-standings.json
│   ├── bar-data.json
│   └── line-data.json
├── canvas-app/
└── canvas.sh
```

### JSON Format

**For tables and single-metric charts:**
```json
[
  { "team": "PHX", "wins": 42, "losses": 18 },
  { "team": "DEN", "wins": 40, "losses": 20 }
]
```

**The script automatically wraps this with visualization metadata:**
```json
{
  "type": "line",
  "xKey": "team",
  "yKeys": ["wins", "losses"],
  "colors": ["#4ade80", "#f87171"],
  "label": "Team Performance",
  "data": [...]
}
```

## Available Datasets

Current datasets in `data/` folder:

- `basketball-standings.json` - Full basketball standings (10 teams with rank, wins, losses, pct, gb, streak)
- `bar-data.json` - Team wins data (8 teams)
- `line-data.json` - Monthly performance scores

## Technical Stack

- **Frontend**: React 19, Vite 7
- **WebSocket**: ws library (Node.js)
- **Visualization**: Custom SVG-based React components
- **Build Tool**: Vite
- **Package Manager**: npm

## Key Features

### 1. Real-Time Updates
Data is pushed instantly to the browser via WebSocket - no page refresh needed.

### 2. Automatic Data Detection
If no visualization type is specified, Whiff automatically:
- Renders arrays of objects as tables
- Respects embedded type specifications in JSON files

### 3. Multi-Series Support
LineGraph component supports multiple data series with:
- Independent Y-value keys
- Custom colors for each series
- Automatic scaling to fit all series
- Legend showing series labels and colors

### 4. Flexible File Discovery
The sender script automatically checks:
1. `data/` folder first
2. Project root as fallback

This allows organized data management without hardcoding paths.

## Development Workflow

Typical workflow for data exploration:

```bash
# 1. Add your JSON data to data/ folder
cp mydata.json data/

# 2. View as table to understand structure
./canvas.sh mydata.json

# 3. Visualize specific metrics
./canvas.sh mydata.json --type line --xKey date --yKey revenue

# 4. Compare multiple metrics
./canvas.sh mydata.json \
  --type line \
  --xKey date \
  --yKeys revenue,expenses,profit \
  --colors "#22c55e","#ef4444","#3b82f6"
```

## Future Enhancements

Potential additions:
- Scatter plots
- Pie charts
- Data filtering and transformations
- Export visualizations as images
- Custom color themes
- Data streaming for live updates
- Multiple visualization panes
- Zoom and pan for large datasets

## License

MIT

## Contributing

This is a development tool - feel free to fork and customize for your needs.
