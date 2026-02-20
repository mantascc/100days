# Schelling's Segregation Model

An interactive visualization of Schelling's model of segregation - demonstrating how small individual preferences can lead to large-scale segregation patterns.

## Demo

Open `index.html` in your browser to run the simulation.

## Features

- **Interactive Controls**: Play, pause, step through iterations, and reset
- **Adjustable Parameters**:
  - **Tolerance**: Minimum fraction of similar neighbors needed for happiness (0.00-1.00)
  - **Density**: Percentage of grid cells occupied by agents (0.30-0.98)
  - **Radius**: Neighborhood size for checking similarity (1-3)
  - **Grid**: Canvas dimensions from 40×40 to 200×200
- **Real-time Statistics**: Track iteration count
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

The simulation places two types of agents (blue and yellow-green) randomly on a grid. Each agent evaluates their neighborhood based on the radius parameter. If the fraction of similar neighbors is below their tolerance threshold, they become unhappy and relocate to a random empty cell. This process repeats until equilibrium is reached.

## Technology

Single-file HTML application with:
- Vanilla JavaScript (no frameworks)
- Canvas API for rendering
- CSS Grid and Flexbox for responsive layout
- Minimalist dark theme design

## Local Development

No build process needed! Simply:

```bash
# Option 1: Open directly
open index.html

# Option 2: Run a local server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## License

MIT
