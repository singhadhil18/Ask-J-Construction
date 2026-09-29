const assert = require('node:assert/strict');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright-core');
const base = 'http://127.0.0.1:8001';
const pages = ['index', 'customer-testimonials'];
const allPages = ['index', 'about', 'services', 'projects', 'customer-testimonials', 'contact', 'service-areas-faq'];
const results = [];
const original = name => execFileSync('git', ['show', `HEAD:${name}`], {encoding:'utf8', maxBuffer: 2e6});

async function geometry(page) {
  return page.locator('.wixui-rich-text, .wixui-vector-image, .wixui-image, #SITE_HEADER').evaluateAll(es => es.map(e => {
    const r = e.getBoundingClientRect(), c = getComputedStyle(e);
    return {id:e.id, x:r.x,y:r.y,width:r.width,height:r.height,font:c.font,color:c.color};
  }));
}

(async () => {
  for (const [engine, launcher] of Object.entries({chromium,webkit})) {
    const browser = await launcher.launch();
    try {
      for (const width of [320,390,430,768,1440,1920]) {
        const page = await browser.newPage({viewport:{width,height:900}, ...(width < 768 ? {isMobile:true,hasTouch:true} : {})});
        for (const name of width >= 980 ? allPages : pages) {
          const url = `${base}/${name}.html`;
          await page.goto(url); await page.evaluate(()=>document.fonts.ready);
          const current = await geometry(page);
          const icons = await page.locator('.wixui-vector-image').evaluateAll(es=>es.map(e=> {
            const box=e.getBoundingClientRect(), svg=e.querySelector('svg').getBoundingClientRect(), text=e.nextElementSibling.getBoundingClientRect();
            return {id:e.id,width:box.width,height:box.height,svgHeight:svg.height,gap:text.top-box.bottom};
          }));
          for (const icon of icons) {
            assert(icon.height>0 && icon.svgHeight>0, `${engine} ${width} ${icon.id}: collapsed icon`);
            if (width<980) assert(icon.gap>=23,`${engine} ${width}: quote overlaps copy`);
          }
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), 'Horizontal overflow');
          if (width===390) {
            await page.locator('.wixui-vector-image').first().evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-document.querySelector('#SITE_HEADER').getBoundingClientRect().height-16,behavior:'instant'}));
            await page.screenshot({path:`audits/quotes-${engine}-${name}.png`});
            await page.locator('.wixui-rich-text p,.wixui-rich-text blockquote').evaluateAll(es=>es.forEach(e=>e.style.setProperty('font-size',`${parseFloat(getComputedStyle(e).fontSize)*2}px`,'important')));
            assert(await page.locator('.wixui-vector-image').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().bottom<=e.nextElementSibling.getBoundingClientRect().top)), 'Overlap at enlarged text');
          }
          if (width>=980) {
            await page.route(url,route=>route.fulfill({contentType:'text/html',body:original(`${name}.html`)}));
            await page.route('**/mobile-compatibility.css*',route=>route.fulfill({contentType:'text/css',body:original('mobile-compatibility.css')}));
            await page.goto(url); await page.evaluate(()=>document.fonts.ready);
            assert.deepEqual(current,await geometry(page),'Desktop layout or typography changed');
            await page.unrouteAll();
          }
          results.push({engine,version:browser.version(),width,page:name,icons:icons.length,passed:true});
          console.log(`${engine} ${width} ${name}: PASS`);
        }
        await page.close();
      }
    } finally {await browser.close();}
  }
  fs.writeFileSync('audits/quotation-layout.json',JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
