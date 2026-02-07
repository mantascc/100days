// Agent-User Interaction Network with Heatmap and Force Graph

let data = null;
let currentTime = 0;
let isPlaying = false;
let playbackSpeed = 200;

// Filter state
let activeFilter = null; // {agent: "agent_a", day: 5}

// Heatmap
const heatmapCanvas = document.getElementById('heatmap-canvas');
const heatmapCtx = heatmapCanvas.getContext('2d');
let heatmapData = null;
let maxFrequency = 0;

// Graph
const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');

const agentColors = {
  data: '#00ffff',
  search: '#ff00ff',
  analysis: '#ffff00',
  reporting: '#00ff00',
  querying: '#ff6600'
};

// === HEATMAP ===

function buildHeatmapData() {
  if (!data) return;

  // Initialize grid: agent x day
  const grid = {};
  data.agents.forEach(agent => {
    grid[agent.id] = {};
    for (let day = 1; day <= 30; day++) {
      grid[agent.id][day] = 0;
    }
  });

  // Count interactions per agent per day
  data.interactions.forEach(interaction => {
    grid[interaction.target][interaction.day]++;
  });

  // Find max frequency for normalization
  maxFrequency = 0;
  Object.values(grid).forEach(days => {
    Object.values(days).forEach(count => {
      maxFrequency = Math.max(maxFrequency, count);
    });
  });

  heatmapData = grid;
}

function resizeHeatmap() {
  const dpr = window.devicePixelRatio || 1;
  const rect = heatmapCanvas.getBoundingClientRect();

  heatmapCanvas.width = rect.width * dpr;
  heatmapCanvas.height = rect.height * dpr;

  heatmapCtx.scale(dpr, dpr);
}

function drawHeatmap() {
  if (!heatmapData || !data) return;

  const rect = heatmapCanvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Clear
  heatmapCtx.fillStyle = '#000';
  heatmapCtx.fillRect(0, 0, width, height);

  // Layout
  const labelWidth = 100;
  const labelHeight = 25;
  const marginLeft = labelWidth + 10;
  const marginTop = 20;
  const marginBottom = 30;

  const gridWidth = width - marginLeft - 20;
  const gridHeight = height - marginTop - marginBottom;

  const cellSize = 9;
  const cellGap = 1;
  const totalCellWidth = cellSize + cellGap;

  const numRows = data.agents.length;
  const numCols = 30;

  // Draw cells
  data.agents.forEach((agent, row) => {
    const y = marginTop + row * totalCellWidth;

    // Agent label
    heatmapCtx.fillStyle = agentColors[agent.specialty] || '#00ffff';
    heatmapCtx.font = '10px Courier New';
    heatmapCtx.textAlign = 'right';
    heatmapCtx.textBaseline = 'middle';
    heatmapCtx.fillText(agent.name, marginLeft - 10, y + cellSize / 2);

    // Draw day cells
    for (let day = 1; day <= 30; day++) {
      const x = marginLeft + (day - 1) * totalCellWidth;
      const count = heatmapData[agent.id][day];
      const intensity = count / maxFrequency;

      // Color scale: black → grey → cyan
      let color;
      if (intensity === 0) {
        color = '#000';
      } else if (intensity < 0.3) {
        const t = intensity / 0.3;
        const grey = Math.floor(t * 68); // 0 to #444
        color = `rgb(${grey}, ${grey}, ${grey})`;
      } else {
        const t = (intensity - 0.3) / 0.7;
        const r = Math.floor(68 * (1 - t));
        const g = Math.floor(68 + (255 - 68) * t);
        const b = Math.floor(68 + (255 - 68) * t);
        color = `rgb(${r}, ${g}, ${b})`;
      }

      heatmapCtx.fillStyle = color;
      heatmapCtx.fillRect(x, y, cellSize, cellSize);

      // Highlight if filtered
      if (activeFilter && activeFilter.agent === agent.id && activeFilter.day === day) {
        heatmapCtx.strokeStyle = '#ffffff';
        heatmapCtx.lineWidth = 2;
        heatmapCtx.strokeRect(x - 1, y - 1, cellSize + 2, cellSize + 2);
      }
    }
  });

  // Draw day labels
  heatmapCtx.fillStyle = '#666';
  heatmapCtx.font = '9px Courier New';
  heatmapCtx.textAlign = 'center';
  heatmapCtx.textBaseline = 'top';

  [1, 5, 10, 15, 20, 25, 30].forEach(day => {
    const x = marginLeft + (day - 1) * totalCellWidth + cellSize / 2;
    const y = marginTop + numRows * totalCellWidth + 5;
    heatmapCtx.fillText(day.toString(), x, y);
  });
}

function getHeatmapCell(mouseX, mouseY) {
  if (!data) return null;

  const rect = heatmapCanvas.getBoundingClientRect();
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  const labelWidth = 100;
  const marginLeft = labelWidth + 10;
  const marginTop = 20;

  const cellSize = 9;
  const cellGap = 1;
  const totalCellWidth = cellSize + cellGap;

  const row = Math.floor((y - marginTop) / totalCellWidth);
  const col = Math.floor((x - marginLeft) / totalCellWidth);

  if (row >= 0 && row < data.agents.length && col >= 0 && col < 30) {
    return {
      agent: data.agents[row].id,
      agentName: data.agents[row].name,
      day: col + 1
    };
  }

  return null;
}

// === FORCE GRAPH ===

class Node {
  constructor(id, type, name, specialty) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.specialty = specialty;
    this.x = Math.random() * graphCanvas.width;
    this.y = Math.random() * graphCanvas.height;
    this.vx = 0;
    this.vy = 0;
    this.radius = type === 'agent' ? 10 : 3;
    this.color = type === 'agent' ? (agentColors[specialty] || '#00ffff') : '#444';
    this.mass = type === 'agent' ? 8 : 1;
  }
}

const nodes = new Map();
const activeEdges = new Map();

function initGraph() {
  if (!data) return;

  nodes.clear();

  // Create agent nodes
  data.agents.forEach(agent => {
    nodes.set(agent.id, new Node(agent.id, 'agent', agent.name, agent.specialty));
  });

  // Create user nodes
  data.users.forEach(user => {
    nodes.set(user.id, new Node(user.id, 'user', user.id, null));
  });
}

function resizeGraph() {
  const dpr = window.devicePixelRatio || 1;
  const rect = graphCanvas.getBoundingClientRect();

  graphCanvas.width = rect.width * dpr;
  graphCanvas.height = rect.height * dpr;

  graphCtx.scale(dpr, dpr);
}

function applyForces() {
  const rect = graphCanvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height - 100; // Account for timeline

  const centerX = width / 2;
  const centerY = (height - 100) / 2;

  // Damping
  nodes.forEach(node => {
    node.vx *= 0.85;
    node.vy *= 0.85;
  });

  // Node repulsion
  const nodesArray = Array.from(nodes.values());
  for (let i = 0; i < nodesArray.length; i++) {
    for (let j = i + 1; j < nodesArray.length; j++) {
      const a = nodesArray[i];
      const b = nodesArray[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < 150) {
        const force = (150 - dist) / dist * 0.3;
        const fx = dx * force;
        const fy = dy * force;

        a.vx -= fx / a.mass;
        a.vy -= fy / a.mass;
        b.vx += fx / b.mass;
        b.vy += fy / b.mass;
      }
    }
  }

  // Edge attraction
  activeEdges.forEach(edge => {
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);

    if (source && target) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const idealDist = 100;
      const force = (dist - idealDist) / dist * 0.05;
      const fx = dx * force;
      const fy = dy * force;

      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }
  });

  // Center gravity
  nodes.forEach(node => {
    const dx = centerX - node.x;
    const dy = centerY - node.y;

    node.vx += dx * 0.0005;
    node.vy += dy * 0.0005;
  });

  // Apply velocities
  nodes.forEach(node => {
    node.x += node.vx * 0.3;
    node.y += node.vy * 0.3;

    const margin = 30;
    node.x = Math.max(margin, Math.min(width - margin, node.x));
    node.y = Math.max(margin, Math.min(height - margin, node.y));
  });
}

function updateActiveEdges() {
  if (!data) return;

  activeEdges.clear();

  const windowSize = 3600; // 1 hour window
  const minTime = currentTime - windowSize;

  let filteredInteractions = data.interactions;

  // Apply filter if active
  if (activeFilter) {
    filteredInteractions = filteredInteractions.filter(i =>
      i.target === activeFilter.agent && i.day === activeFilter.day
    );
  }

  filteredInteractions.forEach(interaction => {
    if (interaction.timestamp >= minTime && interaction.timestamp <= currentTime) {
      const age = currentTime - interaction.timestamp;
      const alpha = 1 - (age / windowSize);

      const key = `${interaction.source}-${interaction.target}`;

      if (!activeEdges.has(key)) {
        activeEdges.set(key, {
          source: interaction.source,
          target: interaction.target,
          outcomes: [],
          count: 0
        });
      }

      const edge = activeEdges.get(key);
      edge.outcomes.push({
        outcome: interaction.outcome,
        alpha: alpha
      });
      edge.count++;
    }
  });
}

function drawGraph() {
  const rect = graphCanvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Clear
  graphCtx.fillStyle = '#000';
  graphCtx.fillRect(0, 0, width, height);

  // Draw edges
  activeEdges.forEach(edge => {
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);

    if (!source || !target) return;

    edge.outcomes.forEach(outcome => {
      const color = outcome.outcome === 'success' ? '#00ffff' : '#ff0000';
      const alpha = Math.floor(outcome.alpha * 120).toString(16).padStart(2, '0');

      graphCtx.strokeStyle = color + alpha;
      graphCtx.lineWidth = 1;
      graphCtx.beginPath();
      graphCtx.moveTo(source.x, source.y);
      graphCtx.lineTo(target.x, target.y);
      graphCtx.stroke();
    });
  });

  // Draw nodes
  nodes.forEach(node => {
    graphCtx.fillStyle = node.color;
    graphCtx.beginPath();
    graphCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    graphCtx.fill();

    if (node.type === 'agent') {
      graphCtx.shadowBlur = 10;
      graphCtx.shadowColor = node.color;
      graphCtx.beginPath();
      graphCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      graphCtx.fill();
      graphCtx.shadowBlur = 0;

      // Label
      graphCtx.fillStyle = '#e0e0e0';
      graphCtx.font = '9px Courier New';
      graphCtx.textAlign = 'center';
      graphCtx.fillText(node.specialty, node.x, node.y - 18);
    }
  });
}

function updateStats() {
  if (!data) return;

  document.getElementById('agent-count').textContent = data.agents.length;
  document.getElementById('user-count').textContent = data.users.length;
  document.getElementById('edge-count').textContent = activeEdges.size;

  const visibleInteractions = data.interactions.filter(i => i.timestamp <= currentTime);
  const successCount = visibleInteractions.filter(i => i.outcome === 'success').length;
  const totalCount = visibleInteractions.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  document.getElementById('success-rate').textContent = successRate + '%';
}

function updateTimelineUI() {
  if (!data) return;

  const progress = (currentTime - data.metadata.timeRange.start) /
                   (data.metadata.timeRange.end - data.metadata.timeRange.start);

  const progressBar = document.getElementById('timeline-progress');
  const handle = document.getElementById('timeline-handle');

  const percent = progress * 100;
  progressBar.style.width = percent + '%';
  handle.style.left = percent + '%';

  const date = new Date(currentTime * 1000);
  const day = Math.floor((currentTime - data.metadata.timeRange.start) / 86400) + 1;
  const timeStr = date.toLocaleTimeString();

  document.getElementById('current-time').textContent = `Day ${day} - ${timeStr}`;
}

function setTimeFromPercent(percent) {
  if (!data) return;

  const clamped = Math.max(0, Math.min(1, percent));
  currentTime = data.metadata.timeRange.start +
                clamped * (data.metadata.timeRange.end - data.metadata.timeRange.start);
  updateTimelineUI();
}

// === ANIMATION LOOP ===

function animate() {
  if (!data) {
    requestAnimationFrame(animate);
    return;
  }

  // Update time
  if (isPlaying) {
    const dt = (16 / 1000) * playbackSpeed;
    currentTime += dt;

    if (currentTime >= data.metadata.timeRange.end) {
      currentTime = data.metadata.timeRange.start;
    }

    updateTimelineUI();
  }

  // Update and draw
  applyForces();
  updateActiveEdges();
  drawGraph();
  drawHeatmap();
  updateStats();

  requestAnimationFrame(animate);
}

// === EVENT LISTENERS ===

// Timeline
document.getElementById('play-pause').addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('play-pause').textContent = isPlaying ? 'Pause' : 'Play';
});

document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    playbackSpeed = parseInt(btn.dataset.speed);
  });
});

const slider = document.getElementById('timeline-slider');
const handle = document.getElementById('timeline-handle');
let isDragging = false;

function getPercentFromEvent(e) {
  const rect = slider.getBoundingClientRect();
  return (e.clientX - rect.left) / rect.width;
}

handle.addEventListener('mousedown', () => {
  isDragging = true;
  isPlaying = false;
  document.getElementById('play-pause').textContent = 'Play';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    setTimeFromPercent(getPercentFromEvent(e));
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

slider.addEventListener('click', (e) => {
  if (e.target === slider || e.target.id === 'timeline-track' ||
      e.target.id === 'timeline-progress') {
    setTimeFromPercent(getPercentFromEvent(e));
  }
});

// Heatmap interactions
const tooltip = document.getElementById('tooltip');

heatmapCanvas.addEventListener('mousemove', (e) => {
  const cell = getHeatmapCell(e.clientX, e.clientY);

  if (cell && heatmapData) {
    const count = heatmapData[cell.agent][cell.day];
    tooltip.textContent = `${cell.agentName}, Day ${cell.day}: ${count} interactions`;
    tooltip.style.left = e.clientX + 10 + 'px';
    tooltip.style.top = e.clientY + 10 + 'px';
    tooltip.classList.add('visible');
  } else {
    tooltip.classList.remove('visible');
  }
});

heatmapCanvas.addEventListener('mouseleave', () => {
  tooltip.classList.remove('visible');
});

heatmapCanvas.addEventListener('click', (e) => {
  const cell = getHeatmapCell(e.clientX, e.clientY);

  if (cell) {
    activeFilter = {
      agent: cell.agent,
      day: cell.day
    };

    document.getElementById('filter-text').textContent =
      `Showing: ${cell.agentName}, Day ${cell.day}`;
    document.getElementById('filter-display').classList.add('active');
  }
});

document.getElementById('clear-filter').addEventListener('click', () => {
  activeFilter = null;
  document.getElementById('filter-display').classList.remove('active');
});

// Window resize
window.addEventListener('resize', () => {
  resizeHeatmap();
  resizeGraph();
});

// === INIT ===

fetch('data.json')
  .then(response => response.json())
  .then(loadedData => {
    data = loadedData;
    console.log('Loaded:', {
      agents: data.agents.length,
      users: data.users.length,
      interactions: data.interactions.length,
      days: data.metadata.days
    });

    currentTime = data.metadata.timeRange.start;

    buildHeatmapData();
    initGraph();

    resizeHeatmap();
    resizeGraph();

    updateTimelineUI();
    animate();
  })
  .catch(err => {
    console.error('Failed to load data:', err);
  });
