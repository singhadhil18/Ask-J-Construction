const assert=require('node:assert/strict');
const {chromium,webkit}=require('./.qa-tools/node_modules/playwright');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:8001';
const routes=['index','about','services','projects','customer-testimonials','service-areas-faq','contact','luxury-home-builds','home-renovations','frameless-showers'];
const services=['luxury-home-builds.html','home-renovations.html','frameless-showers.html','services.html#folding-sliding-systems','services.html#clearview-fencing','services.html#project-management','services.html'];
(async()=>{
 for(const [engine,type] of Object.entries({chromium,webkit})) {
  const browser=await type.launch();
  try {
   for(const viewport of [{width:390,height:844},{width:844,height:390},{width:1440,height:900}]) {
    const mobile=viewport.width<980;
    const page=await browser.newPage({viewport,hasTouch:mobile,isMobile:mobile});
    const errors=[];const failures=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400 && new URL(r.url()).origin===new URL(base).origin)failures.push(`${r.status()} ${r.url()}`);});
    for(const destination of services) {
     await page.goto(base+'/about.html');
     if(mobile){await page.locator('.menu-toggle').click();await page.locator('.services-toggle').click();}
     else {await page.locator('.services-trigger a').focus();await page.keyboard.press('ArrowDown');}
     await page.locator(`#services-submenu a[href="${destination}"]`).click();
     await page.waitForURL(`${base}/${destination}`);
     await page.waitForLoadState('load');
     await page.evaluate(()=>document.fonts.ready);
     assert.equal(await page.locator('#mobile-navigation').isVisible(),false);
     if(destination.includes('#')) {
      const id=destination.split('#')[1];
      await page.waitForFunction(id=>{
       const r=document.getElementById(id).getBoundingClientRect();
       return r.top>=document.querySelector('#SITE_HEADER').getBoundingClientRect().bottom-1&&r.bottom<=innerHeight+1;
      },id,{timeout:4000});
      const box=await page.locator('#'+id).boundingBox();
      const header=await page.locator('#SITE_HEADER').boundingBox();
      assert(box.y>=header.height-1&&box.y+box.height<=viewport.height+1,`${engine} ${viewport.width} ${id}: service anchor obscured ${JSON.stringify(box)}`);
     }
    }
    for(const route of routes) {
     await page.goto(`${base}/${route}.html`);
     await page.locator('.header-quote').click();await page.waitForURL(base+'/contact.html');
     assert(await page.getByRole('textbox',{name:'First Name',exact:true}).isVisible());
    }
    await page.goto(base+'/index.html');
    await page.locator('#comp-kbae6awx a').click();await page.waitForURL(base+'/about.html');
    await page.goto(base+'/index.html');
    for(const href of ['luxury-home-builds.html','home-renovations.html','frameless-showers.html']) {
     await page.locator(`#comp-jnod9lp55 a[href="${href}"]`).first().click();await page.waitForURL(base+'/'+href);await page.goBack();
    }
    if(mobile) {
     await page.locator('.menu-toggle').click();await page.locator('.services-toggle').click();
     await page.locator('.recovered-nav > a').last().scrollIntoViewIfNeeded();
     const box=await page.locator('.recovered-nav > a').last().boundingBox();assert(box.y>=0&&box.y+box.height<=viewport.height+1,'Landscape menu unreachable');
     await page.keyboard.press('Escape');await page.keyboard.press('Escape');
     assert.equal(await page.locator('#mobile-navigation').isVisible(),false);
     assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-toggle');
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
    await page.close();console.log(`${engine} ${viewport.width}x${viewport.height}: service menu destinations, section anchors, ten quote routes, home service tiles, About CTA, drawer dismissal and resources PASS`);
   }
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
