// Record one short square video per sketch using Playwright + ffmpeg.
//
// usage:
//   node capture.mjs               # all scenarios
//   node capture.mjs 25-spotlight  # only scenarios whose slug contains this string
//
// Each scenario in scenarios/*.mjs exports:
//   export const meta = { slug, title, warmupMs?: number }
//   export async function play(page)  // do interactions; we record while this runs
//
// Output:
//   ../assets/videos/<slug>.mp4    H.264, 720x720, no audio, looping length
//   ../assets/posters/<slug>.jpg   first frame
//   ../assets/gallery.json         list consumed by index.html

import { chromium } from 'playwright';
import { readdir, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKETCH_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(__dirname, '../..');
const SCENARIO_DIR = path.join(__dirname, 'scenarios');
const RAW_DIR = path.join(__dirname, '.raw');
const VIDEO_OUT = path.join(SKETCH_DIR, 'assets/videos');
const POSTER_OUT = path.join(SKETCH_DIR, 'assets/posters');
const GALLERY_JSON = path.join(SKETCH_DIR, 'assets/gallery.json');

const SIZE = 720;
const SERVE_PORT = 8766;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ico': 'image/x-icon',
};

function startServer() {
    const server = http.createServer(async (req, res) => {
        try {
            let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
            if (p.endsWith('/')) p += 'index.html';
            const file = path.join(REPO_ROOT, p);
            if (!file.startsWith(REPO_ROOT + path.sep) && file !== REPO_ROOT) {
                res.writeHead(403); res.end(); return;
            }
            const data = await readFile(file);
            const ext = path.extname(file).toLowerCase();
            res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
            res.end(data);
        } catch {
            res.writeHead(404); res.end();
        }
    });
    return new Promise((resolve) => {
        server.listen(SERVE_PORT, '127.0.0.1', () => resolve(server));
    });
}

function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
        p.on('close', (code) =>
            code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))
        );
    });
}

async function loadScenarios() {
    const files = (await readdir(SCENARIO_DIR))
        .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
        .sort();
    const out = [];
    for (const f of files) {
        const mod = await import(pathToFileURL(path.join(SCENARIO_DIR, f)).href);
        if (!mod.meta?.slug) throw new Error(`${f}: missing meta.slug`);
        if (typeof mod.play !== 'function') throw new Error(`${f}: missing play()`);
        out.push(mod);
    }
    return out;
}

async function captureOne(scenario) {
    const sketchPath = path.join(REPO_ROOT, scenario.meta.slug, 'index.html');
    if (!existsSync(sketchPath)) throw new Error(`missing sketch: ${sketchPath}`);
    const url = `http://127.0.0.1:${SERVE_PORT}/${scenario.meta.slug}/`;

    // Fresh raw dir per run for predictable file lookup.
    const scenarioRawDir = path.join(RAW_DIR, scenario.meta.slug);
    await rm(scenarioRawDir, { recursive: true, force: true });
    await mkdir(scenarioRawDir, { recursive: true });

    const browser = await chromium.launch({
        args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--autoplay-policy=no-user-gesture-required',
        ],
    });
    const context = await browser.newContext({
        viewport: { width: SIZE, height: SIZE },
        recordVideo: {
            dir: scenarioRawDir,
            size: { width: SIZE, height: SIZE },
        },
        deviceScaleFactor: 2,
        permissions: ['camera', 'microphone'],
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    if (scenario.meta.zoom) {
        const z = scenario.meta.zoom;
        await page.evaluate((v) => {
            document.documentElement.style.zoom = String(v);
        }, z);
    }
    await page.waitForTimeout(scenario.meta.warmupMs ?? 600);
    try {
        await scenario.play(page);
    } finally {
        // closing the page + context flushes the .webm to disk
        await page.close();
        await context.close();
        await browser.close();
    }

    const files = (await readdir(scenarioRawDir)).filter((f) => f.endsWith('.webm'));
    if (!files.length) throw new Error(`no .webm produced for ${scenario.meta.slug}`);
    return path.join(scenarioRawDir, files[0]);
}

async function processVideo(rawPath, slug, meta) {
    const mp4 = path.join(VIDEO_OUT, `${slug}.mp4`);
    const jpg = path.join(POSTER_OUT, `${slug}.jpg`);
    const ssSec = ((meta.warmupMs ?? 600) / 1000).toFixed(2);
    const filters = [];
    if (meta.crop) filters.push(`crop=${meta.crop}`);
    if (meta.vf) filters.push(meta.vf);
    filters.push(`scale=${SIZE}:${SIZE}:flags=lanczos`);
    await run('ffmpeg', [
        '-y',
        '-ss', ssSec,
        '-i', rawPath,
        '-vf', filters.join(','),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '26',
        '-preset', 'slow',
        '-movflags', '+faststart',
        '-an',
        mp4,
    ]);
    await run('ffmpeg', ['-y', '-i', mp4, '-vframes', '1', '-q:v', '3', jpg]);
}

async function writeGalleryJson(scenarios) {
    const entries = scenarios
        .filter((s) => existsSync(path.join(POSTER_OUT, `${s.meta.slug}.jpg`)))
        .map((s) => ({
            slug: s.meta.slug,
            title: s.meta.title,
            href: `../${s.meta.slug}/`,
            poster: `assets/posters/${s.meta.slug}.jpg`,
            video: existsSync(path.join(VIDEO_OUT, `${s.meta.slug}.mp4`))
                ? `assets/videos/${s.meta.slug}.mp4`
                : null,
            disabled: Boolean(s.meta.disabled),
        }));
    // Newest first: descending by leading number in slug.
    entries.sort((a, b) => {
        const na = parseInt(a.slug.match(/^(\d+)/)?.[1] ?? '0', 10);
        const nb = parseInt(b.slug.match(/^(\d+)/)?.[1] ?? '0', 10);
        if (na !== nb) return nb - na;
        return b.slug.localeCompare(a.slug);
    });
    await writeFile(GALLERY_JSON, JSON.stringify(entries, null, 2) + '\n');
}

async function main() {
    const filter = process.argv[2];
    for (const d of [VIDEO_OUT, POSTER_OUT, RAW_DIR]) await mkdir(d, { recursive: true });

    const all = await loadScenarios();
    const toCapture = filter ? all.filter((s) => s.meta.slug.includes(filter)) : all;
    if (!toCapture.length) {
        console.error('no scenarios matched filter');
        process.exit(1);
    }
    const server = await startServer();
    console.log(`capturing ${toCapture.length} of ${all.length} scenario(s)`);
    const failed = [];
    for (const s of toCapture) {
        process.stdout.write(`▶ ${s.meta.slug} ... `);
        const t0 = performance.now();
        try {
            const raw = await captureOne(s);
            await processVideo(raw, s.meta.slug, s.meta);
            console.log(`✓ (${((performance.now() - t0) / 1000).toFixed(1)}s)`);
        } catch (e) {
            console.log(`✗ ${e.message.split('\n')[0]}`);
            failed.push({ slug: s.meta.slug, error: e.message.split('\n')[0] });
        }
    }
    server.close();
    if (failed.length) {
        console.log(`\n${failed.length} failed:`);
        for (const f of failed) console.log(`  ✗ ${f.slug}: ${f.error}`);
    }
    // Always rewrite gallery.json from the full scenario set so a filtered
    // re-shoot doesn't drop the other tiles.
    await writeGalleryJson(all);
    console.log(`wrote ${path.relative(REPO_ROOT, GALLERY_JSON)}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
