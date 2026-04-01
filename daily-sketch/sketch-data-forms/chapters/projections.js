// Chapter 3: Projections
// Data story: "Where the internet lives" — ~30 major data center locations.
// Same points, eight map projections. Each reshapes geography, redistributes emphasis.

import { setupCanvas } from '../lib/utils.js';

// ── Data ──────────────────────────────────────────────────────────────────────

const CENTERS = [
    // North America (dense cluster)
    { lat: 39.0, lng: -77.5 },  // Ashburn
    { lat: 47.6, lng: -122.3 }, // Seattle
    { lat: 37.3, lng: -121.9 }, // San Jose
    { lat: 34.1, lng: -118.2 }, // Los Angeles
    { lat: 32.8, lng: -96.8  }, // Dallas
    { lat: 41.9, lng: -87.6  }, // Chicago
    { lat: 40.7, lng: -74.0  }, // New York
    { lat: 43.7, lng: -79.4  }, // Toronto
    { lat: 33.7, lng: -84.4  }, // Atlanta
    // Europe (dense cluster)
    { lat: 51.5, lng: -0.1   }, // London
    { lat: 52.4, lng:  4.9   }, // Amsterdam
    { lat: 50.1, lng:  8.7   }, // Frankfurt
    { lat: 48.9, lng:  2.3   }, // Paris
    { lat: 53.3, lng: -6.3   }, // Dublin
    { lat: 59.3, lng: 18.1   }, // Stockholm
    { lat: 47.4, lng:  8.5   }, // Zurich
    // Asia-Pacific (cluster)
    { lat:  1.4, lng: 103.8  }, // Singapore
    { lat: 35.7, lng: 139.7  }, // Tokyo
    { lat: 22.3, lng: 114.2  }, // Hong Kong
    { lat: -33.9,lng: 151.2  }, // Sydney
    { lat: 19.1, lng:  72.9  }, // Mumbai
    { lat: 37.6, lng: 127.0  }, // Seoul
    { lat: 39.9, lng: 116.4  }, // Beijing
    // Middle East
    { lat: 25.2, lng:  55.3  }, // Dubai
    { lat: 26.0, lng:  50.6  }, // Bahrain
    // South America (sparse)
    { lat: -23.5,lng: -46.6  }, // São Paulo
    { lat: -33.5,lng: -70.6  }, // Santiago
    // Africa (sparse)
    { lat: -26.2,lng:  28.0  }, // Johannesburg
    { lat:  -1.3,lng:  36.8  }, // Nairobi
];

// ── Projection functions ──────────────────────────────────────────────────────
// All return {x, y} in [0,1] × [0,1], or null if point not visible.

function equirectangular(lat, lng) {
    return { x: (lng + 180) / 360, y: (90 - lat) / 180 };
}

function mercator(lat, lng) {
    const latR = Math.max(-85, Math.min(85, lat)) * Math.PI / 180;
    const x    = (lng + 180) / 360;
    const y    = 0.5 - Math.log(Math.tan(Math.PI / 4 + latR / 2)) / (2 * Math.PI);
    return { x, y: Math.max(0, Math.min(1, y)) };
}

function mollweide(lat, lng) {
    const phi = lat * Math.PI / 180;
    const lam = lng * Math.PI / 180;
    let theta = phi;
    for (let i = 0; i < 10; i++) {
        theta -= (2 * theta + Math.sin(2 * theta) - Math.PI * Math.sin(phi)) /
                 (4 * Math.cos(theta) * Math.cos(theta) + 2);
    }
    const X = (2 * Math.SQRT2 / Math.PI) * lam * Math.cos(theta);
    const Y = Math.SQRT2 * Math.sin(theta);
    return {
        x: 0.5 + X / (4 * Math.SQRT2),
        y: 0.5 - Y / (2 * Math.SQRT2),
    };
}

function lambertCylindrical(lat, lng) {
    return {
        x: (lng + 180) / 360,
        y: 0.5 - Math.sin(lat * Math.PI / 180) * 0.5,
    };
}

function orthographic(centerLat, centerLng) {
    const cPhi = centerLat * Math.PI / 180;
    const cLam = centerLng * Math.PI / 180;
    return (lat, lng) => {
        const phi = lat * Math.PI / 180;
        const lam = lng * Math.PI / 180;
        const cosc = Math.sin(cPhi) * Math.sin(phi) +
                     Math.cos(cPhi) * Math.cos(phi) * Math.cos(lam - cLam);
        if (cosc < 0) return null;
        const X = Math.cos(phi) * Math.sin(lam - cLam);
        const Y = Math.cos(cPhi) * Math.sin(phi) - Math.sin(cPhi) * Math.cos(phi) * Math.cos(lam - cLam);
        return { x: 0.5 + X * 0.47, y: 0.5 - Y * 0.47 };
    };
}

function azimuthalEquidistant(centerLat, centerLng) {
    const cPhi = centerLat * Math.PI / 180;
    const cLam = centerLng * Math.PI / 180;
    return (lat, lng) => {
        const phi = lat * Math.PI / 180;
        const lam = lng * Math.PI / 180;
        const cosc = Math.sin(cPhi) * Math.sin(phi) +
                     Math.cos(cPhi) * Math.cos(phi) * Math.cos(lam - cLam);
        const c = Math.acos(Math.max(-1, Math.min(1, cosc)));
        if (c < 0.0001) return { x: 0.5, y: 0.5 };
        const k = c / Math.sin(c);
        const X = k * Math.cos(phi) * Math.sin(lam - cLam);
        const Y = k * (Math.cos(cPhi) * Math.sin(phi) - Math.sin(cPhi) * Math.cos(phi) * Math.cos(lam - cLam));
        return { x: 0.5 + X / (2 * Math.PI) * 1.6, y: 0.5 - Y / (2 * Math.PI) * 1.6 };
    };
}

// ── Graticule ─────────────────────────────────────────────────────────────────

function drawGraticule(ctx, W, H, project, pad) {
    const sx = x => pad + x * (W - pad * 2);
    const sy = y => pad + y * (H - pad * 2);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth   = 0.5;

    // Latitude lines every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
            const p = project(lat, lng);
            if (!p) { first = true; continue; }
            first ? ctx.moveTo(sx(p.x), sy(p.y)) : ctx.lineTo(sx(p.x), sy(p.y));
            first = false;
        }
        ctx.stroke();
    }

    // Longitude lines every 30°
    for (let lng = -180; lng <= 180; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 3) {
            const p = project(lat, lng);
            if (!p) { first = true; continue; }
            first ? ctx.moveTo(sx(p.x), sy(p.y)) : ctx.lineTo(sx(p.x), sy(p.y));
            first = false;
        }
        ctx.stroke();
    }
}

// ── Draw function factory ─────────────────────────────────────────────────────

function makeDrawProjection(project, globeCircle = false) {
    return (cv) => {
        const { ctx, W, H } = cv;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);

        const pad = 12;

        // Globe outline for orthographic
        if (globeCircle) {
            const cx = pad + 0.5 * (W - pad * 2);
            const cy = pad + 0.5 * (H - pad * 2);
            const r  = Math.min(W - pad * 2, H - pad * 2) * 0.47;
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        drawGraticule(ctx, W, H, project, pad);

        // Data center dots
        const sx = x => pad + x * (W - pad * 2);
        const sy = y => pad + y * (H - pad * 2);

        CENTERS.forEach(({ lat, lng }) => {
            const p = project(lat, lng);
            if (!p) return;
            if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return;
            ctx.fillStyle = '#00a8ff';
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.arc(sx(p.x), sy(p.y), 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    };
}

// ── Chapter factory ───────────────────────────────────────────────────────────

export function createChapter() {
    const orthoAtlantic = orthographic(20, -30);
    const orthoPacific  = orthographic(20, 150);
    const orthoPole     = orthographic(90, 0);
    const azimuthal     = azimuthalEquidistant(20, 15);

    return {
        labels: [
            'equirectangular',
            'mercator',
            'mollweide',
            'lambert cyl.',
            'ortho · atlantic',
            'ortho · pacific',
            'ortho · north pole',
            'azimuthal equidist.',
        ],
        dt: 0,
        setup: (id) => setupCanvas(id),
        drawFns: [
            makeDrawProjection(equirectangular),
            makeDrawProjection(mercator),
            makeDrawProjection(mollweide),
            makeDrawProjection(lambertCylindrical),
            makeDrawProjection(orthoAtlantic, true),
            makeDrawProjection(orthoPacific,  true),
            makeDrawProjection(orthoPole,     true),
            makeDrawProjection(azimuthal),
        ],
    };
}
