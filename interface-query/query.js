#!/usr/bin/env node

/**
 * 100 Days Project Query CLI
 *
 * Usage:
 *   node query.js <search-term>
 *   node query.js --concept=network
 *   node query.js --tag=flocking
 *   node query.js --day=12
 *   node query.js entropy --concept=statistical
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    search: [],
    concept: null,
    tag: null,
    day: null
};

args.forEach(arg => {
    if (arg.startsWith('--concept=')) {
        options.concept = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--tag=')) {
        options.tag = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--day=')) {
        options.day = parseInt(arg.split('=')[1]);
    } else {
        options.search.push(arg.toLowerCase());
    }
});

// Parse interface.md content
function parseInterfaceMd(content, dayDir) {
    const dayNum = parseInt(dayDir.match(/\d+/)?.[0] || 0);
    const project = {
        day: dayNum,
        dir: dayDir,
        title: '',
        idea: '',
        primaryConcept: '',
        secondaryConcept: '',
        conceptualTags: [],
        technicalTags: [],
        stack: []
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

    // Extract secondary concept
    const secondaryMatch = content.match(/\*\*Secondary\*\*:\s+(.+?)(?:\(|,|\n|$)/);
    if (secondaryMatch) {
        project.secondaryConcept = secondaryMatch[1].trim()
            .replace(/\(.*?\)/g, '')
            .trim();
    }

    // Extract conceptual tags
    const conceptualTagsMatch = content.match(/##\s+Conceptual Tags\s*\n([^\n]+)/);
    if (conceptualTagsMatch) {
        project.conceptualTags = conceptualTagsMatch[1]
            .split(/\s+/)
            .filter(t => t.startsWith('#'))
            .map(t => t.substring(1));
    }

    // Extract technical tags
    const technicalTagsMatch = content.match(/##\s+Technical Tags\s*\n([^\n]+)/);
    if (technicalTagsMatch) {
        project.technicalTags = technicalTagsMatch[1]
            .split(/\s+/)
            .filter(t => t.startsWith('#'))
            .map(t => t.substring(1));
    }

    // Extract stack
    const stackMatch = content.match(/##\s+Stack\s*\n((?:^[-*]\s+.+$\n?)+)/m);
    if (stackMatch) {
        project.stack = stackMatch[1]
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^[-*]\s+/, '').trim());
    }

    return project;
}

// Load all projects
function loadProjects() {
    const projects = [];
    const entries = fs.readdirSync(__dirname, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && /^day-?\d+/i.test(entry.name)) {
            const interfacePath = path.join(__dirname, entry.name, 'interface.md');

            if (fs.existsSync(interfacePath)) {
                try {
                    const content = fs.readFileSync(interfacePath, 'utf8');
                    const project = parseInterfaceMd(content, entry.name);
                    if (project.title) {
                        projects.push(project);
                    }
                } catch (e) {
                    // Skip files with errors
                }
            }
        }
    }

    return projects.sort((a, b) => a.day - b.day);
}

// Filter projects based on options
function filterProjects(projects, options) {
    return projects.filter(p => {
        // Day filter
        if (options.day && p.day !== options.day) {
            return false;
        }

        // Concept filter
        if (options.concept) {
            const concept = options.concept.toLowerCase();
            const primary = p.primaryConcept.toLowerCase();
            const secondary = p.secondaryConcept.toLowerCase();

            if (!primary.includes(concept) && !secondary.includes(concept)) {
                return false;
            }
        }

        // Tag filter
        if (options.tag) {
            const allTags = [...p.conceptualTags, ...p.technicalTags]
                .map(t => t.toLowerCase());

            if (!allTags.some(t => t.includes(options.tag))) {
                return false;
            }
        }

        // Text search
        if (options.search.length > 0) {
            const searchText = [
                p.title,
                p.idea,
                p.primaryConcept,
                p.secondaryConcept,
                ...p.conceptualTags,
                ...p.technicalTags,
                ...p.stack
            ].join(' ').toLowerCase();

            const matches = options.search.every(term => searchText.includes(term));
            if (!matches) return false;
        }

        return true;
    });
}

// Display results
function displayResults(projects) {
    if (projects.length === 0) {
        console.log('\nNo projects found.\n');
        return;
    }

    console.log(`\nFound ${projects.length} project${projects.length > 1 ? 's' : ''}:\n`);

    projects.forEach(p => {
        console.log(`\x1b[1m\x1b[36mDay ${p.day}: ${p.title}\x1b[0m`);
        console.log(`  ${p.idea}`);

        if (p.primaryConcept) {
            console.log(`  \x1b[33m→ ${p.primaryConcept}\x1b[0m${p.secondaryConcept ? ` / ${p.secondaryConcept}` : ''}`);
        }

        if (p.conceptualTags.length > 0) {
            console.log(`  \x1b[90m#${p.conceptualTags.slice(0, 5).join(' #')}\x1b[0m`);
        }

        console.log(`  \x1b[90m./${p.dir}/\x1b[0m`);
        console.log();
    });
}

// Show usage
function showUsage() {
    console.log(`
\x1b[1m100 Days Project Query\x1b[0m

Usage:
  node query.js <search-term>              Search all fields
  node query.js --concept=<concept>        Filter by data concept
  node query.js --tag=<tag>                Filter by tag
  node query.js --day=<number>             Show specific day
  node query.js <term> --concept=<concept> Combine filters

Data Concepts:
  network, clustering, statistical, temporal, spatial, audio, visual, emergence

Examples:
  node query.js entropy
  node query.js --concept=network
  node query.js --tag=flocking
  node query.js --day=12
  node query.js particles --concept=statistical
  node query.js canvas --tag=physics
`);
}

// Main
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
}

try {
    const projects = loadProjects();
    const results = filterProjects(projects, options);
    displayResults(results);
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
