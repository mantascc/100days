// Initialize and start the grid
const grid = new LoaderGrid();

// Register all loaders
// Group 1: Geometric Primitives
if (typeof geometricLoaders !== 'undefined') {
  geometricLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Geometric Primitives', i);
  });
}

// Group 2: Organic Forms
if (typeof organicLoaders !== 'undefined') {
  organicLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Organic Forms', i);
  });
}

// Group 3: Particle Systems
if (typeof particleLoaders !== 'undefined') {
  particleLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Particle Systems', i);
  });
}

// Group 4: Line Art
if (typeof lineartLoaders !== 'undefined') {
  lineartLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Line Art', i);
  });
}

// Group 5: Grid Distortions
if (typeof gridLoaders !== 'undefined') {
  gridLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Grid Distortions', i);
  });
}

// Group 6: Symbolic
if (typeof symbolicLoaders !== 'undefined') {
  symbolicLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Symbolic', i);
  });
}

// Group 7: Optical/Physics
if (typeof physicsLoaders !== 'undefined') {
  physicsLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Optical/Physics', i);
  });
}

// Group 8: Glitch/Digital
if (typeof glitchLoaders !== 'undefined') {
  glitchLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Glitch/Digital', i);
  });
}

// Group 9: Minimalist Reduction
if (typeof minimalistLoaders !== 'undefined') {
  minimalistLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Minimalist Reduction', i);
  });
}

// Group 10: Hybrid Behaviors
if (typeof hybridLoaders !== 'undefined') {
  hybridLoaders.forEach((loader, i) => {
    grid.registerLoader(loader, 'Hybrid Behaviors', i);
  });
}

// Start the animation
grid.init();
