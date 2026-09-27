const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});const errors=[];
for(const [width,height,mobile]of [[390,844,true],[320,667,true],[1440,900,false]]){
 const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:5189');await page.waitForFunction(()=>!document.querySelector('#enlarge').disabled);if(mobile)await page.click('[data-view=map]');await page.screenshot({path:`/tmp/landmarks-${width}-central.png`});
 assert.equal(await page.locator('.landmark').count(),9);assert.equal(await page.locator('.landmark-label:visible').count(),0);
 await page.click('#map-fit');await page.waitForTimeout(100);assert.equal(await page.locator('.landmark:visible').count(),9);await page.screenshot({path:`/tmp/landmarks-${width}-all.png`});
 for(const landmark of await page.locator('.landmark').all()){
  const hit=landmark.locator('.landmark-hit');if(mobile)await hit.tap();else {await hit.hover();assert.equal(await landmark.locator('.landmark-label').isVisible(),true);await landmark.focus();}
  assert.equal(await landmark.locator('.landmark-label').isVisible(),true);assert.equal(await page.locator('#next-label').textContent(),'PICK A DOT');
  const label=await landmark.locator('.landmark-label').boundingBox(),map=await page.locator('#map').boundingBox();assert.ok(label.x>=map.x&&label.x+label.width<=map.x+map.width+1,'name contained');
  if(mobile)await hit.tap();else await page.locator('#map').focus();
 }
 await page.click('#map-central');await page.locator('#map').focus();await page.keyboard.press('ArrowLeft');await page.keyboard.press('+');await page.keyboard.press('Home');await page.waitForTimeout(100);assert.equal(await page.locator('.landmark:visible').count(),9);
 await page.click('#map-central');const box=await page.locator('#map').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height*.8);await page.mouse.down();await page.mouse.move(box.x+box.width/2+40,box.y+box.height*.8,{steps:8});await page.mouse.up();assert.equal(await page.locator('#next-label').textContent(),'PICK A DOT');
 if(mobile){const cdp=await page.context().newCDPSession(page);const x=box.x+box.width/2,y=box.y+box.height/2;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-30,y},{x:x+30,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-60,y},{x:x+60,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.locator('#next-label').textContent(),'PICK A DOT');}
 await page.click('#map-central');await page.locator('[data-dot="1"] .core').click();assert.equal(await page.locator('#next-label').textContent(),'NEXT PHOTO');console.log('PASS',width,'nine landmarks, label interactions, fit, central, keyboard, gestures and guess');await page.close();
}
console.log({errors});assert.equal(errors.length,0);await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
