const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {chromium,webkit}=require('./.qa-tools/node_modules/playwright');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:8001';
const routes=fs.readdirSync('.').filter(n=>n.endsWith('.html'));
(async()=>{
 for(const [engine,type] of Object.entries({chromium,webkit})) {
  const browser=await type.launch();
  try {
   for(const width of [320,390,768,980,1024,1280,1359,1360,1440,1920]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    for(const route of routes) {
     await page.goto(`${base}/${route}`);await page.evaluate(()=>document.fonts.ready);
     const clipped=await page.locator('main h1,main h2,main h3,main p,main a,main input,main textarea,main button').evaluateAll(els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.left < -1||r.right>innerWidth+1);}).map(e=>({text:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,60),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})));
     assert.deepEqual(clipped,[],`${engine} ${width} ${route}: content clipped`);
     if(route==='index.html') {
      const cta=page.locator('#comp-kbae6awx');
      assert((await cta.boundingBox()).height>=39,'About CTA collapsed');
      assert.equal(await cta.locator('a').getAttribute('href'),'about.html');
     }
     if(route==='projects.html' && width>=980&&width<=1359) {
      const gaps=await page.locator('.project-gallery-section [data-mesh-id$="-gridContainer"] > [id]').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:innerWidth-r.right,top:r.top,bottom:r.bottom};}));
      gaps.forEach(r=>assert(r.left>=39&&r.right>=39,'Project gutter missing'));
      for(let i=0;i<gaps.length;i++)for(let j=i+1;j<gaps.length;j++){const a=gaps[i],b=gaps[j];assert(!(a.left<width-b.right-1&&width-a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1),'Project elements overlap');}
     }
    }
    await page.close();
   }
   for(const width of [390,1440]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.goto(base+'/contact.html');
    await page.evaluate(()=>{window.open=url=>{window.__outgoing=url;return null;};});
    assert.equal(await page.locator('[data-hook="country-selector-trigger"]').count(),0);
    assert.deepEqual(await page.locator('.contact-phone-link').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),['tel:+27837322142','tel:+27785680809']);
    await page.getByRole('textbox',{name:'First Name',exact:true}).fill('   ');
    await page.getByRole('textbox',{name:'Last Name',exact:true}).fill('   ');
    await page.getByRole('textbox',{name:'Email',exact:true}).fill('test@example.com');
    await page.getByRole('button',{name:'Send enquiry by WhatsApp'}).click();
    assert.equal(await page.evaluate(()=>window.__outgoing),undefined,'Whitespace names must not send');
    await page.getByRole('textbox',{name:'First Name',exact:true}).fill('Test');
    await page.getByRole('button',{name:'Send enquiry by WhatsApp'}).click();
    assert.equal(await page.evaluate(()=>window.__outgoing),undefined,'Whitespace surname must not send');
    await page.getByRole('textbox',{name:'Last Name',exact:true}).fill('Enquiry');
    await page.getByRole('textbox',{name:'Phone',exact:true}).fill('+27 82 123 4567');
    await page.getByRole('textbox',{name:'Message',exact:true}).fill('Glass & doors + repairs\nSecond line');
    await page.getByRole('button',{name:'Send enquiry by WhatsApp'}).click();
    const outgoing=new URL(await page.evaluate(()=>window.__outgoing));
    assert.equal(outgoing.origin+outgoing.pathname,'https://wa.me/27785680809');
    assert(outgoing.searchParams.get('text').includes('Phone: +27 82 123 4567'));
    assert(outgoing.searchParams.get('text').includes('Glass & doors + repairs\nSecond line'));
    assert.equal(await page.getByRole('textbox',{name:'Phone',exact:true}).inputValue(),'+27 82 123 4567');
    await page.goto(base+'/customer-testimonials.html');
    assert.equal(await page.locator('.review-submit').innerText(),'Submit');
    assert.equal(await page.locator('.review-success h2').textContent(),'Review Submitted Successfully');
    await page.close();
   }
   console.log(`${engine}: 100 page/viewport clipping checks, gallery overlap/gutters, invalid-name recovery, full-phone handoff and preview wording PASS`);
  }finally{await browser.close();}
 }
 // Capture the email-app handoff without launching an app or sending a message.
 const values={'First Name':'Test','Last Name':'Enquiry',Email:'test@example.com',Phone:'+27 82 123 4567',Address:'1 Example Road',Subject:'Glass & doors',Message:'Line one + two\nNext line'};
 let submit;const note={};const location={};
 const form={querySelector:s=>({value:values[s.match(/"([^"]+)"/)[1]]||''}),querySelectorAll:()=>[],reportValidity:()=>true,addEventListener:(type,fn)=>{if(type==='submit')submit=fn;}};
 vm.runInNewContext(fs.readFileSync('contact-form.js','utf8'),{document:{querySelector:()=>form,getElementById:()=>note},window:{location}});
 submit({preventDefault(){},submitter:{dataset:{sendVia:'email'}}});
 const outgoing=new URL(location.href);assert.equal(outgoing.pathname,'askjconstruction@gmail.com');assert.equal(outgoing.searchParams.get('subject'),values.Subject);assert(outgoing.searchParams.get('body').includes(values.Message));assert(outgoing.searchParams.get('body').includes(values.Phone));
 console.log('Email recipient, subject, phone and multiline encoding PASS (app launch mocked; no message sent)');
})().catch(e=>{console.error(e);process.exitCode=1;});
