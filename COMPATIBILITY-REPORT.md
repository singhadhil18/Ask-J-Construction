# Compatibility and Lighthouse verification

Measured locally on 28 September 2026 using the compressed, cache-enabled preview at http://127.0.0.1:8001/. These are lab scores, not live-site field data.

## Lighthouse results

| Page | Mobile performance | Desktop performance | Accessibility (both) | Best practices (both) | SEO (both) |
|---|---:|---:|---:|---:|---:|
| index | 96 | 100 | 100 | 100 | 100 |
| about | 98 | 100 | 100 | 100 | 100 |
| services | 98 | 100 | 100 | 100 | 100 |
| projects | 99 | 100 | 100 | 100 | 100 |
| customer-testimonials | 97 | 100 | 100 | 100 | 100 |
| contact | 99 | 100 | 100 | 100 | 100 |
| service-areas-faq | 100 | 100 | 100 | 100 | 100 |

Home mobile baseline: 74 performance, 100 accessibility, 81 best practices, 100 SEO; largest contentful paint was 40.3 seconds. Final measured home mobile LCP: 2.9 seconds. All desktop pages scored 100 in all four categories. Mobile performance is 96–100; retaining the current imagery and visual quality takes priority over chasing a single-run perfect score. Scores vary with machine load and network simulation.

## Changes

- Local font files replace insecure remote font requests; preload the fonts actually used.
- Responsive high-quality AVIF and WebP image variants, with original artwork and original-format fallbacks. Logo and favicon artwork remain unchanged.
- Prioritize the first content image and defer off-screen images.
- Compression, cache and MIME-safety headers, with Apache deployment rules in `.htaccess` and an equivalent local preview in `serve_site.py`.
- Small-screen-only layout: stacked columns, constrained backgrounds, proportionate logos, wrapping navigation, readable headings and 16px form fields to avoid iOS focus zoom.
- Corrected two broken retina-image URLs on Projects and semantic heading order on Projects and Testimonials.
- Fixed the FAQ footer link overflowing into footer logos.
- Added form autocomplete metadata and a valid telephone input type.

## Design preservation

The baseline archive is `compatibility-baseline.zip`. `audits/desktop-fidelity.json` compares desktop text/header geometry, fonts and colours against those saved pages. All seven pages reported zero differences in those checks. This is not a claim of bit-for-bit image equivalence: photographic assets are delivered in optimized formats. Mobile layout changes were separately authorized; desktop design was retained.

## Browser coverage and limits

96 checks passed (84 page/viewport checks plus 12 intercepted contact-form checks). Chromium, Microsoft Edge and WebKit are checked at 320, 375, 768 and 1440 CSS pixels. Checks include no horizontal overflow, six navigation links, sticky-header position, decoded images, footer separation and client-side error monitoring. Contact form tests intercept outgoing actions: required-field validation, recipient and encoded message content are checked without sending a message.

WebKit is a Safari-engine compatibility test on Windows, not a physical iPhone or installed Apple Safari test. The user tested the preview on an Apple mobile device and reported that it looks good, with one header-size inconsistency during navigation. Device model, OS version and individual app-handoff results were not supplied.

An additional 28 WebKit layout checks passed across all seven pages using iPhone 13 and iPad Mini portrait and landscape presets (`audits/apple-device-emulation.json`). These checks verify viewport overflow only, not native touch or application handoff behavior. The native simulator tool is unavailable on this Windows host (`xcrun ENOENT`).

A website-only LAN preview is available while the local server runs at `http://192.168.0.66:8003/` for the user's physical iPhone/iPad check on the same Wi-Fi. Public pages and an original logo asset returned HTTP 200; internal reports, audit directories and the server script returned HTTP 404. The server now accepts an explicit bind address and restricts access to public site files. No page, stylesheet or contact script changed after the full audit; the separate `audits/lan-preview-tested-files.json` records this server-only revision. The reported header inconsistency was subsequently addressed by disabling Safari text inflation inside the header and reserving the original logo aspect ratio before image loading. Confirmation of that specific fix on the physical device remains pending.

Firefox could not launch. Both Firefox 155 (Playwright 1.63) and Firefox 153 (Playwright 1.62) fail before opening a page with Windows SideBySide reporting the mozglue assembly unresolved. This is an unverified browser, not a passing check. Test-installation repair was attempted without changing browser binaries or system security settings.

The contact form opens the visitor's email or WhatsApp application; actual delivery still requires the visitor to send. The inherited testimonial submission remains a separate static-recovery limitation, not a live backend.

## Reproduce

- Start production-like preview: `python serve_site.py --port 8001`.
- Regenerate image delivery and local font references: `python optimize_static.py` (requires Pillow with WebP and AVIF support).
- `node audit_lighthouse.mjs` writes mobile and desktop JSON reports for all seven pages. The installed Lighthouse path can be set with `LIGHTHOUSE_MODULES`.
- `node audit_compatibility.cjs chromium edge webkit` uses the local `.qa-tools` Playwright package. The optional Firefox path uses `.qa-firefox`.
- `node audit_fidelity.cjs` compares the saved baseline pages and current site.

Run SEO generation before optimization if regenerating content. Do not rerun the original recovery/finalization scripts without reapplying functional and compatibility changes. The original preview on port 8000 has also been switched to serve_site.py, so both 8000 and 8001 now apply the same verified compression/cache headers.

## Deployment

No deployment was performed. Enable HTTPS on the actual host and apply equivalent compression/cache headers if it is not Apache. Do not publish the audit archives, test runtimes, scripts or reports as public site content. The site's static contact handoff script and mobile stylesheets must be included.

## Header consistency follow-up

After the physical-device feedback, 70 checks passed across seven pages, five viewport widths (320, 390, 768, 844 and 1440), and Chromium/WebKit with the logo download blocked. Each page retained identical header height at each width with no horizontal overflow. All seven desktop fidelity comparisons still report zero differences. A focused homepage Lighthouse rerun after the shared-header change returned mobile 96/100/100/100 and desktop 100/100/100/100. Other page scores above are from the preceding full audit. Header verification is recorded in `audits/header-uniformity.json`.

## Direct-file header correction

The user clarified that the issue occurs when opening index.html directly. The shared desktop header now has an explicit 198px border-box height and 165px logo row, preserving the 259x165 logo. Mobile uses explicit proportional logo rows and content-sized navigation. Stylesheet URLs are versioned to avoid stale cached styling. A new navigation audit clicks all six header destinations, including the quote action, at five widths in Chromium and WebKit over both file URLs and HTTP: all 120 transitions retained a uniform height. Results: `audits/header-navigation.json`; reproduce with `node audit_header_navigation.cjs`. This supersedes the earlier claim that automatic sizing alone resolved the issue.
