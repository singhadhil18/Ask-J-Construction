# iOS quotation spacing and delivery optimization

29 September 2026. Local production preview: http://127.0.0.1:8001.
Deployed to https://askjconstruction.co.za on 29 September 2026 at 05:46 UTC
from main source b593d2d. See DEPLOYMENT.md for artifact and rollback details.

## Fix

The mobile flex layout forced every component to `width: auto; height: auto`.
Quotation SVGs have absolutely positioned artwork, so their parent boxes
collapsed to zero height. Depending on the browser, the artwork overflowed
over the following text or disappeared. Vector components now retain their
original dimensions and reserve space before the copy. The existing mobile
24px gap, quotation artwork, typography and colours are preserved.

## Performance changes

- Embed the two small shared stylesheets at their original cascade positions,
  removing two render-blocking requests. Their editable sources remain the
  CSS files; run `python inline_delivery_styles.py` after editing them.
- Generate smaller AVIF delivery copies of three large photographs. Keep the
  originals and WebP/JPEG fallbacks; no photograph or crop was replaced.
- Serve a smaller high-density mobile logo and a 3x-density footer image.
- Preload the first large image on the four image-led pages, after the viewport
  declaration so mobile devices select the correct source.
- Let three below-fold testimonial fonts load on demand instead of preloading
  them. Font families and glyphs are unchanged.

`python optimize_delivery_assets.py` regenerates the new delivery assets.
The site is static HTML; no JavaScript was added to implement these changes.

## Verification

Lighthouse 13.5.0 uses the existing mobile simulated-throttling and desktop
profiles against the compressed local production server. All seven routes
were audited in both profiles. Homepage, projects, testimonials and contact
also receive two confirmation runs; report the median rather than the best run.
Raw results and browser screenshots are saved under the ignored `audits/` folder.

| Page | Mobile performance | Desktop performance | Accessibility / Best Practices / SEO, both profiles |
| --- | ---: | ---: | --- |
| Home | 99 | 100 | 100 / 100 / 100 |
| About | 100 | 100 | 100 / 100 / 100 |
| Services | 100 | 100 | 100 / 100 / 100 |
| Projects | 100 | 100 | 100 / 100 / 100 |
| Testimonials | 99 | 100 | 100 / 100 / 100 |
| Contact | 100 | 100 | 100 / 100 / 100 |
| Service areas / FAQ | 100 | 100 | 100 / 100 / 100 |

The remaining mobile performance points come from simulated largest-contentful
paint timing (approximately 2.0s on Home and 1.8s on Testimonials), including
image/font delivery. These runs have zero layout shift and zero blocking time.
The target of 100 in every category was not fully reached. Further work would
need to preserve image quality and the requested typography; live hosting
latency is not represented by localhost results.

`node audit_quotation_layout.cjs` checks nonzero SVG dimensions, separation from
text and horizontal overflow at 320, 390, 430, 768, 1440 and 1920 CSS pixels
in Chromium and WebKit. It also checks doubled paragraph text on phones and
compares desktop geometry, fonts and colours with Git HEAD before committing.
All seven pages retain their original text content and local asset references.
The 44 layout cases passed on Chromium 153.0.8010.12 and WebKit 26.6.

The existing compatibility suite also checks all seven pages at 320, 375, 768
and 1440 pixels in both engines: overflow, broken images, page errors, sticky
header/footer separation and contact validation. WhatsApp launches are
intercepted; no messages are sent.

WebKit coverage is desktop emulation, not a physical iPhone or a particular
iOS release. Post-deployment live checks also passed in both engines. Live
Lighthouse measured all 100s on Home in both profiles; Testimonials measured
99 mobile Performance and 100 for its other categories and desktop profile.
These single live measurements are separate from the local medians above.
