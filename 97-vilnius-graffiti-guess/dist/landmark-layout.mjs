// A sprite's bottom center has a fixed seven-pixel offset from its geographic
// anchor. Never clamp or rearrange artwork as the camera pans or zooms.
export function layoutLandmarks(landmarks, width, height, defaultSize=44) {
 return landmarks.map(landmark=>{
  const size=landmark.id==='tv-bokstas'?64:defaultSize;
  const [ax,ay]=landmark.anchor;
  const x=ax-size/2,y=ay-size-7;
  return {...landmark,x,y,size,hidden:x+size<0||x>width||y+size<0||y>height};
 });
}
