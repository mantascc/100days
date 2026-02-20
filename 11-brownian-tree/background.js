// Background particle animation system

// Shared variables that will be set from main
let canvas, ctx, backgroundCFG;
let W = 0, H = 0;
let dpr = 1;
let agents = [];

// Utility function
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

function initBackground(canvasElement, config) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  backgroundCFG = config;
  
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  
  // Setup resize handling
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();
  
  // Create agents
  createAgents();
}

function resizeCanvas() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  // Recreate agents with new dimensions
  createAgents();
}

function createAgents() {
  agents = Array.from({ length: backgroundCFG.agentCount }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    vx: rand(-1, 1) * backgroundCFG.speed,
    vy: rand(-1, 1) * backgroundCFG.speed
  }));
}

function stepAgents() {
  for (const a of agents) {
    // small jitter for a wandering feel
    a.vx += rand(-backgroundCFG.jitter, backgroundCFG.jitter) * 0.02;
    a.vy += rand(-backgroundCFG.jitter, backgroundCFG.jitter) * 0.02;

    // clamp velocity (keeps things slow/ambient)
    const s = Math.hypot(a.vx, a.vy) || 1e-6;
    const maxS = backgroundCFG.speed;
    if (s > maxS) { 
      a.vx = (a.vx / s) * maxS; 
      a.vy = (a.vy / s) * maxS; 
    }

    a.x += a.vx;
    a.y += a.vy;

    // wrap around edges for endless flow
    if (a.x < -2) a.x = W + 2;
    if (a.x > W + 2) a.x = -2;
    if (a.y < -2) a.y = H + 2;
    if (a.y > H + 2) a.y = -2;
  }
}

function drawGrid() {
  if (backgroundCFG.gridGap <= 0) return;
  const g = backgroundCFG.gridGap;
  ctx.beginPath();
  for (let x = 0; x <= W; x += g) { 
    ctx.moveTo(x, 0); 
    ctx.lineTo(x, H); 
  }
  for (let y = 0; y <= H; y += g) { 
    ctx.moveTo(0, y); 
    ctx.lineTo(W, y); 
  }
  ctx.strokeStyle = `rgba(255,255,255,${backgroundCFG.gridAlpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLinks() {
  const cutoff2 = backgroundCFG.linkDist * backgroundCFG.linkDist;
  ctx.lineWidth = 1;
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    for (let j = i + 1; j < agents.length; j++) {
      const b = agents[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= cutoff2) {
        const d = Math.sqrt(d2);
        const t = d / backgroundCFG.linkDist; // 0..1
        const alpha = backgroundCFG.linkAlphaNear + (backgroundCFG.linkAlphaFar - backgroundCFG.linkAlphaNear) * t;
        ctx.strokeStyle = `rgba(230,230,230,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function drawAgents() {
  const s = backgroundCFG.agentSize;
  ctx.fillStyle = '#e6e6e6';
  for (const a of agents) {
    // 2x2 "pixel" agents
    ctx.fillRect(Math.round(a.x) - 1, Math.round(a.y) - 1, s, s);
  }
}

function clearBackground() {
  ctx.fillStyle = '#0f0f12';
  ctx.fillRect(0, 0, W, H);
}

function renderBackground() {
  drawGrid();
  drawLinks();
  drawAgents();
}

function updateBackground() {
  stepAgents();
}

// Export dimensions for other modules
function getCanvasDimensions() {
  return { W, H };
}

function getCanvasContext() {
  return ctx;
}

// Make functions globally accessible
window.initBackground = initBackground;
window.updateBackground = updateBackground;
window.renderBackground = renderBackground;
window.clearBackground = clearBackground;
window.getCanvasDimensions = getCanvasDimensions;
window.getCanvasContext = getCanvasContext;
