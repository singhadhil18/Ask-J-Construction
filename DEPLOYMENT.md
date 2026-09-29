# ASKJ production hosting

## Current release — 29 September 2026, 08:52 UTC

- Live URL: https://askjconstruction.co.za/
- Source merged and pushed to main: `f794341a74a5ec87732543d511e043b971014ac8`.
- Built-site artifact: `2f3a5599da22f75f8aa281f7fef322e6b730ffc5`.
- Web root: `/home/xesuzeeq/domains/askjconstruction.co.za/public_html`.
- Stage: `/home/xesuzeeq/domains/askjconstruction.co.za/stage-20260929T085230Z`.
- Receipt: `/home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json`.
- NEW recovery folder: `/home/xesuzeeq/.trash/askj-20260929T085230Z`.
  Contains 12 replaced files, 1,890,322 bytes plus receipt. The earlier deleted
  rollback folders are still unavailable. No old recovery folder was restored.
- Verified all 545 production artifact files by SHA-256 after installation;
  283 changed/new files installed. Existing cached assets retained deliberately.
  No unrelated files, verification files, domain configuration or .well-known
  were removed. No confirmed obsolete source files remained in this web root.

All ten pages, sitemap, robots and release receipt return HTTP 200. New service
extensionless routes redirect correctly. Canonical HTTP/www/index redirects
work; unknown paths return 404, repository/audit paths remain denied. AVIF
images have the right MIME type and one-year immutable caching. Versioned
navigation JavaScript revalidates. Homepage service cards link to their pages.

Live browser validation: 88 page/contact checks in Chromium and WebKit,
plus 28 actual service-link navigations with mouse and touch. No enquiries sent.
The three portrait photographs and centred text were visually checked live.

Live Lighthouse (single runs):

| Page | Mobile Performance | Desktop Performance | Accessibility / Best Practices / SEO |
| --- | ---: | ---: | --- |
| Home | 99 | 100 | 100 / 100 / 100 |
| Services | 97 | 100 | 100 / 100 / 100 |
| FAQs | 100 | 100 | 100 / 100 / 100 |
| Luxury home builds | 98 | 100 | 100 / 100 / 100 |
| Home renovations | 98 | 100 | 100 / 100 / 100 |
| Frameless showers | 100 | 100 | 100 / 100 / 100 |

Homepage live LCP: 1.9s mobile, 0.6s desktop. Raw live reports use suffix
`-release-current` under ignored audits/. Physical phone testing is unverified.

Google Search Console: verified domain property accessible in browser. Updated
sitemap submitted successfully, status Success, **10 discovered pages**.
All ten sitemap entries have accurate modification dates and canonical URLs.
Google accepted individual indexing requests for luxury-home-builds.html,
home-renovations.html and frameless-showers.html after live URL checks. All
three were added to the priority crawl queue. Before submission they were
reported as unknown/not indexed. Discovery and indexing requests are not a
guarantee of indexing or ranking.

### Homepage indexing qualification

Google's historical crawl dated 28 September 2026 still classified the homepage
as an alternative page with canonical https://www.askjconstruction.com/.
A fresh Search Console live test on 29 September at 10:59 SAST confirmed
successful smartphone fetching, crawl/indexing allowed, "Page can be indexed",
and user-declared canonical https://askjconstruction.co.za/. All ten live
pages independently passed self-canonical/no-noindex checks. The historical
index record has not yet updated; do not claim the homepage is already indexed.
Google accepted the homepage indexing request and added it to the priority
crawl queue after the successful live test.

## Previous release records (historical, superseded above)


Verified 29 September 2026 (South African time).

- Canonical site: https://askjconstruction.co.za/
- Registrar: Frikkadel. Public delegation uses ns1.server1.webhostmost.com, ns2.server2.webhostmost.com, ns3.server3.webhostmost.com and ns4.server4.webhostmost.com. Root and www resolve to 66.78.41.25.
- Host: WebHostMost server5; account xesuzeeq; SSH port 2323 using the existing pinned host key and local identity. No credentials belong in this repository.
- Web root: /home/xesuzeeq/domains/askjconstruction.co.za/public_html. private_html points to public_html.
- Deployed source: b593d2d9ceca38d50dbb2611a886cb5a2a8277b8 (iOS quotation fix and static delivery optimization), merged and pushed to main.
- Artifact commit: 351ffcc56c17d4850a1f8f8c26130f83d7807b31.
- Separate release repository: /home/xesuzeeq/domains/askjconstruction.co.za/askj-release.git, branch release.
- Receipt: /home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json.
- Rollback status: all three ASKJ Trash rollback folders were permanently deleted on 29 September 2026 at the user's request. The previous receipt's rollback path is historical and no longer available. Staging folders and release Git history remain; they are not a verified file-for-file rollback of the hosting account.
- Server staging: /home/xesuzeeq/domains/askjconstruction.co.za/stage-20260929T054640Z. All 274 installed production files matched the staged artifact by SHA-256; 9 replaced files were saved and 20 changed/new files installed. Older cached assets were retained.

## Production checks

All seven pages, robots.txt, sitemap.xml and release.json return 200. Sitemap and canonical metadata use the .co.za origin. HTTP, www and index.html redirect to the canonical origin; known extensionless routes redirect to their .html equivalents. A genuinely unknown route returns 404. Git/test directories are denied; development reports are no longer public. Existing cached assets are retained for compatibility.

HTML is gzip compressed (homepage approximately 190 KB to 30 KB). Fingerprinted images use one-year immutable caching; HTML/CSS/JS revalidate. AVIF/WebP MIME types are correct. HTTP/2 is confirmed; the server advertises HTTP/3. Let's Encrypt certificate covers the root and wildcard subdomains, valid through 27 December 2026. Renewal automation has not been independently inspected.

Google Search Console accepted https://askjconstruction.co.za/sitemap.xml with Success and 7 discovered pages. Discovery does not guarantee indexing or ranking. Evidence is in local audits/sitemap-success.png.

Post-deployment Lighthouse 13.5.0: homepage mobile/desktop 100 in all four categories; testimonials mobile performance 99 and desktop performance 100, with 100 accessibility, best practices and SEO on both profiles. These are single live lab runs, separate from the localhost medians in IOS-QUOTATION-REPORT.md.

The live quotation fix passed in WebKit 26.6 and Chromium 153 at 390 and 1440 pixels on Home and Testimonials: all 11 SVGs have nonzero height, phone text has at least 24px separation, and neither page overflows horizontally. Physical iPhone testing remains unverified.

Live Chromium verification passed 32 checks: all seven pages at 320, 375, 768 and 1440 pixels, plus four contact-validation checks with outgoing messages intercepted. No horizontal overflow, broken images, header/footer overlap or page JavaScript errors were detected.

## Safe updates

Do not upload the project folder wholesale. build_release.py creates a production-only .release-stage from HTML, styles, contact script and referenced assets. Existing staging is intentionally not overwritten. For later releases, reuse release repository history and push fast-forward; do not recreate the release branch. Include release.json with source revision, stage the exact artifact commit outside public_html, retain a rollback receipt, and preserve unrelated verification files and .well-known.

Run live audits with AUDIT_BASE_URL=https://askjconstruction.co.za using audit_lighthouse.mjs or audit_compatibility.cjs; live reports are separate. audit_hosting.py verifies routes and protected files.

## Outstanding account checks

The user confirmed the domain was purchased through a friendâ€™s registrar account; expiry and renewal settings must be verified there. Public nameserver delegation is verified. No email DNS records were changed. The previous .com Wix domain is separate and was not redirected or modified.

## Favicon verification

Restored the original Wix square favicon variants at assets/favicon-192.jpg, favicon-32.jpg and favicon-180.jpg. All seven pages declare correct JPEG MIME types and square dimensions. Live files return 200 and are allowed by robots.txt for Googlebot-Image. Google Search display still depends on recrawl and selection. No logo artwork was redesigned.
