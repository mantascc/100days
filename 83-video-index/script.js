const GRID = document.getElementById('grid');

const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const conn = navigator.connection || {};
const lightMode =
    prefersReducedMotion ||
    conn.saveData === true ||
    conn.effectiveType === '2g' ||
    conn.effectiveType === 'slow-2g';

async function init() {
    const data = await fetch('assets/gallery.json').then((r) => r.json());
    for (const item of data) GRID.appendChild(makeTile(item));

    if (!isCoarsePointer) return;            // desktop uses hover (handled per-tile)
    if (lightMode) return;                   // mobile + reduced-motion or slow net: posters + per-tile play btn
    setupCenteredPlayback();                 // mobile, normal net: single autoplay at viewport center
}

function makeTile(item) {
    const a = document.createElement('a');
    a.className = 'tile';
    if (item.disabled || !item.video) a.classList.add('disabled');
    a.href = item.href;
    a.dataset.slug = item.slug;
    const day = (item.slug.match(/^(\d+[a-z]?)/) || [])[1] || '';
    const playable = item.video && !item.disabled;
    const videoTag = playable
        ? `<video muted loop playsinline preload="none" data-src="${item.video}"></video>`
        : '';
    const playBtn =
        playable && isCoarsePointer && lightMode
            ? `<button class="play-btn" aria-label="Preview" aria-pressed="false">
                   <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                   <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
               </button>`
            : '';
    a.innerHTML = `
        <img src="${item.poster}" alt="${item.title}" loading="lazy">
        ${videoTag}
        ${playBtn}
        <span class="label">${day}: ${item.title}</span>
    `;
    if (!isCoarsePointer && playable) {
        a.addEventListener('pointerenter', () => activate(a));
        a.addEventListener('pointerleave', () => deactivate(a));
    }
    if (playable && isCoarsePointer && lightMode) {
        const btn = a.querySelector('.play-btn');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const playing = a.classList.contains('active');
            if (playing) deactivate(a);
            else activate(a);
            btn.setAttribute('aria-pressed', String(!playing));
        });
    }
    return a;
}

function activate(tile) {
    const video = tile.querySelector('video');
    if (!video) return;
    if (!video.src) video.src = video.dataset.src;
    video.play().catch(() => {});
    tile.classList.add('active');
}

function deactivate(tile) {
    const video = tile.querySelector('video');
    if (!video) return;
    video.pause();
    tile.classList.remove('active');
}

function setupCenteredPlayback() {
    let active = new Set();
    const update = () => {
        const cy = window.innerHeight / 2;
        const visible = [];
        for (const tile of GRID.querySelectorAll('.tile:not(.disabled)')) {
            const r = tile.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) continue;
            visible.push({ tile, top: r.top, mid: r.top + r.height / 2 });
        }
        if (!visible.length) {
            for (const t of active) deactivate(t);
            active = new Set();
            return;
        }
        // Pick the visible tile whose center is nearest viewport center.
        let bestTop = visible[0].top;
        let bestDy = Infinity;
        for (const v of visible) {
            const dy = Math.abs(v.mid - cy);
            if (dy < bestDy) {
                bestDy = dy;
                bestTop = v.top;
            }
        }
        // Activate every visible tile in the same row (tops within a few px).
        const next = new Set(
            visible.filter((v) => Math.abs(v.top - bestTop) < 4).map((v) => v.tile)
        );
        for (const t of active) if (!next.has(t)) deactivate(t);
        for (const t of next) if (!active.has(t)) activate(t);
        active = next;
    };
    let raf = null;
    const schedule = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = null;
            update();
        });
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
}

init();
setupWriteupModal();

function setupWriteupModal() {
    const link = document.getElementById('writeup-link');
    const dlg = document.getElementById('writeup');
    if (!link || !dlg) return;
    const body = dlg.querySelector('.modal-body');
    const copyBtn = dlg.querySelector('.modal-copy');
    const closeBtn = dlg.querySelector('.modal-close');
    let raw = '';
    let loaded = false;

    const open = async (e) => {
        e.preventDefault();
        if (!loaded) {
            try {
                raw = await fetch(link.getAttribute('href')).then((r) => r.text());
                body.innerHTML = window.marked ? marked.parse(raw) : `<pre>${escape(raw)}</pre>`;
                loaded = true;
            } catch (err) {
                body.innerHTML = `<p>Failed to load: ${err.message}</p>`;
            }
        }
        dlg.showModal();
    };

    const close = () => dlg.close();

    const copy = async () => {
        if (!raw) return;
        try {
            await navigator.clipboard.writeText(raw);
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = original;
                copyBtn.classList.remove('copied');
            }, 1400);
        } catch {
            copyBtn.textContent = 'Copy failed';
        }
    };

    link.addEventListener('click', open);
    copyBtn.addEventListener('click', copy);
    dlg.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close')) { close(); return; }
        if (e.target === dlg) close();  // backdrop click
    });
}

function escape(s) {
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
