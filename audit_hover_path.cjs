const {chromium, webkit} = require('./.qa-tools/node_modules/playwright-core');
const assert = require('node:assert/strict');
(async () => {
  for (const [engine, type] of Object.entries({chromium, webkit})) {
    const browser = await type.launch();
    try {
      for (const width of [320, 390, 905, 1440]) {
        const page = await browser.newPage({viewport: {width, height: 900}});
        await page.goto('http://127.0.0.1:8003/about.html');
        const trigger = page.locator('.services-trigger a');
        const menu = page.locator('#services-submenu');
        for (const item of await page.locator('.recovered-nav > a').all()) {
          await trigger.hover();
          assert(await menu.isVisible());
          await item.hover();
          assert.equal(await menu.isVisible(), false, 'Another navigation item must close Services');
          assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
        }
        await page.mouse.move(1, 1);
        await trigger.focus();
        await page.locator('.recovered-nav > a').last().hover();
        assert.equal(await menu.isVisible(), false, 'Hover must close even when Services retains keyboard focus');
        await trigger.hover();
        if (width >= 905) {
          const first = await menu.locator('a').first().boundingBox();
          const heading = await trigger.boundingBox();
          await page.mouse.move(heading.x + heading.width / 2, first.y + first.height / 2, {steps: 20});
          await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2, {steps: 20});
        } else {
          // Wrapped rows contain other headings: crossing one intentionally closes.
          // Moving directly into the submenu still keeps it open.
          await menu.locator('a').first().hover();
        }
        assert(await menu.isVisible(), 'Entering the submenu must keep it open');
        await menu.locator('a').last().hover();
        assert(await menu.isVisible());
        if (engine === 'chromium' && [905, 1440].includes(width)) {
          await page.screenshot({path: 'audits/services-hover-' + width + '.png'});
        }
        await page.close();
        console.log(engine, width, 'hover switching and submenu access PASS');
      }
    } finally { await browser.close(); }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

