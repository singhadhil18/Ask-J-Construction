const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium, webkit, firefox} = require('./.qa-tools/node_modules/playwright-core');

const url = name => process.env.AUDIT_BASE_URL
  ? process.env.AUDIT_BASE_URL.replace(/\/$/, '') + '/' + name + '.html'
  : pathToFileURL(path.resolve(name + '.html')).href;
(async () => {
  for (const [engine, type] of Object.entries({chromium, firefox, webkit}).filter(([name]) => !process.argv[2] || process.argv.slice(2).includes(name))) {
    const browser = await type.launch({headless:true});
    try {
      for (const touch of [false, true]) {
        const context = await browser.newContext({viewport:{width:touch?390:1440,height:900},hasTouch:touch,...(touch && engine !== 'firefox'?{isMobile:true}:{})});
        const page = await context.newPage();
        for (const name of ['index','services']) {
          await page.goto(url(name));
          assert.equal(await page.locator('.interactive-tile').count(),3);
          for (let i=0;i<3;i++) {
            await page.goto(url(name));
            await page.evaluate(()=>document.fonts.ready);
            const tile=page.locator('.interactive-tile').nth(i);
            const link=tile.locator('a');
            await link.scrollIntoViewIfNeeded();
            const before=await tile.boundingBox();
            const style=()=>tile.evaluate(e=>{const s=getComputedStyle(e,'::after');return {opacity:s.opacity,pointer:s.pointerEvents,duration:s.transitionDuration,background:s.backgroundColor};});
            assert.equal((await style()).pointer,'none');
            assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
            const destination=await link.evaluate(e=>e.href);
            if (!touch) {
              await link.hover();
              await page.waitForTimeout(180);
              assert.equal((await style()).opacity,'1');
              assert.deepEqual(await tile.boundingBox(),before,'hover shifts tile');
              await page.mouse.down();
              assert.equal((await style()).background,name === 'index' ? 'rgba(34, 34, 34, 0.5)' : 'rgba(34, 34, 34, 0.24)');
              await page.mouse.move(1,899);
              await page.mouse.up();
              await page.keyboard.press('Tab');
              await link.focus();
              assert(await link.evaluate(e=>e.matches(':focus-visible')));
              assert.equal(await link.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
              await page.emulateMedia({reducedMotion:'reduce'});
              assert.equal((await style()).duration,'0s');
              await page.emulateMedia({reducedMotion:'no-preference'});
              if(engine==='chromium' && name==='index' && i===0) await page.screenshot({path:'audits/tile-highlight.png'});
              await page.keyboard.press('Enter');
            } else {
              assert.equal((await style()).opacity,'0');
              await link.tap();
            }
            await page.waitForURL(destination);
            if (!touch) {
              await page.goto(url(name));
              await page.locator('.interactive-tile').nth(i).locator('a').click();
              await page.waitForURL(destination);
            }
          }
          console.log(engine, touch?'touch':'mouse/keyboard',name,'3 tiles PASS');
        }
        await page.goto(url('projects'));
        assert.equal(await page.locator('.interactive-tile').count(),0,'static photos remain unchanged');
        await context.close();
      }
    } finally {await browser.close();}
  }
})().catch(e=>{console.error(e);process.exitCode=1;});


