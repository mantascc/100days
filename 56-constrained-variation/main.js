const CHAPTERS = [
    './chapters/static.js',
    './chapters/interference.js',
    './chapters/scanlines.js',
    './chapters/corrupt.js',
    './chapters/anna.js',
    './chapters/blank.js',
];

const N = CHAPTERS.length;

let rafId      = null;
let autoPopover = null;
let active     = 0;

const grid        = document.getElementById('grid');
const counter     = document.getElementById('chapter-counter');
const chapterName = document.getElementById('chapter-name');
const btnPrev     = document.getElementById('btn-prev');
const btnNext     = document.getElementById('btn-next');

function pad(n) { return String(n).padStart(2, '0'); }

function hashIndex() {
    const n = parseInt(location.hash.slice(1));
    return isNaN(n) ? 0 : Math.max(0, Math.min(N - 1, n - 1));
}

async function load(index) {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    if (autoPopover !== null) { clearTimeout(autoPopover); autoPopover = null; }

    // close popover when navigating away
    document.getElementById('guide-popover').classList.remove('is-open');
    document.getElementById('btn-clone').classList.remove('active');

    const { default: chapter } = await import(CHAPTERS[index]);
    const { labels, drawFns, dt, setup } = chapter;

    // rebuild grid with chapter labels
    grid.innerHTML = labels.map((l, i) => `
        <div class="card">
            <span class="label">${l}</span>
            <div class="cell"><canvas id="c${i + 1}"></canvas></div>
        </div>
    `).join('');

    // update toolbar state
    counter.textContent = `${pad(index + 1)} / ${pad(N)}`;
    chapterName.textContent = CHAPTERS[index].split('/').pop().replace('.js', '');
    btnPrev.classList.toggle('disabled', index === 0);
    btnNext.classList.toggle('disabled', index === N - 1);

    // init canvases via chapter's setup
    const cvs = {};
    for (let i = 1; i <= 8; i++) cvs[i] = setup(`c${i}`);

    // auto-show CLONE popover on blank chapter
    if (CHAPTERS[index].includes('blank.js')) {
        autoPopover = setTimeout(() => {
            document.getElementById('guide-popover').classList.add('is-open');
            document.getElementById('btn-clone').classList.add('active');
        }, 1500);
    }

    // static chapter: draw once; animated: loop
    if (dt === 0) {
        for (let i = 1; i <= 8; i++) drawFns[i - 1](cvs[i], 0);
    } else {
        let t = 0;
        const step = () => {
            t += dt;
            for (let i = 1; i <= 8; i++) drawFns[i - 1](cvs[i], t);
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
    }
}

btnPrev.addEventListener('click', () => {
    if (active > 0) { active--; location.hash = active + 1; }
});

btnNext.addEventListener('click', () => {
    if (active < N - 1) { active++; location.hash = active + 1; }
});

window.addEventListener('hashchange', () => {
    active = hashIndex();
    load(active);
});

active = hashIndex();
load(active);
