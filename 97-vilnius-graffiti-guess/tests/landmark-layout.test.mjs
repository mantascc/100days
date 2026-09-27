import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MapCamera} from '../dist/map-camera.mjs';
import {layoutLandmarks} from '../dist/landmark-layout.mjs';
const photos=JSON.parse(readFileSync(new URL('../dist/photos.json',import.meta.url)));
const landmarks=JSON.parse(readFileSync(new URL('../dist/landmarks.json',import.meta.url)));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const layout=c=>layoutLandmarks(landmarks.map(p=>({...p,anchor:c.project(p.lat,p.lng)})),c.width,c.height,c.width<420?32:44);
test('every sprite translates exactly with the map through repeated pans',()=>{
 for(const [w,h]of [[296,380],[358,514],[640,450],[900,600]]){
  const c=new MapCamera(w,h,[...photos,...landmarks]);
  for(const [dx,dy]of [[30,-20],[-75,80],[200,100],[-150,-90]]){
   const before=layout(c),origin=c.toScreen([0,0]);c.pan(dx,dy);const after=layout(c),moved=c.toScreen([0,0]);
   after.forEach((p,i)=>{close(p.x-before[i].x,moved[0]-origin[0]);close(p.y-before[i].y,moved[1]-origin[1])});
  }
 }
});
test('zoom, resize and fit retain the bottom-center geographic attachment',()=>{
 const c=new MapCamera(358,514,[...photos,...landmarks]);
 for(const change of [()=>{},()=>c.zoomAt(2,[150,200]),()=>c.pan(30,20),()=>c.resize(700,500),()=>c.fit()]){
  change();for(const p of layout(c)){close(p.x+p.size/2,p.anchor[0]);close(p.y+p.size+7,p.anchor[1]);}
 }
});
test('partially visible sprites clip naturally instead of clamping to map edges',()=>{
 const [p]=layoutLandmarks([{id:'edge',anchor:[-5,40]}],300,400,32);
 assert.equal(p.x,-21);assert.equal(p.y,1);assert.equal(p.hidden,false);
 const [outside]=layoutLandmarks([{id:'edge',anchor:[-50,40]}],300,400,32);
 assert.equal(outside.x,-66);assert.equal(outside.hidden,true);
});
