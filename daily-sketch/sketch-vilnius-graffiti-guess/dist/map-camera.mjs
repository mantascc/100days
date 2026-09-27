// Local metric projection, accurate enough for this central-Vilnius game extent.
export const worldPoint = (lat, lng) => [(lng - 25.278) * 64300, -(lat - 54.686) * 111200];
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
export class MapCamera {
 constructor(width, height, locations) {
  this.width=width; this.height=height; this.zoom=1;
  const points=locations.map(p=>worldPoint(p.lat,p.lng));
  this.bounds={left:Math.min(...points.map(p=>p[0])),right:Math.max(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),bottom:Math.max(...points.map(p=>p[1]))};
  this.fit();
 }
 get baseScale(){const b=this.bounds;return Math.min(Math.max(100,this.width-130)/(b.right-b.left+300),Math.max(100,this.height-145)/(b.bottom-b.top+150));}
 get scale(){return this.baseScale*this.zoom;}
 project(lat,lng){return this.toScreen(worldPoint(lat,lng));}
 toScreen([x,y]){return [this.width/2+(x-this.x)*this.scale,this.height/2+(y-this.y)*this.scale];}
 toWorld([x,y]){return [this.x+(x-this.width/2)/this.scale,this.y+(y-this.height/2)/this.scale];}
 fit(){this.zoom=1;this.x=(this.bounds.left+this.bounds.right)/2;this.y=(this.bounds.top+this.bounds.bottom)/2;}
 resize(width,height){this.width=width;this.height=height;}
 pan(dx,dy){this.x-=dx/this.scale;this.y-=dy/this.scale;this.constrain();}
 zoomAt(factor,anchor=[this.width/2,this.height/2]){const before=this.toWorld(anchor);this.zoom=clamp(this.zoom*factor,.75,8);const after=this.toWorld(anchor);this.x+=before[0]-after[0];this.y+=before[1]-after[1];this.constrain();}
 constrain(){// Keep exploration inside the downloaded city area.
  const nw=worldPoint(54.703,25.251),se=worldPoint(54.671,25.309);
  this.x=clamp(this.x,nw[0],se[0]);this.y=clamp(this.y,nw[1],se[1]);
 }
 get transform(){return `translate(${this.width/2-this.x*this.scale} ${this.height/2-this.y*this.scale}) scale(${this.scale})`;}
}
