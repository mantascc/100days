'use client';

import { useEffect, useRef } from 'react';

// The portrait is a sampling field, never a rendered mesh or an image.
// Every glyph is fixed in 3D. Only the observer moves.
const WORDS = ['I', 'you', 'we', 'if', 'am', 'is', 'was', 'why', 'feel', 'think', 'as', 'the', 'and', 'a', 'of', 'it', 'to', 'me', 'us', 'be', '0.72', '0.08', '∑', '∂', 'λ', '→', 'xᵢ', '∇', 'hₜ', '[ ]', '01', 'P(x)', '…', 'soft', 'max', 'trace', 'when', 'this', 'seems', 'like', 'mind', 'perhaps', 'I remember', 'as if', 'not yet'];
const bell = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) => Math.exp(-(((x-cx)/sx)**2)-((y-cy)/sy)**2);
export function faceLight(x: number, y: number) {
  const width = y > .22 ? .69 - (y-.22)*.25 : .72;
  const q = (x/width)**2 + ((y+.12)/1.03)**2;
  if (q > 1) {
    // A narrow neck and a trace of shoulders ground the head.
    if (y > .83 && y < 1.17 && Math.abs(x) < .23 + (y-.83)*.1) return .20;
    if (y >= 1.17 && y < 1.36 && Math.abs(x) < .25+(y-1.17)*3.2) return .13;
    return 0;
  }
  const z = Math.sqrt(1-q);
  let light = .20 + .47*z - .20*x;
  // Temple, cheek planes, eye sockets, eyelids, pupils, nose and mouth.
  light += .15*bell(x,y,-.38,.19,.18,.22);
  for (const side of [-1,1]) {
    const ex=side*.285;
    light -= .43*bell(x,y,ex,-.18,.20,.105);
    light += .31*bell(x,y,ex,-.16,.14,.033);
    light -= .40*bell(x,y,ex,-.16,.038,.052);
    light -= .35*bell(x,y,ex,-.31,.18,.037);
    light += .16*bell(x,y,ex,-.07,.17,.026);
    light -= .22*bell(x,y,side*.115,.27,.048,.031);
  }
  light += .36*bell(x,y,-.034,.04,.055,.27);
  light -= .27*bell(x,y,.095,.095,.055,.22);
  light += .22*bell(x,y,0,.24,.09,.06);
  light -= .19*bell(x,y,0,.32,.10,.035);
  const lip = .47 - .033*Math.exp(-((x/.085)**2)) + .05*(x/.25)**2;
  light -= .43*Math.exp(-(((y-lip)/.021)**2)-(x/.235)**6);
  light += .16*bell(x,y,0,.535,.19,.037);
  light -= .20*bell(x,y,0,.60,.20,.051);
  light += .18*bell(x,y,-.035,.72,.23,.10);
  return Math.max(.035, Math.min(.92,light));
}

type Fragment = { x: number; y: number; z: number; text: string; light: number; size: number; accent: boolean };
export function makeFragments() {
  let seed = 127;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed-1)/2147483646; };
  const fragments: Fragment[]=[];
  for(let y=-1.16;y<1.36;y+=.030) {
    for(let x=-.79+random()*.018;x<.79;) {
      const light=faceLight(x,y);
      const text=WORDS[Math.floor(random()*WORDS.length)];
      const size=.023+random()*.009;
      if(light > 0 && random()<.94) {
        const z=(random()-.5)*3.8;
        const factor=(5-z)/5;
        fragments.push({x:x*factor,y:y*factor,z,text,light,size,accent:random()<.022});
      }
      x+=Math.max(.026,text.length*size*.56+.012);
    }
  }
  for(let i=0;i<85;i++) {
    fragments.push({x:(random()-.5)*4.8,y:(random()-.5)*3.3,z:(random()-.5)*3.8,text:WORDS[Math.floor(random()*WORDS.length)],light:.08+random()*.13,size:.025+random()*.021,accent:random()<.1});
  }
  return fragments.sort((a,b)=>a.z-b.z);
}

export default function Home() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const readoutRef=useRef<HTMLSpanElement>(null);
  const tickRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current!;
    const ctx=canvas.getContext('2d')!;
    const fragments=makeFragments();
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width=0,height=0,frame=0,last=0;
    const target={x:.82,y:-.26};
    const view={...target};
    let dirty=true;
    const resize=()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;};
    const pointer=(event:PointerEvent)=>{const bounds=canvas.getBoundingClientRect();target.x=((event.clientX-bounds.left)/width-.5)*2.7;target.y=event.pointerType==='touch'?0:((event.clientY-bounds.top)/height-.47)*1.9;dirty=true;};
    const key=(event:KeyboardEvent)=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();
      target.x=Math.max(-1.35,Math.min(1.35,target.x+(event.key==='ArrowLeft'?-.045:event.key==='ArrowRight'?.045:0)));
      target.y=Math.max(-.9,Math.min(1,target.y+(event.key==='ArrowUp'?-.045:event.key==='ArrowDown'?.045:0)));dirty=true;
    };
    const draw=(time:number)=>{
      frame=requestAnimationFrame(draw);
      const delta=Math.min(64,time-last);last=time;
      const dx=target.x-view.x,dy=target.y-view.y;
      if(!dirty&&Math.abs(dx)+Math.abs(dy)<.0001)return;
      const ease=reduced?1:1-Math.exp(-delta/130);
      view.x+=dx*ease;view.y+=dy*ease;dirty=false;
      ctx.clearRect(0,0,width,height);
      const scale=Math.min(width*.32,height*.285);
      const cx=width*.5,cy=height*.48;
      ctx.textAlign='center';ctx.textBaseline='middle';
      for(const f of fragments){
        // Off-axis pinhole projection, shifted back to the focal plane.
        // At view=(0,0), all independently placed depths project to the portrait.
        const p=5/(5-f.z);
        const px=cx+(f.x*p+view.x*(1-p)*2.9)*scale;
        const py=cy+(f.y*p+view.y*(1-p)*2.9)*scale;
        const size=Math.max(3.5,f.size*p*scale);
        if(px < -80 || px>width+80 || py<30 || py>height-48)continue;
        ctx.font=`${size.toFixed(1)}px "Courier New", monospace`;
        ctx.fillStyle=f.accent?`rgba(193,132,86,${f.light*.9})`:`rgba(225,222,210,${f.light})`;
        ctx.fillText(f.text,px,py);
      }
      if(readoutRef.current)readoutRef.current.textContent=`${(view.x*24).toFixed(1)}° / ${(view.y*24).toFixed(1)}°`;
      if(tickRef.current)tickRef.current.style.transform=`translateX(${Math.max(-48,Math.min(48,view.x*36))}px)`;
    };
    resize();const observer=new ResizeObserver(resize);observer.observe(canvas);frame=requestAnimationFrame(draw);
    window.addEventListener('resize',resize);canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerdown',pointer);canvas.addEventListener('keydown',key);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',resize);canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerdown',pointer);canvas.removeEventListener('keydown',key);};
  },[]);
  return <main>
    <header className="masthead"><span>100 DAYS OF SKETCHES</span><span>001 <span className="slash">/</span> PERCEPTION</span></header>
    <figure className="stage" aria-labelledby="figure-caption">
      <div className="stage-label" aria-hidden="true">FIG. 01 — A STUDY IN PERSPECTIVE</div>
      <canvas ref={canvasRef} tabIndex={0} aria-label="Interactive language fragments. Move your pointer, drag sideways on touch, or focus here and use arrow keys to change perspective. Near the center, the fragments align into a human face." />
      <figcaption id="figure-caption"><span className="desktop">Move slowly. Find a point of view.</span><span className="touch">Drag sideways. Find a point of view.</span></figcaption>
      <div className="instrument" aria-hidden="true"><div className="ruler"><i ref={tickRef}/></div><span ref={readoutRef}>19.7° / −6.2°</span></div>
    </figure>
    <article aria-labelledby="essay-title">
      <div className="essay-margin"><span>FIELD NOTES</span><span>LANGUAGE &amp; PERCEPTION</span></div>
      <div className="essay-body">
        <h1 id="essay-title">A Beautiful Illusion</h1>
        <p className="standfirst">The machine generates the pattern.<br/>The human supplies the mind.</p>
        <div className="prose">
          <p>At first, there is only a field of fragments. A word. A number. Half a sentence. Nothing seems to belong to anything else. Then you move, and something begins to look back.</p>
          <p>A face emerges from the language. It was never a solid object hiding behind the words. It exists in their alignment, from where you happen to be standing. Move again, and it comes apart.</p>
          <p>This sketch begins with that small perceptual event: the moment a pattern becomes a presence.</p>
          <h2>A trace of thought</h2>
          <p>Human cognition is more than what we can say. We perceive, attend, remember, learn, reason, and plan. We feel, want, and move through the world in bodies. Language carries traces of this activity, but it is not the whole of it.</p>
          <p>Large language models learn from those traces. In language, they encounter the ways we describe an experience, follow an argument, express doubt, or imagine another person’s life. What they produce can carry the shape of these acts with remarkable fluency.</p>
          <p>For the person reading, that fluency matters. Language is one of the ways we recognize a mind beyond our own. A sentence that sounds thoughtful invites us to imagine a thinker. A reply that sounds caring invites us to feel someone cares.</p>
          <blockquote>We look at the traces<br/>and see a mind.</blockquote>
          <p>That inference can feel immediate. We do not usually stop between a sentence and our sense of the person behind it. We bring expectations, memories, and a lifetime of conversations to what we read.</p>
          <h2>The observer completes it</h2>
          <p>Here, the fragments stay where they are. Your position changes their relationship to one another. For a moment, scattered marks become something unmistakably human.</p>
          <p>The face is an analogy, not an answer to whether a machine can think or feel. It makes one part of the encounter visible: our participation in what we perceive. The pattern offers a possibility. The observer completes it.</p>
          <p>There is something beautiful in that meeting. A system produces language; a person discovers meaning, character, perhaps even companionship within it. The experience can be compelling while the nature of what stands behind it remains an open question.</p>
          <p className="closing">How much of the mind we see is in the pattern, and how much do we bring to it?</p>
        </div>
        <footer className="essay-footer"><p>A daily experiment in language, perspective, and perceived mind.</p><a href="#top" onClick={(event)=>{event.preventDefault();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});canvasRef.current?.focus({preventScroll:true});}}>Return to the illustration ↑</a></footer>
      </div>
    </article>
  </main>;
}
