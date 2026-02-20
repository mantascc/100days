# Day 20: Schelling Segregation Model

## Idea
Agent-based simulation demonstrating how individual preference for similarity leads to emergent spatial segregation patterns

## Description
This project implements Thomas Schelling's groundbreaking segregation model, a foundational agent-based simulation in social science. Two types of agents (blue and yellow-green) occupy a grid, each with a tolerance threshold for dissimilar neighbors. Agents who are "unhappy" (too few similar neighbors within their radius) relocate to random empty spots. Even with low intolerance (tolerance=0.65 means only 65% similar neighbors needed), the system rapidly self-organizes into highly segregated clusters. The simulation can run step-by-step or continuously, demonstrating how micro-level preferences create macro-level patterns.

The implementation uses direct pixel manipulation via ImageData for fast rendering of 40-200×200 grids. Agents are initially placed randomly at specified density, then iteratively check neighborhoods (configurable radius 1-3) and swap with empty cells if unhappy. The system tracks empty cell indices for efficient random placement without expensive grid scans. The emergence of segregation from modest individual preferences is profound - a tolerance of 0.65 (accepting 65% dissimilar neighbors) still produces near-total segregation.

## Data Concepts
- **Primary**: Spatial (agent positioning, neighborhood analysis, segregation patterns)
- **Secondary**: Statistical (threshold-based decisions, emergent patterns), Temporal (iterative evolution)

## Conceptual Tags
#agent-based-model #schelling-model #emergence #segregation #social-simulation #threshold-dynamics #spatial-patterns #tipping-points #complexity-science

## Technical Tags
#canvas #image-data #pixel-manipulation #simulation #discrete-time #spatial-algorithms

## Stack
- HTML5 Canvas
- ImageData API
- Vanilla JavaScript
- CSS Grid and Flexbox

## Mechanics
- **Grid Representation**: Uint8Array of N×N cells (0=empty, 1=agent A, 2=agent B)
- **Initial Placement**: Fisher-Yates shuffle of indices; first D×N² cells filled with agents (50/50 split A/B); remaining become empty list
- **Happiness Check**: For agent at (x,y), count neighbors within radius R; if >T fraction are same type, agent is happy; isolated agents (total=0) always happy
- **Agent Movement**: Each iteration - (1) identify all unhappy agents, (2) shuffle unhappy list and empty list, (3) swap unhappy agents with random empty cells up to min(unhappy, empties)
- **Rendering**: Create ImageData, iterate through gridArr setting RGBA values per cell type, putImageData for instant display
- **Parameter Space**: Tolerance T (0-1), Density D (0.3-0.98), Radius R (1-3 cells), Grid N (40-200)

## Parameters
- `tolerance: 0.65` - Minimum fraction of similar neighbors required for happiness (0-1, default 0.65)
- `density: 0.50` - Fraction of grid cells occupied by agents (0.3-0.98, default 0.5)
- `radius: 2` - Neighborhood size for checking neighbors (1-3 cells, default 2)
- `gridSize: 200` - Grid resolution N×N (40-200, default 200×200 = 40,000 cells)
- Colors:
  - Agent A: #002FFF (blue)
  - Agent B: #B4E03C (yellow-green)
  - Empty: #0b0b0f (dark grey)

## Notes
- Schelling's model (1971) was revolutionary in demonstrating emergence - simple rules producing complex outcomes
- The "segregation paradox": even tolerant individuals (accepting 35% dissimilar neighbors) create highly segregated systems
- With tolerance=0.65, most runs achieve >90% local similarity despite only requiring 65% - system overshoots equilibrium
- Radius parameter dramatically affects dynamics - R=1 creates fine-grained patterns, R=3 creates large homogeneous regions
- Density matters: low density (0.3-0.5) allows rapid reorganization, high density (0.8+) constrains movement causing slower or incomplete segregation
- The model demonstrates "tipping points" - small tolerance changes can cause qualitative regime shifts
- Empty cell tracking optimization crucial for performance - naive random placement would be O(N²) per agent move
- Pixel-perfect rendering at up to 200×200 (40K cells) maintains real-time performance via direct buffer manipulation
- Fisher-Yates shuffle ensures unbiased random placement without systematic spatial patterns in initial state
- The model has been applied to understanding residential segregation, school integration, language adoption, and opinion clustering
- Historical context: Schelling developed this with coins on a checkerboard before computer simulations
- The UI "Parameters" button pattern addresses mobile UX - keeps controls accessible without cluttering canvas view
- Iteration counter provides quantitative measure of convergence speed under different parameters
- Play/pause/step controls enable both exploratory observation (step) and batch runs (play)
- The model demonstrates how individual-level preferences aggregate to system-level patterns that no individual intended
- Tolerance threshold creates binary agent decision despite continuous parameter - realistic for preference-based choices
