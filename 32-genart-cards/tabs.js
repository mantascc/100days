// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab;

    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${targetTab}-content`).classList.add('active');
  });
});

// Populate Scale tab with table data
const scaleData = [
  {
    range: "0.3-0.5",
    entropyLoad: {
      title: "Mental recovery zone",
      items: ["Familiar patterns, established routines", "Working within known frameworks", "Cognitive cruise control", "Not stagnation—necessary for sustainable operation"]
    },
    divergence: {
      title: "Convergence - Refinement mode",
      items: ["Selecting from known options", "Polishing existing work", "Executing established plan", "Cognitive relief—fewer choices"]
    },
    exploration: {
      title: "Exploitation - Mastery mode",
      items: ["Optimizing known methods", "Incremental improvements", "Repeating successful patterns", "Efficient, low-risk operation"]
    },
    abstract: {
      title: "Concrete - Implementation mode",
      items: ["Specific tasks, clear outputs", "Tactical decisions", "Hands-on making", "Grounding, tangible progress"]
    },
    integration: {
      title: "Integration - Unified focus",
      items: ["Single coherent project", "All work connects clearly", "Narrative continuity", "Cognitively restful"]
    },
    novelty: {
      title: "Familiarity - Known territory",
      items: ["Established patterns", "Proven methods", "Comfortable competence", "Restorative routine"]
    }
  },
  {
    range: "0.5-0.7",
    entropyLoad: {
      title: "Productive challenge",
      items: ["Learning adjacent skills", "Controlled experimentation", "Manageable uncertainty", "Sweet spot for growth"]
    },
    divergence: {
      title: "Balanced generation",
      items: ["Controlled ideation sessions", "Filtering while creating", "Exploring within constraints", "Productive creative tension"]
    },
    exploration: {
      title: "Informed exploration",
      items: ["Testing adjacent possibilities", "Building on expertise", "Calculated risks", "Growth through extension"]
    },
    abstract: {
      title: "Applied concepts",
      items: ["Translating ideas to practice", "Pattern recognition", "System-level thinking with examples", "Bridging theory and execution"]
    },
    integration: {
      title: "Multiple threads",
      items: ["2-3 related projects", "Shared conceptual DNA", "Can context-switch smoothly", "Manageable complexity"]
    },
    novelty: {
      title: "Productive novelty",
      items: ["New variations on familiar", "Remixing known elements", "Manageable learning curve", "Engaging challenge"]
    }
  },
  {
    range: "0.7-0.85",
    entropyLoad: {
      title: "Significant cognitive tax",
      items: ["Multiple unfamiliar domains simultaneously", "No stable reference points", "High integration cost", "Sustainable only in bursts"]
    },
    divergence: {
      title: "Pure divergence",
      items: ["No filters, all possibilities open", "Brainstorming without boundaries", "Resisting premature closure", "Exhausting but generative"]
    },
    exploration: {
      title: "Deep exploration",
      items: ["Venturing into unfamiliar territory", "No map, building as you go", "High uncertainty tolerance needed", "Discovery-driven exhaustion"]
    },
    abstract: {
      title: "Pure abstraction",
      items: ["Conceptual models", "Philosophical frameworks", "Meta-level analysis", "Intellectually demanding"]
    },
    integration: {
      title: "Fragmented attention",
      items: ["Many unrelated threads", "Forced to context-switch", "Integration burden rises", "Mental juggling act"]
    },
    novelty: {
      title: "Radical novelty",
      items: ["Completely unfamiliar domain", "No transferable skills", "Beginner mind required", "Cognitively expensive"]
    }
  },
  {
    range: "0.85-0.9",
    entropyLoad: {
      title: "Danger zone",
      items: ["Overwhelming cognitive load", "Nothing can consolidate", "Fight-or-flight activation", "Leads to shutdown or ratcheting"]
    },
    divergence: {
      title: "Divergence paralysis",
      items: ["Too many options to evaluate", "Can't commit to direction", "Analysis paralysis sets in", "Choice overload"]
    },
    exploration: {
      title: "Lost in wilderness",
      items: ["No landmarks or reference points", "Can't connect back to expertise", "Disorienting uncertainty", "Anxiety activation"]
    },
    abstract: {
      title: "Abstraction untethered",
      items: ["No connection to application", "Concepts spiraling into concepts", "Can't ground ideas", "Floating anxiety"]
    },
    integration: {
      title: "Fragmentation stress",
      items: ["Can't hold all contexts", "Dropping balls constantly", "No coherent narrative", "Overwhelm setting in"]
    },
    novelty: {
      title: "Novelty overwhelm",
      items: ["Everything is alien", "No pattern recognition", "Can't build mental models", "Disorientation"]
    }
  },
  {
    range: "0.9-1.0",
    entropyLoad: {
      title: "Toxic range - Fragmentation collapse",
      items: ["Complete context switching chaos", "No working memory coherence", "Pure survival mode", "Actively avoid"]
    },
    divergence: {
      title: "Ideation chaos",
      items: ["Generating faster than processing", "No capacity to evaluate", "Ideas cancel each other out", "Creative whiteout"]
    },
    exploration: {
      title: "Exploration overwhelm",
      items: ["Everything is unknown", "No foundation to stand on", "Cognitive groundlessness", "Survival instinct triggers"]
    },
    abstract: {
      title: "Conceptual vertigo",
      items: ["Pure theory, zero grounding", "Lost in meta-levels", "No path back to concrete", "Dissociative thinking"]
    },
    integration: {
      title: "Context collapse",
      items: ["Complete disconnection between tasks", "No working memory persistence", "Pure reactive mode", "Cognitive shutdown"]
    },
    novelty: {
      title: "Novelty shock",
      items: ["Zero familiar reference points", "Constant surprise, no stability", "Fight-or-flight response", "Protective shutdown"]
    }
  }
];

// Build the scale table (flipped: ranges as columns, scales as rows)
const scaleContent = document.getElementById('scale-content');
const table = document.createElement('table');
table.className = 'scale-table';

// Extract ranges for header
const ranges = scaleData.map(d => d.range);

// Table header
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
headerRow.innerHTML = `<th>Dimension</th>` + ranges.map(r => `<th>${r}</th>`).join('');
thead.appendChild(headerRow);
table.appendChild(thead);

// Table body
const tbody = document.createElement('tbody');

const dimensions = [
  { key: 'entropyLoad', label: 'Cognitive Load' },
  { key: 'divergence', label: 'Divergence ↔ Convergence' },
  { key: 'exploration', label: 'Exploration ↔ Exploitation' },
  { key: 'abstract', label: 'Abstract ↔ Concrete' },
  { key: 'integration', label: 'Integration ↔ Fragmentation' },
  { key: 'novelty', label: 'Novelty ↔ Familiarity' }
];

const formatCell = (data) => {
  const itemsList = data.items.map(item => `<li>${item}</li>`).join('');
  return `<strong>${data.title}</strong><ul>${itemsList}</ul>`;
};

dimensions.forEach(dim => {
  const tr = document.createElement('tr');

  // Dimension label cell
  const labelCell = document.createElement('td');
  labelCell.className = 'dimension-cell';
  labelCell.textContent = dim.label;
  tr.appendChild(labelCell);

  // Data cells for each range
  scaleData.forEach(rangeData => {
    const td = document.createElement('td');
    td.innerHTML = formatCell(rangeData[dim.key]);
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
});

table.appendChild(tbody);
scaleContent.appendChild(table);
