'use strict';
const $ = s => document.querySelector(s);
const presets = {
  'Optical': {color:[174,221,173], secondary:[124,178,222], clarity:92, bloom:45, grain:87, fringe:100, reflection:54, speed:60, note:'Pale green glass. Light caught at the edges.'},
  'Cryo': {color:[125,193,249], secondary:[193,150,244], clarity:84, bloom:55, grain:24, fringe:52, reflection:60, speed:16, note:'Cold blue transmission. A violet afterimage.'},
  'Amber': {color:[244,185,103], secondary:[229,106,72], clarity:61, bloom:65, grain:46, fringe:23, reflection:55, speed:20, note:'Warm resin. A little memory in the material.'},
  'Ghost': {color:[214,223,220], secondary:[155,174,180], clarity:95, bloom:22, grain:22, fringe:8, reflection:30, speed:12, note:'Almost absent. The silhouette holds the light.'},
  'Afterglow': {color:[225,142,197], secondary:[116,209,190], clarity:48, bloom:78, grain:48, fringe:70, reflection:66, speed:30, note:'Pink interference. The image outlasts the form.'}
};
let active='Optical', state={...presets.Optical}, time=0, paused=matchMedia('(prefers-reduced-motion: reduce)').matches, last=0, selected=0;
let dirty = true;
const fields=[['clarity','Clarity'],['bloom','Edge bleed'],['grain','Film grain'],['fringe','Chromatic fringe'],['reflection','Reflection'],['speed','Motion']];
for (const name of Object.keys(presets)) { const b=document.createElement('button'); b.textContent=name; b.onclick=()=>apply(name); $('#presets').append(b); }
for (const [key,label] of fields) { const d=document.createElement('div'); d.className='control'; d.innerHTML=`<label for="${key}">${label}<output id="${key}-value" for="${key}"></output></label><input id="${key}" type="range" min="0" max="100" value="${state[key]}">`; $('#controls').append(d); d.querySelector('input').oninput=e=>{state[key]=+e.target.value; sync();}; }
function sync(){dirty=true;for(const [k]of fields){$('#'+k).value=state[k];$('#'+k+'-value').value=String(state[k]).padStart(2,'0');} document.querySelectorAll('#presets button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===active)));$('#material-note').textContent=state.note;}
function apply(name){active=name;state={...presets[name]};sync();}
$('#reset').onclick=()=>apply(active || 'Optical');
$('#shuffle').onclick=()=>{let names=Object.keys(presets);apply(names[Math.floor(Math.random()*names.length)]);for(const [k]of fields)state[k]=Math.round(10+Math.random()*80);active='';state.note='An unrepeatable accident. Keep what catches the light.';sync();};
function pause(){dirty=true;paused=!paused;$('#pause').textContent=paused?'▷ Resume':'Ⅱ Pause';$('#pause').setAttribute('aria-pressed',String(paused));} $('#pause').onclick=pause;
if(paused){paused=false;pause();}
const cube={v:[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],f:[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]]};
const diamond={v:[[0,-1.65,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,1.65,0]],f:[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]]};
const prism={v:[[-1,1,-.65],[1,1,-.65],[0,-1.3,-.65],[-1,1,.65],[1,1,.65],[0,-1.3,.65]],f:[[0,1,2],[3,5,4],[0,3,4,1],[1,4,5,2],[2,5,3,0]]};
function cylinder(){const v=[],f=[],n=48;for(let j=0;j<2;j++)for(let i=0;i<n;i++){const a=i/n*Math.PI*2;v.push([Math.cos(a),Math.sin(a),j===0?-.32:.32]);}f.push(Array.from({length:n},(_,i)=>i),Array.from({length:n},(_,i)=>n+i));for(let i=0;i<n;i++)f.push([i,(i+1)%n,(i+1)%n+n,i+n]);return{v,f};}
const specimens=[['Cube','VOLUME / 06',cube],['Rhombus','FACET / 08',diamond],['Prism','SPLIT / 05',prism],['Lens','SURFACE / 02',cylinder()],['Slab','PLANE / 06',{v:cube.v.map(([x,y,z])=>[x*1.2,y*1.2,z*.2]),f:cube.f}],['Twin','OVERLAP / 12',cube]];
const views=[];
for(let i=0;i<specimens.length;i++){const b=document.createElement('button');b.className='specimen';b.setAttribute('aria-label',`Inspect ${specimens[i][0]}`);b.innerHTML=`<div class="cell-top"><span>CL—00${i+1}</span><span class="inspect">EXPAND ↗</span></div><canvas aria-hidden="true"></canvas><div class="cell-bottom"><span>${specimens[i][0].toUpperCase()}</span><span>${specimens[i][1]}</span></div>`;$('#specimens').append(b);const view=makeView(b.querySelector('canvas'),i);views.push(view);b.onclick=e=>{if(view.dragged && e.detail!==0)return;selected=i;detail.ax=view.ax;detail.ay=view.ay;$('#viewer-title').textContent=`CL—00${i+1} / ${specimens[i][0].toUpperCase()}`;$('#viewer').showModal();dirty=true;};}
const detail=makeView($('#detail'),0);
$('#close').onclick=()=>$('#viewer').close();
// Native dialogs provide focus trapping and Escape dismissal on touch and keyboard.
const settings = $('#settings');
$('#settings-toggle').onclick = () => { settings.showModal(); $('#settings-toggle').setAttribute('aria-expanded', 'true'); };
$('#settings-close').onclick = () => settings.close();
settings.addEventListener('close', () => { $('#settings-toggle').setAttribute('aria-expanded', 'false'); $('#settings-toggle').focus(); });
for (const dialog of [settings, $('#viewer')]) {
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { dirty = true; });
}
function makeView(canvas, index) {
  const v = {canvas, ctx:canvas.getContext('2d'), buffer:document.createElement('canvas'), index, ax:0, ay:0, dragged:false, visible:true, width:0, height:0};
  v.b = v.buffer.getContext('2d');
  // Cache layout dimensions instead of reading six bounding boxes every frame.
  new ResizeObserver(entries => {
    v.width = entries[0].contentRect.width;
    v.height = entries[0].contentRect.height;
    dirty = true;
  }).observe(canvas);
  let point = null;
  canvas.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0) return;
    point = {id:e.pointerId, x:e.clientX, y:e.clientY, startX:e.clientX, startY:e.clientY};
    v.dragged = false;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!point || e.pointerId !== point.id) return;
    // A real movement threshold keeps taps reliable, even with finger jitter.
    if (!v.dragged && Math.hypot(e.clientX-point.startX,e.clientY-point.startY) < 7) return;
    v.dragged = true;
    v.ay += (e.clientX-point.x)*.009;
    v.ax += (e.clientY-point.y)*.009;
    point.x = e.clientX; point.y = e.clientY;
    dirty = true;
  });
  canvas.addEventListener('pointerup', () => { point = null; });
  canvas.addEventListener('pointercancel', () => { point = null; v.dragged = true; });
  canvas.addEventListener('lostpointercapture', () => { point = null; });
  return v;
}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const v=views.find(v=>v.canvas===e.target);if(v){v.visible=e.isIntersecting;dirty=true;}}));views.forEach(v=>observer.observe(v.canvas));
const noise=document.createElement('canvas');noise.width=noise.height=192;const ng=noise.getContext('2d'),pixels=ng.createImageData(192,192);let seed=491;for(let i=0;i<pixels.data.length;i+=4){seed=(seed*16807)%2147483647;const n=seed%256;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=255;}ng.putImageData(pixels,0,0);
const rgba=(color,a)=>`rgba(${color.join(',')},${a})`;
function project(p,ax,ay,az){let[x,y,z]=p;let q=x*Math.cos(ay)+z*Math.sin(ay);z=-x*Math.sin(ay)+z*Math.cos(ay);x=q;q=y*Math.cos(ax)-z*Math.sin(ax);z=y*Math.sin(ax)+z*Math.cos(ax);y=q;return[(x*Math.cos(az)-y*Math.sin(az))*3.8/(3.8+z*.22),(x*Math.sin(az)+y*Math.cos(az))*3.8/(3.8+z*.22),z];}
function object(ctx,index,s,t,v){const mesh=specimens[index][2];const ax=-.27+v.ax+Math.sin(t*.24+index)*.12,ay=.52+v.ay+t*.22,az=index===1?.12:Math.sin(t*.17+index)*.12;const points=mesh.v.map(p=>project(p,ax,ay,az));const faces=mesh.f.map(f=>({f,z:f.reduce((a,i)=>a+points[i][2],0)/f.length})).sort((a,b)=>b.z-a.z);
const copies=index===5?[-.45,.45]:[0];for(const copy of copies){ctx.save();ctx.translate(copy*s,copy*s*.32);const scale=index===5?s*.74:s;
for(const {f,z}of faces){const path=new Path2D();f.forEach((k,i)=>{const p=points[k];i?path.lineTo(p[0]*scale,p[1]*scale):path.moveTo(p[0]*scale,p[1]*scale);});path.closePath();const g=ctx.createLinearGradient(-scale,-scale,scale,scale);const density=.035+(100-state.clarity)/370;g.addColorStop(0,rgba(state.color,density*.45));g.addColorStop(.35,rgba(state.color,density*1.4));g.addColorStop(.52,rgba(state.secondary,density*.45));g.addColorStop(.9,rgba(state.color,density*.8));g.addColorStop(1,rgba(state.color,density*1.8));ctx.fillStyle=g;ctx.fill(path);
ctx.save();ctx.clip(path);const streak=ctx.createLinearGradient(-scale*1.8,-scale,scale*1.5,scale*.7);streak.addColorStop(0,'transparent');streak.addColorStop(.4,'transparent');streak.addColorStop(.49,rgba(state.color,.035));streak.addColorStop(.51,rgba(state.color,.19));streak.addColorStop(.56,'transparent');streak.addColorStop(1,'transparent');ctx.fillStyle=streak;ctx.fillRect(-scale*2,-scale*2,scale*4,scale*4);
// Fine optical grooves remain visible through the transparent faces.
ctx.strokeStyle=rgba(state.color,.035);ctx.lineWidth=.5;for(let y=-scale*2;y<scale*2;y+=4){ctx.beginPath();ctx.moveTo(-scale*2,y);ctx.lineTo(scale*2,y+scale*.25);ctx.stroke();}ctx.restore();
ctx.save();ctx.translate(state.fringe*.028,0);ctx.strokeStyle=rgba(state.secondary,.24);ctx.lineWidth=1.4;ctx.stroke(path);ctx.restore();ctx.strokeStyle=rgba(state.color,z<0?.6:.25);ctx.lineWidth=z<0?1:.65;ctx.stroke(path);
}
for(let i=0;i<points.length;i++){const p=points[i],glow=ctx.createRadialGradient(p[0]*scale,p[1]*scale,0,p[0]*scale,p[1]*scale,12);glow.addColorStop(0,rgba(state.color,.32));glow.addColorStop(.2,rgba(state.color,.1));glow.addColorStop(1,rgba(state.color,0));ctx.fillStyle=glow;ctx.fillRect(p[0]*scale-12,p[1]*scale-12,24,24);}ctx.restore();}}
function render(v,index,t){const c=v.canvas,ctx=v.ctx;const dpr=Math.min(devicePixelRatio||1,matchMedia('(max-width: 680px)').matches?1.25:1.6),w=Math.round(v.width*dpr),h=Math.round(v.height*dpr);if(!w||!h)return;if(c.width!==w||c.height!==h){c.width=w;c.height=h;v.buffer.width=w;v.buffer.height=h;}const b=v.b;ctx.setTransform(dpr,0,0,dpr,0,0);b.setTransform(dpr,0,0,dpr,0,0);const W=w/dpr,H=h/dpr,s=Math.min(W*.225,H*.235);ctx.fillStyle='#101612';ctx.fillRect(0,0,W,H);const halo=ctx.createRadialGradient(W*.5,H*.43,2,W*.5,H*.43,W*.64);halo.addColorStop(0,rgba(state.color,.055));halo.addColorStop(1,'transparent');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
// A ruled horizon gives the transparent object a surrounding space.
ctx.strokeStyle=rgba(state.color,.055);ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(20,H*.77);ctx.lineTo(W-20,H*.77);ctx.stroke();ctx.strokeStyle=rgba(state.color,.04);ctx.beginPath();ctx.moveTo(W/2,35);ctx.lineTo(W/2,H-40);ctx.stroke();
b.clearRect(0,0,W,H);b.save();b.translate(W*.5,H*.435+Math.sin(t*.6+index)*3);object(b,index,s,t+index*.38,v);b.restore();
ctx.save();ctx.globalCompositeOperation='screen';if(state.bloom>0){ctx.filter=`blur(${6+state.bloom*.17}px)`;ctx.globalAlpha=state.bloom/65;ctx.drawImage(v.buffer,0,0,W,H);ctx.filter=`blur(${1+state.bloom*.025}px)`;ctx.globalAlpha=state.bloom/100;ctx.drawImage(v.buffer,0,0,W,H);}ctx.filter='none';ctx.globalAlpha=1;ctx.drawImage(v.buffer,0,0,W,H);ctx.restore();
ctx.save();ctx.translate(0,H*1.19);ctx.scale(1,-.44);ctx.globalAlpha=state.reflection/260;ctx.filter='blur(2px)';ctx.drawImage(v.buffer,0,0,W,H);ctx.restore();const fade=ctx.createLinearGradient(0,H*.76,0,H);fade.addColorStop(0,'rgba(16,22,18,0)');fade.addColorStop(1,'#101612');ctx.fillStyle=fade;ctx.fillRect(0,H*.76,W,H*.24);
ctx.save();ctx.globalAlpha=state.grain/260;ctx.globalCompositeOperation='soft-light';ctx.fillStyle=v.grainPattern||(v.grainPattern=ctx.createPattern(noise,'repeat'));ctx.translate(Math.floor(t*8)%192,Math.floor(t*5)%192);ctx.fillRect(-192,-192,W+384,H+384);ctx.restore();
const vignette=ctx.createRadialGradient(W/2,H/2,W*.22,W/2,H/2,W*.7);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#080d0b88');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);}
// Cap compositing at 30 fps. Paused frames redraw only when a control or view changes.
let lastPaint = 0;
function frame(now) {
  const dt = Math.min((now-last)/1000,.05);
  last = now;
  if (!paused && !document.hidden) time += dt*state.speed/35;
  if (!document.hidden && now-lastPaint >= 1000/30 && (dirty || (!paused && state.speed>0))) {
    if ($('#viewer').open) render(detail,selected,time);
    else for (const v of views) if(v.visible) render(v,v.index,time);
    dirty = false;
    lastPaint = now;
  }
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { dirty=true; });
sync();requestAnimationFrame(frame);
$('#export').onclick=()=>{const out=document.createElement('canvas');out.width=1500;out.height=1100;const ctx=out.getContext('2d');ctx.fillStyle='#101612';ctx.fillRect(0,0,out.width,out.height);ctx.fillStyle='#dce4d8';ctx.font='52px Arial';ctx.fillText('CLARITY',40,76);ctx.font='12px monospace';ctx.fillText(`${active||'MUTATION'} / OPTICAL STUDIES`,40,108);views.forEach((v,i)=>{render(v,i,time);const x=30+(i%3)*490,y=145+Math.floor(i/3)*430;const ratio=Math.min(480/v.canvas.width,380/v.canvas.height);const iw=v.canvas.width*ratio,ih=v.canvas.height*ratio;ctx.drawImage(v.canvas,x+(480-iw)/2,y+(380-ih)/2,iw,ih);ctx.fillStyle='#b4c3b6';ctx.fillText(`CL—00${i+1} / ${specimens[i][0].toUpperCase()}`,x+15,y+400);});ctx.font='11px monospace';ctx.fillText(fields.map(([k,label])=>`${label.toUpperCase()} ${state[k]}`).join('   /   '),40,1055);out.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='clarity-'+(active||'mutation').toLowerCase()+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});};
