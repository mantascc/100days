// Variation 2 v1 — original thumbnail grid (simple, static-feeling, small cards)
function V2ThumbnailGridV1() {
  const active = window.PROJECTS.filter(p => !p.disabled);
  return (
    <div style={v2v1.shell}>
      <div style={v2v1.inner}>
        <div style={v2v1.header}>
          <div>
            <div style={v2v1.kicker}>100day · routine · dark-canvas experiments</div>
            <h1 style={v2v1.title}>Hello<br/>world<span style={v2v1.dot}>.</span></h1>
            <p style={v2v1.lede}>
              Sixty-eight single-file experiments in computational aesthetics. Each card is a glyph field, rendered live; click through to the real thing.
            </p>
          </div>
          <div style={v2v1.countWrap}>
            <div style={v2v1.countBig}>{active.length}</div>
            <div style={v2v1.countSm}>/ 100</div>
          </div>
        </div>

        <div style={v2v1.grid}>
          {active.map(p => <V2V1Card key={p.id} project={p} />)}
        </div>

        <footer style={v2v1.footer}>— compiled by mantascc · <a href="https://github.com/mantascc/100days" style={v2v1.flink}>github.com/mantascc/100days</a></footer>
      </div>
    </div>
  );
}

function V2V1Card({ project }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const c = window.THEMES[project.themes?.[0]]?.color || '#888';
    window.animateGlyph(ref.current, project, { size: 180, color: c });
    return () => cancelAnimationFrame(ref.current?._raf);
  }, [project.id]);
  return (
    <a href={`../${project.id}/index.html`} style={{...v2v1.card, borderColor: hover ? '#444' : '#222'}}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={v2v1.thumb}>
        <canvas ref={ref} style={{display:'block'}}/>
      </div>
      <div style={v2v1.cardBody}>
        <div style={v2v1.cardTop}>
          <span style={v2v1.cardDay}>day {String(project.day).padStart(3,'0')}</span>
          <span style={v2v1.cardThemes}>{project.themes[0] || '—'}</span>
        </div>
        <div style={{...v2v1.cardTitle, color: hover ? '#fff' : '#ccc'}}>{project.title}</div>
        <div style={v2v1.cardDesc}>{project.desc}</div>
      </div>
    </a>
  );
}

const v2v1 = {
  shell: { background:'#0a0a0a', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'64px 48px', minHeight:'100%' },
  inner: { maxWidth: 1080, margin:'0 auto' },
  header: { display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'start', marginBottom:64, paddingBottom:32, borderBottom:'1px solid #222' },
  kicker: { fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'#666', marginBottom:16 },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:96, fontWeight:400, lineHeight:0.9, letterSpacing:'-0.03em', margin:'0 0 24px', color:'#fff' },
  dot: { color:'#bc8cff' },
  lede: { fontSize:13, color:'#888', maxWidth:480, lineHeight:1.7 },
  countWrap: { textAlign:'right', color:'#666' },
  countBig: { fontFamily:"'Instrument Serif', serif", fontSize:64, color:'#fff', lineHeight:1 },
  countSm: { fontSize:12, color:'#666', marginTop:4 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:1, background:'#161616', border:'1px solid #222' },
  card: { background:'#0a0a0a', border:'1px solid', borderColor:'#222', textDecoration:'none', display:'flex', flexDirection:'column', transition:'border-color 0.2s', margin:-1 },
  thumb: { height:180, borderBottom:'1px solid #161616', display:'flex', alignItems:'center', justifyContent:'center', background:'#070707' },
  cardBody: { padding:'12px 14px 14px', display:'flex', flexDirection:'column', gap:6, flex:1 },
  cardTop: { display:'flex', justifyContent:'space-between', fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'#555' },
  cardDay: { color:'#666' },
  cardThemes: { color:'#888' },
  cardTitle: { fontFamily:"'Instrument Serif', serif", fontSize:20, lineHeight:1.1, letterSpacing:'-0.01em', transition:'color 0.2s' },
  cardDesc: { fontSize:11.5, color:'#666', lineHeight:1.5, marginTop:4 },
  footer: { marginTop:48, paddingTop:24, borderTop:'1px solid #222', fontSize:11, color:'#444', textAlign:'center' },
  flink: { color:'#666', textDecoration:'none' },
};

window.V2ThumbnailGridV1 = V2ThumbnailGridV1;
