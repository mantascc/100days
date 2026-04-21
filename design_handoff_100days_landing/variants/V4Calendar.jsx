// Variation 4 v2 — Calendar field with live mini-glyph cells, persistent selection, keyboard nav
function V4Calendar() {
  const byDay = {};
  window.PROJECTS.forEach(p => { byDay[Math.floor(p.day)] = p; });
  const [selected, setSelected] = React.useState(null);
  const [hover, setHover] = React.useState(null);

  const active = window.PROJECTS.filter(p => !p.disabled);
  const maxDay = Math.max(...active.map(p => Math.floor(p.day)));
  const current = hover ?? selected;

  // Keyboard nav
  React.useEffect(() => {
    const handler = (e) => {
      if (selected == null) return;
      let next = selected;
      if (e.key === 'ArrowRight') next = Math.min(100, selected + 1);
      else if (e.key === 'ArrowLeft') next = Math.max(1, selected - 1);
      else if (e.key === 'ArrowDown') next = Math.min(100, selected + 10);
      else if (e.key === 'ArrowUp') next = Math.max(1, selected - 10);
      else if (e.key === 'Enter' && byDay[selected] && !byDay[selected].disabled) {
        window.location.href = `../${byDay[selected].id}/index.html`;
        return;
      } else return;
      e.preventDefault();
      setSelected(next);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  const cells = []; for (let i = 1; i <= 100; i++) cells.push(i);
  const streaks = []; // compute runs of consecutive completed days
  let run = 0; for (let i = 1; i <= 100; i++) { if (byDay[i] && !byDay[i].disabled) run++; else { if (run) streaks.push(run); run = 0; } }
  if (run) streaks.push(run);
  const longest = streaks.length ? Math.max(...streaks) : 0;

  return (
    <div style={v4s.shell}>
      <div style={v4s.inner}>
        <div style={v4s.topMeta}>
          <span>clear_channel · 100day · field</span>
          <span>{active.length} landed · {100 - active.length} blank · longest streak {longest}</span>
        </div>

        <h1 style={v4s.title}>a hundred<br/><em style={v4s.em}>days.</em></h1>
        <p style={v4s.lede}>
          One experiment, one day. Each cell is a living glyph of the experiment it holds; click to open, arrow keys to walk the field. Now at day <span style={{color:'#fff'}}>{String(maxDay).padStart(3,'0')}</span>.
        </p>

        <div style={v4s.gridWrap}>
          <div style={v4s.grid}>
            {cells.map(n => {
              const p = byDay[n];
              const isSelected = selected === n;
              const isCurrent = n === maxDay;
              if (!p) {
                return <div key={n} style={{...v4s.cell, ...v4s.cellEmpty, borderColor: isSelected ? '#666' : '#161616'}}
                            onClick={() => setSelected(n)}>
                  <span style={v4s.cellNum}>{String(n).padStart(2,'0')}</span>
                  {isCurrent && <span style={v4s.nowMark}>now</span>}
                </div>;
              }
              if (p.disabled) {
                return <div key={n} style={{...v4s.cell, ...v4s.cellDisabled, borderColor: isSelected ? '#666' : '#161616'}}
                            onClick={() => setSelected(n)}>
                  <span style={v4s.cellNum}>{String(n).padStart(2,'0')}</span>
                  <span style={v4s.xMark}>✗</span>
                </div>;
              }
              return (
                <V4Cell key={n} n={n} project={p} selected={isSelected}
                        onHover={setHover} onLeave={() => setHover(null)}
                        onSelect={() => setSelected(n)} isCurrent={isCurrent} />
              );
            })}
          </div>

          <div style={v4s.sidebar}>
            <div style={v4s.readout}>
              {current && byDay[current] && !byDay[current].disabled ? (() => {
                const p = byDay[current];
                const c = window.THEMES[p.themes?.[0]]?.color || '#888';
                return (
                  <React.Fragment>
                    <div style={{...v4s.rKicker, color: c}}>● day {String(p.day).padStart(3,'0')} / 100</div>
                    <div style={v4s.rTitle}>{p.title}</div>
                    <div style={v4s.rDesc}>{p.desc}</div>
                    <div style={v4s.rThemes}>
                      {p.themes.map(t => <span key={t} style={{color: window.THEMES[t]?.color}}>· {t}</span>)}
                    </div>
                    <a href={`../${p.id}/index.html`} style={v4s.rLink}>open {p.id} →</a>
                  </React.Fragment>
                );
              })() : current && byDay[current]?.disabled ? (
                <React.Fragment>
                  <div style={v4s.rKicker}>✗ day {String(current).padStart(3,'0')} / 100</div>
                  <div style={v4s.rTitle}>{byDay[current].title}</div>
                  <div style={v4s.rDesc}>archived — {byDay[current].desc}</div>
                </React.Fragment>
              ) : current ? (
                <React.Fragment>
                  <div style={v4s.rKicker}>○ day {String(current).padStart(3,'0')} / 100</div>
                  <div style={v4s.rDesc}>No experiment landed on this day. The routine is ongoing — blanks are honest, not missing.</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={v4s.rKicker}>— the field</div>
                  <div style={v4s.rDesc}>100 cells, one per day. Each living cell is a glyph of its experiment.</div>
                  <div style={v4s.kbd}>
                    <div><kbd style={v4s.kb}>click</kbd> select a cell</div>
                    <div><kbd style={v4s.kb}>↑↓←→</kbd> walk the field</div>
                    <div><kbd style={v4s.kb}>enter</kbd> open the project</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        <div style={v4s.legend}>
          {window.THEME_ORDER.map(t => {
            const count = active.filter(p => p.themes?.[0] === t).length;
            if (!count) return null;
            return (
              <span key={t} style={v4s.legendItem}>
                <span style={{...v4s.legendDot, background: window.THEMES[t].color}} />
                {t} · {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function V4Cell({ n, project, selected, onHover, onLeave, onSelect, isCurrent }) {
  const ref = React.useRef(null);
  const themeColor = window.THEMES[project.themes?.[0]]?.color || '#888';
  React.useEffect(() => {
    if (!ref.current) return;
    window.animateGlyph(ref.current, project, { size: 66, color: themeColor });
    return () => cancelAnimationFrame(ref.current?._raf);
  }, [project.id]);
  return (
    <a href={`../${project.id}/index.html`}
       onMouseEnter={() => onHover(n)} onMouseLeave={onLeave}
       onClick={(e) => { e.preventDefault(); onSelect(); }}
       onDoubleClick={() => window.location.href = `../${project.id}/index.html`}
       style={{...v4s.cell, background:'#070707',
               borderColor: selected ? themeColor : isCurrent ? '#444' : '#1a1a1a',
               boxShadow: selected ? `0 0 0 1px ${themeColor}, 0 0 20px ${themeColor}33` : 'none'}}>
      <canvas ref={ref} style={{position:'absolute', inset:0, opacity: selected ? 1 : 0.85}} />
      <span style={{...v4s.cellNum, color: selected ? '#fff' : '#555', background:'rgba(7,7,7,0.7)'}}>{String(n).padStart(2,'0')}</span>
      {isCurrent && <span style={v4s.nowMark}>now</span>}
    </a>
  );
}

const v4s = {
  shell: { background:'#0a0a0a', color:'#fff', fontFamily:'JetBrains Mono, monospace', padding:'48px 40px 64px', minHeight:'100%' },
  inner: { maxWidth: 1040, margin:'0 auto' },
  topMeta: { display:'flex', justifyContent:'space-between', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:32, paddingBottom:12, borderBottom:'1px solid #222' },
  title: { fontFamily:"'Instrument Serif', serif", fontSize:112, fontWeight:400, lineHeight:0.9, letterSpacing:'-0.03em', margin:'0 0 20px', color:'#fff' },
  em: { color:'#bc8cff', fontStyle:'italic' },
  lede: { fontSize:13, color:'#888', maxWidth:560, lineHeight:1.7, marginBottom:40 },
  gridWrap: { display:'grid', gridTemplateColumns:'1fr 300px', gap:28, marginBottom:32, alignItems:'start' },
  grid: { display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:2, background:'transparent' },
  cell: { position:'relative', aspectRatio:'1', border:'1px solid', display:'flex', alignItems:'flex-start', justifyContent:'flex-start', padding:'3px 4px', textDecoration:'none', cursor:'pointer', transition:'border-color 0.15s, box-shadow 0.2s', overflow:'hidden' },
  cellEmpty: { borderColor:'#161616', background:'#0a0a0a' },
  cellDisabled: { borderColor:'#161616', background:'#0a0a0a' },
  cellNum: { position:'relative', zIndex:1, fontSize:8, letterSpacing:'0.02em', fontVariantNumeric:'tabular-nums', color:'#444', padding:'1px 3px' },
  xMark: { position:'absolute', bottom:3, right:4, fontSize:10, color:'#333', zIndex:1 },
  nowMark: { position:'absolute', bottom:3, right:4, fontSize:8, textTransform:'uppercase', letterSpacing:'0.06em', color:'#3fb950', zIndex:1, background:'rgba(7,7,7,0.8)', padding:'1px 3px' },
  sidebar: { display:'flex', flexDirection:'column', gap:16 },
  readout: { border:'1px solid #222', background:'#0f0f0f', padding:'20px', fontSize:12, minHeight:260 },
  rKicker: { fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, color:'#666' },
  rTitle: { fontFamily:"'Instrument Serif', serif", fontSize:26, color:'#fff', lineHeight:1.1, marginBottom:12, letterSpacing:'-0.01em' },
  rDesc: { fontSize:12, color:'#888', lineHeight:1.6, marginBottom:14 },
  rThemes: { display:'flex', flexWrap:'wrap', gap:10, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:16 },
  rLink: { fontSize:11, color:'#58a6ff', textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.08em' },
  kbd: { display:'flex', flexDirection:'column', gap:8, fontSize:11, color:'#666', marginTop:16 },
  kb: { background:'#1a1a1a', border:'1px solid #333', padding:'1px 6px', fontSize:10, color:'#ccc', fontFamily:'inherit', marginRight:8 },
  legend: { display:'flex', flexWrap:'wrap', gap:16, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'#666', paddingTop:20, borderTop:'1px solid #222' },
  legendItem: { display:'flex', alignItems:'center', gap:6 },
  legendDot: { width:6, height:6, borderRadius:3 },
};

window.V4Calendar = V4Calendar;
