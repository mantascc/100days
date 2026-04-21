// Variation 6 v2 — Constellation map with force simulation, drag, zoom/pan, starry aesthetic
function V6Constellation() {
  const active = window.PROJECTS.filter(p => !p.disabled);
  const svgRef = React.useRef(null);
  const [hover, setHover] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [view, setView] = React.useState({ x: 0, y: 0, k: 1 });
  const [, forceRender] = React.useReducer(x => x+1, 0);
  const stateRef = React.useRef(null);

  const W = 820, H = 620;

  // Init nodes + edges once
  if (!stateRef.current) {
    const themeAngle = {};
    window.THEME_ORDER.forEach((t, i) => themeAngle[t] = (i / window.THEME_ORDER.length) * Math.PI * 2);
    const nodes = active.map(p => {
      const t = p.themes?.[0] || 'grid';
      let h = 0; for (let i = 0; i < p.id.length; i++) h = ((h<<5)-h+p.id.charCodeAt(i))|0;
      const rand = () => { h = (h*1103515245 + 12345) & 0x7fffffff; return h/0x7fffffff; };
      const a = themeAngle[t] + (rand()-0.5)*0.6;
      const r = 160 + rand()*80;
      return {
        ...p, theme: t,
        color: window.THEMES[t]?.color || '#888',
        size: 1.8 + (p.day > 60 ? 2.2 : p.day > 30 ? 1.3 : 0.6),
        x: W/2 + Math.cos(a)*r, y: H/2 + Math.sin(a)*r,
        vx: 0, vy: 0, fx: null, fy: null,
        anchorA: themeAngle[t], twinkle: rand(),
      };
    });
    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
    const edges = [];
    // nearest-neighbor within theme
    window.THEME_ORDER.forEach(t => {
      const ns = nodes.filter(n => n.theme === t);
      ns.forEach((a, i) => {
        let best = null, bestD = Infinity;
        ns.forEach((b, j) => {
          if (i === j) return;
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if (d < bestD) { bestD = d; best = b; }
        });
        if (best) edges.push({ a: a.id, b: best.id, color: window.THEMES[t].color, strong: true });
      });
    });
    // cross-theme bridges: project pairs that share >=2 themes
    for (let i = 0; i < nodes.length; i++) for (let j = i+1; j < nodes.length; j++){
      const shared = nodes[i].themes.filter(t => nodes[j].themes.includes(t));
      if (shared.length >= 2 && nodes[i].theme !== nodes[j].theme){
        edges.push({ a: nodes[i].id, b: nodes[j].id, color: '#444', strong: false });
      }
    }
    stateRef.current = { nodes, edges, byId };
  }

  // Force sim loop
  React.useEffect(() => {
    let raf;
    const step = () => {
      const { nodes, edges, byId } = stateRef.current;
      const cx = W/2, cy = H/2;
      for (const n of nodes) {
        if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; continue; }
        // gentle pull toward theme anchor (radial)
        const ax = cx + Math.cos(n.anchorA) * 200;
        const ay = cy + Math.sin(n.anchorA) * 170;
        n.vx += (ax - n.x) * 0.0008;
        n.vy += (ay - n.y) * 0.0008;
      }
      // repulsion
      for (let i = 0; i < nodes.length; i++) for (let j = i+1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx*dx + dy*dy + 0.01;
        const f = 120 / d2;
        const d = Math.sqrt(d2);
        const fx = (dx/d)*f, fy = (dy/d)*f;
        a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
      }
      // spring edges
      for (const e of edges) {
        const a = byId[e.a], b = byId[e.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) + 0.01;
        const target = e.strong ? 55 : 120;
        const k = e.strong ? 0.01 : 0.002;
        const f = (d - target) * k;
        a.vx += (dx/d)*f; a.vy += (dy/d)*f;
        b.vx -= (dx/d)*f; b.vy -= (dy/d)*f;
      }
      // integrate + damping
      for (const n of nodes) {
        if (n.fx != null) continue;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
        // soft bounds
        n.x = Math.max(20, Math.min(W-20, n.x));
        n.y = Math.max(20, Math.min(H-20, n.y));
      }
      forceRender();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Drag handler
  const dragRef = React.useRef(null);
  const screenToSvg = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    return { x: (px - view.x)/view.k, y: (py - view.y)/view.k };
  };
  const onNodeDown = (e, n) => {
    e.stopPropagation();
    const pt = screenToSvg(e);
    dragRef.current = { id: n.id, dx: pt.x - n.x, dy: pt.y - n.y };
    n.fx = n.x; n.fy = n.y;
  };
  React.useEffect(() => {
    const move = (e) => {
      if (!dragRef.current) return;
      const n = stateRef.current.byId[dragRef.current.id];
      const pt = screenToSvg(e);
      n.fx = pt.x - dragRef.current.dx;
      n.fy = pt.y - dragRef.current.dy;
    };
    const up = () => {
      if (dragRef.current) {
        const n = stateRef.current.byId[dragRef.current.id];
        // release with small velocity
        n.fx = null; n.fy = null;
      }
      dragRef.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [view]);

  // Zoom + pan on the svg itself
  const panRef = React.useRef(null);
  const onSvgDown = (e) => {
    if (e.target.closest('[data-node]')) return;
    panRef.current = { lx: e.clientX, ly: e.clientY, x: view.x, y: view.y };
  };
  React.useEffect(() => {
    const move = (e) => {
      if (!panRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scale = W / rect.width;
      setView(v => ({ ...v, x: panRef.current.x + (e.clientX - panRef.current.lx)*scale, y: panRef.current.y + (e.clientY - panRef.current.ly)*scale }));
    };
    const up = () => { panRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);
  const onWheel = (e) => {
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    setView(v => {
      const k2 = Math.max(0.5, Math.min(3, v.k * Math.exp(-e.deltaY*0.0015)));
      const r = k2 / v.k;
      return { k: k2, x: px - (px - v.x)*r, y: py - (py - v.y)*r };
    });
  };

  const { nodes, edges, byId } = stateRef.current;
  const current = hover ?? selected;
  const currentNode = current ? byId[current] : null;
  const now = performance.now() / 1000;

  return (
    <div style={v6s.shell}>
      {/* starfield bg */}
      <div style={v6s.stars} />
      <div style={v6s.inner}>
        <div style={v6s.topBar}>
          <span style={v6s.kicker}>constellation · mantascc / 100days</span>
          <span style={v6s.meta}>{active.length} nodes · {edges.length} edges · zoom {view.k.toFixed(2)}×</span>
        </div>

        <h1 style={v6s.title}>star <em style={v6s.em}>chart</em></h1>
        <p style={v6s.lede}>
          Each experiment is a star, anchored loosely to the cluster of its primary theme. Drag to rearrange, pan the canvas, scroll to zoom. Bridges between themes mark projects that share a second concept.
        </p>

        <div style={v6s.stage}>
          <div style={v6s.svgWrap}>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={v6s.svg}
                 onPointerDown={onSvgDown} onWheel={onWheel}
                 onMouseLeave={() => setHover(null)}>
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                {/* theme labels */}
                {window.THEME_ORDER.map((t, i) => {
                  const ns = nodes.filter(n => n.theme === t);
                  if (!ns.length) return null;
                  const a = (i / window.THEME_ORDER.length) * Math.PI * 2;
                  const lx = W/2 + Math.cos(a) * 290;
                  const ly = H/2 + Math.sin(a) * 260;
                  return (
                    <text key={t} x={lx} y={ly} fill={window.THEMES[t].color} fontSize="10" textAnchor="middle"
                          style={{textTransform:'uppercase', letterSpacing:'0.14em', fontFamily:'JetBrains Mono, monospace', opacity:0.5, pointerEvents:'none'}}>
                      {t} · {ns.length}
                    </text>
                  );
                })}

                {edges.map((e, i) => {
                  const a = byId[e.a], b = byId[e.b];
                  const active = hover === e.a || hover === e.b || selected === e.a || selected === e.b;
                  return (
                    <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                          stroke={e.color} strokeWidth={e.strong ? 0.5 : 0.3}
                          opacity={active ? 0.8 : (e.strong ? 0.2 : 0.08)}
                          strokeDasharray={e.strong ? null : '2 3'} />
                  );
                })}

                {nodes.map(n => {
                  const isHover = hover === n.id;
                  const isSel = selected === n.id;
                  const tw = 0.6 + 0.4*Math.sin(now*2 + n.twinkle*10);
                  return (
                    <g key={n.id} data-node style={{cursor:'grab', color: n.color}}
                       onPointerDown={(e) => onNodeDown(e, n)}
                       onMouseEnter={() => setHover(n.id)}
                       onClick={() => setSelected(n.id)}
                       onDoubleClick={() => window.location.href = `../${n.id}/index.html`}>
                      <circle cx={n.x} cy={n.y} r={(n.size + 8) * (isHover||isSel ? 1.3 : 1)} fill="url(#nodeGlow)" opacity={isHover||isSel ? 0.9 : tw*0.5} />
                      <circle cx={n.x} cy={n.y} r={n.size + (isHover||isSel ? 1.5 : 0)} fill={n.color} opacity={isHover||isSel ? 1 : 0.7 + tw*0.3} />
                      {(isHover || isSel) && (
                        <text x={n.x} y={n.y - n.size - 8} fill="#fff" fontSize="11" textAnchor="middle"
                              fontFamily="JetBrains Mono, monospace" style={{pointerEvents:'none'}}>
                          {n.title}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
            <div style={v6s.controls}>
              <button onClick={() => setView({x:0,y:0,k:1})} style={v6s.ctrlBtn}>reset</button>
              <button onClick={() => setView(v => ({...v, k: Math.min(3, v.k*1.2)}))} style={v6s.ctrlBtn}>+</button>
              <button onClick={() => setView(v => ({...v, k: Math.max(0.5, v.k/1.2)}))} style={v6s.ctrlBtn}>−</button>
            </div>
          </div>

          <div style={v6s.readout}>
            {currentNode ? (
              <React.Fragment>
                <div style={{...v6s.rKicker, color: currentNode.color}}>● day {String(currentNode.day).padStart(3,'0')} · {currentNode.themes.join(' · ')}</div>
                <div style={v6s.rTitle}>{currentNode.title}</div>
                <div style={v6s.rDesc}>{currentNode.desc}</div>
                <a href={`../${currentNode.id}/index.html`} style={v6s.rLink}>open {currentNode.id} →</a>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={v6s.rKicker}>— hover or click a star</div>
                <div style={v6s.rDesc}>
                  Solid edges link nearest neighbors inside a theme. Dashed edges bridge projects that share a secondary concept across themes.
                </div>
                <div style={v6s.kbd}>
                  <div>drag star · rearrange</div>
                  <div>drag sky · pan</div>
                  <div>scroll · zoom</div>
                  <div>dbl-click · open file</div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const v6s = {
  shell: { background:'#050507', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'48px 40px 64px', minHeight:'100%', position:'relative', overflow:'hidden' },
  stars: { position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 0.5px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.35) 0.5px, transparent 1px), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.25) 0.5px, transparent 1px)', backgroundSize:'200px 200px, 150px 150px, 300px 300px, 250px 250px', opacity:0.5, pointerEvents:'none' },
  inner: { maxWidth: 1120, margin:'0 auto', position:'relative' },
  topBar: { display:'flex', justifyContent:'space-between', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:24, paddingBottom:12, borderBottom:'1px solid #1a1a1a' },
  kicker: { color:'#666' },
  meta: { color:'#666' },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:88, fontWeight:400, lineHeight:1, letterSpacing:'-0.03em', margin:'0 0 20px', color:'#fff' },
  em: { fontStyle:'italic', color:'#39c5cf' },
  lede: { fontSize:13, color:'#888', maxWidth:620, lineHeight:1.7, marginBottom:32 },
  stage: { display:'grid', gridTemplateColumns:'1fr 280px', gap:24, alignItems:'start' },
  svgWrap: { position:'relative', border:'1px solid #1a1a1a', background:'#030305' },
  svg: { width:'100%', height:'auto', display:'block', cursor:'grab', touchAction:'none' },
  controls: { position:'absolute', top:12, right:12, display:'flex', gap:4 },
  ctrlBtn: { fontFamily:'inherit', fontSize:10, padding:'4px 10px', background:'rgba(10,10,12,0.8)', border:'1px solid #222', color:'#888', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' },
  readout: { border:'1px solid #1a1a1a', background:'#0a0a0c', padding:20, fontSize:12, minHeight:240 },
  rKicker: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12, color:'#666' },
  rTitle: { fontFamily:"'Instrument Serif', serif", fontSize:26, color:'#fff', lineHeight:1.1, marginBottom:10, letterSpacing:'-0.01em' },
  rDesc: { fontSize:12, color:'#888', lineHeight:1.6, marginBottom:16 },
  rLink: { fontSize:11, color:'#39c5cf', textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.08em' },
  kbd: { display:'flex', flexDirection:'column', gap:6, fontSize:11, color:'#555', marginTop:16, textTransform:'uppercase', letterSpacing:'0.06em' },
};

window.V6Constellation = V6Constellation;
