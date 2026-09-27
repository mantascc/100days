export function shuffle(items, random = Math.random) {
 const out = [...items];
 for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
 return out;
}
export function distance(a,b){
 const rad=x=>x*Math.PI/180, dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
 const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
export function createGame(photos, random=Math.random){
 if(!photos.length || new Set(photos.map(p=>p.id)).size!==photos.length)throw Error('Unique photos are required');
 const order=shuffle(photos,random);let index=0;const results=[];
 return {
 get photo(){return order[index]},get index(){return index},get results(){return [...results]},get complete(){return index===photos.length},get revealed(){return results.length>index},
 guess(id){if(index===photos.length||results.length>index)throw Error('This round is closed');const picked=photos.find(p=>p.id===id);if(!picked)throw Error('Unknown dot');const photo=order[index];const result={id:photo.id,picked:id,correct:id===photo.id,meters:distance(photo,picked)};results.push(result);return result;},
 next(){if(index===photos.length||results.length<=index)throw Error('Choose a dot first');index++;return index<photos.length;}
 };
}
