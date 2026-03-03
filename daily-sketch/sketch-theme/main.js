import { getThemeBySlug, THEMES } from '../themes.js';
import { rgbToHex } from './lib/utils.js';
import { createChapter as createStaticChapter } from './chapters/static.js';
import { createChapter as createInterferenceChapter } from './chapters/interference.js';
import { createChapter as createScanlinesChapter } from './chapters/scanlines.js';
import { createChapter as createCorruptChapter } from './chapters/corrupt.js';
import { createChapter as createAnnaChapter } from './chapters/anna.js';
import { createChapter as createEntropyChapter } from './chapters/entropy.js';

const CHAPTER_FACTORIES = [
    { id: 'static', create: createStaticChapter },
    { id: 'interference', create: createInterferenceChapter },
    { id: 'scanlines', create: createScanlinesChapter },
    { id: 'corrupt', create: createCorruptChapter },
    { id: 'anna', create: createAnnaChapter },
    { id: 'entropy', create: createEntropyChapter },
];

const N = CHAPTER_FACTORIES.length;

const search = new URLSearchParams(window.location.search);
const theme = getThemeBySlug(search.get('theme'));

let rafId = null;
let active = 0;

const root = document.documentElement;
const grid = document.getElementById('grid');
const counter = document.getElementById('chapter-counter');
const chapterName = document.getElementById('chapter-name');
const themeName = document.getElementById('theme-name');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const themeList = document.getElementById('theme-list');

function pad(n) {
    return String(n).padStart(2, '0');
}

function mixRgb(a, b, t) {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ];
}

function hashIndex() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(N - 1, n - 1));
}

function applyTheme() {
    const uiAccent = mixRgb([255, 255, 255], theme.pink, 0.1);
    root.style.setProperty('--theme-deep', rgbToHex(theme.deep));
    root.style.setProperty('--ui-accent', rgbToHex(uiAccent));
    document.title = theme.name;
    themeName.textContent = theme.name.toLowerCase();
}

function renderThemeList() {
    const currentHash = `#${active + 1}`;
    themeList.innerHTML = THEMES.map((entry) => `
        <li>
            <a class="theme-option ${entry.slug === theme.slug ? 'is-active' : ''}" href="./?theme=${entry.slug}${currentHash}" ${entry.slug === theme.slug ? 'aria-current="true"' : ''}>
                <span class="theme-option-label">${entry.name.toUpperCase()}</span>
            </a>
        </li>
    `).join('');
}

async function load(index) {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    document.getElementById('guide-popover').classList.remove('is-open');
    document.getElementById('btn-clone').classList.remove('active');

    const chapterMeta = CHAPTER_FACTORIES[index];
    const chapter = chapterMeta.create(theme);
    const { labels, drawFns, dt, setup } = chapter;

    grid.innerHTML = labels.map((label, i) => `
        <div class="card">
            <span class="label">${label}</span>
            <div class="cell"><canvas id="c${i + 1}"></canvas></div>
        </div>
    `).join('');

    counter.textContent = `${pad(index + 1)} / ${pad(N)}`;
    chapterName.textContent = chapterMeta.id;
    btnPrev.classList.toggle('disabled', index === 0);
    btnNext.classList.toggle('disabled', index === N - 1);
    renderThemeList();

    const cvs = {};
    for (let i = 1; i <= 8; i++) cvs[i] = setup(`c${i}`);

    if (dt === 0) {
        for (let i = 1; i <= 8; i++) drawFns[i - 1](cvs[i], 0);
        return;
    }

    let t = 0;
    const step = () => {
        t += dt;
        for (let i = 1; i <= 8; i++) drawFns[i - 1](cvs[i], t);
        rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
}

btnPrev.addEventListener('click', () => {
    if (active > 0) {
        active -= 1;
        location.hash = active + 1;
    }
});

btnNext.addEventListener('click', () => {
    if (active < N - 1) {
        active += 1;
        location.hash = active + 1;
    }
});

window.addEventListener('hashchange', () => {
    active = hashIndex();
    load(active);
});

applyTheme();
active = hashIndex();
load(active);
