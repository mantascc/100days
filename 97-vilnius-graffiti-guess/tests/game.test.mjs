import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createGame,distance} from '../dist/game.mjs';
const photos=JSON.parse(readFileSync(new URL('../dist/photos.json',import.meta.url)));
test('all seven rounds reveal once, require a guess, and finish',()=>{const game=createGame(photos,()=>.999);assert.throws(()=>game.next());assert.throws(()=>game.guess(999));for(let i=0;i<photos.length;i++){assert.equal(game.index,i);const r=game.guess(game.photo.id);assert.equal(r.correct,true);assert.equal(r.meters,0);assert.throws(()=>game.guess(game.photo.id));assert.equal(game.next(),i<photos.length-1)}assert.equal(game.complete,true);assert.equal(game.results.length,7);assert.throws(()=>game.next());assert.throws(()=>game.guess(1));});
test('wrong guess is measured and records both locations',()=>{const game=createGame(photos,()=>.999);const r=game.guess(5);assert.equal(r.correct,false);assert.equal(r.id,1);assert.equal(r.picked,5);assert.ok(r.meters>1000&&r.meters<3000);assert.equal(distance(photos[0],photos[4]),distance(photos[4],photos[0]));});
test('content has seven local images with supplied coordinates and plausible Vilnius geotags',()=>{assert.equal(photos.length,7);for(const p of photos){assert.ok(p.lat>54.6&&p.lat<54.8&&p.lng>25.1&&p.lng<25.4);assert.ok(existsSync(new URL('../dist/'+p.image,import.meta.url)));assert.match(p.coordinateEvidence,/supplied/);assert.match(p.image,/^assets\/photos\/graffiti-0[1-7]\.webp$/);assert.ok(p.width<=1800&&p.height<=1800);}});

test("rejects empty and duplicate photo collections",()=>{assert.throws(()=>createGame([]));assert.throws(()=>createGame([photos[0],photos[0]]));});
