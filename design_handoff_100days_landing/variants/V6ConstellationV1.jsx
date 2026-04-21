// Variation 6 v1 — original constellation: static polar layout, no simulation, no drag, simple hover
function V6ConstellationV1() {
  const active = window.PROJECTS.filter(p => !p.disabled);
  const [hover, setHover] = React.useState(null);
  const W = 780, H = 560;

  const byTheme = {};
  window.THEME_ORDER.forEach(t => byTheme[t] = []);
  active.forEach(p => { const t = p.themes?.[0] || 'grid'; (byTheme[t] ||= []).push(p); });

  // Static polar placement: each theme gets a wedge; projects arranged along a short arc
  const nodes = [];
  const themes = window.THEME_ORDER.filter(t => byTheme[t]?.length);
  themes.forEach((t, ti) => {
    const center = (ti / themes.length) * Math.PI * 2 - Math.PI / 2;
    const list = byTheme[t];
    const spread = Math.min(0.75, 0.15 + list.length * 0.03);
    list.forEach((p, i) => {
      const frac = list.length === 1 ? 0 : (i / (list.length - 1)) - 0.5;
      const a = center + frac * spread;
      let h = 0; for (let k = 0; k < p.id.length; k++) h = ((h<<5)-h+p.id.charCodeAt(k))|0;
      const r = 140 + ((Math.abs(h) % 100)) + (i % 3) * 20;
      nodes.push({
        ...p, theme: t,
        color: window.THEMES[t].color,
        size: 2 + (p.day > 50 ? 2 : 1),
        x: W/2 + Math.cos(a) * r,
        y: H/2 + Math.sin(a) * r * 0.78,
        themeAngle: center,
      });
    });
  });
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Thin edges: nearest neighbor within theme
  const edges = [];
  themes.forEach(t => {
    const ns = nodes.filter(n => n.theme === t);
    ns.forEach((a, i) => {
      let best = null, bestD = Infinity;
      ns.forEach((b, j) => {
        if (i === j) return;
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < bestD) { bestD = d; best = b; }
      });
      if (best) edges.push({ a: a.id, b: best.id, color: window.THEMES[t].color });
    });
  });

  const current = hover ? byId[hover] : null;

  return (
    <div style={v6v1.shell}>
      <div style={v6v1.inner}>
        <div style={v6v1.topBar}>
          <span>constellation · mantascc / 100days</span>
          <span>{active.length} nodes · {themes.length} clusters</span>
        </div>

        <h1 style={v6v1.title}>star <em style={v6v1.em}>chart</em></h1>
        <p style={v6v1.lede}>
          Each experiment is a node, grouped by primary theme. Hover to read, click to open. A quiet map of what's been made and how it relates.
        </p>

        <div style={v6v1.stage}>
          <div style={v6v1.svgWrap}>
            <svg viewBox={`0 0 ${W} ${H}`} style={v6v1.svg} onMouseLeave={() => setHover(null)}>
              {/* theme labels on the outside */}
              {themes.map(t => {
                const a = byTheme[t][0] ? null : null;
                const idx = themes.indexOf(t);
                const ang = (idx / themes.length) * Math.PI * 2 - Math.PI / 2;
                const lx = W/2 + Math.cos(ang) * 260;
                const ly = H/2 + Math.sin(ang) * 220;
                return (
                  <text key={t} x={lx} y={ly} fill={window.THEMES[t].color} fontSize="10" textAnchor="middle"
                        style={{textTransform:'uppercase', letterSpacing:'0.14em', fontFamily:'JetBrains Mono, monospace', opacity:0.5}}>
                    {t} · {byTheme[t].length}
                  </text>
                );
              })}

              {edges.map((e, i) => {
                const a = byId[e.a], b = byId[e.b];
                const active = hover === e.a || hover === e.b;
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                             stroke={e.color} strokeWidth="0.5" opacity={active ? 0.7 : 0.2} />;
              })}

              {nodes.map(n => {
                const isHover = hover === n.id;
                return (
                  <a key={n.id} href={`../${n.id}/index.html`}
                     onMouseEnter={() => setHover(n.id)}>
                    <circle cx={n.x} cy={n.y} r={n.size + (isHover ? 2 : 0)} fill={n.color}
                            opacity={isHover ? 1 : 0.75} style={{cursor:'pointer'}} />
                    {isHover && (
                      <text x={n.x} y={n.y - n.size - 8} fill="#fff" fontSize="11" textAnchor="middle"
                            fontFamily="JetBrains Mono, monospace" style={{pointerEvents:'none'}}>
                        {n.title}
                      </text>
                    )}
                  </a>
                );
              })}
            </svg>
          </div>

          <div style={v6v1.readout}>
            {current ? (
              <React.Fragment>
                <div style={{...v6v1.rKicker, color: current.color}}>● day {String(current.day).padStart(3,'0')} · {current.themes.join(' · ')}</div>
                <div style={v6v1.rTitle}>{current.title}</div>
                <div style={v6v1.rDesc}>{current.desc}</div>
                <a href={`../${current.id}/index.html`} style={v6v1.rLink}>open {current.id} →</a>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={v6v1.rKicker}>— hover a node</div>
                <div style={v6v1.rDesc}>
                  Nodes cluster by primary theme. Thin lines link each project to its nearest neighbor in the same theme.
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const v6v1 = {
  shell: { background:'#0a0a0a', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'48px 40px 64px', minHeight:'100%' },
  inner: { maxWidth: 1080, margin:'0 auto' },
  topBar: { display:'flex', justifyContent:'space-between', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:24, paddingBottom:12, borderBottom:'1px solid #222' },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:84, fontWeight:400, lineHeight:1, letterSpacing:'-0.03em', margin:'0 0 20px', color:'#fff' },
  em: { fontStyle:'italic', color:'#39c5cf' },
  lede: { fontSize:13, color:'#888', maxWidth:580, lineHeight:1.7, marginBottom:32 },
  stage: { display:'grid', gridTemplateColumns:'1fr 280px', gap:24, alignItems:'start' },
  svgWrap: { border:'1px solid #1a1a1a', background:'#070708' },
  svg: { width:'100%', height:'auto', display:'block' },
  readout: { border:'1px solid #1a1a1a', background:'#0a0a0c', padding:20, fontSize:12, minHeight:220 },
  rKicker: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12, color:'#666' },
  rTitle: { fontFamily:"'Instrument Serif', serif", fontSize:24, color:'#fff', lineHeight:1.1, marginBottom:10, letterSpacing:'-0.01em' },
  rDesc: { fontSize:12, color:'#888', lineHeight:1.6, marginBottom:16 },
  rLink: { fontSize:11, color:'#39c5cf', textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.08em' },
};

window.V6ConstellationV1 = V6ConstellationV1;
