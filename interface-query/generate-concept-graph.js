#!/usr/bin/env node

/**
 * Generate Concept Graph Dataset
 *
 * Reads all interface.md files and creates a dataset of projects
 * grouped by data concepts for visualization.
 *
 * Output: concept-graph-data.json
 */

const fs = require('fs');
const path = require('path');

// Data concept categories
const concepts = [
    { id: 'network', label: 'Network & Graph', color: '#ff6b6b' },
    { id: 'clustering', label: 'Clustering', color: '#f9ca24' },
    { id: 'statistical', label: 'Statistical', color: '#a29bfe' },
    { id: 'temporal', label: 'Temporal', color: '#4ecdc4' },
    { id: 'spatial', label: 'Spatial & Geo', color: '#45b7d1' },
    { id: 'audio', label: 'Audio & Signal', color: '#fd79a8' },
    { id: 'visual', label: 'Image & Visual', color: '#00b894' },
    { id: 'emergence', label: 'Emergence', color: '#feca57' }
];

// Parse interface.md content
function parseInterfaceMd(content, dayDir) {
    const dayNum = parseInt(dayDir.match(/\d+/)?.[0] || 0);
    const project = {
        day: dayNum,
        title: '',
        idea: '',
        primaryConcept: '',
        secondaryConcept: '',
        concepts: []  // Will store concept IDs
    };

    // Extract title
    const titleMatch = content.match(/^#\s+Day\s+\d+:\s+(.+)$/m);
    if (titleMatch) project.title = titleMatch[1].trim();

    // Extract idea
    const ideaMatch = content.match(/##\s+Idea\s*\n([^\n]+)/);
    if (ideaMatch) project.idea = ideaMatch[1].trim();

    // Extract primary concept
    const primaryMatch = content.match(/\*\*Primary\*\*:\s+(.+?)(?:\(|,|\n|$)/);
    if (primaryMatch) {
        project.primaryConcept = primaryMatch[1].trim()
            .replace(/\(.*?\)/g, '')
            .trim();
    }

    // Extract secondary concept (capture full line, may have multiple concepts)
    const secondaryMatch = content.match(/\*\*Secondary\*\*:\s+(.+?)(?:\n|$)/);
    if (secondaryMatch) {
        project.secondaryConcept = secondaryMatch[1].trim();
    }

    // Check if secondary concept represents REAL data (not just implementation)
    const isRealDataConcept = (conceptText) => {
        const text = conceptText.toLowerCase();

        // REAL data indicators - actual data analysis/exploration
        const dataIndicators = [
            'graph', 'network data', 'interaction data', 'relationship',
            'time-series', 'history', 'evolution', 'sequence',
            'heatmap', 'geographic', 'location', 'geocoded',
            'clustering analysis', 'pattern detection', 'grouping behavior',
            'entropy', 'probability', 'distribution', 'stochastic',
            'frequency', 'signal', 'waveform',
            'segregation', 'emergence', 'phase transition',
            'image data', 'color analysis', 'palette'
        ];

        // IMPLEMENTATION indicators - not data concepts
        const implementationIndicators = [
            'motion over time', 'animated', 'particle positions',
            'drag interaction', 'element positioning', 'layout',
            'proximity connections', 'force-directed',
            'trails', 'breadcrumbs', 'visualization technique',
            'rendering', 'display'
        ];

        // Check if it's implementation (reject it)
        const isImplementation = implementationIndicators.some(kw => text.includes(kw));
        if (isImplementation) return false;

        // Check if it's real data (accept it)
        const isData = dataIndicators.some(kw => text.includes(kw));
        return isData;
    };

    // Map concepts to IDs (returns array of all matching IDs)
    const mapConceptsToIds = (conceptText) => {
        const text = conceptText.toLowerCase();
        const ids = [];

        if (text.includes('network') || text.includes('graph')) ids.push('network');
        if (text.includes('cluster')) ids.push('clustering');
        if (text.includes('statistical') || text.includes('stochastic') || text.includes('entropy')) ids.push('statistical');
        if (text.includes('temporal') || text.includes('time')) ids.push('temporal');
        if (text.includes('spatial') || text.includes('geo')) ids.push('spatial');
        if (text.includes('audio') || text.includes('sound')) ids.push('audio');
        if (text.includes('visual') || text.includes('image')) ids.push('visual');
        if (text.includes('emergence')) ids.push('emergence');

        return ids;
    };

    // Process primary concept
    if (project.primaryConcept) {
        const ids = mapConceptsToIds(project.primaryConcept);
        ids.forEach(id => {
            if (!project.concepts.includes(id)) {
                project.concepts.push(id);
            }
        });
    }

    // Process secondary concept - STRICT FILTERING
    // Only include if it represents REAL data concepts (not implementation)
    if (project.secondaryConcept) {
        // Split by comma and process each part
        const parts = project.secondaryConcept.split(',').map(p => p.trim());
        parts.forEach(part => {
            // Apply strict filter: only include if it's real data
            if (isRealDataConcept(part)) {
                const ids = mapConceptsToIds(part);
                ids.forEach(id => {
                    if (!project.concepts.includes(id)) {
                        project.concepts.push(id);
                    }
                });
            }
            // Otherwise skip this secondary concept
        });
    }

    return project;
}

// Load all projects
function loadProjects() {
    const projects = [];
    const parentDir = path.join(__dirname, '..');
    const entries = fs.readdirSync(parentDir, { withFileTypes: true });

    for (const entry of entries) {
        // Match new format: NN-name or NNb-name (e.g., 01-entropy, 15b-binary-camera-grid-v2)
        if (entry.isDirectory() && /^\d{1,2}b?-.+/.test(entry.name)) {
            const interfacePath = path.join(parentDir, entry.name, 'interface.md');

            if (fs.existsSync(interfacePath)) {
                try {
                    const content = fs.readFileSync(interfacePath, 'utf8');
                    const project = parseInterfaceMd(content, entry.name);
                    if (project.title && project.concepts.length > 0) {
                        projects.push(project);
                    }
                } catch (e) {
                    console.error(`Error parsing ${entry.name}:`, e.message);
                }
            }
        }
    }

    return projects.sort((a, b) => a.day - b.day);
}

// Group projects by concept
function groupByConcept(projects) {
    const groups = {};

    // Initialize groups
    concepts.forEach(c => {
        groups[c.id] = {
            concept: c,
            projects: []
        };
    });

    // Add projects to groups
    projects.forEach(p => {
        p.concepts.forEach(conceptId => {
            if (groups[conceptId]) {
                groups[conceptId].projects.push({
                    day: p.day,
                    title: p.title,
                    idea: p.idea
                });
            }
        });
    });

    return groups;
}

// Generate dataset
function generateDataset() {
    console.log('Loading projects...');
    const projects = loadProjects();
    console.log(`Found ${projects.length} projects`);

    console.log('\nGrouping by concept...');
    const groups = groupByConcept(projects);

    // Generate statistics
    const stats = {};
    concepts.forEach(c => {
        const count = groups[c.id].projects.length;
        stats[c.label] = count;
        console.log(`  ${c.label}: ${count} projects`);
    });

    // Create dataset
    const dataset = {
        generated: new Date().toISOString(),
        totalProjects: projects.length,
        concepts: concepts,
        groups: groups,
        projects: projects
    };

    return dataset;
}

// Main
try {
    const dataset = generateDataset();

    // Write to interface-query folder
    const outputPath = path.join(__dirname, 'concept-graph-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf8');

    // Also write to 54-concept-graph folder
    const vizPath = path.join(__dirname, '..', '54-concept-graph', 'concept-graph-data.json');
    fs.writeFileSync(vizPath, JSON.stringify(dataset, null, 2), 'utf8');

    console.log(`\n✓ Generated concept-graph-data.json (interface-query + 54-concept-graph)`);
    console.log(`  Total projects: ${dataset.totalProjects}`);
    console.log(`  Concepts: ${concepts.length}`);

} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
