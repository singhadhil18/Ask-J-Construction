const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright-core');
const {firefox} = require('./.qa-firefox/node_modules/playwright-core');
const pages = ['index', 'about', 'services', 'projects', 'customer-testimonials', 'contact', 'service-areas-faq'];
const selected = process.argv.slice(2).length ? process.argv.slice(2) : ['chromium', 'edge', 'webkit', 'firefox'];
const baseUrl = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');
const report = process.env.AUDIT_BASE_URL ? 'audits/live-compatibility.json' : 'audits/compatibility.json';
const prior = fs.existsSync(report) ? JSON.parse(fs.readFileSync(report)) : [];
const results = (Array.isArray(prior) ? prior : prior.results || []).filter(r=>!selected.includes(r.engine));
fs.mkdirSync('audits', {recursive:true});
(async () => {
  for (const engine of selected) {
    const browser = await (engine === 'webkit' ? webkit : engine === 'firefox' ? firefox : chromium).launch({headless:true, ...(engine === 'edge' ? {channel:'msedge'} : {})});
    try {
      for (const width of [320, 375, 768, 1440]) {
        const context = await browser.newContext({viewport:{width,height:900}, deviceScaleFactor:width <= 375 ? 2 : 1, ...(width <= 375 && engine !== 'firefox' ? {isMobile:true,hasTouch:true} : {})});
        const page = await context.newPage();
        for (const name of pages) {
          const errors=[];
          const handler=e=>errors.push(e.message);
          page.on('pageerror',handler);
          await page.goto(`${baseUrl}/${name}.html`,{waitUntil:'networkidle'});
          await page.evaluate(()=>document.fonts.ready);
          const state=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,header:document.querySelector('#SITE_HEADER').getBoundingClientRect().height,nav:document.querySelectorAll('.recovered-nav a').length}));
          assert(state.width<=state.viewport+1,`${engine} ${width} ${name} overflows: ${JSON.stringify(state)}`);
          assert.equal(state.nav,6);
          assert.equal(errors.length,0,errors.join('\n'));
          await page.evaluate(async()=>{
            for (let y=0;y<document.documentElement.scrollHeight;y+=650) {
              window.scrollTo(0,y);
              await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
              await Promise.all(Array.from(document.images).filter(i=>{const b=i.getBoundingClientRect();return b.bottom>0&&b.top<innerHeight;}).map(i=>i.decode().catch(()=>{})));
            }
            window.scrollTo(0,document.body.scrollHeight);
          });
          const headerTop=await page.locator('#SITE_HEADER').evaluate(e=>e.getBoundingClientRect().top);
          assert(Math.abs(headerTop)<2,`${engine} ${name} header not sticky: ${headerTop}`);
          const footer=await page.evaluate(()=>({linkBottom:document.querySelector('.local-search-link').getBoundingClientRect().bottom,footerTop:document.querySelector('#SITE_FOOTER').getBoundingClientRect().top}));
          assert(footer.linkBottom<=footer.footerTop+1,`${engine} ${name}: footer link overlaps footer`);
          const broken=await page.evaluate(()=>Array.from(document.images).filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc));
          assert.equal(broken.length,0,`${engine} ${name}: broken images ${broken}`);
          await page.screenshot({path:`audits/${process.env.AUDIT_BASE_URL ? "live-" : ""}${engine}-${width}-${name}.png`,fullPage:true});
          results.push({engine,width,page:name,...state,headerTop,passed:true});
          page.off('pageerror',handler);
          console.log(`${engine} ${width} ${name}: PASS`);
        }
        await page.goto(`${baseUrl}/contact.html`);
        await page.evaluate(()=>{window.open=(url)=>{window.__testOutgoingUrl=url;return null;};});
        await page.getByRole('button',{name:'Send enquiry by WhatsApp'}).click();
        assert.equal(await page.evaluate(()=>window.__testOutgoingUrl),undefined,'Empty form must not open WhatsApp');
        await page.getByRole('textbox',{name:'First Name',exact:true}).fill('Compatibility');
        await page.getByRole('textbox',{name:'Last Name',exact:true}).fill('Test');
        await page.getByRole('textbox',{name:'Email',exact:true}).fill('test@example.com');
        await page.getByRole('textbox',{name:'Message',exact:true}).fill('A & B\nGlass + maintenance');
        await page.getByRole('button',{name:'Send enquiry by WhatsApp'}).click();
        const outgoing=await page.evaluate(()=>window.__testOutgoingUrl);
        assert(outgoing.startsWith('https://wa.me/27785680809?text='));
        assert(new URL(outgoing).searchParams.get('text').includes('A & B\nGlass + maintenance'));
        results.push({engine,width,check:'contact form validation and WhatsApp destination',passed:true});
        console.log(`${engine} ${width} contact validation: PASS (no message sent)`);
        await context.close();
      }
    } finally { await browser.close(); }
  }
  fs.writeFileSync(report,JSON.stringify(results,null,2));
})().catch(error=>{fs.writeFileSync(report,JSON.stringify({results,error:error.stack},null,2));console.error(error);process.exitCode=1;});
