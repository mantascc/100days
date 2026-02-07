# Coworker Force Time Graph

An interactive force-directed graph visualization that displays coworker interactions over time. Built with React, TypeScript, D3.js, and Tailwind CSS.

## Features

- **Force-Directed Graph**: Visualize coworker relationships using D3's force simulation
- **Time-Based Animation**: Watch interactions unfold chronologically with playback controls
- **Interactive Controls**: Play, pause, adjust speed, and scrub through the timeline
- **Rich Data Display**: View node details including name, role, team, and location
- **Edge Information**: See interaction types, duration, projects, and notes
- **Responsive Design**: Modern UI that works across different screen sizes

## Data Format

### Nodes CSV (`coworkers_nodes.csv`)
```csv
id,name,role,team,location,email
1,John Doe,Software Engineer,Frontend,"New York, NY",john.doe@example.com
```

### Edges CSV (`coworkers_edges.csv`)
```csv
event_id,source,target,timestamp,event_type,duration_minutes,project,weight,note
1,1,2,2025-09-01T10:00:00,meeting,30,Project Alpha,3,Kickoff meeting
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Load your CSV files using the file upload buttons
2. Click "Play" to start the animation
3. Use the timeline slider to jump to specific points in time
4. Adjust playback speed with the speed control
5. Hover over nodes and edges to see detailed information
6. Click nodes to highlight their connections

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **D3.js** - Force simulation and data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## License

MIT
