#!/usr/bin/env node

/**
 * Computational Minimalism Style Skill
 *
 * Generates starter HTML following the style-seed design system
 *
 * Usage:
 *   node style-skill.js <project-name> [--accent=cyan|magenta|blue|green|amber|red]
 *
 * Examples:
 *   node style-skill.js "Particle Field"
 *   node style-skill.js "Data Flow" --accent=cyan
 */

const fs = require('fs');
const path = require('path');

// Parse args
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
    showUsage();
    process.exit(0);
}

const projectName = args[0];
const accentArg = args.find(a => a.startsWith('--accent='));
const accentColor = accentArg ? accentArg.split('=')[1] : 'blue';

// Accent color map
const accents = {
    cyan: '#00ffaa',
    magenta: '#ff0066',
    blue: '#00a8ff',
    green: '#00ff88',
    amber: '#ffaa00',
    red: '#ff0000'
};

const accent = accents[accentColor] || accents.blue;

// Generate HTML template
const html = generateHTML(projectName, accent);

// Output to file
const filename = projectName.toLowerCase().replace(/\s+/g, '-') + '.html';
fs.writeFileSync(filename, html, 'utf8');

console.log(`\n✓ Created ${filename}`);
console.log(`  Accent: ${accentColor} (${accent})`);
console.log(`  Design system: Computational Minimalism\n`);

function generateHTML(title, accent) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Computational Minimalism / Style Seed */
        /* "The aesthetic of watching something think." */

        :root {
            /* Ground Layers (Elevation) */
            --ground-void: #0a0a0a;
            --ground-base: #0f0f0f;
            --ground-raised: #141414;
            --ground-surface: #1a1a1a;
            --ground-float: #202232;
            --ground-modal: #242424;

            /* Text */
            --text-primary: #ffffff;
            --text-default: #f5f5f7;
            --text-secondary: #a8aab8;
            --text-tertiary: #666666;
            --text-ghost: #333333;

            /* Structural */
            --border-subtle: #1a1a1a;
            --border-default: #2a2a2a;
            --border-strong: #3a3d52;
            --stroke-primary: #ffffff;
            --stroke-ghost: rgba(255,255,255,0.2);

            /* Accent (Spectral Single) */
            --accent: ${accent};

            /* Overlay */
            --overlay-dim: rgba(10,10,10,0.85);
            --overlay-ghost: rgba(255,255,255,0.1);

            /* Typography */
            --font-mono: 'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', Monaco, 'Courier New', monospace;
            --font-system: system-ui, -apple-system, sans-serif;
            --text-xs: 10px;
            --text-sm: 11px;
            --text-base: 13px;
            --text-md: 14px;
            --text-lg: 16px;
            --text-xl: 20px;
            --leading-tight: 1.25;
            --leading-base: 1.5;
            --leading-loose: 1.75;
            --tracking-tight: -0.02em;
            --tracking-normal: 0;
            --tracking-wide: 0.08em;

            /* Spacing (4px base unit) */
            --space-1: 4px;
            --space-2: 8px;
            --space-3: 12px;
            --space-4: 16px;
            --space-5: 20px;
            --space-6: 24px;
            --space-8: 32px;
            --space-10: 40px;
            --space-12: 48px;
            --space-16: 64px;

            /* Stroke */
            --stroke-thin: 1px;
            --stroke-default: 2px;
            --stroke-heavy: 3px;

            /* Motion */
            --duration-instant: 0ms;
            --duration-fast: 100ms;
            --duration-base: 150ms;
            --duration-slow: 300ms;
            --duration-drift: 800ms;
            --ease-snap: linear;
            --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: var(--ground-void);
            color: var(--text-default);
            font-family: var(--font-system);
            font-size: var(--text-base);
            line-height: var(--leading-base);
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            display: grid;
            place-items: center;
        }

        #stage {
            position: relative;
            width: 80vmin;
            height: 80vmin;
            background: var(--ground-base);
            border: 1px solid var(--border-default);
        }

        canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        #info {
            position: absolute;
            top: var(--space-4);
            left: var(--space-4);
            font-size: var(--text-sm);
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
            pointer-events: none;
        }

        /* Animation principles:
         * - Instant feedback on interaction
         * - Binary state changes (on/off)
         * - Linear over theatrical
         * - Physics > easing
         */
    </style>
</head>
<body>
    <div id="stage">
        <canvas id="canvas"></canvas>
        <div id="info">${title.toLowerCase()}</div>
    </div>

    <script>
        'use strict';

        // Setup
        const stage = document.getElementById('stage');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Hi-DPI canvas
        function resize() {
            const rect = stage.getBoundingClientRect();
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Initialize
        resize();
        window.addEventListener('resize', resize);

        // Draw background
        function drawBackground() {
            const w = stage.clientWidth;
            const h = stage.clientHeight;

            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--ground-base');
            ctx.fillRect(0, 0, w, h);
        }

        // Animation loop
        function animate() {
            drawBackground();

            // Your sketch logic here

            requestAnimationFrame(animate);
        }

        // Start
        animate();

        /**
         * Development Rhythm:
         * 1. Wait for idea crystallization
         * 2. Build minimum viable sketch
         * 3. Iterate on core mechanic
         * 4. Strip unnecessary elements
         * 5. Polish = reduction, not addition
         *
         * Quality Markers:
         * - Opens instantly
         * - Behavior self-evident
         * - Visually quiet but informationally dense
         * - 60fps target
         * - <50kb when possible
         */
    </script>
</body>
</html>
`;
}

function showUsage() {
    console.log(`
\x1b[1mComputational Minimalism Style Skill\x1b[0m

Generate starter HTML following the style-seed design system.

Usage:
  node style-skill.js <project-name> [--accent=color]

Accent Colors:
  cyan      #00ffaa  Terminal, growth
  magenta   #ff0066  Error, alert
  blue      #00a8ff  Action, primary (default)
  green     #00ff88  Success, trim
  amber     #ffaa00  Warning, warmth
  red       #ff0000  Rare emphasis

Examples:
  node style-skill.js "Particle Field"
  node style-skill.js "Data Flow" --accent=cyan
  node style-skill.js "Network Graph" --accent=green

Philosophy:
  - Quiet systems over loud interfaces
  - Visible logic, emergent complexity
  - Reduction as polish (strip, don't add)
  - Data as material — show the grain
  - Physics over easing, linear over theatrical

Anti-Patterns (never use):
  - Gradients, drop shadows
  - Rounded corners > 4px
  - Decorative borders
  - Multiple accent colors
  - Mixed case typography
  - Emojis or icons (unless functional)

Reference: day-50/style-seed.md
`);
}
