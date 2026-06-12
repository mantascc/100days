#!/usr/bin/env node
// build-corpus.js — compile corpus.json, the canonical machine-readable
// index of all numbered days. interface.md files are the authoring surface;
// this script only reads, never writes, sketch folders.
//
// usage: node build-corpus.js

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function parseInterface(md) {
  const out = { title: null, idea: null, concepts: {}, conceptualTags: [], technicalTags: [] };
  const titleMatch = md.match(/^#\s*Day\s+\w+:\s*(.+)$/m);
  if (titleMatch) out.title = titleMatch[1].trim();

  const section = (name) => {
    const re = new RegExp(`^##\\s*${name}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, 'mi');
    const m = md.match(re);
    return m ? m[1].trim() : null;
  };

  const idea = section('Idea');
  if (idea) out.idea = idea.split('\n')[0].replace(/<!--.*?-->/g, '').trim() || null;

  const concepts = section('Data Concepts');
  if (concepts) {
    const prim = concepts.match(/\*\*Primary\*\*:\s*(.+)/i);
    const sec = concepts.match(/\*\*Secondary\*\*:\s*(.+)/i);
    if (prim) out.concepts.primary = prim[1].trim();
    if (sec) out.concepts.secondary = sec[1].trim();
  }

  const hashTags = (text) =>
    text ? [...text.matchAll(/#([\w-]+)/g)].map((m) => m[1]) : [];
  out.conceptualTags = hashTags(section('Conceptual Tags'));
  out.technicalTags = hashTags(section('Technical Tags'));
  return out;
}

function titleFromId(id) {
  return id
    .replace(/^\d+b?-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// --- load sources -----------------------------------------------------------

const projects = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects.json'), 'utf8'));
const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

let genomes = {};
try {
  const g = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'aesthetic-genome', 'genome-proposed.json'), 'utf8')
  );
  genomes = Object.fromEntries(g.genomes.map((e) => [e.id, e]));
} catch (e) {
  console.warn('warn: no genome data —', e.message);
}

// --- scan numbered day folders ----------------------------------------------

const dayDirs = fs
  .readdirSync(ROOT)
  .filter((d) => /^\d{2}b?-/.test(d) && fs.statSync(path.join(ROOT, d)).isDirectory())
  .sort();

const entries = dayDirs.map((dir) => {
  const dayMatch = dir.match(/^(\d+)(b?)-/);
  const ifacePath = path.join(ROOT, dir, 'interface.md');
  const hasInterface = fs.existsSync(ifacePath);
  const iface = hasInterface ? parseInterface(fs.readFileSync(ifacePath, 'utf8')) : null;
  const genome = genomes[dir] || null;

  return {
    id: dir,
    day: parseInt(dayMatch[1], 10),
    variant: dayMatch[2] || null,
    title: (iface && iface.title) || titleFromId(dir),
    path: dir,
    description: byId[dir] ? byId[dir].description : null,
    idea: iface ? iface.idea : null,
    concepts: iface && Object.keys(iface.concepts).length ? iface.concepts : null,
    tags: iface ? { conceptual: iface.conceptualTags, technical: iface.technicalTags } : null,
    has_interface: hasInterface,
    in_projects_json: Boolean(byId[dir]),
    genome: genome
      ? { status: genome.status, confidence: genome.confidence }
      : null,
  };
});

// --- integrity checks ---------------------------------------------------------

const seen = new Map();
const collisions = [];
for (const e of entries) {
  const key = `${e.day}${e.variant || ''}`;
  if (seen.has(key)) collisions.push([seen.get(key), e.id]);
  seen.set(key, e.id);
}
const dayNums = [...new Set(entries.map((e) => e.day))].sort((a, b) => a - b);
const gaps = [];
for (let d = dayNums[0]; d <= dayNums[dayNums.length - 1]; d++) {
  if (!dayNums.includes(d)) gaps.push(d);
}
const unregistered = entries.filter((e) => !e.in_projects_json).map((e) => e.id);
const orphanedRegistrations = projects
  .map((p) => p.id)
  .filter((id) => !entries.some((e) => e.id === id));

const corpus = {
  $schema: 'corpus-v1',
  generated: new Date().toISOString(),
  counts: {
    days: entries.length,
    with_interface: entries.filter((e) => e.has_interface).length,
    with_genome: entries.filter((e) => e.genome).length,
  },
  notes: {
    missing_days: gaps, // day 48 was never made; the gap is intentional history
    day_collisions: collisions,
    unregistered_folders: unregistered,
    orphaned_registrations: orphanedRegistrations,
  },
  days: entries,
};

fs.writeFileSync(path.join(ROOT, 'corpus.json'), JSON.stringify(corpus, null, 2) + '\n');
console.log(
  `corpus.json: ${corpus.counts.days} days, ` +
    `${corpus.counts.with_interface} with interface.md, ` +
    `${corpus.counts.with_genome} with genome`
);
if (gaps.length) console.log('missing days:', gaps.join(', '));
if (collisions.length) console.log('collisions:', JSON.stringify(collisions));
if (unregistered.length) console.log('unregistered:', unregistered.join(', '));
if (orphanedRegistrations.length) console.log('orphaned registrations:', orphanedRegistrations.join(', '));
