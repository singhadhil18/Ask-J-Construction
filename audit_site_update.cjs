const {chromium,webkit}=require('./.qa-tools/node_modules/playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:8003';
const pages=['index','about','services','projects','customer-testimonials','contact','service-areas-faq','luxury-home-builds','home-renovations','frameless-showers'];
const results=[];
(async()=>{
 for(const [engine,type] of Object.entries({chromium,webkit}).filter(([name])=>!process.argv[2]||name===process.argv[2])) {
  const browser=await type.launch();
  try {
   for(const width of [320,390,430,768,1440,1920]) {
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:2,...(width<768?{isMobile:true,hasTouch:true}:{})});
    for(const name of pages) {
     const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
     const response=await page.goto(`${base}/${name}.html`);assert.equal(response.status(),200);
     await page.evaluate(()=>document.fonts.ready);
     assert.equal(await page.locator('.recovered-nav > a, .services-trigger > a').count(),7);
     assert.deepEqual(await page.locator('.recovered-nav > a').allTextContents(),['Home','About','Projects','Testimonials','FAQs','Contact']);
     const toggle=width>=980?page.locator('.services-trigger > a'):page.getByRole('button',{name:'Toggle services submenu'}), panel=page.locator('#services-submenu');
     assert.equal(await page.locator('.services-trigger svg').count(),0);
     assert.equal(await panel.isVisible(),false);
     if(width<768) {
      await toggle.tap();assert.equal(await panel.isVisible(),true);
      await toggle.tap();assert.equal(await panel.isVisible(),false);
     }
     await toggle.focus();await page.keyboard.press(width>=980?'ArrowDown':'Enter');assert.equal(await panel.isVisible(),true);
     assert.equal(await toggle.getAttribute('aria-expanded'),'true');
     assert.equal(await panel.locator('a').count(),7);
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Open menu overflows');
     await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);
     assert(await toggle.evaluate(e=>e===document.activeElement));
     const wa=page.locator('.site-socials a[aria-label="WhatsApp"]');
     assert.equal(await wa.getAttribute('href'),'https://wa.me/27785680809');
     const rect=await wa.boundingBox();assert(rect.width>=44&&rect.height>=44);
     const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,header:document.querySelector('#SITE_HEADER').getBoundingClientRect().height}));
     assert(layout.scroll<=width+1,`${name} horizontal overflow`);
     if(width>=980)assert.equal(layout.header,198);
     if(width<980)assert(await page.locator('.wixui-vector-image').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>0&&e.getBoundingClientRect().bottom<=e.nextElementSibling.getBoundingClientRect().top)),'Quotation overlap');
     assert(await page.locator('.local-answers').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.left+parseFloat(c.paddingLeft)>=19&&r.right-parseFloat(c.paddingRight)<=innerWidth-19;})),'Missing content gutters');
     assert.equal(errors.length,0,errors.join('\n'));page.off('pageerror',handler);
     results.push({engine,version:browser.version(),width,page:name,passed:true});
    }
    await page.close();console.log(engine,width,': all ten pages PASS');
   }
   let page=await browser.newPage({viewport:{width:1440,height:900}});
   await page.goto(base+'/index.html');
   await page.locator('.services-trigger > a').hover();assert(await page.locator('#services-submenu').isVisible());
   await page.mouse.click(5,250);assert.equal(await page.locator('#services-submenu').isVisible(),false);
   await page.locator('.services-trigger > a').focus();assert(await page.locator('#services-submenu').isVisible());
   await page.locator('#services-submenu a[href="frameless-showers.html"]').click();await page.waitForURL('**/frameless-showers.html');
   await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('h1').innerText(),'Frameless showers and maintenance');
   // Use fresh contexts for each profile; the Windows WebKit build can crash
   // when resizing an AVIF page immediately after a cross-document navigation.
   await page.close();page=await browser.newPage({viewport:{width:844,height:390}});
   await page.goto(base+'/frameless-showers.html');await page.getByRole('button',{name:'Toggle services submenu'}).click();
   await page.getByRole('link',{name:'See all services',exact:true}).scrollIntoViewIfNeeded();
   const last=await page.getByRole('link',{name:'See all services',exact:true}).boundingBox();assert(last.y+last.height<=390,'Landscape menu unreachable');
   await page.close();page=await browser.newPage({viewport:{width:390,height:900}});
   for(const name of ['service-areas-faq','luxury-home-builds','home-renovations','frameless-showers']) {
    await page.goto(base+'/'+name+'.html');await page.evaluate(()=>document.fonts.ready);
    await page.locator('.local-answers p,.local-answers h1,.local-answers h2,.local-answers h3').evaluateAll(es=>es.forEach(e=>e.style.setProperty('font-size',`${parseFloat(getComputedStyle(e).fontSize)*2}px`,'important')));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Enlarged text overflow');
   }
   await page.close();
   const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
   await nojs.goto(base+'/index.html');assert.equal(await nojs.locator('#services-submenu a:visible').count(),7);
   await nojs.getByRole('link',{name:'Home renovations and additions',exact:true}).click();await nojs.waitForURL('**/home-renovations.html');await nojs.close();
   const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
   await touch.goto(base+'/index.html');await touch.getByRole('button',{name:'Toggle services submenu'}).tap();
   await touch.locator('#services-submenu a[href="home-renovations.html"]').tap();await touch.waitForURL('**/home-renovations.html');await touch.waitForLoadState('networkidle');await touch.close();
   console.log(engine,'hover, keyboard, navigation, landscape, doubled text, no-JS: PASS');
  } finally {await browser.close();}
 }
 fs.writeFileSync('audits/site-update.json',JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
