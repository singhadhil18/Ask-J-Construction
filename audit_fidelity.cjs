const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('./.qa-tools/node_modules/playwright-core');
const root=process.cwd();
const server=http.createServer((req,res)=>{
  const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
  const saved=path.resolve(root,'audits/baseline-pages',requested);
  const asset=path.resolve(root,requested);
  if(!asset.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  const file=fs.existsSync(saved)?saved:asset;
  const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
  if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(8002,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  const checks=[];
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const name of ['index','about','services','projects','customer-testimonials','contact','service-areas-faq']){
      const states=[];
      for(const port of [8002,8001]){
        await page.goto(`http://127.0.0.1:${port}/${name}.html`,{waitUntil:'networkidle'});
        await page.evaluate(()=>document.fonts.ready);
        states.push(await page.evaluate(()=>Array.from(document.querySelectorAll('#SITE_HEADER,.wixui-rich-text,.header-logo,.header-quote')).map(e=>{
          const b=e.getBoundingClientRect(),s=getComputedStyle(e);
          return {key:e.id||e.className,text:e.textContent.trim(),x:b.x,y:b.y,w:b.width,h:b.height,font:s.font,color:s.color};
        })));
      }
      const differences=[];
      states[0].forEach((before,i)=>{
        const after=states[1][i];
        if(!after||before.key!==after.key){differences.push({key:before.key,reason:'element mismatch'});return;}
        if(['x','y','w','h'].some(k=>Math.abs(before[k]-after[k])>2)||before.font!==after.font||before.color!==after.color)
          differences.push({key:before.key,before,after});
      });
      checks.push({page:name,checked:states[0].length,differences});
      console.log(name, 'desktop differences:',differences.length);
    }
    fs.writeFileSync('audits/desktop-fidelity.json',JSON.stringify(checks,null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
