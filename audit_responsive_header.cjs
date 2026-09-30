const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001';
const routes = fs.readdirSync('.').filter(name => name.endsWith('.html'));
const widths = [320, 390, 430, 768, 979, 980, 1076, 1440, 1920];
const results = [];
async function geometry(page) {
  return page.locator('#SITE_HEADER').evaluate(header => {
    const rect = e => {const b = e.getBoundingClientRect(); return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};};
    const visible = [...header.querySelectorAll(':scope > a, :scope > button, :scope > nav > a, :scope > nav .services-trigger > a')].filter(e => e.getBoundingClientRect().width);
    return {header:rect(header),overflow:document.documentElement.scrollWidth > innerWidth + 1,
      controls:visible.map(e => ({label:e.textContent.trim() || e.getAttribute('aria-label'),...rect(e)}))};
  });
}
function checkGeometry(g, width) {
  assert(!g.overflow, `Page overflow at ${width}`);
  for (const c of g.controls) {
    assert(c.left >= 11 && c.right <= width-11, `Missing gutters: ${JSON.stringify(c)}`);
    assert(c.top >= g.header.top && c.bottom <= g.header.bottom, `Outside header: ${c.label}`);
    assert(c.height >= 43, `Small target: ${c.label}`);
  }
  for (let a=0;a<g.controls.length;a++) for(let b=a+1;b<g.controls.length;b++) {
    const x=g.controls[a],y=g.controls[b];
    assert(!(x.left<y.right-1 && x.right>y.left+1 && x.top<y.bottom-1 && x.bottom>y.top+1), `Overlap: ${x.label} / ${y.label}`);
  }
}
(async () => {
  for (const [engine,type] of Object.entries({chromium,webkit}).filter(([name])=>!process.argv[2] || process.argv.slice(2).includes(name))) {
    const browser=await type.launch();
    try {
      for (const width of widths) {
        const page=await browser.newPage({viewport:{width,height:900},hasTouch:width<980,isMobile:width<980});
        const errors=[]; page.on('pageerror',e=>errors.push(e.message));
        let headerHeight;
        for(const route of routes) {
          await page.goto(`${base}/${route}`);
          await page.evaluate(()=>document.fonts.ready);
          const g=await geometry(page); checkGeometry(g,width);
          if (route === 'index.html' && width < 980) {
            const hero = await page.locator('#comp-kbae5tti').evaluate(e => {
              const box=e.getBoundingClientRect();
              return [...e.querySelectorAll('h1, a.wixui-button')].map(item=>{
                const b=item.getBoundingClientRect(); return {left:b.left-box.left,right:box.right-b.right};
              });
            });
            assert(hero.length >= 2);
            hero.forEach(gutter=>assert(gutter.left>=15 && gutter.right>=15, 'Hero title/button padding'));
          }
          headerHeight ??= g.header.height;
          assert(Math.abs(g.header.height-headerHeight)<1, `Header shifts on ${route}`);
          if(width<980) {
            assert.equal(g.controls.length,3);
            assert(g.controls[0].label === 'Open navigation menu');
            assert(!await page.locator('.recovered-nav').isVisible());
            await page.evaluate(()=>scrollTo({top:500,behavior:'instant'}));
            await page.waitForFunction(()=>Math.abs(scrollY-500)<2);
            assert(Math.abs((await page.locator('#SITE_HEADER').boundingBox()).y)<1);
            const scroll=await page.evaluate(()=>scrollY);
            await page.locator('.menu-toggle').click();
            await page.waitForTimeout(240);
            assert(await page.locator('#mobile-navigation').isVisible());
            assert.equal(await page.locator('.recovered-nav > a, .services-trigger > a').count(),7);
            await page.locator('.services-toggle').click();
            assert(await page.locator('#services-submenu').isVisible());
            await page.keyboard.press('Escape'); // First closes the nested disclosure.
            await page.keyboard.press('Escape'); // Then the modal drawer.
            await page.waitForTimeout(30);
            assert(!await page.locator('#mobile-navigation').isVisible());
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
            assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-toggle');
            await page.waitForFunction(y=>Math.abs(scrollY-y)<2,scroll);
          }
          results.push({engine,version:browser.version(),width,route,height:g.header.height});
        }
        assert.deepEqual(errors,[]);
        await page.close();
      }
      const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
      await page.goto(base); await page.evaluate(()=>document.fonts.ready);
      await page.locator('.menu-toggle').click(); await page.waitForTimeout(250);
      await page.screenshot({path:`audits/${engine}-header-drawer.png`});
      await page.locator('.recovered-nav > a').last().focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-close');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Contact');
      await page.mouse.click(385,400); await page.waitForTimeout(30);
      assert(!await page.locator('#mobile-navigation').isVisible());
      await page.locator('.menu-toggle').click();
      await page.locator('.services-toggle').click();
      await page.locator('#services-submenu a').first().click();
      await page.waitForURL('**/luxury-home-builds.html');
      await page.locator('.header-quote').click(); await page.waitForURL('**/contact.html');
      await page.locator('.menu-toggle').click(); await page.locator('.menu-close').click();
      await page.waitForTimeout(30);
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow),'visible');
      await page.locator('.menu-toggle').click();
      await page.setViewportSize({width:1440,height:900});
      await page.waitForTimeout(80);
      assert(!await page.locator('#mobile-navigation').isVisible());
      assert(await page.locator('#SITE_HEADER > .recovered-nav').isVisible());
      await page.setViewportSize({width:390,height:844});
      await page.waitForTimeout(80);
      assert(!await page.locator('.recovered-nav').isVisible());
      for(const width of [320,390,844,980,1440]) {
        await page.setViewportSize({width,height:width===844?390:900});
        await page.goto(base); await page.evaluate(()=>document.fonts.ready);
        await page.locator('#SITE_HEADER a, #SITE_HEADER button').evaluateAll(elements => {
          elements.forEach(e=>e.style.fontSize=`${parseFloat(getComputedStyle(e).fontSize)*2}px`);
        });
        checkGeometry(await geometry(page),width);
        if(width<980) {
          await page.locator('.menu-toggle').click();
          await page.locator('.services-toggle').click();
          await page.locator('.recovered-nav > a').last().scrollIntoViewIfNeeded();
          const b=await page.locator('.recovered-nav > a').last().boundingBox();
          assert(b.y>=0 && b.y+b.height <= (await page.viewportSize()).height+1);
        }
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.setViewportSize({width:390,height:844}); await page.goto(base);
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('#mobile-navigation').evaluate(e=>getComputedStyle(e).animationName),'none');
      await page.close();
      const desktop=await browser.newPage({viewport:{width:1440,height:900}});
      await desktop.goto(base); await desktop.evaluate(()=>document.fonts.ready);
      await desktop.waitForTimeout(400);
      await desktop.screenshot({path:`audits/${engine}-header-desktop.png`});
      await desktop.locator('.services-trigger a').hover();
      assert(await desktop.locator('#services-submenu').isVisible());
      await desktop.locator('#services-submenu a').first().click();
      await desktop.waitForURL('**/luxury-home-builds.html');
      await desktop.close();
      const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
      await fallback.goto(base);
      assert(await fallback.locator('.recovered-nav').isVisible());
      await fallback.locator('.recovered-nav > a[href="about.html"]').click();
      await fallback.waitForURL('**/about.html');
      await fallback.close();
      console.log(`${engine} ${browser.version()}: all routes/widths, drawer, services, CTA, focus, dismissal, resize, 200% text, landscape, reduced motion and no-JS passed`);
    } finally {await browser.close();}
  }
  fs.writeFileSync('audits/responsive-header.json',JSON.stringify(results,null,2));
  console.log(`${results.length} page/width geometry checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
