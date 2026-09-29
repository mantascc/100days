// npm install --no-save @napi-rs/canvas; requires ffmpeg on PATH.
// node scripts/export-reel.cjs [output.mp4]
// Render the sketch's actual canvas engine deterministically, without browser controls.
const {createCanvas, Path2D} = require('@napi-rs/canvas');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const source = fs.readFileSync(path.join(__dirname,'../main.js'),'utf8');
const part = (a,b) => {if(!source.includes(a)||!source.includes(b))throw Error('Sketch source changed; update renderer boundaries');return source.slice(source.indexOf(a),source.indexOf(b));};
const code = part('const presets =','let active=') + '\nlet state={...presets.Optical};\n' + part('const cube=','const views=[];') + part('const noise=','// Cap compositing');
const context = vm.createContext({Path2D,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:{createElement:()=>createCanvas(192,192)}});
vm.runInContext(code+'\nglobalThis.engine={presets,specimens,render,setState:s=>state=s};',context);
const {engine} = context;
const W=1080,H=1920,FPS=30,COUNT=300;
const sheet=createCanvas(W,H),ctx=sheet.getContext('2d');
const views=Array.from({length:6},(_,index)=>{const canvas=createCanvas(480,450),buffer=createCanvas(480,450);return {canvas,buffer,ctx:canvas.getContext('2d'),b:buffer.getContext('2d'),width:480,height:450,ax:0,ay:0,index};});
const names=['Optical','Cryo','Amber','Afterglow','Ghost','Optical'];
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
function draw(frame){
  const t=frame/FPS,segment=Math.min(4,Math.floor(t/2)),mix=smooth((t%2-1.25)/.75);
  const from=engine.presets[names[segment]],to=engine.presets[names[segment+1]],state={...from};
  for(const k of ['clarity','bloom','grain','fringe','reflection','speed'])state[k]=from[k]+(to[k]-from[k])*mix;
  for(const k of ['color','secondary'])state[k]=from[k].map((v,i)=>Math.round(v+(to[k][i]-v)*mix));
  engine.setState(state);
  ctx.fillStyle='#101612';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#a4b2a5';ctx.font='24px monospace';ctx.fillText('C L A R I T Y',60,208);
  views.forEach((v,i)=>{
    const x=60+i%2*480,y=250+Math.floor(i/2)*450;
    // Integrate velocity continuously while material presets change.
    if(frame>0)v.clock+=(state.speed/35)/FPS;
    else v.clock=0;
    engine.render(v,i,v.clock);
    ctx.drawImage(v.canvas,x,y);
    ctx.strokeStyle='#303a32';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,479,449);
    ctx.font='16px monospace';ctx.fillStyle='#869087';ctx.fillText(`CL—00${i+1}`,x+24,y+32);
    ctx.fillStyle='#b4c3b6';ctx.fillText(engine.specimens[i][0].toUpperCase(),x+24,y+422);
  });
}
(async()=>{
  const output=path.resolve(process.argv[2]||path.join(__dirname,'../exports/clarity-instagram-10s.mp4'));
  fs.mkdirSync(path.dirname(output),{recursive:true});
  const ffmpeg=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-frames:v',String(COUNT),output],{stdio:['pipe','inherit','inherit']});
  const finished=once(ffmpeg,'close');
  ffmpeg.stdin.on('error',e=>{throw e;});
  for(let f=0;f<COUNT;f++){
    draw(f);
    if(f%60===0){fs.writeFileSync(output.replace(/\.mp4$/,`-preview-${f}.png`),sheet.toBuffer('image/png'));console.log(`Rendered ${f}/${COUNT}`);}
    if(!ffmpeg.stdin.write(sheet.toBuffer('image/png')))await once(ffmpeg.stdin,'drain');
  }
  ffmpeg.stdin.end();const [exit]=await finished;if(exit!==0)throw Error(`ffmpeg exited ${exit}`);console.log(output);
})().catch(e=>{console.error(e);process.exitCode=1;});
