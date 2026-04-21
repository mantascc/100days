// Glyph placeholder generator — deterministic ASCII art per project
// Each project gets a canvas-rendered glyph card based on its theme + id hash.
window.renderGlyph = function renderGlyph(canvas, project, opts = {}) {
  const { size = 160, color = '#ccc', bg = 'transparent', animate = true, dpr = (window.devicePixelRatio||1) } = opts;
  const ctx = canvas.getContext('2d');
  const w = size, h = size;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  // hash from id for deterministic params
  let hash = 0;
  for (let i = 0; i < project.id.length; i++) hash = ((hash<<5)-hash+project.id.charCodeAt(i))|0;
  const rand = (n=1) => { hash = (hash*1103515245 + 12345) & 0x7fffffff; return (hash / 0x7fffffff) * n; };
  const seed = Math.abs(hash) / 0x7fffffff;

  const theme = project.themes?.[0] || 'grid';
  const fs = 10;
  ctx.font = `400 ${fs}px JetBrains Mono, monospace`;
  ctx.textBaseline = 'top';

  const cols = Math.floor(w / 6);
  const rows = Math.floor(h / (fs * 1.1));
  const t = animate ? (performance.now() / 1000) * (0.4 + seed*0.3) : seed * 10;

  const draw = (char, r, c, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillText(char, c * 6, r * fs * 1.1);
  };

  ctx.clearRect(0,0,w,h);
  if (bg !== 'transparent') { ctx.fillStyle = bg; ctx.fillRect(0,0,w,h); }

  const cx = cols/2, cy = rows/2;

  // theme-specific renderers
  const GLYPHS_DOT = [' ','·','∙','∘','○','◌','◎','⊙','●'];
  const GLYPHS_BLOCK = [' ','░','▒','▓','█'];
  const GLYPHS_ASCII = [' ','.',':','-','=','+','*','#','%','@'];
  const GLYPHS_WAVE = [' ','·','~','-','=','≈'];

  if (theme === 'ascii' || theme === 'field' || theme === 'audio') {
    const G = theme === 'audio' ? GLYPHS_WAVE : GLYPHS_DOT;
    const f1 = 0.15 + seed*0.1, f2 = 0.2 + seed*0.08;
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const v = (Math.sin(c*f1 + t) + Math.cos(r*f2 - t*0.7) + Math.sin((c+r)*0.1+t*0.5) + 3)/6;
      const idx = Math.floor(v * (G.length-1));
      if (G[idx] !== ' ') draw(G[idx], r, c, 0.4 + v*0.6);
    }
  } else if (theme === 'network') {
    // draw nodes + edges
    const n = 8 + Math.floor(seed*6);
    const nodes = [];
    for (let i=0;i<n;i++){
      const a = (i/n)*Math.PI*2 + t*0.3;
      const rad = 4 + seed*3 + Math.sin(t+i)*1.5;
      nodes.push({ c: cx + Math.cos(a)*rad, r: cy + Math.sin(a)*rad*0.85 });
    }
    // edges as dots
    for (let i=0;i<n;i++) for (let j=i+1;j<n;j++){
      if ((i*j+n)%3 !== 0) continue;
      const a = nodes[i], b = nodes[j];
      const steps = 10;
      for (let k=0;k<steps;k++){
        const rr = a.r + (b.r-a.r)*k/steps;
        const cc = a.c + (b.c-a.c)*k/steps;
        draw('·', Math.round(rr), Math.round(cc), 0.3);
      }
    }
    for (const nd of nodes) draw('●', Math.round(nd.r), Math.round(nd.c), 0.9);
  } else if (theme === 'physics') {
    // particles in a radial field
    const n = 40;
    for (let i=0;i<n;i++){
      const a = i*0.618*Math.PI*2 + t*0.2;
      const rad = Math.sqrt(i/n) * Math.min(cols,rows)*0.45;
      const r = Math.round(cy + Math.sin(a)*rad);
      const c = Math.round(cx + Math.cos(a)*rad);
      if (r<0||r>=rows||c<0||c>=cols) continue;
      draw('·', r, c, 0.4 + (1-i/n)*0.5);
    }
    draw('●', Math.round(cy), Math.round(cx), 1);
  } else if (theme === 'agent') {
    // swarm vectors
    const n = 20;
    for (let i=0;i<n;i++){
      const px = (i*37 + seed*100) % cols;
      const py = (i*53 + seed*200) % rows;
      const a = Math.sin(t+i)*Math.PI;
      const ch = Math.abs(Math.cos(a))>0.7 ? '─' : Math.abs(Math.sin(a))>0.7 ? '│' : (Math.cos(a)*Math.sin(a)>0 ? '\\' : '/');
      draw(ch, Math.round(py), Math.round(px), 0.5 + Math.sin(t+i)*0.3);
    }
  } else if (theme === 'grid') {
    // grid with selective fill
    for (let r=0;r<rows;r+=2) for (let c=0;c<cols;c+=2){
      const v = Math.sin(c*0.3 + t)*Math.cos(r*0.3 - t*0.5);
      if (v > 0.2) draw('□', r, c, 0.5);
      else if (v > -0.2) draw('·', r, c, 0.3);
      else draw('■', r, c, 0.7);
    }
  } else if (theme === 'color') {
    // horizontal bands of block glyphs
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const band = Math.floor((r/rows)*5);
      const v = (Math.sin(c*0.25 + band + t*0.3) + 1)/2;
      const idx = Math.floor(v*(GLYPHS_BLOCK.length-1));
      if (GLYPHS_BLOCK[idx] !== ' ') draw(GLYPHS_BLOCK[idx], r, c, 0.4 + band*0.1);
    }
  } else if (theme === 'type') {
    // type specimen — big letterform from id
    const letter = project.title[0].toUpperCase();
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${Math.min(w,h)*0.9}px 'Instrument Serif', serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(letter, w/2, h/2 + 4);
    ctx.restore();
    // scatter of punctuation around
    const marks = ['·','∙',','];
    for (let i=0;i<12;i++){
      const a = i*0.618*Math.PI*2 + t*0.2;
      const rad = Math.min(cols,rows)*0.42;
      const r = Math.round(cy + Math.sin(a)*rad);
      const c = Math.round(cx + Math.cos(a)*rad);
      draw(marks[i%marks.length], r, c, 0.3);
    }
  } else if (theme === 'ui') {
    // mock UI chrome — rows of bars
    for (let r=1; r<rows-1; r+=3){
      const wd = Math.floor(cols * (0.3 + (Math.sin(r+t)+1)/3));
      for (let c=1;c<1+wd;c++) draw('▏', r, c, 0.7);
      for (let c=1;c<1+Math.floor(wd*0.4);c++) draw('─', r+1, c, 0.3);
    }
  } else if (theme === 'data') {
    // bar chart / sparkline
    for (let c=0;c<cols;c+=2){
      const h0 = Math.floor(rows * (0.3 + (Math.sin(c*0.4+t)+Math.sin(c*0.15-t*0.7))/4 + 0.2));
      for (let r=rows-1; r>rows-1-h0; r--) draw('▊', r, c, 0.5 + (r-rows+h0)/h0 * 0.4);
    }
  } else {
    // default: noise dots
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const v = Math.sin(c*0.3+r*0.2+t);
      if (v>0.5) draw('·', r, c, 0.4);
    }
  }
  ctx.globalAlpha = 1;
};

// Start animation loop for a canvas
window.animateGlyph = function(canvas, project, opts={}) {
  const loop = () => {
    if (!canvas.isConnected) return;
    window.renderGlyph(canvas, project, opts);
    canvas._raf = requestAnimationFrame(loop);
  };
  cancelAnimationFrame(canvas._raf);
  loop();
};
