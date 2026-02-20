const SIZE = 24;
const BG = '#0a0a0a';
const FG = '#ffffff';

class LoaderGrid {
  constructor() {
    this.loaders = [];
    this.cells = [];
    this.startTime = Date.now();
  }

  registerLoader(loader, group, index) {
    this.loaders.push({ loader, group, index });
  }

  init() {
    const grid = document.getElementById('grid');
    let currentGroup = null;

    this.loaders.forEach(({ loader, group, index }, i) => {
      // Add group title if we're starting a new group
      if (group !== currentGroup) {
        const titleRow = document.createElement('div');
        titleRow.className = 'group-title';
        titleRow.textContent = group;
        grid.appendChild(titleRow);
        currentGroup = group;
      }

      const cell = document.createElement('div');
      cell.className = 'loader-cell';

      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;

      const ctx = canvas.getContext('2d');

      cell.appendChild(canvas);
      grid.appendChild(cell);

      // Hover info for desktop
      cell.addEventListener('mouseenter', () => {
        const info = document.getElementById('hover-info');
        info.innerHTML = `<div class="group">${group}</div><div class="index">#${index + 1}</div>`;
        info.classList.add('visible');
      });

      cell.addEventListener('mouseleave', () => {
        document.getElementById('hover-info').classList.remove('visible');
      });

      // Tap info for mobile
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        const info = document.getElementById('hover-info');
        info.innerHTML = `<div class="group">${group}</div><div class="index">#${index + 1}</div>`;
        info.classList.add('visible');
      });

      this.cells.push({ canvas, ctx, loader });
    });

    // Hide tooltip when tapping outside
    document.addEventListener('click', () => {
      document.getElementById('hover-info').classList.remove('visible');
    });

    this.animate();
  }

  animate() {
    const elapsed = Date.now() - this.startTime;
    const t = elapsed; // milliseconds for the loader functions

    this.cells.forEach(({ ctx, loader }) => {
      // Clear
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Draw
      ctx.fillStyle = FG;
      ctx.strokeStyle = FG;
      loader(ctx, t);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Utility: convert t (ms) to normalized loop time [0,1) with duration
const loop = (t, duration = 1000) => (t % duration) / duration;

// Easing helpers
const ease = {
  inOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  out: t => t * (2 - t),
};
