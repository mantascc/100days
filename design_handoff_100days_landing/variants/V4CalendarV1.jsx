// Variation 4 v1 — original calendar field: plain 10x10, single-char theme swatches, no sidebar glyphs
function V4CalendarV1() {
  const byDay = {};
  window.PROJECTS.forEach(p => { byDay[Math.floor(p.day)] = p; });
  const [hover, setHover] = React.useState(null);
  const active = window.PROJECTS.filter(p => !p.disabled);

  const cells = []; for (let i = 1; i <= 100; i++) cells.push(i);
  const current = hover != null ? byDay[hover] : null;

  return (
    <div style={v4v1.shell}>
      <div style={v4v1.inner}>
        <div style={v4v1.topMeta}>
          <span>clear_channel · 100day · field</span>
          <span>{active.length} landed · {100 - active.length} blank</span>
        </div>

        <h1 style={v4v1.title}>a hundred<br/><em style={v4v1.em}>days.</em></h1>
        <p style={v4v1.lede}>
          One cell per day. Solid for a landed experiment, dim for an empty day, × for an archived one. Hover a cell to read; click to open.
        </p>

        <div style={v4v1.grid}>
          {cells.map(n => {
            const p = byDay[n];
            if (!p) {
              return (
                <div key={n} style={{...v4v1.cell, ...v4v1.cellEmpty}} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}>
                  <span style={v4v1.cellNum}>{String(n).padStart(2,'0')}</span>
                </div>
              );
            }
            if (p.disabled) {
              return (
                <div key={n} style={{...v4v1.cell, ...v4v1.cellDisabled}} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}>
                  <span style={v4v1.cellNum}>{String(n).padStart(2,'0')}</span>
                  <span style={v4v1.xMark}>✗</span>
                </div>
              );
            }
            const c = window.THEMES[p.themes?.[0]]?.color || '#888';
            return (
              <a key={n} href={`../${p.id}/index.html`}
                 onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}
                 style={{...v4v1.cell, background: c + '22', borderColor: hover === n ? c : '#1a1a1a', color: c}}>
                <span style={{...v4v1.cellNum, color: hover === n ? '#fff' : c}}>{String(n).padStart(2,'0')}</span>
                <span style={v4v1.themeMark}>{p.themes?.[0]?.[0]?.toUpperCase() || '·'}</span>
              </a>
            );
          })}
        </div>

        <div style={v4v1.readout}>
          {hover != null && byDay[hover] && !byDay[hover].disabled ? (() => {
            const p = byDay[hover];
            return (
              <div>
                <span style={v4v1.rKicker}>day {String(p.day).padStart(3,'0')} · {p.themes.join(' · ')}</span>
                <span style={v4v1.rTitle}>{p.title}</span>
                <span style={v4v1.rDesc}>— {p.desc}</span>
              </div>
            );
          })() : hover != null ? (
            <div><span style={v4v1.rKicker}>day {String(hover).padStart(3,'0')}</span> <span style={v4v1.rDesc}>— no experiment landed on this day.</span></div>
          ) : (
            <div><span style={v4v1.rDesc}>— hover a cell to read. 100 cells, one per day.</span></div>
          )}
        </div>

        <div style={v4v1.legend}>
          {window.THEME_ORDER.map(t => {
            const count = active.filter(p => p.themes?.[0] === t).length;
            if (!count) return null;
            return (
              <span key={t} style={v4v1.legendItem}>
                <span style={{...v4v1.legendDot, background: window.THEMES[t].color}} />
                {t} · {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const v4v1 = {
  shell: { background:'#0a0a0a', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'48px 40px 64px', minHeight:'100%' },
  inner: { maxWidth: 900, margin:'0 auto' },
  topMeta: { display:'flex', justifyContent:'space-between', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:32, paddingBottom:12, borderBottom:'1px solid #222' },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:104, fontWeight:400, lineHeight:0.9, letterSpacing:'-0.03em', margin:'0 0 20px', color:'#fff' },
  em: { color:'#bc8cff', fontStyle:'italic' },
  lede: { fontSize:13, color:'#888', maxWidth:520, lineHeight:1.7, marginBottom:40 },
  grid: { display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:3, marginBottom:24 },
  cell: { position:'relative', aspectRatio:'1', border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', cursor:'pointer', transition:'border-color 0.15s, background 0.15s' },
  cellEmpty: { background:'#0a0a0a' },
  cellDisabled: { background:'#0a0a0a' },
  cellNum: { position:'absolute', top:3, left:4, fontSize:8, letterSpacing:'0.02em', fontVariantNumeric:'tabular-nums', color:'#444' },
  xMark: { fontSize:14, color:'#333' },
  themeMark: { fontSize:18, fontFamily:"'Instrument Serif', serif", opacity:0.8 },
  readout: { padding:'14px 16px', border:'1px solid #222', background:'#0f0f0f', fontSize:12, lineHeight:1.7, color:'#888', marginBottom:24, minHeight:48 },
  rKicker: { textTransform:'uppercase', letterSpacing:'0.06em', fontSize:10, color:'#666', marginRight:10 },
  rTitle: { color:'#fff', fontFamily:"'Instrument Serif', serif", fontSize:18, marginRight:8 },
  rDesc: { color:'#888' },
  legend: { display:'flex', flexWrap:'wrap', gap:16, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'#666', paddingTop:20, borderTop:'1px solid #222' },
  legendItem: { display:'flex', alignItems:'center', gap:6 },
  legendDot: { width:6, height:6, borderRadius:3 },
};

window.V4CalendarV1 = V4CalendarV1;
