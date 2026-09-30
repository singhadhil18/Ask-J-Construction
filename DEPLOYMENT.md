# ASKJ production hosting

## Current release - 30 September 2026, 07:31 UTC

- Live: https://askjconstruction.co.za/
- Source: `848fa033e9bba4627caa742e750e8762a4e17128`, pushed to `main`.
- Artifact: `c084c2e1a1cde9c93723d0a502b74b8883240f4b`, fast-forward on the existing hosting release branch.
- Web root: `/home/xesuzeeq/domains/askjconstruction.co.za/public_html`.
- Stage: `/home/xesuzeeq/domains/askjconstruction.co.za/stage-header-848fa03`.
- Receipt: `/home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json`.
- Recovery: removed on 30 September 2026 at the user's explicit request; the former path `/home/xesuzeeq/.trash/askj-20260930T073103Z` is no longer available.

### Hosting cleanup — 30 September 2026, 07:37 UTC

The user explicitly selected emptying the entire account Trash, including other
sites' rollback copies, plus deletion of the six older ASKJ staging releases.
Cleanup permanently removed 17,561 files totalling 1,051,886,159 bytes. The
provider's `files` and `info` Trash directories remain empty. All 13,631 live
ASKJ files and 396 current staging files were verified unchanged by SHA-256;
the current stage and release repository were preserved. Git release history
was not rewritten. The deployment receipt now marks rollback unavailable.
Cleanup receipt: `/home/xesuzeeq/domains/askjconstruction.co.za/cleanup-20260930T073750Z.json`.

### Release details

Desktop navigation now places the logo left, headings centrally and the quote
action right. Below 980px, the compact sticky ribbon contains the hamburger,
logo and quote action, with a left-side modal navigation drawer. Re-selecting
the current page's heading or homepage logo scrolls to the top over 1.1 seconds
without reloading. Reduced motion, keyboard dismissal, scroll preservation and
interruption are supported. Mobile Services has a separate expansion arrow.
The narrow-screen homepage title and estimate button retain 16px side padding.

All 396 artifact files matched the tested workspace and committed release
blobs by SHA-256, then matched the installed server files. Fifteen replaced
files (2,429,163 bytes) and the previous receipt were saved in recoverable Trash.
The existing 13,235 extra assets were retained for cached-page compatibility.
No confirmed obsolete files, exposed source files or temporary deployment files
were found in the live root. Nothing was purged; hosting configuration was
verified unchanged.

Live verification passed in Chromium 153.0.8010.12 and WebKit 26.6:

- Forty layout checks: all ten pages at 390px and 1440px in both engines.
- All seven same-page heading links on desktop/mobile: animation timing,
  final scroll position, no reload or Contact draft loss, logo behavior,
  interruption, reduced motion, other-page navigation and service disclosure.
- Nineteen public page/support/asset responses matched the artifact hashes.
- HTTPS, canonical redirects, protected paths and a real unknown-page 404.
- Desktop, mobile and expanded-drawer screenshots inspected.

Local verification is recorded in HEADER-REVIEW.md. No new Lighthouse runs were
performed for this deployment. Physical devices remain unverified. The
testimonial form remains a disclosed preview with no storage or transmission.
This documentation commit follows the deployed source; it does not change the
public artifact.

## Previous release - 29 September 2026, 13:06 UTC

- Live: https://askjconstruction.co.za/customer-testimonials.html
- Source: `298ff82485045f9cebce4b2b1eb1b63613cb4908`.
- Branch: `codex/2026-09-29-150123`; not merged to main.
- Artifact: `d3218110c620692e9a82a751c7c213314e7b4580`.
- Web root: `/home/xesuzeeq/domains/askjconstruction.co.za/public_html`.
- Stage: `/home/xesuzeeq/domains/askjconstruction.co.za/stage-20260929T130606Z`.
- Receipt: `/home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json`.
- Recovery: `/home/xesuzeeq/.trash/askj-20260929T130606Z`.

The testimonial form is an explicitly labelled interactive preview. It validates
required fields, supports mouse/touch/keyboard star selection and publication
consent, then closes into the thank-you panel. Reduced-motion preferences are
respected. No review is transmitted or stored, and reload resets the preview.
The form and confirmation both disclose this limitation. Existing page links
remain unchanged; the abandoned WhatsApp/Maps edits were not deployed.

All 396 deployed files matched SHA-256. Installed 13 changed/new files, with
12 replaced files (2,414,352 bytes) saved in recoverable Trash alongside the
previous receipt. Cached assets and unrelated files were preserved. Inventory
found no extra non-asset files or temporary deployment files to retire; no
obsolete files were removed and Trash was not emptied. Existing hosting
configuration was verified unchanged before installation.

Validation: 846 static references/metadata checks and 88 staged page/contact
checks passed in Chromium and WebKit at four widths. Eight testimonial scenarios
passed both locally and live: desktop/touch, normal/reduced motion, validation,
controls, closing animation, visible confirmation below the sticky header,
no network submission, no browser storage, and reset on reload. No enquiries
were sent. Desktop/mobile screenshots were inspected. Firefox could not launch
in the earlier session and remains unverified, as do physical devices.

All ten live pages, sitemap, robots and release receipt returned 200; canonical
redirects, private-path protection and unknown-page 404 handling passed.
Eighteen public page/support-file responses matched the tested artifact hashes.
No Lighthouse run was requested or performed for this interaction-only release.



## Previous release - 29 September 2026, 12:36 UTC

- Live: https://askjconstruction.co.za/
- Source: `2c968334adc3b410c0b50f011264b5981ecf7b7d`.
- Branch: `codex/2026-09-29-143041`; not merged to main.
- Artifact: `98a2585f62e83bb7f22e740fe4a2afbc6d08931a`.
- Web root: `/home/xesuzeeq/domains/askjconstruction.co.za/public_html`.
- Stage: `/home/xesuzeeq/domains/askjconstruction.co.za/stage-20260929T123656Z`.
- Receipt: `/home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json`.
- Recovery: `/home/xesuzeeq/.trash/askj-20260929T123656Z`.

Grey navigation hover boxes, the centre-out quote underline, and charcoal
service tile feedback are deployed. Navigation script cache version refreshed.
All 395 installed artifact files matched SHA-256. Replaced 21 files, preserving
2,396,245 bytes of prior files plus the previous receipt in recoverable Trash.
The 13,235 extra files were all assets retained for cached pages. No temporary
deployment files were found and no obsolete files removed. Trash was not emptied.
Hosting configuration was checked for equivalent content before replacement.

The staged build passed 88 Chromium/WebKit page and contact checks at four
viewport widths, and 845 static-reference/metadata checks. Local and live tile,
navigation, quote underline, keyboard, reduced-motion and touch checks passed.
Desktop and mobile screenshots were inspected. No enquiries were sent.
Firefox could not launch using either installed build; Firefox and physical
phones remain unverified. Lighthouse was not requested or run.

All ten live pages, sitemap, robots and release receipt returned HTTP 200.
Canonical redirects, protected paths and unknown-page 404 handling passed.
Seventeen public page/support-file responses matched the tested artifact hashes.



## Previous release — 29 September 2026, 08:52 UTC



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

