import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {MapCamera,worldPoint} from '../dist/map-camera.mjs';
import {setupMap} from '../dist/map-interaction.mjs';
const photos=JSON.parse(readFileSync(new URL('../dist/photos.json',import.meta.url))),landmarks=JSON.parse(readFileSync(new URL('../dist/landmarks.json',import.meta.url))),locations=[...photos,...landmarks];
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
test('zoom preserves the geographic point under the pointer',()=>{const c=new MapCamera(600,450,locations),anchor=[430,220],before=c.toWorld(anchor);c.zoomAt(2,anchor);const after=c.toWorld(anchor);close(before[0],after[0]);close(before[1],after[1]);assert.equal(c.zoom,2);});
test('pan translates every pin and landmark by the same screen delta; fit restores them',()=>{const c=new MapCamera(600,450,locations),before=locations.map(p=>c.project(p.lat,p.lng));c.pan(30,-20);locations.forEach((p,i)=>{const now=c.project(p.lat,p.lng);close(now[0]-before[i][0],30);close(now[1]-before[i][1],-20)});c.zoomAt(3);c.fit();locations.forEach((p,i)=>{const now=c.project(p.lat,p.lng);close(now[0],before[i][0]);close(now[1],before[i][1])});});
test('fit retains all seven dots and nine landmarks at mobile and desktop sizes',()=>{for(const [w,h]of [[350,345],[600,450],[900,600]]){const c=new MapCamera(w,h,locations);for(const p of locations){const [x,y]=c.project(p.lat,p.lng);assert.ok(x>34&&x<w-34,`${p.name||p.id} horizontal`);assert.ok(y>74&&y<h-35,`${p.name||p.id} vertical`)}}});
test('zoom and pan are bounded; resize keeps the explored center',()=>{const c=new MapCamera(600,450,locations);c.zoomAt(100);assert.equal(c.zoom,8);c.zoomAt(.00001);assert.equal(c.zoom,.75);c.pan(1e6,1e6);assert.ok(Number.isFinite(c.x)&&c.x>=worldPoint(54.714,25.196)[0]&&c.x<=worldPoint(54.661,25.314)[0]);const center=[c.x,c.y];c.resize(350,345);assert.deepEqual([c.x,c.y],center);});
test('a drag or pinch never submits a guess, but a tap does',()=>{
 class El{constructor(){this.listeners={};this.style={};this.classList={add(){},remove(){}};this.attrs={};}setAttribute(k,v){this.attrs[k]=v}append(){}addEventListener(k,f){this.listeners[k]=f}querySelector(){return new El()}querySelectorAll(){return []}getBoundingClientRect(){return {left:0,top:0}}setPointerCapture(){}hasPointerCapture(){return false}fire(type,extra){this.listeners[type]({button:0,pointerId:1,clientX:100,clientY:100,target:this,preventDefault(){},...extra})}}
 const root=new El();root.parentElement={clientWidth:600,clientHeight:450};const controls={};globalThis.document={createElementNS:()=>new El(),getElementById:id=>controls[id]??=new El()};globalThis.ResizeObserver=class{observe(){}};globalThis.requestAnimationFrame=()=>1;
 let taps=0;const {camera}=setupMap({root,geometry:[],locations:photos,landmarks,onChange(){},onTap(){taps++}});
 root.fire('pointerdown');root.fire('pointerup');assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointermove',{clientX:135});root.fire('pointerup',{clientX:135});assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointerdown',{pointerId:2,clientX:200});const before=camera.zoom;root.fire('pointermove',{pointerId:2,clientX:250});assert.ok(camera.zoom>before);root.fire('pointerup',{pointerId:2,clientX:250});root.fire('pointerup');assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointercancel');assert.equal(taps,1);
});

test('nine unique landmarks retain the originals and have local artwork and sources',()=>{
 assert.equal(landmarks.length,9);assert.equal(new Set(landmarks.map(p=>p.id)).size,9);
 for(const id of ['gediminas','seimas','tauro','hales','rotuse','tv-bokstas','triju-kryziu','baltasis-tiltas','ausros-vartai'])assert.ok(landmarks.some(p=>p.id===id));
 for(const p of landmarks){assert.ok(existsSync(new URL('../dist/'+p.image,import.meta.url)));assert.match(p.source,/^https:/);assert.ok(p.lat>54.66&&p.lat<54.715&&p.lng>25.195&&p.lng<25.315);}
});
test('central view stays useful while Fit All and resize include the western tower',()=>{
 const central=[...photos,...landmarks.filter(p=>!p.overviewOnly)];
 for(const [w,h] of [[296,310],[358,514],[640,450]]){
  const c=new MapCamera(w,h,locations,central);c.fit('central');const centralScale=c.scale;
  for(const p of photos){const [x,y]=c.project(p.lat,p.lng);assert.ok(x>23&&x<w-23&&y>23&&y<h-23);}
  c.fit();assert.ok(c.scale<centralScale*.9);
  const tower=landmarks.find(p=>p.id==='tv-bokstas');let [x,y]=c.project(tower.lat,tower.lng);assert.ok(x>34&&x<w-34&&y>74&&y<h-35);
  c.resize(w+100,h+100);[x,y]=c.project(tower.lat,tower.lng);assert.ok(x>34&&x<c.width-34);c.zoomAt(1.4);c.pan(10,0);assert.equal(c.fitMode,null);
 }
});

test('expanded geometry includes roads near TV tower and records its map extent',()=>{
 const provenance=JSON.parse(readFileSync(new URL('../dist/map-provenance.json',import.meta.url)));
 const geometry=JSON.parse(readFileSync(new URL('../dist/map.json',import.meta.url)));
 const tower=landmarks.find(p=>p.id==='tv-bokstas');
 assert.ok(provenance.bounds[1]<tower.lng-.01);assert.equal(provenance.features,geometry.length);
 assert.ok(geometry.some(feature=>feature.points.some(([lat,lng])=>Math.abs(lat-tower.lat)<.002&&Math.abs(lng-tower.lng)<.003)));
});
