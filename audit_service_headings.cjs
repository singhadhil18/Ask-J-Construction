const assert = require('node:assert/strict');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001';
(async () => {
  for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
      for (const width of [320, 390, 430, 768, 979, 980, 1024, 1440, 1920]) {
        const page = await browser.newPage({viewport: {width, height: 900}});
        await page.goto(`${base}/services.html`);
        await page.evaluate(() => document.fonts.ready);
        const data = await page.evaluate(() => {
          const rect = el => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
          return {
            cards: [...document.querySelectorAll('.service-catalog > [style]')].map(rect),
            headings: [...document.querySelectorAll('.service-card-heading')].map(el => ({...rect(el),font:getComputedStyle(el).font,tag:el.tagName,href:el.querySelector('a')?.getAttribute('href')})),
            menuLinks: [...document.querySelectorAll('#services-submenu a')].map(el => el.getAttribute('href')),
            photos: [...document.querySelectorAll('.service-photo-block')].map(el => ({...rect(el),image:rect(el.querySelector('img'))}))
          };
        });
        assert.equal(data.headings.length, 6);
        assert.equal(new Set(data.headings.map(h => h.font)).size, 1, `${name} ${width}: inconsistent title fonts`);
        for (const h of data.headings) { assert.equal(h.tag,'H2'); assert(data.menuLinks.includes(h.href), `${name}: unmatched service link ${h.href}`); }
        for (const r of data.cards) assert(r.x >= 19 && r.right <= width-19, `${name} ${width}: clipped card ${JSON.stringify(r)}`);
        for (const p of data.photos) { assert(Math.abs(p.width / p.height - 1.5) < .01, `${name} ${width}: inconsistent image shape`); assert(Math.abs(p.image.height-p.height)<1, `${name} ${width}: image escapes frame`); }
        if (width >= 980) {
          for (const offset of [0,3]) assert(Math.max(...data.headings.slice(offset,offset+3).map(h=>h.y))-Math.min(...data.headings.slice(offset,offset+3).map(h=>h.y)) < 1, 'Titles do not align');
        } else {
          for(let i=1;i<data.cards.length;i++) assert(data.cards[i].y >= data.cards[i-1].bottom+15, `${name} ${width}: service content overlaps or lacks spacing`);
        }
        if(name==='chromium' && [390,980,1440].includes(width)) await page.screenshot({path:`audits/services-final-${width}.png`,fullPage:true});
        if([390,1440].includes(width)) {
          for(const anchor of ['folding-sliding-systems','clearview-fencing','project-management']) {
            await page.locator(`.service-card-heading a[href="services.html#${anchor}"]`).click();
            await page.waitForURL(`**/services.html#${anchor}`);
            await page.waitForTimeout(600);
            const visible = await page.locator(`#${anchor}`).evaluate(el=>{const r=el.getBoundingClientRect(); const header=document.querySelector('#SITE_HEADER').getBoundingClientRect();return r.top>=header.bottom-1 && r.bottom<=innerHeight;});
            assert(visible,`${name} ${width}: linked heading hidden by header`);
          }
        }
        await page.close();
      }
      console.log(`${name} ${browser.version()}: Services layout, heading consistency and links passed at nine widths`);
    } finally { await browser.close(); }
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
