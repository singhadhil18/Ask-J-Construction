const fs=require('node:fs');
const {webkit,devices}=require('./.qa-tools/node_modules/playwright');
(async()=>{const browser=await webkit.launch({headless:true});const results=[];try{
for(const device of ['iPhone 13','iPhone 13 landscape','iPad Mini','iPad Mini landscape']){
 const context=await browser.newContext(devices[device]);const page=await context.newPage();
 for(const name of ['index','about','services','projects','customer-testimonials','contact','service-areas-faq']){
 await page.goto('http://127.0.0.1:8000/'+name+'.html',{waitUntil:'networkidle'});
 const s=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,ua:navigator.userAgent,touch:navigator.maxTouchPoints}));
 if(s.scrollWidth>s.width+1)throw Error(device+' '+name+' horizontal overflow');
 results.push({device,page:name,...s,passed:true});
 }
 await context.close();console.log(device+': seven pages passed');
}
fs.writeFileSync('audits/apple-device-emulation.json',JSON.stringify(results,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
