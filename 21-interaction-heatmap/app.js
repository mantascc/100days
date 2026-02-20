// Application: Agent Interaction Heatmap

const tooltip = document.getElementById('tooltip');
let heatmap = null;

// Agent colors
const agentColors = {
  data: '#00ffff',
  search: '#ff00ff',
  analysis: '#ffff00',
  reporting: '#00ff00',
  querying: '#ff6600'
};

// Load and process data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    console.log('Loaded:', {
      agents: data.agents.length,
      users: data.users.length,
      interactions: data.interactions.length,
      days: data.metadata.days
    });

    // Update info panel
    document.getElementById('agent-count').textContent = data.agents.length;
    document.getElementById('user-count').textContent = data.users.length;
    document.getElementById('interaction-count').textContent = data.interactions.length;

    const successCount = data.interactions.filter(i => i.outcome === 'success').length;
    const successRate = Math.round((successCount / data.interactions.length) * 100);
    document.getElementById('success-rate').textContent = successRate + '%';

    // Transform data for heatmap component
    const heatmapData = transformDataForHeatmap(data);

    // Create heatmap
    const container = document.getElementById('heatmap');
    heatmap = new Heatmap(container, {
      cellSize: 10,
      cellGap: 1,
      labelWidth: 120,
      onCellClick: handleCellClick,
      onCellHover: handleCellHover
    });

    heatmap.setData(heatmapData);
    heatmap.render();
  })
  .catch(err => {
    console.error('Failed to load data:', err);
  });

/**
 * Transform raw data into heatmap format
 */
function transformDataForHeatmap(data) {
  // Build rows (agents)
  const rows = data.agents.map(agent => ({
    id: agent.id,
    label: agent.name,
    color: '#999999', // Uniform grey for all labels
    specialty: agent.specialty
  }));

  // Build columns (days 1-30)
  const columns = [];
  for (let day = 1; day <= 30; day++) {
    columns.push({
      id: day,
      label: day.toString(),
      showLabel: [1, 5, 10, 15, 20, 25, 30].includes(day) // Only show specific labels
    });
  }

  // Build values grid: count interactions per agent per day
  const values = {};

  data.agents.forEach(agent => {
    values[agent.id] = {};
    for (let day = 1; day <= 30; day++) {
      values[agent.id][day] = 0;
    }
  });

  data.interactions.forEach(interaction => {
    values[interaction.target][interaction.day]++;
  });

  return {
    rows,
    columns,
    values
  };
}

/**
 * Handle cell click
 */
function handleCellClick(cell) {
  console.log('Clicked cell:', {
    agent: cell.row.label,
    day: cell.col.label,
    interactions: cell.value
  });

  // You can add filtering logic here
  alert(`${cell.row.label} - Day ${cell.col.label}: ${cell.value} interactions`);
}

/**
 * Handle cell hover
 */
function handleCellHover(cell) {
  if (cell) {
    tooltip.textContent = `${cell.row.label}, Day ${cell.col.label}: ${cell.value} interactions`;
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.classList.add('visible');
  } else {
    tooltip.classList.remove('visible');
  }
}
