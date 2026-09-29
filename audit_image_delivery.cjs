const {chromium}=require('./.qa-tools/node_modules/playwright-core');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:8003';
const pages=['index','about','services','projects','customer-testimonials','contact','service-areas-faq','luxury-home-builds','home-renovations','frameless-showers'];
const capture=process.argv.includes('--capture');
(async()=>{
 const browser=await chromium.launch();const rows=[];
 const inventory=capture?[]:JSON.parse(fs.readFileSync('audits/image-delivery.json'));
 try {
  for(const width of [320,390,768,1440,1920]) {
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:2});
   for(const name of pages) {
    const requests=[];const listener=req=>{if(req.frame().url()===`${base}/${name}.html`)requests.push(req.url());};page.on('request',listener);
    await page.goto(`${base}/${name}.html`);await page.evaluate(()=>document.fonts.ready);
    if(!capture) {
     await page.evaluate(async()=>{
      for(let y=0;y<document.documentElement.scrollHeight;y+=650) {
       scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
       await Promise.all([...document.images].filter(i=>{const b=i.getBoundingClientRect();return b.bottom>0&&b.top<innerHeight}).map(i=>i.decode().catch(()=>{})));
      }
     });
    }
    if(!capture) await page.waitForFunction(() => [...document.querySelectorAll('main img')].filter(e=>e.getBoundingClientRect().width>0).every(e=>e.complete&&e.naturalWidth>0), null, {timeout:15000});
    const images=await page.locator('main img').evaluateAll((es,args)=>es.map(e=>({page:args.name,viewport:args.width,id:e.id,src:e.getAttribute('src'),selected:e.currentSrc,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,fit:getComputedStyle(e).objectFit,background:!!e.closest('wow-image'),loaded:e.complete&&e.naturalWidth>0})),{name,width});
    for(const image of images) {
     const source=inventory.find(r=>r.page===name+'.html'&&r.original===image.src);
     if(source&&!capture) {
      assert(image.loaded,`Broken image ${image.src}`);
      const selected=Number(image.selected.match(/-sharp-(\d+)\./)?.[1]);
      const displayed=image.fit==='cover'?Math.max(image.width,image.height*source.originalWidth/source.originalHeight):image.width;
      image.required=Math.min(source.originalWidth,Math.ceil(displayed*2));image.selectedWidth=selected;
      image.originalLimited=displayed*2>source.originalWidth;
      assert(selected>=image.required-2,`${name} ${width} ${image.src}: ${selected} < ${image.required}`);
     }
    }
    // A hero preload must not fetch a second size of the same image.
    const eagerImages=page.locator('main img[loading="eager"]');
    const eager=await eagerImages.count()?await eagerImages.first().getAttribute('src'):null;
    if(eager&&!capture) {
     const stem=eager.match(/([a-f0-9]{20})\./)?.[1];
     if(stem) {
      // Chromium can reuse a larger cached source after a responsive preload.
      // Only positive transfers represent another network download.
      const downloads=await page.evaluate(stem=>performance.getEntriesByType('resource').filter(r=>r.name.includes(stem+'-sharp-')&&r.transferSize>0).map(r=>r.name),stem);
      assert(new Set(downloads).size<=1,`${name}: duplicate hero downloads: ${downloads.join(', ')}`);
     }
    }
    rows.push(...images);page.off('request',listener);
   }
   await page.close();console.log(width,'image selections PASS');
  }
 } finally {await browser.close();}
 fs.writeFileSync(capture?'audits/image-before.json':'audits/image-after.json',JSON.stringify(rows,null,2));
 console.log(rows.length,'image placements checked');
})().catch(e=>{console.error(e);process.exitCode=1;});
