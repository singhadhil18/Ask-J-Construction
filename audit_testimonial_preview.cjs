const assert = require('node:assert/strict');
const {chromium, webkit} = require('./.qa-tools/node_modules/playwright-core');
(async () => {
  for (const [engine,type] of Object.entries({chromium,webkit})) {
    const browser = await type.launch();
    try {
      for (const touch of [false,true]) {
        for (const reduced of [false,true]) {
          const page = await browser.newPage({viewport:{width:touch?390:1440,height:900},hasTouch:touch,isMobile:touch,reducedMotion:reduced?'reduce':'no-preference'});
          const errors=[]; page.on('pageerror', e=>errors.push(e.message));
          await page.goto((process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8005').replace(/\/$/, '') + '/customer-testimonials.html');
          await page.evaluate(()=>document.fonts.ready);
          const form=page.locator('#testimonial-form');
          const pane=page.locator('.testimonial-pane');
          const button=form.getByRole('button',{name:'Submit',exact:true});
          assert(await button.isEnabled());
          await button.click();
          assert(await form.isVisible());
          assert(await form.locator('input[name=first_name]').evaluate(e=>!e.validity.valid));
          await form.locator('[name=first_name]').fill('Preview');
          await form.locator('[name=last_name]').fill('Tester');
          await form.locator('[name=email]').fill('preview@example.com');
          await form.locator('[name=testimonial]').fill('The form is clear and easy to use. Preview only.');
          const rating=form.getByRole('radio',{name:'4 stars',exact:true});
          if(touch)await rating.tap();else await rating.check();
          assert(await rating.isChecked());
          assert.equal(await form.locator('.review-star.is-selected').count(),4);
          const checkbox=form.getByRole('checkbox');await checkbox.check();assert(await checkbox.isChecked());
          if(!touch){await rating.focus();await page.keyboard.press('ArrowRight');assert(await form.getByRole('radio',{name:'5 stars'}).isChecked());}
          await pane.scrollIntoViewIfNeeded();
          if(!reduced)await pane.screenshot({path:`audits/${engine}-${touch?'mobile':'desktop'}-review-form.png`});
          const before=await pane.boundingBox();
          const requests=[];page.on('request',r=>{if(['fetch','xhr'].includes(r.resourceType())||r.method()==='POST')requests.push(r.url());});
          await page.evaluate(()=>{window.__animations=0;const original=Element.prototype.animate;Element.prototype.animate=function(...args){window.__animations++;return original.apply(this,args);};});
          if(touch)await button.tap();else await button.click();
          await page.locator('.review-success').waitFor({state:'visible'});
          await page.waitForFunction(()=>document.activeElement?.classList.contains('review-success'));
          assert(await form.isHidden());
          assert.equal(await page.locator('.review-success h2').textContent(),'Review Submitted Successfully');
          await page.waitForTimeout(650);
          assert(await page.locator('.review-success').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('#SITE_HEADER').getBoundingClientRect().bottom),'Confirmation covered by sticky header');
          assert((await pane.boundingBox()).height<before.height/2);
          assert.equal(await page.evaluate(()=>window.__animations),reduced?0:3);
          assert.equal(requests.length,0,'No review data may be transmitted');
          assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0,'No review data may be stored');
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
          assert.equal(errors.length,0,errors.join('\n'));
          await page.screenshot({path:`audits/${engine}-${touch?'mobile':'desktop'}-review-success.png`});
          await page.reload();
          assert.equal(await form.locator('[name=testimonial]').inputValue(),'');
          console.log(engine,touch?'touch':'desktop',reduced?'reduced motion':'animated','validation, controls, close, no persistence PASS');
          await page.close();
        }
      }
    } finally {await browser.close();}
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
