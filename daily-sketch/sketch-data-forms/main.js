import { createChapter as createChartTypes  } from './chapters/chart-types.js';
import { createChapter as createGraphLayouts } from './chapters/graph-layouts.js';
import { createChapter as createProjections  } from './chapters/projections.js';
import { createChapter as createEncodings    } from './chapters/encodings.js';

const CHAPTER_FACTORIES = [
    { id: 'chart-types',   create: createChartTypes  },
    { id: 'graph-layouts', create: createGraphLayouts },
    { id: 'projections',   create: createProjections  },
    { id: 'encodings',     create: createEncodings    },
];

const N = CHAPTER_FACTORIES.length;

let rafId  = null;
let active = 0;

const grid        = document.getElementById('grid');
const counter     = document.getElementById('chapter-counter');
const chapterName = document.getElementById('chapter-name');
const btnPrev     = document.getElementById('btn-prev');
const btnNext     = document.getElementById('btn-next');

function pad(n) { return String(n).padStart(2, '0'); }

function hashIndex() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(N - 1, n - 1));
}

function load(index) {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }

    const meta    = CHAPTER_FACTORIES[index];
    const chapter = meta.create();
    const { labels, drawFns, dt, setup } = chapter;

    grid.innerHTML = labels.map((label, i) => `
        <div class="card">
            <span class="label">${label}</span>
            <div class="cell"><canvas id="c${i + 1}"></canvas></div>
        </div>
    `).join('');

    counter.textContent = `${pad(index + 1)} / ${pad(N)}`;
    chapterName.textContent = meta.id;
    btnPrev.classList.toggle('disabled', index === 0);
    btnNext.classList.toggle('disabled', index === N - 1);

    const cvs = {};
    for (let i = 1; i <= labels.length; i++) cvs[i] = setup(`c${i}`);

    if (dt === 0) {
        for (let i = 1; i <= labels.length; i++) drawFns[i - 1](cvs[i], 0);
    } else {
        let t = 0;
        const step = () => {
            t += dt;
            for (let i = 1; i <= labels.length; i++) drawFns[i - 1](cvs[i], t);
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

window.addEventListener('hashchange', () => { active = hashIndex(); load(active); });

active = hashIndex();
load(active);
