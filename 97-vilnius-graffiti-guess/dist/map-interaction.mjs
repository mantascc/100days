import {MapCamera,worldPoint} from './map-camera.mjs';
const NS='http://www.w3.org/2000/svg';
export function setupMap({root,geometry,locations,landmarks,onChange,onTap}) {
 const wrap=root.parentElement,geo=root.querySelector('#geography');
 const camera=new MapCamera(wrap.clientWidth,wrap.clientHeight,[...locations,...landmarks],[...locations,...landmarks.filter(p=>!p.overviewOnly)]);
 for(const item of geometry){
  const path=document.createElementNS(NS,'path');
  path.setAttribute('d',item.points.map((p,i)=>`${i?'L':'M'}${worldPoint(...p).map(n=>n.toFixed(1)).join(',')}`).join(' ')+(item.type==='water'?'Z':''));
  const river=item.type==='river',water=item.type==='water';
  path.setAttribute('fill',water?'#203c38':'none');path.setAttribute('stroke',water?'#38574c':river?'#203c38':item.type==='major'?'#748069':'#434c3e');
  path.setAttribute('stroke-width',river?'75':item.type==='major'?'2.6':'1.2');
  if(!river)path.setAttribute('vector-effect','non-scaling-stroke');
  path.setAttribute('stroke-linejoin','round');path.setAttribute('stroke-linecap','round');geo.append(path);
 }
 let pending=0;
 function render(){pending=0;root.setAttribute('viewBox',`0 0 ${camera.width} ${camera.height}`);root.querySelectorAll(':scope > rect').forEach(r=>{r.setAttribute('width',camera.width);r.setAttribute('height',camera.height)});geo.setAttribute('transform',camera.transform);document.getElementById('zoom-in').disabled=camera.zoom>=8;document.getElementById('zoom-out').disabled=camera.zoom<=camera.minZoom+.00001;
  const meters=[50,100,200,500,1000,2000,5000].find(m=>m*camera.scale>=45)??5000;const bar=document.getElementById('map-scale');bar.style.width=`${meters*camera.scale}px`;bar.textContent=`${meters} m`;onChange();
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(render);}
 const local=e=>{const r=root.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
 const pointers=new Map();let moved=false,origin,pressedTarget;
 const midpoint=ps=>[(ps[0][0]+ps[1][0])/2,(ps[0][1]+ps[1][1])/2];
 const distance=ps=>Math.hypot(ps[0][0]-ps[1][0],ps[0][1]-ps[1][1]);
 root.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=local(e);if(!pointers.size){moved=false;origin=p;pressedTarget=e.target;}else moved=true;pointers.set(e.pointerId,p);root.setPointerCapture(e.pointerId);root.classList.add('dragging');});
 root.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=[...pointers.values()],previous=pointers.get(e.pointerId),p=local(e);pointers.set(e.pointerId,p);const now=[...pointers.values()];
  if(pointers.size>=2){moved=true;const before=midpoint(old),after=midpoint(now);camera.zoomAt(distance(now)/Math.max(1,distance(old)),before);camera.pan(after[0]-before[0],after[1]-before[1]);}
  else {if(Math.hypot(p[0]-origin[0],p[1]-origin[1])>6)moved=true;if(moved)camera.pan(p[0]-previous[0],p[1]-previous[1]);}
  if(moved)schedule();
 });
 function end(e,cancel=false){if(!pointers.has(e.pointerId))return;const tap=!cancel&&!moved&&pointers.size===1;pointers.delete(e.pointerId);if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);if(!pointers.size)root.classList.remove('dragging');if(tap)onTap(pressedTarget,local(e));}
 root.addEventListener('pointerup',e=>end(e));root.addEventListener('pointercancel',e=>end(e,true));
 root.addEventListener('lostpointercapture',e=>{pointers.delete(e.pointerId);if(!pointers.size)root.classList.remove('dragging')});
 root.addEventListener('wheel',e=>{e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?camera.height:1);camera.zoomAt(Math.exp(-delta*.002),local(e));schedule()},{passive:false});
 root.addEventListener('dblclick',e=>{if(e.target.closest('[data-dot],[data-landmark]'))return;e.preventDefault();camera.zoomAt(1.6,local(e));schedule()});
 root.addEventListener('keydown',e=>{if(e.target!==root)return;const moves={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(moves[e.key])camera.pan(...moves[e.key]);else if(e.key==='+'||e.key==='=')camera.zoomAt(1.4);else if(e.key==='-')camera.zoomAt(1/1.4);else if(e.key==='Home'||e.key==='0')camera.fit();else return;e.preventDefault();schedule();});
 document.getElementById('zoom-in').onclick=()=>{camera.zoomAt(1.4);schedule()};document.getElementById('zoom-out').onclick=()=>{camera.zoomAt(1/1.4);schedule()};document.getElementById('map-central').onclick=()=>{camera.fit('central');schedule()};
 document.getElementById('map-fit').onclick=()=>{camera.fit();schedule()};
 new ResizeObserver(()=>{if(wrap.clientWidth&&wrap.clientHeight){camera.resize(wrap.clientWidth,wrap.clientHeight);schedule()}}).observe(wrap);
 return {camera,render,fit(){camera.fit();render()}};
}
