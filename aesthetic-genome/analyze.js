#!/usr/bin/env node
/**
 * aesthetic genome / code analyzer
 * scans 100days projects, proposes genome vectors from code heuristics
 *
 * usage: node analyze.js
 * output: genome-proposed.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_JSON = path.join(ROOT, 'projects.json');

// ─── heuristics ───

function readProjectFiles(projectPath) {
  const abs = path.resolve(ROOT, projectPath.replace('100days/', ''));
  if (!fs.existsSync(abs)) return { files: [], code: '', html: '' };

  const files = [];
  function walk(dir, depth = 0) {
    if (depth > 2) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, depth + 1);
        else files.push({ name: e.name, path: full, size: fs.statSync(full).size });
      }
    } catch(e) {}
  }
  walk(abs);

  // gather all readable code
  let code = '';
  let html = '';
  for (const f of files) {
    if (/\.(html|js|css|ts|jsx|tsx|svelte|vue)$/i.test(f.name) && f.size < 200000) {
      try {
        const content = fs.readFileSync(f.path, 'utf-8');
        code += '\n' + content;
        if (f.name.endsWith('.html')) html += '\n' + content;
      } catch(e) {}
    }
  }

  return { files, code, html };
}

function clamp(v, lo = 0, hi = 1) { return Math.min(hi, Math.max(lo, v)); }

function scoreDensity(code, files) {
  let score = 0.5;
  // particle/element count hints
  const particleMatch = code.match(/(?:particles|nodes|agents|cells|dots|points)\s*[=:]\s*(\d+)/i);
  if (particleMatch) {
    const n = parseInt(particleMatch[1]);
    if (n > 500) score += 0.3;
    else if (n > 100) score += 0.15;
    else if (n < 20) score -= 0.2;
  }
  // grid size
  const gridMatch = code.match(/(?:gridSize|GRID_SIZE|cols|COLS|rows)\s*[=:]\s*(\d+)/i);
  if (gridMatch && parseInt(gridMatch[1]) > 50) score += 0.2;
  // putImageData = pixel-level density
  if (code.includes('putImageData')) score += 0.15;
  // sparse indicators
  if (code.match(/float|breathing|negative.?space/i)) score -= 0.15;
  // few draw calls
  const drawCalls = (code.match(/fillRect|strokeRect|arc\(|lineTo|fillText/g) || []).length;
  if (drawCalls < 3) score -= 0.1;
  if (drawCalls > 15) score += 0.1;

  return clamp(score);
}

function scoreAgency(code) {
  let score = 0;
  // event listeners
  const listeners = (code.match(/addEventListener|onclick|onmouse|ontouchstart|oninput|onchange/gi) || []).length;
  score += Math.min(listeners * 0.08, 0.4);
  // input elements
  const inputs = (code.match(/<input|<select|<button|<range|type="range"/gi) || []).length;
  score += Math.min(inputs * 0.1, 0.3);
  // audio/camera/mic
  if (code.match(/getUserMedia|AudioContext|analyser|getByteFrequency/i)) score += 0.3;
  // mouse tracking as core mechanic
  if (code.match(/mousemove|pointermove/i) && code.match(/canvas/i)) score += 0.15;
  // no interaction at all
  if (listeners === 0 && inputs === 0) score = 0.05;

  return clamp(score);
}

function scoreLegibility(code) {
  let score = 0.3;
  // text labels, info elements
  const labels = (code.match(/fillText|<label|<span.*class.*label|id="info"|id="stats"/gi) || []).length;
  score += Math.min(labels * 0.08, 0.3);
  // data display
  if (code.match(/\.toFixed|\.toPrecision|innerText\s*=|textContent\s*=/i)) score += 0.1;
  // educational/reference content
  const headings = (code.match(/<h[1-6]/gi) || []).length;
  if (headings > 5) score += 0.3;
  // tooltip/explanation
  if (code.match(/tooltip|explanation|description|modal.*text/i)) score += 0.1;
  // purely abstract (no text rendering)
  if (labels === 0 && headings === 0) score -= 0.2;

  return clamp(score);
}

function scoreDeterminism(code) {
  let score = 0.7; // default toward deterministic
  // randomness sources
  const randoms = (code.match(/Math\.random/g) || []).length;
  if (randoms > 10) score -= 0.4;
  else if (randoms > 3) score -= 0.25;
  else if (randoms > 0) score -= 0.15;
  // noise functions
  if (code.match(/perlin|simplex|noise\s*\(/i)) score -= 0.2;
  // seed = controlled randomness
  if (code.match(/seed|srand|seeded/i)) score += 0.15;
  // shuffle
  if (code.match(/shuffle|Fisher.?Yates/i)) score -= 0.1;

  return clamp(score);
}

function scoreComplexity(code, files) {
  let score = 0.3;
  const lines = code.split('\n').length;
  if (lines > 800) score += 0.3;
  else if (lines > 400) score += 0.2;
  else if (lines > 200) score += 0.1;

  const functions = (code.match(/function\s+\w+|=>\s*{|const\s+\w+\s*=\s*(?:function|\()/g) || []).length;
  if (functions > 20) score += 0.2;
  else if (functions > 10) score += 0.1;

  // multi-file
  const codeFiles = files.filter(f => /\.(js|ts|jsx|tsx)$/i.test(f.name)).length;
  if (codeFiles > 3) score += 0.15;

  // algorithm keywords
  if (code.match(/marching|diffusion|cellular|automaton|flocking|boids|spring|verlet/i)) score += 0.15;

  return clamp(score);
}

function scorePhysicality(code) {
  let score = 0;
  const physicsTerms = [
    /velocity|vel[XY]|vx|vy/i,
    /force|attract|repel/i,
    /mass|gravity|grav/i,
    /spring|stiffness|damping|damp/i,
    /friction|drag|resistance/i,
    /collision|collide|bounce/i,
    /momentum|inertia/i,
    /acceleration|accel/i,
    /euler|verlet|integration/i,
    /fluid|viscosity|pressure/i
  ];
  for (const re of physicsTerms) {
    if (re.test(code)) score += 0.12;
  }
  return clamp(score);
}

function scorePaletteRestraint(code) {
  // extract hex colors
  const hexes = new Set();
  const matches = code.match(/#[0-9a-fA-F]{3,8}/g) || [];
  for (const m of matches) {
    // normalize 3-char to 6-char
    const h = m.length === 4 ? `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}` : m.slice(0, 7);
    hexes.add(h.toLowerCase());
  }
  // filter out near-blacks and near-whites (structural, not chromatic)
  const chromatic = [...hexes].filter(h => {
    const r = parseInt(h.slice(1,3), 16);
    const g = parseInt(h.slice(3,5), 16);
    const b = parseInt(h.slice(5,7), 16);
    const lum = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    return lum > 30 && lum < 225 && sat > 20;
  });

  const n = chromatic.length;
  if (n === 0) return 0.95; // monochrome
  if (n === 1) return 0.85;
  if (n <= 2) return 0.7;
  if (n <= 4) return 0.5;
  if (n <= 6) return 0.35;
  return 0.2;
}

function scoreMotionCharacter(code) {
  let score = 0.1;
  if (code.match(/requestAnimationFrame/)) score += 0.3;
  if (code.match(/setInterval|setTimeout.*(?:animate|update|tick|draw)/i)) score += 0.2;
  // continuous vs discrete
  if (code.match(/lerp|interpolat|ease|tween/i)) score += 0.1;
  if (code.match(/velocity|drift|flow|wave|oscillat/i)) score += 0.15;
  // fps throttling = intentional motion design
  if (code.match(/fps|framerate|deltaTime|dt\s*[=<>]/i)) score += 0.1;
  // static page (reference, educational)
  if (!code.match(/requestAnimationFrame|setInterval|animate/i)) score = 0.05;

  return clamp(score);
}

function detectMaterial(code) {
  const hasCanvas = /canvas|getContext\(['"]2d|fillRect|strokeRect/i.test(code);
  const hasGlyph = /fillText.*char|String\.fromCharCode|glyph|ascii|braille|kanji/i.test(code);
  const hasSVG = /<svg|createElementNS.*svg/i.test(code);
  const hasDom = /<div.*class|createElement\(['"]div/i.test(code);
  const hasData = /fetch\(|\.json|dataset|d3\./i.test(code);
  const hasWebGL = /webgl|three\.js|THREE\./i.test(code);

  if (hasGlyph) return 'glyph';
  if (hasWebGL) return 'geometry';
  if (hasCanvas && hasData) return 'hybrid';
  if (hasCanvas) return 'pixel';
  if (hasSVG) return 'geometry';
  if (hasData && hasDom) return 'data';
  if (hasDom) return 'dom';
  return 'pixel';
}

function detectTemporalMode(code) {
  const hasRAF = /requestAnimationFrame/.test(code);
  const hasConvergence = /equilibrium|converge|stable|settled|done|complete/i.test(code);
  const hasLoop = /loop|cycle|repeat|phase/i.test(code);
  const hasReactive = /getUserMedia|AudioContext|onmouse|onclick.*(?:update|draw)/i.test(code);

  if (!hasRAF && !code.match(/setInterval|animate/i)) return 'static';
  if (hasReactive && hasRAF) return 'reactive';
  if (hasConvergence) return 'equilibrium';
  if (hasLoop) return 'loop';
  return 'evolve';
}

function detectReferent(code) {
  const hasRealData = /flight|geo|map|latitude|longitude|coworker|network.*real|sentiment/i.test(code);
  const hasEducational = /<h[1-6].*pattern|explanation|description|learn|concept/i.test(code);
  const hasMetaphor = /dna|mutation|schelling|segregation|game.?of.?life|conway/i.test(code);

  if (hasEducational) return 'educational';
  if (hasRealData) return 'data-mapped';
  if (hasMetaphor) return 'metaphorical';
  return 'self-contained';
}

function detectScale(code) {
  const particleMatch = code.match(/(?:particles|nodes|agents|count)\s*[=:]\s*(\d+)/i);
  const hasField = /field|lattice|grid.*(?:100|50)|wave/i.test(code);
  const hasSystem = /system|orchestrat|hierarch|network.*graph/i.test(code);
  const hasMulti = /chapter|mode|variant|scene/i.test(code);

  if (hasMulti && (hasField || hasSystem)) return 'multi';
  if (hasSystem) return 'macro';
  if (hasField) return 'meso';
  if (particleMatch && parseInt(particleMatch[1]) < 20) return 'micro';
  return 'meso';
}

// ─── main ───

function analyzeProject(project) {
  const { files, code, html } = readProjectFiles(project.path);

  if (!code || code.length < 50) {
    return {
      id: project.id,
      description: project.description,
      status: 'empty',
      confidence: 0
    };
  }

  const genome = {
    id: project.id,
    description: project.description,
    status: 'proposed',
    confidence: 0,
    continuous: {
      density: scoreDensity(code, files),
      agency: scoreAgency(code),
      legibility: scoreLegibility(code),
      determinism: scoreDeterminism(code),
      complexity: scoreComplexity(code, files),
      physicality: scorePhysicality(code),
      palette_restraint: scorePaletteRestraint(code),
      motion_character: scoreMotionCharacter(code)
    },
    categorical: {
      material: detectMaterial(code),
      temporal_mode: detectTemporalMode(code),
      referent: detectReferent(code),
      scale: detectScale(code)
    },
    meta: {
      file_count: files.length,
      code_lines: code.split('\n').length,
      total_bytes: files.reduce((s, f) => s + f.size, 0),
      has_external_deps: /cdnjs|unpkg|googleapis|import\s.*from/i.test(code),
      rendering: /canvas|getContext/.test(code) ? 'canvas' : /svg/i.test(code) ? 'svg' : 'dom'
    }
  };

  // confidence = how much signal we found
  const signals = Object.values(genome.continuous);
  const spread = Math.max(...signals) - Math.min(...signals);
  const nonDefault = signals.filter(v => Math.abs(v - 0.5) > 0.15).length;
  genome.confidence = clamp(0.3 + spread * 0.3 + nonDefault * 0.06);

  return genome;
}

// run
const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, 'utf-8'));
console.log(`analyzing ${projects.length} projects...\n`);

const genomes = [];
for (const p of projects) {
  const g = analyzeProject(p);
  genomes.push(g);
  const status = g.status === 'empty' ? '  (empty)' : `  confidence: ${(g.confidence * 100).toFixed(0)}%`;
  console.log(`  ${g.id}${status}`);
}

const output = {
  schema: 'aesthetic-genome-v1',
  generated: new Date().toISOString(),
  method: 'hybrid/code-analysis',
  project_count: genomes.length,
  genomes
};

const outPath = path.join(__dirname, 'genome-proposed.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\nwrote ${outPath}`);
console.log(`  ${genomes.filter(g => g.status === 'proposed').length} analyzed`);
console.log(`  ${genomes.filter(g => g.status === 'empty').length} empty/skipped`);
