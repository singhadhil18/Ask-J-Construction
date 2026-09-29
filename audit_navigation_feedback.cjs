const assert = require('node:assert/strict');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright-core');
const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');
(async () => {
  for (const [engine, type] of Object.entries({chromium, webkit})) {
    const browser = await type.launch();
    try {
      for (const touch of [false, true]) {
        const page = await browser.newPage({viewport:{width:touch?390:1440,height:900},hasTouch:touch,isMobile:touch});
        await page.goto(base + '/');
        const nav = page.locator('.recovered-nav > a, .services-trigger > a');
        const quote = page.locator('.header-quote');
        if (!touch) {
          for (const link of await nav.all()) {
            const rect = await link.boundingBox();
            await link.hover();
            await page.waitForTimeout(180);
            const style = await link.evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e,'::before').backgroundColor,opacity:getComputedStyle(e,'::before').opacity}));
            assert.deepEqual(style,{color:'rgb(255, 255, 255)',background:'rgb(102, 102, 102)',opacity:'1'});
            assert.deepEqual(await link.boundingBox(),rect);
          }
          await page.locator('.services-trigger a').hover();
          assert(await page.locator('#services-submenu').isVisible());
          await quote.hover();
          await page.waitForTimeout(250);
          assert(!(await page.locator('#services-submenu').isVisible()));
          const underline = await quote.evaluate(e=>{const s=getComputedStyle(e,'::after');return {transform:s.transform,origin:parseFloat(s.transformOrigin),width:parseFloat(s.width)};});
          assert.equal(underline.transform,'matrix(1, 0, 0, 1, 0, 0)');
          assert(Math.abs(underline.origin-underline.width/2)<1);
          await page.screenshot({path:`audits/${engine}-quote-hover-release.png`});
          await page.mouse.move(1,899);
          await page.waitForTimeout(250);
          assert.equal(await quote.evaluate(e=>getComputedStyle(e,'::after').transform),'matrix(0, 0, 0, 1, 0, 0)');
          await page.emulateMedia({reducedMotion:'reduce'});
          await page.keyboard.press('Tab');
          await quote.focus();
          assert.equal(await quote.evaluate(e=>getComputedStyle(e,'::after').transitionDuration),'0s');
          assert.equal(await quote.evaluate(e=>getComputedStyle(e,'::after').transform),'matrix(1, 0, 0, 1, 0, 0)');
          await nav.first().focus();
          assert.equal(await nav.first().evaluate(e=>getComputedStyle(e,'::before').opacity),'1');
          await quote.click();
        } else {
          await page.locator('.services-trigger a').tap();
          assert(await page.locator('#services-submenu').isVisible());
          await page.locator('#services-submenu a').first().tap();
          await page.waitForURL(base + '/luxury-home-builds.html');
          await page.waitForLoadState('networkidle');
          await page.screenshot({path:`audits/${engine}-mobile-release.png`});
          await quote.tap();
        }
        await page.waitForURL(base + '/contact.html');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        console.log(engine,touch?'touch':'mouse/keyboard','navigation tiles and quote underline PASS');
        await page.close();
      }
    } finally {await browser.close();}
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
