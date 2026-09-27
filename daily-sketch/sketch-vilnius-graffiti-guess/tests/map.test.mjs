import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MapCamera} from '../dist/map-camera.mjs';
import {setupMap} from '../dist/map-interaction.mjs';
const photos=JSON.parse(readFileSync(new URL('../dist/photos.json',import.meta.url))),landmarks=JSON.parse(readFileSync(new URL('../dist/landmarks.json',import.meta.url))),locations=[...photos,...landmarks];
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
test('zoom preserves the geographic point under the pointer',()=>{const c=new MapCamera(600,450,locations),anchor=[430,220],before=c.toWorld(anchor);c.zoomAt(2,anchor);const after=c.toWorld(anchor);close(before[0],after[0]);close(before[1],after[1]);assert.equal(c.zoom,2);});
test('pan translates every pin and landmark by the same screen delta; fit restores them',()=>{const c=new MapCamera(600,450,locations),before=locations.map(p=>c.project(p.lat,p.lng));c.pan(30,-20);locations.forEach((p,i)=>{const now=c.project(p.lat,p.lng);close(now[0]-before[i][0],30);close(now[1]-before[i][1],-20)});c.zoomAt(3);c.fit();locations.forEach((p,i)=>{const now=c.project(p.lat,p.lng);close(now[0],before[i][0]);close(now[1],before[i][1])});});
test('fit retains all five dots and five landmarks at mobile and desktop sizes',()=>{for(const [w,h]of [[350,345],[600,450],[900,600]]){const c=new MapCamera(w,h,locations);for(const p of locations){const [x,y]=c.project(p.lat,p.lng);assert.ok(x>34&&x<w-34,`${p.name||p.id} horizontal`);assert.ok(y>74&&y<h-35,`${p.name||p.id} vertical`)}}});
test('zoom and pan are bounded; resize keeps the explored center',()=>{const c=new MapCamera(600,450,locations);c.zoomAt(100);assert.equal(c.zoom,8);c.zoomAt(.00001);assert.equal(c.zoom,.75);c.pan(1e6,1e6);assert.ok(Number.isFinite(c.x)&&Math.abs(c.x)<5000);const center=[c.x,c.y];c.resize(350,345);assert.deepEqual([c.x,c.y],center);});
test('a drag or pinch never submits a guess, but a tap does',()=>{
 class El{constructor(){this.listeners={};this.style={};this.classList={add(){},remove(){}};this.attrs={};}setAttribute(k,v){this.attrs[k]=v}append(){}addEventListener(k,f){this.listeners[k]=f}querySelector(){return new El()}querySelectorAll(){return []}getBoundingClientRect(){return {left:0,top:0}}setPointerCapture(){}hasPointerCapture(){return false}fire(type,extra){this.listeners[type]({button:0,pointerId:1,clientX:100,clientY:100,target:this,preventDefault(){},...extra})}}
 const root=new El();root.parentElement={clientWidth:600,clientHeight:450};const controls={};globalThis.document={createElementNS:()=>new El(),getElementById:id=>controls[id]??=new El()};globalThis.ResizeObserver=class{observe(){}};globalThis.requestAnimationFrame=()=>1;
 let taps=0;const {camera}=setupMap({root,geometry:[],locations:photos,landmarks,onChange(){},onTap(){taps++}});
 root.fire('pointerdown');root.fire('pointerup');assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointermove',{clientX:135});root.fire('pointerup',{clientX:135});assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointerdown',{pointerId:2,clientX:200});const before=camera.zoom;root.fire('pointermove',{pointerId:2,clientX:250});assert.ok(camera.zoom>before);root.fire('pointerup',{pointerId:2,clientX:250});root.fire('pointerup');assert.equal(taps,1);
 root.fire('pointerdown');root.fire('pointercancel');assert.equal(taps,1);
});
