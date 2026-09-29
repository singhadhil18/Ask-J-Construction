import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Use the locally installed auditing tools; no package download is required.
const modules = process.env.LIGHTHOUSE_MODULES || 'C:/Users/Adhil.Singh/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules';
const {default: lighthouse} = await import(pathToFileURL(path.join(modules, 'lighthouse/core/index.js')));
const launcher = await import(pathToFileURL(path.join(modules, 'chrome-launcher/dist/index.js')));
const pages = process.argv.slice(2);
const names = pages.length ? pages : ['index', 'about', 'services', 'projects', 'customer-testimonials', 'contact', 'service-areas-faq'];
const baseUrl = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');
const reportPrefix = process.env.AUDIT_BASE_URL ? 'live-' : '';
const reportSuffix = process.env.AUDIT_REPORT_SUFFIX || '';
await fs.mkdir('audits', {recursive: true});
const chrome = await launcher.launch({chromeFlags: ['--headless', '--disable-gpu']});
try {
  for (const name of names) {
    for (const mode of ['mobile', 'desktop']) {
      const flags = {port: chrome.port, logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']};
      if (mode === 'desktop') Object.assign(flags, {formFactor: 'desktop', screenEmulation: {mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false}, throttling: {rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0}});
      const result = await lighthouse(`${baseUrl}/${name === 'index' ? '' : name + '.html'}`, flags);
      await fs.writeFile(`audits/${reportPrefix}${name}-${mode}${reportSuffix}.json`, JSON.stringify(result.lhr));
      console.log(JSON.stringify({page: name, mode, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])), lcp:result.lhr.audits['largest-contentful-paint'].displayValue}));
    }
  }
} finally {
  try { await chrome.kill(); } catch (error) { console.warn('Audit reports saved; browser cleanup warning:', error.message); }
}
