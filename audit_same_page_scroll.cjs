const assert = require('node:assert/strict');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001';
const routes = ['index', 'about', 'services', 'projects', 'customer-testimonials', 'service-areas-faq', 'contact'];
async function scrollDown(page) {
  await page.evaluate(()=>window.scrollTo({top:500,behavior:'instant'}));
  await page.waitForFunction(()=>Math.abs(scrollY-500)<2);
}
async function currentLink(page, route, mobile) {
  if (mobile) await page.locator('.menu-toggle').click();
  if (route === 'services') {
    return page.locator('.services-trigger a');
  }
  return page.locator(`.recovered-nav > a[href="${route}.html"]`);
}
(async()=>{
  for(const [engine,type] of Object.entries({chromium,webkit})) {
    const browser=await type.launch();
    try {
      for(const mobile of [false,true]) {
        const page=await browser.newPage({viewport:{width:mobile?390:1440,height:800},hasTouch:mobile,isMobile:mobile});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        for(const route of routes) {
          await page.goto(route==='index'?base+'/':`${base}/${route}.html`);
          await page.evaluate(()=>document.fonts.ready);
          const loadedAt=await page.evaluate(()=>performance.timeOrigin);
          if(route==='contact') await page.getByRole('textbox',{name:'First Name',exact:true}).fill('Preserve this draft');
          await scrollDown(page);
          await (await currentLink(page,route,mobile)).click();
          await page.waitForTimeout(350);
          const midway=await page.evaluate(()=>scrollY);
          assert(midway>0 && midway<499, `${engine} ${route} ${mobile}: expected animation, got ${midway}`);
          if(mobile) assert(!await page.locator('#mobile-navigation').isVisible());
          await page.waitForFunction(()=>scrollY<1);
          assert.equal(await page.evaluate(()=>performance.timeOrigin),loadedAt,'Same-page link reloaded the page');
          if(route==='contact') assert.equal(await page.getByRole('textbox',{name:'First Name',exact:true}).inputValue(),'Preserve this draft');
        }
        // The home logo also returns to the top; user input can stop the animation.
        await page.goto(base+'/index.html#top'); await scrollDown(page);
        await page.locator('.header-logo').click(); await page.waitForTimeout(300);
        await page.keyboard.press('Escape');
        const stopped=await page.evaluate(()=>scrollY);
        await page.waitForTimeout(1100);
        assert(stopped>0 && Math.abs(await page.evaluate(()=>scrollY)-stopped)<2);
        assert.equal(await page.evaluate(()=>location.hash),'');
        // Reduced-motion visitors get an immediate return, with no page reload.
        await page.emulateMedia({reducedMotion:'reduce'});
        await scrollDown(page);
        await (await currentLink(page,'index',mobile)).click();
        await page.waitForFunction(()=>scrollY<1,null,{timeout:500});
        // A different heading still follows its page URL.
        if(mobile) await page.locator('.menu-toggle').click();
        await page.locator('.recovered-nav > a[href="about.html"]').click();
        await page.waitForURL('**/about.html');
        if(mobile) {
          await page.locator('.menu-toggle').click();
          await page.locator('.services-toggle').click();
          assert(await page.locator('#services-submenu').isVisible());
          await page.locator('#services-submenu a').first().click();
          await page.waitForURL('**/luxury-home-builds.html');
        }
        assert.deepEqual(errors,[]);
        await page.close();
        console.log(`${engine} ${mobile?'mobile':'desktop'}: all seven current-page headings, animation timing, no reload/draft loss, logo, interruption, reduced motion and other-page navigation PASS`);
      }
    } finally {await browser.close();}
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
