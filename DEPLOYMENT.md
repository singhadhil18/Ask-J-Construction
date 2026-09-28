# ASKJ production hosting

Verified 29 September 2026 (South African time).

- Canonical site: https://askjconstruction.co.za/
- Registrar: Frikkadel. Public delegation uses ns1.server1.webhostmost.com, ns2.server2.webhostmost.com, ns3.server3.webhostmost.com and ns4.server4.webhostmost.com. Root and www resolve to 66.78.41.25.
- Host: WebHostMost server5; account xesuzeeq; SSH port 2323 using the existing pinned host key and local identity. No credentials belong in this repository.
- Web root: /home/xesuzeeq/domains/askjconstruction.co.za/public_html. private_html points to public_html.
- Deployed source: 4e9f8c9 (favicon update).
- Artifact commit: 7237f88baa56c92a39cfdc36618bf9dde18409f2.
- Separate release repository: /home/xesuzeeq/domains/askjconstruction.co.za/askj-release.git, branch release.
- Receipt: /home/xesuzeeq/domains/askjconstruction.co.za/last-deployment.json.
- Recoverable backup: /home/xesuzeeq/.trash/askj-20260928T222755Z. Do not restore development files to the public folder.

## Production checks

All seven pages, robots.txt, sitemap.xml and release.json return 200. Sitemap and canonical metadata use the .co.za origin. HTTP, www and index.html redirect to the canonical origin; known extensionless routes redirect to their .html equivalents. A genuinely unknown route returns 404. Git/test directories are denied; development reports are no longer public. Existing cached assets are retained for compatibility.

HTML is gzip compressed (homepage approximately 190 KB to 30 KB). Fingerprinted images use one-year immutable caching; HTML/CSS/JS revalidate. AVIF/WebP MIME types are correct. HTTP/2 is confirmed; the server advertises HTTP/3. Let's Encrypt certificate covers the root and wildcard subdomains, valid through 27 December 2026. Renewal automation has not been independently inspected.

Google Search Console accepted https://askjconstruction.co.za/sitemap.xml with Success and 7 discovered pages. Discovery does not guarantee indexing or ranking. Evidence is in local audits/sitemap-success.png.

Live Lighthouse: homepage mobile/desktop performance 99/99; contact 99/100. Both pages score 100 accessibility, best practices and SEO on both device profiles. These are live lab measurements, separate from localhost reports.

Live Chromium verification passed 32 checks: all seven pages at 320, 375, 768 and 1440 pixels, plus four contact-validation checks with outgoing messages intercepted. No horizontal overflow, broken images, header/footer overlap or page JavaScript errors were detected.

## Safe updates

Do not upload the project folder wholesale. build_release.py creates a production-only .release-stage from HTML, styles, contact script and referenced assets. Existing staging is intentionally not overwritten. For later releases, reuse release repository history and push fast-forward; do not recreate the release branch. Include release.json with source revision, stage the exact artifact commit outside public_html, retain a rollback receipt, and preserve unrelated verification files and .well-known.

Run live audits with AUDIT_BASE_URL=https://askjconstruction.co.za using audit_lighthouse.mjs or audit_compatibility.cjs; live reports are separate. audit_hosting.py verifies routes and protected files.

## Outstanding account checks

The user confirmed the domain was purchased through a friend’s registrar account; expiry and renewal settings must be verified there. Public nameserver delegation is verified. No email DNS records were changed. The previous .com Wix domain is separate and was not redirected or modified.

## Favicon verification

Restored the original Wix square favicon variants at assets/favicon-192.jpg, favicon-32.jpg and favicon-180.jpg. All seven pages declare correct JPEG MIME types and square dimensions. Live files return 200 and are allowed by robots.txt for Googlebot-Image. Google Search display still depends on recrawl and selection. No logo artwork was redesigned.
