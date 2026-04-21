// Variation 2 v2 — Glyph thumbnails, featured-first, theme-distinct glyphs, filter chips
function V2ThumbnailGrid() {
  const active = window.PROJECTS.filter(p => !p.disabled);
  const [filter, setFilter] = React.useState('all');

  const counts = {};
  active.forEach(p => { const t = p.themes?.[0] || '—'; counts[t] = (counts[t]||0) + 1; });

  const filtered = filter === 'all' ? active : active.filter(p => p.themes?.includes(filter));
  const [featured, ...rest] = filtered;

  return (
    <div style={v2s.shell}>
      <div style={v2s.inner}>
        <div style={v2s.header}>
          <div style={{flex:1}}>
            <div style={v2s.kicker}>specimen catalog · 100day · vol. 001</div>
            <h1 style={v2s.title}>specimens<span style={v2s.dot}>.</span></h1>
            <p style={v2s.lede}>
              Each card is a glyph field rendered live — a portrait of the project drawn in its own primary theme. Sixty-eight specimens; hover to preview, click to open.
            </p>
          </div>
          <div style={v2s.countWrap}>
            <div style={v2s.countBig}>{active.length}</div>
            <div style={v2s.countSm}>/ 100</div>
            <div style={v2s.countHint}>{filtered.length} shown</div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={v2s.filterBar}>
          <span style={v2s.filterLabel}>filter —</span>
          <button onClick={() => setFilter('all')} style={v2s.chip(filter==='all', '#888')}>all · {active.length}</button>
          {window.THEME_ORDER.map(t => counts[t] ? (
            <button key={t} onClick={() => setFilter(t)} style={v2s.chip(filter===t, window.THEMES[t].color)}>
              {t} · {counts[t]}
            </button>
          ) : null)}
        </div>

        {featured && (
          <a href={`../${featured.id}/index.html`} style={v2s.featured}>
            <V2Glyph project={featured} size={380} />
            <div style={v2s.featBody}>
              <div style={v2s.featKicker}>— featured / day {String(featured.day).padStart(3,'0')}</div>
              <div style={v2s.featTitle}>{featured.title}</div>
              <div style={v2s.featDesc}>{featured.desc}</div>
              <div style={v2s.featThemes}>
                {featured.themes.map(t => <span key={t} style={{color: window.THEMES[t]?.color}}>· {t}</span>)}
              </div>
              <div style={v2s.featOpen}>open {featured.id} →</div>
            </div>
          </a>
        )}

        <div style={v2s.grid}>
          {rest.map(p => <V2Card key={p.id} project={p} />)}
        </div>

        <footer style={v2s.footer}>
          compiled by mantascc · <a href="https://github.com/mantascc/100days" style={v2s.flink}>github.com/mantascc/100days</a>
        </footer>
      </div>
    </div>
  );
}

function V2Glyph({ project, size=200 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const c = window.THEMES[project.themes?.[0]]?.color || '#888';
    window.animateGlyph(ref.current, project, { size, color: c });
    return () => cancelAnimationFrame(ref.current?._raf);
  }, [project.id, size]);
  return (
    <div style={{width:size, height:size, background:'#070707', flexShrink:0, overflow:'hidden'}}>
      <canvas ref={ref} style={{display:'block'}}/>
    </div>
  );
}

function V2Card({ project }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const c = window.THEMES[project.themes?.[0]]?.color || '#888';
    window.animateGlyph(ref.current, project, { size: 200, color: c });
    return () => cancelAnimationFrame(ref.current?._raf);
  }, [project.id]);
  const themeColor = window.THEMES[project.themes?.[0]]?.color || '#888';
  return (
    <a href={`../${project.id}/index.html`}
       style={{...v2s.card, borderColor: hover ? themeColor : '#222'}}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={v2s.thumb}>
        <canvas ref={ref} style={{display:'block'}}/>
        {hover && (
          <div style={v2s.hoverInfo}>
            {project.themes.map(t => <span key={t} style={{color: window.THEMES[t]?.color, marginRight:8}}>· {t}</span>)}
          </div>
        )}
      </div>
      <div style={v2s.cardBody}>
        <div style={v2s.cardTop}>
          <span style={v2s.cardDay}>day {String(project.day).padStart(3,'0')}</span>
          <span style={{...v2s.cardThemes, color: themeColor}}>● {project.themes[0] || '—'}</span>
        </div>
        <div style={{...v2s.cardTitle, color: hover ? '#fff' : '#ddd'}}>{project.title}</div>
        <div style={v2s.cardDesc}>{project.desc}</div>
      </div>
    </a>
  );
}

const v2s = {
  shell: { background:'#0a0a0a', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'56px 40px 80px', minHeight:'100%' },
  inner: { maxWidth: 1040, margin:'0 auto' },
  header: { display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'start', marginBottom:32, paddingBottom:24, borderBottom:'1px solid #222' },
  kicker: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#555', marginBottom:16 },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:108, fontWeight:400, lineHeight:0.9, letterSpacing:'-0.03em', margin:'0 0 20px', color:'#fff' },
  dot: { color:'#bc8cff' },
  lede: { fontSize:13, color:'#888', maxWidth:520, lineHeight:1.7 },
  countWrap: { textAlign:'right', color:'#666' },
  countBig: { fontFamily:"'Instrument Serif', serif", fontSize:72, color:'#fff', lineHeight:1 },
  countSm: { fontSize:12, color:'#555', marginTop:4 },
  countHint: { fontSize:10, color:'#777', marginTop:8, textTransform:'uppercase', letterSpacing:'0.08em' },
  filterBar: { display:'flex', flexWrap:'wrap', alignItems:'center', gap:6, marginBottom:32, padding:'10px 0', borderBottom:'1px solid #161616' },
  filterLabel: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'#555', marginRight:8 },
  chip: (active, color) => ({
    fontFamily:'inherit', fontSize:10, padding:'5px 10px', textTransform:'uppercase', letterSpacing:'0.06em',
    border:'1px solid', borderColor: active ? color : '#222', background: active ? color+'22' : 'transparent',
    color: active ? color : '#666', cursor:'pointer', transition:'all 0.15s'
  }),
  featured: { display:'flex', gap:0, marginBottom:32, border:'1px solid #222', background:'#0d0d0d', textDecoration:'none', transition:'border-color 0.2s' },
  featBody: { padding:'32px 36px', flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12 },
  featKicker: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'#555' },
  featTitle: { fontFamily:"'Instrument Serif', serif", fontSize:52, color:'#fff', lineHeight:1, letterSpacing:'-0.02em' },
  featDesc: { fontSize:14, color:'#999', lineHeight:1.6, maxWidth:440 },
  featThemes: { display:'flex', gap:12, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:4 },
  featOpen: { fontSize:11, color:'#58a6ff', marginTop:8, textTransform:'uppercase', letterSpacing:'0.08em' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 },
  card: { background:'#0a0a0a', border:'1px solid #222', textDecoration:'none', display:'flex', flexDirection:'column', transition:'border-color 0.2s' },
  thumb: { height:200, borderBottom:'1px solid #161616', display:'flex', alignItems:'center', justifyContent:'center', background:'#070707', position:'relative', overflow:'hidden' },
  hoverInfo: { position:'absolute', left:10, bottom:10, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', background:'rgba(10,10,10,0.92)', padding:'4px 8px', border:'1px solid #222' },
  cardBody: { padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:6, flex:1 },
  cardTop: { display:'flex', justifyContent:'space-between', fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em' },
  cardDay: { color:'#555', fontVariantNumeric:'tabular-nums' },
  cardThemes: { color:'#888' },
  cardTitle: { fontFamily:"'Instrument Serif', serif", fontSize:22, lineHeight:1.1, letterSpacing:'-0.01em', transition:'color 0.2s', marginTop:2 },
  cardDesc: { fontSize:11.5, color:'#666', lineHeight:1.5, marginTop:4 },
  footer: { marginTop:48, paddingTop:24, borderTop:'1px solid #222', fontSize:11, color:'#555', textAlign:'center' },
  flink: { color:'#777', textDecoration:'none' },
};

window.V2ThumbnailGrid = V2ThumbnailGrid;
