#!/usr/bin/env python3
"""
Imagination observability — snapshot generator.

Reads imagination/**/*.md frontmatter and the sketch order in projects.json,
then emits:
  - graph.json                    (raw nodes + links, for any downstream use)
  - snapshots/<YYYY-MM-DD>.html   (the barcode timeline — featured snapshot)
  - snapshots/latest.html         (copy of the most recent)

The timeline maps every entity onto the 01..N sketch axis (time), so you see
emergence, dormancy, and revival directly — the things a force graph hides.

Usage:
    python3 imagination/snapshots/generate.py
"""
import os, re, json, datetime, itertools

HERE = os.path.dirname(os.path.abspath(__file__))
IMAG = os.path.dirname(HERE)                       # .../imagination
ROOT = os.path.dirname(IMAG)                       # .../100days
TYPES = ["veins", "moves", "tensions", "sources", "seeds", "collisions"]
TYPE_ORDER = {"vein": 0, "move": 1, "tension": 2, "source": 3, "seed": 4, "collision": 5}

def parse_fm(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m: return None
    fm = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"(\w+):\s*(.*)", line)
        if not mm: continue
        k, v = mm.group(1), mm.group(2).strip()
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip() for x in v[1:-1].split(",") if x.strip()]
        fm[k] = v
    return fm

def listify(v):
    if isinstance(v, list): return v
    return [v] if v else []

def collect():
    nodes, by_id = [], {}
    for t in TYPES:
        d = os.path.join(IMAG, t)
        if not os.path.isdir(d): continue
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".md"): continue
            fm = parse_fm(open(os.path.join(d, fn), encoding="utf-8").read())
            if not fm or "id" not in fm: continue
            n = {
                "id": fm["id"], "type": fm.get("type", t[:-1]),
                "title": fm.get("title", fm["id"]),
                "charge": fm.get("charge", "medium"), "state": fm.get("state", "active"),
                "spawned": listify(fm.get("spawned", [])),
                "feeds": listify(fm.get("feeds", [])), "sources": listify(fm.get("sources", [])),
            }
            n["spawned_count"] = len(n["spawned"])
            nodes.append(n); by_id[n["id"]] = n
    return nodes, by_id

# ---------- graph.json (raw data) ----------
def build_graph(nodes, by_id):
    links = []
    for n in nodes:
        for tgt in n["feeds"] + n["sources"]:
            if tgt in by_id:
                links.append({"source": n["id"], "target": tgt, "kind": "link", "weight": 1})
    for a, b in itertools.combinations(nodes, 2):
        shared = len(set(a["spawned"]) & set(b["spawned"]))
        if shared >= 2:
            links.append({"source": a["id"], "target": b["id"], "kind": "co", "weight": shared})
    deg = {n["id"]: 0 for n in nodes}
    for l in links: deg[l["source"]] += 1; deg[l["target"]] += 1
    for n in nodes: n["degree"] = deg[n["id"]]
    return {"nodes": nodes, "links": links}

# ---------- timeline ----------
def sketch_key(sid):
    m = re.match(r"(\d+)([a-z]?)", sid)
    return (int(m.group(1)), m.group(2)) if m else (9999, sid)

def build_timeline(nodes):
    axis_ids = []
    pj = os.path.join(ROOT, "projects.json")
    if os.path.exists(pj):
        for it in json.load(open(pj)):
            p = it.get("path") or it.get("id", "")
            axis_ids.append(p.split("/")[-1])
    spawned_all = set().union(*[set(n["spawned"]) for n in nodes]) if nodes else set()
    for s in spawned_all:
        if s not in axis_ids: axis_ids.append(s)
    axis_ids = sorted(set(axis_ids), key=sketch_key)
    idx = {s: i for i, s in enumerate(axis_ids)}
    axis = [{"id": s, "n": (re.match(r"\d+[a-z]?", s).group(0) if re.match(r"\d", s) else s)} for s in axis_ids]

    rows = []
    for n in nodes:
        cols = sorted(idx[s] for s in n["spawned"] if s in idx)
        # longest consecutive run
        best = cur = bs = curs = 0; prev = None
        for c in cols:
            cur = cur + 1 if prev is not None and c == prev + 1 else 1
            if cur == 1: curs = c
            if cur > best: best = cur; bs = curs
            prev = c
        rows.append({"id": n["id"], "type": n["type"], "title": n["title"], "charge": n["charge"],
                     "state": n["state"], "cols": cols,
                     "first": cols[0] if cols else None, "last": cols[-1] if cols else None,
                     "reach": len(cols), "run": {"start": bs, "len": best}})
    rows.sort(key=lambda r: (TYPE_ORDER.get(r["type"], 9), r["first"] if r["first"] is not None else 9999))

    third = int(len(axis_ids) * 2 / 3)
    btarget, bmax = None, -1
    for r in rows:
        if r["type"] != "vein": continue
        recent = sum(1 for c in r["cols"] if c >= third)
        if recent > bmax: bmax, btarget = recent, r["id"]
    meta = {"date": datetime.date.today().isoformat(), "sketches": len(axis_ids),
            "entities": len(nodes), "third": third}
    return {"meta": meta, "axis": axis, "rows": rows, "break_target": btarget}

def main():
    nodes, by_id = collect()
    graph = build_graph(nodes, by_id)
    json.dump(graph, open(os.path.join(IMAG, "graph.json"), "w"), indent=2)

    tl = build_timeline(nodes)
    html = TIMELINE.replace("__TLDATA__", json.dumps(tl))
    date = tl["meta"]["date"]
    out = os.path.join(HERE, f"{date}.html")
    open(out, "w", encoding="utf-8").write(html)
    open(os.path.join(HERE, "latest.html"), "w", encoding="utf-8").write(html)
    print(json.dumps(tl["meta"], indent=2))
    print("break target:", tl["break_target"])
    print("wrote:", out, "and latest.html, graph.json")

TIMELINE = r"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Imagination — timeline</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root{
    --void:#0a0a0a;--base:#0f0f0f;--raised:#141414;--surface:#1a1a1a;
    --text:#f5f5f7;--t2:#a8aab8;--t3:#666;--ghost:#262626;
    --b-sub:#1a1a1a;--b-def:#2a2a2a;--b-strong:#3a3d52;
    --vein:#00ffaa;--move:#00a8ff;--tension:#ff0066;--source:#ffaa00;--seed:#00ff88;--collision:#ff0000;
    --mono:'JetBrains Mono','IBM Plex Mono','SF Mono',Monaco,monospace;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--void);color:var(--text);font-family:var(--mono);font-size:13px;padding:0 0 60px}
  header{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:baseline;
    padding:16px 22px;border-bottom:1px solid var(--b-sub);background:var(--void)}
  header .title{font-size:11px;text-transform:uppercase;letter-spacing:.14em}
  header .meta{font-size:10px;color:var(--t3);letter-spacing:.04em}
  .bar{display:flex;gap:6px;padding:10px 22px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--b-sub)}
  .bar .grp{display:flex;gap:4px;margin-right:10px}
  button{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.08em;
    background:var(--surface);color:var(--t2);border:1px solid var(--b-def);padding:5px 9px;cursor:pointer}
  button:hover{border-color:var(--b-strong);color:var(--text)}
  button.off{opacity:.35}
  button.act{border-color:var(--b-strong);color:#fff}
  .lbl{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-right:4px}
  #scroll{overflow-x:auto;padding:8px 22px}
  svg{display:block}
  .axis-num{fill:var(--t3);font-size:9px}
  .axis-line{stroke:var(--ghost);stroke-width:1}
  .grpline{fill:var(--t3);font-size:9px;text-transform:uppercase;letter-spacing:.12em}
  .rowlbl{fill:var(--t2);font-size:10px;text-anchor:end}
  .rowlbl.brk{fill:#fff;font-weight:700}
  .cell{shape-rendering:crispEdges}
  .baseline{stroke:#161616;stroke-width:1}
  .brkmark{fill:none;stroke:#fff;stroke-width:1;opacity:.7}
  #tip{position:fixed;pointer-events:none;background:rgba(20,20,20,.97);border:1px solid var(--b-strong);
    padding:7px 10px;font-size:10px;opacity:0;transition:opacity .08s;z-index:9;line-height:1.5;max-width:260px}
  #tip .t{color:#fff;margin-bottom:2px}#tip .k{color:var(--t3)}
  #note{padding:10px 22px;color:var(--t3);font-size:10px;letter-spacing:.03em;line-height:1.7}
  #note b{color:var(--source)}
</style></head>
<body>
<header><span class="title">Imagination · timeline</span><span class="meta" id="hmeta"></span></header>
<div class="bar">
  <span class="lbl">show</span>
  <span class="grp" id="filters"></span>
  <span class="lbl">sort</span>
  <span class="grp" id="sorts">
    <button data-s="type" class="act">by type</button>
    <button data-s="first">by first seen</button>
    <button data-s="reach">by reach</button>
  </span>
  <button id="brkBtn" class="act">break signal</button>
</div>
<div id="scroll"></div>
<div id="note"></div>
<div id="tip"></div>
<script>
const D=__TLDATA__;
const COLOR={vein:'#00ffaa',move:'#00a8ff',tension:'#ff0066',source:'#ffaa00',seed:'#00ff88',collision:'#ff0000'};
const NAME={vein:'veins',move:'moves',tension:'tensions',source:'sources',seed:'seeds',collision:'collisions'};
const CH={high:1,medium:.7,low:.45}, ST={active:1,dormant:.5,spent:.3};
const cw=11, rh=15, padL=210, padT=34;
let active={vein:1,move:1,tension:1,source:1,seed:1,collision:1};
let sortMode='type', showBreak=true;
document.getElementById('hmeta').textContent=D.meta.date+'  ·  '+D.meta.entities+' entities across '+D.meta.sketches+' sketches';

// filter buttons
const fdiv=document.getElementById('filters');
['vein','move','tension','source','seed','collision'].forEach(t=>{
  const b=document.createElement('button');b.textContent=NAME[t];b.dataset.t=t;b.classList.add('act');
  b.style.borderColor=COLOR[t];b.onclick=()=>{active[t]=!active[t];b.classList.toggle('off',!active[t]);render();};
  fdiv.appendChild(b);
});
document.querySelectorAll('#sorts button').forEach(b=>b.onclick=()=>{
  sortMode=b.dataset.s;document.querySelectorAll('#sorts button').forEach(x=>x.classList.toggle('act',x===b));render();});
document.getElementById('brkBtn').onclick=function(){showBreak=!showBreak;this.classList.toggle('act',showBreak);render();};

const tip=document.getElementById('tip');
const svgns='http://www.w3.org/2000/svg';
function el(n,a){const e=document.createElementNS(svgns,n);for(const k in a)e.setAttribute(k,a[k]);return e;}

function render(){
  let rows=D.rows.filter(r=>active[r.type]);
  if(sortMode==='first') rows=rows.slice().sort((a,b)=>(a.first??1e9)-(b.first??1e9));
  else if(sortMode==='reach') rows=rows.slice().sort((a,b)=>b.reach-a.reach);
  const grouped = sortMode==='type';
  const N=D.axis.length, W=padL+N*cw+30;
  // compute layout rows (with group headers)
  const lay=[]; let y=padT, lastType=null;
  rows.forEach(r=>{
    if(grouped && r.type!==lastType){ lay.push({hdr:r.type,y:y+10}); y+=22; lastType=r.type; }
    lay.push({row:r,y:y}); y+=rh;
  });
  const H=y+20;
  const scroll=document.getElementById('scroll'); scroll.innerHTML='';
  const svg=el('svg',{width:W,height:H,viewBox:'0 0 '+W+' '+H}); scroll.appendChild(svg);

  // axis lines + decade numbers
  let nextDec=0;
  D.axis.forEach((a,i)=>{
    const num=parseInt(a.n);
    if(!isNaN(num) && num>=nextDec){
      const x=padL+i*cw+cw/2;
      svg.appendChild(el('line',{class:'axis-line',x1:x,y1:padT-6,x2:x,y2:H-18}));
      const tx=el('text',{class:'axis-num',x:x,y:padT-10,'text-anchor':'middle'});tx.textContent=num;svg.appendChild(tx);
      nextDec=Math.floor(num/10)*10+10;
    }
  });

  lay.forEach(item=>{
    if(item.hdr){
      const tx=el('text',{class:'grpline',x:padL-8,y:item.y,'text-anchor':'end'});
      tx.textContent=NAME[item.hdr];tx.setAttribute('fill',COLOR[item.hdr]);svg.appendChild(tx);
      return;
    }
    const r=item.row, cy=item.y, op=ST[r.state]??1;
    const isBrk = showBreak && r.id===D.break_target;
    // label
    const tx=el('text',{class:'rowlbl'+(isBrk?' brk':''),x:padL-8,y:cy+rh-4,opacity:op});
    tx.textContent=r.title;svg.appendChild(tx);
    // baseline
    svg.appendChild(el('line',{class:'baseline',x1:padL,y1:cy+rh-5,x2:padL+N*cw,y2:cy+rh-5,opacity:.6}));
    // cells
    r.cols.forEach(c=>{
      const x=padL+c*cw, recent=c>=D.meta.third;
      const rect=el('rect',{class:'cell',x:x+1,y:cy+2,width:cw-2,height:rh-6,
        fill:COLOR[r.type],opacity:(CH[r.charge]??.6)*op});
      rect.addEventListener('mouseenter',e=>{tip.style.opacity=1;
        tip.innerHTML='<div class="t">'+r.title+'</div><div class="k">'+r.type+' · '+D.axis[c].id+'</div>';});
      rect.addEventListener('mousemove',e=>{tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+14)+'px';});
      rect.addEventListener('mouseleave',()=>tip.style.opacity=0);
      svg.appendChild(rect);
      if(isBrk && recent) svg.appendChild(el('rect',{class:'brkmark',x:x+0.5,y:cy+1.5,width:cw-1,height:rh-4}));
    });
  });

  // note
  const bt=D.rows.find(r=>r.id===D.break_target);
  document.getElementById('note').innerHTML = showBreak && bt
    ? 'break signal — <b>'+bt.title+'</b> is your strongest pull in the final third of the timeline ('
      +bt.cols.filter(c=>c>=D.meta.third).length+' recent sketches). the outlined cells mark the streak most worth disrupting.'
    : 'each row is an entity; each cell a sketch it touched, left→right in making order. gaps are dormancy; clusters are obsession.';
}
render();
window.addEventListener('resize',()=>{});
</script></body></html>
"""

if __name__ == "__main__":
    main()
