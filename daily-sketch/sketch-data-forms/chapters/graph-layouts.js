// Chapter 2: Graph Layouts
// Data story: "A small team that merged" — two clusters of 8, one bridge, three isolates.
// Same graph, eight layout algorithms. Each reveals a different structural truth.

import { setupCanvas, makeRng } from '../lib/utils.js';

// ── Graph data ────────────────────────────────────────────────────────────────

const NODES = [
    ...Array.from({ length: 8 }, (_, i) => ({ id: i,      cluster: 'A'       })),
    ...Array.from({ length: 8 }, (_, i) => ({ id: i + 8,  cluster: 'B'       })),
    { id: 16, cluster: 'bridge'  },
    { id: 17, cluster: 'isolate' },
    { id: 18, cluster: 'isolate' },
    { id: 19, cluster: 'isolate' },
];

const EDGES = [
    // Cluster A — ring + chords
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,3],[1,5],[2,6],
    // Cluster B — ring + chords
    [8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,8],[8,11],[9,13],[10,14],
    // Bridge
    [16,2],[16,11],
];

// ── Force simulation ──────────────────────────────────────────────────────────

function runForce(params, iterations, rng) {
    const ns = NODES.map(n => ({
        ...n,
        x: 0.5 + (rng() - 0.5) * 0.4,
        y: 0.5 + (rng() - 0.5) * 0.4,
        vx: 0, vy: 0,
    }));

    for (let iter = 0; iter < iterations; iter++) {
        // Repulsion
        for (let i = 0; i < ns.length; i++) {
            for (let j = i + 1; j < ns.length; j++) {
                const dx = ns[j].x - ns[i].x;
                const dy = ns[j].y - ns[i].y;
                const d2 = Math.max(dx * dx + dy * dy, 0.0001);
                const f  = params.repulsion / d2;
                ns[i].vx -= dx * f; ns[i].vy -= dy * f;
                ns[j].vx += dx * f; ns[j].vy += dy * f;
            }
        }

        // Springs
        EDGES.forEach(([a, b]) => {
            const dx = ns[b].x - ns[a].x;
            const dy = ns[b].y - ns[a].y;
            const d  = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const f  = (d - params.len) * params.spring;
            const fx = (dx / d) * f, fy = (dy / d) * f;
            ns[a].vx += fx; ns[a].vy += fy;
            ns[b].vx -= fx; ns[b].vy -= fy;
        });

        // Center gravity
        ns.forEach(n => {
            n.vx += (0.5 - n.x) * params.gravity;
            n.vy += (0.5 - n.y) * params.gravity;
        });

        // Cluster pull (optional)
        if (params.clusterForce) {
            const cx = { A: { x: 0, y: 0, n: 0 }, B: { x: 0, y: 0, n: 0 } };
            ns.forEach(n => { if (cx[n.cluster]) { cx[n.cluster].x += n.x; cx[n.cluster].y += n.y; cx[n.cluster].n++; } });
            ['A','B'].forEach(k => { cx[k].x /= cx[k].n; cx[k].y /= cx[k].n; });
            ns.forEach(n => {
                if (cx[n.cluster]) {
                    n.vx += (cx[n.cluster].x - n.x) * params.clusterForce;
                    n.vy += (cx[n.cluster].y - n.y) * params.clusterForce;
                }
            });
        }

        // Directional gravity (y-bias by connection count)
        if (params.degreeGravity) {
            const deg = new Array(NODES.length).fill(0);
            EDGES.forEach(([a, b]) => { deg[a]++; deg[b]++; });
            const maxDeg = Math.max(...deg);
            ns.forEach((n, i) => {
                const ty = 0.1 + 0.8 * (1 - deg[n.id] / maxDeg);
                n.vy += (ty - n.y) * params.degreeGravity;
            });
        }

        // Integrate + damp
        ns.forEach(n => {
            n.vx *= 0.85; n.vy *= 0.85;
            n.x = Math.max(0.05, Math.min(0.95, n.x + n.vx));
            n.y = Math.max(0.05, Math.min(0.95, n.y + n.vy));
        });
    }

    return ns;
}

// ── Geometric layouts ─────────────────────────────────────────────────────────

function circularLayout() {
    const order = [...NODES].sort((a, b) => {
        const rank = { A: 0, B: 1, bridge: 2, isolate: 3 };
        return rank[a.cluster] - rank[b.cluster];
    });
    return order.map((node, i) => ({
        ...node,
        x: 0.5 + 0.42 * Math.cos(-Math.PI / 2 + (i / NODES.length) * Math.PI * 2),
        y: 0.5 + 0.42 * Math.sin(-Math.PI / 2 + (i / NODES.length) * Math.PI * 2),
    })).sort((a, b) => a.id - b.id);
}

function bipartiteLayout() {
    const aNodes = NODES.filter(n => n.cluster === 'A');
    const bNodes = NODES.filter(n => n.cluster === 'B');
    const mid    = NODES.filter(n => n.cluster === 'bridge' || n.cluster === 'isolate');
    const result = new Array(NODES.length);
    aNodes.forEach((n, i) => { result[n.id] = { ...n, x: 0.18, y: 0.1 + (i / (aNodes.length - 1)) * 0.8 }; });
    bNodes.forEach((n, i) => { result[n.id] = { ...n, x: 0.82, y: 0.1 + (i / (bNodes.length - 1)) * 0.8 }; });
    mid.forEach((n, i)    => { result[n.id] = { ...n, x: 0.5,  y: 0.2 + (i / (mid.length - 1))    * 0.6 }; });
    return result;
}

function communityLayout() {
    // Cluster A on left circle, B on right, bridge + isolates along center line
    const aNodes = NODES.filter(n => n.cluster === 'A');
    const bNodes = NODES.filter(n => n.cluster === 'B');
    const mid    = NODES.filter(n => n.cluster === 'bridge' || n.cluster === 'isolate');
    const result = new Array(NODES.length);
    const r = 0.27;
    aNodes.forEach((n, i) => {
        const a = -Math.PI / 2 + (i / aNodes.length) * Math.PI * 2;
        result[n.id] = { ...n, x: 0.28 + r * Math.cos(a), y: 0.5 + r * Math.sin(a) };
    });
    bNodes.forEach((n, i) => {
        const a = -Math.PI / 2 + (i / bNodes.length) * Math.PI * 2;
        result[n.id] = { ...n, x: 0.72 + r * Math.cos(a), y: 0.5 + r * Math.sin(a) };
    });
    mid.forEach((n, i) => { result[n.id] = { ...n, x: 0.5, y: 0.3 + i * 0.2 }; });
    return result;
}

function degreeLayout(rng) {
    // Force-derived: nodes placed by degree (high = top)
    return runForce({ repulsion: 0.0008, spring: 0.02, len: 0.18, gravity: 0.008, degreeGravity: 0.03 }, 400, rng);
}

// ── Draw ──────────────────────────────────────────────────────────────────────

const NODE_COLOR = {
    A:       'rgba(0,168,255,0.9)',
    B:       'rgba(0,168,255,0.5)',
    bridge:  '#ffffff',
    isolate: 'rgba(255,255,255,0.25)',
};

const NODE_R = { A: 3, B: 3, bridge: 4.5, isolate: 2.5 };

function drawGraph(cv, layout) {
    const { ctx, W, H } = cv;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    const pad = 16;
    const sx = x => pad + x * (W - pad * 2);
    const sy = y => pad + y * (H - pad * 2);

    // Edges
    ctx.strokeStyle = 'rgba(0,168,255,0.12)';
    ctx.lineWidth   = 0.75;
    EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(sx(layout[a].x), sy(layout[a].y));
        ctx.lineTo(sx(layout[b].x), sy(layout[b].y));
        ctx.stroke();
    });

    // Nodes
    layout.forEach(n => {
        ctx.fillStyle = NODE_COLOR[n.cluster];
        ctx.beginPath();
        ctx.arc(sx(n.x), sy(n.y), NODE_R[n.cluster], 0, Math.PI * 2);
        ctx.fill();
    });
}

// ── Chapter factory ───────────────────────────────────────────────────────────

export function createChapter() {
    // Pre-compute all layouts synchronously
    const rng = makeRng(7);
    const layouts = [
        runForce({ repulsion: 0.0012, spring: 0.015, len: 0.15, gravity: 0.006 },                400, makeRng(7)),
        runForce({ repulsion: 0.0008, spring: 0.025, len: 0.12, gravity: 0.01 },                 400, makeRng(14)),
        runForce({ repulsion: 0.0022, spring: 0.008, len: 0.22, gravity: 0.004 },                400, makeRng(21)),
        runForce({ repulsion: 0.0010, spring: 0.018, len: 0.14, gravity: 0.006, clusterForce: 0.04 }, 400, makeRng(28)),
        circularLayout(),
        bipartiteLayout(),
        communityLayout(),
        degreeLayout(makeRng(35)),
    ];

    return {
        labels:  ['force', 'compact', 'expanded', 'clustered', 'circular', 'bipartite', 'community', 'by degree'],
        dt:      0,
        setup:   (id) => setupCanvas(id),
        drawFns: layouts.map(layout => (cv) => drawGraph(cv, layout)),
    };
}
