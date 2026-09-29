# FAQ, services and image clarity review

29 September 2026. Review branch: `codex/2026-09-29-faq-services-images`.
Local preview: http://127.0.0.1:8003. This update is not merged or deployed.

## What changed

- FAQs now appears immediately before Contact in the header on all ten pages.
- Services uses one text link with no arrow or duplicate button. Mouse browsers
  open the submenu on hover at every width; clicking Services follows the
  overview link. Keyboard focus/ArrowDown also open it. Touch-only devices tap
  the same text, then choose a service or See all services. Escape and outside
  clicks dismiss it. Links remain available without JS. The shared script has
  a content-derived version so cached older logic cannot mismatch new markup.
- New pages cover luxury home builds, home renovations and additions, and
  frameless showers and maintenance. Each has its own metadata, breadcrumb,
  service scope, process, relevant existing photograph, local coverage, FAQs
  and quotation links. The Services overview links to all three pages.
- The main FAQ has 13 answers in four groups; each new service page has three
  focused answers. All FAQ copy was edited with the user-requested Unslop skill.
  No prices, completion promises, warranty terms or new registration claims
  were invented. Obsolete FAQPage markup was replaced with accurate WebPage
  metadata; new service pages include Service and BreadcrumbList metadata.
- The footer uses Meta's unchanged official black WhatsApp glyph beside the
  existing socials, linked to +27 78 568 0809. All icons have 44px link targets.
- 33 original photographs now have high-quality responsive AVIF/WebP copies.
  Source selection accounts for tall cover crops. The homepage on a 390px
  high-density viewport now selects the 1536px source instead of 960px.
  Original photographs, old cached assets, typography, colours and crops remain.
- New routes are in the sitemap, preview-server allowlist and hosting redirects.
  Navigation, FAQ content and service pages have repeatable maintenance helpers.
- Deployment notes now record that the user deleted all ASKJ Trash rollbacks.

## Validation

- 180 layout/navigation cases: all ten pages at 320, 390, 430, 768, 905, 979, 980, 1440 and
  1920 CSS pixels, in Chromium 153.0.8010.12 and WebKit 26.6.
- Additional interaction coverage: hover, keyboard focus, Enter, Escape,
  outside click, repeated phone taps, following submenu links, 844x390
  landscape, doubled text and JavaScript disabled.
- 132 compatibility cases: all ten pages in Chromium, WebKit and Edge at four widths,
  plus contact validation. Outgoing contact launches were intercepted.
- 225 image placements checked at DPR 2. Source sizes meet the displayed
  requirement up to original resolution. No duplicate hero network downloads.
- All internal links and fragments resolve. Referenced assets exist; metadata
  is unique and JSON-LD parses. Quote icons remain separated from text.
- Visual previews and the original/previous/new image crop comparison are in
  ignored `audits/`. Raw Lighthouse reports are stored there separately.

### Local Lighthouse 13.5.0

| Page | Mobile Performance | Desktop Performance | Accessibility / Best Practices / SEO |
| --- | ---: | ---: | --- |
| Home | 96 | 100 | 100 / 100 / 100 |
| Services | 100 | 100 | 100 / 100 / 100 |
| FAQs | 100 | 100 | 100 / 100 / 100 |
| Luxury home builds | 100 | 100 | 100 / 100 / 100 |
| Home renovations | 100 | 100 | 100 / 100 / 100 |
| Frameless showers | 100 | 100 | 100 / 100 / 100 |

These are single-run measurements from the full ten-page follow-up audit.
A final homepage recheck after the pointer-path correction scored 91 mobile
Performance (3.5s LCP), versus 96 (2.7s LCP) in the earlier run. Accessibility,
Best Practices and SEO remained 100. Performance varies between local runs;
sharper images are retained. These are local lab results, not live-site scores
or a ranking guarantee.

## Maintenance

Run these from the repository root in order when rebuilding the content:

```text
python build_service_content.py
python sync_site_chrome.py
python inline_delivery_styles.py
node audit_image_delivery.cjs --capture
python restore_image_clarity.py
```

The image capture needs the current preview running on port 8003. Set
`AUDIT_BASE_URL` to override it. The older `optimize_static.py` and
`optimize_delivery_assets.py` scripts describe earlier recovery work; do not
run them over this release because they would replace the restored delivery.
New content should use `build_service_content.py`, with shared header/footer
updates in `sync_site_chrome.py` and shared styles in `site-updates.css`.

For checks, run `audit_site_update.cjs`, `audit_image_delivery.cjs`, and
`audit_compatibility.cjs chromium webkit`. Set `AUDIT_BASE_URL` to the preview
for compatibility/Lighthouse. The production builder includes the new routes
and assets automatically through its reference manifest.

## Remaining limits and improvements

- Recovered 1536x1024 originals limit the detail available in tall portrait
  crops and high-density displays. We did not fabricate detail by upscaling.
  Higher-resolution camera originals would improve these placements further.
- The three checked Wix originals matched the local files byte-for-byte.
  Direct access to the old .com site was unavailable during planning.
- Windows WebKit's renderer crashed during an automated navigation followed
  by viewport resize. Navigation and fixed portrait/landscape profiles passed
  separately using fresh contexts. Physical iPhone rotation remains unverified.
- Existing membership logos and older About-page compliance claims were not
  independently verified. Confirm current registrations, memberships and
  project-specific inspection arrangements before expanding those claims.
- Verified project locations, scope and completion evidence would support
  stronger case studies. New service imagery is not labelled as proof of a
  named client project. Google Business Profile and enquiry analytics remain
  worthwhile follow-up work outside this website update.
- No new hosting rollback folders were created. A future deployment needs a
  fresh, explicitly recorded recovery approach; deleted backups cannot be used.

## Follow-up navigation bug audit

The open 905px preview paired new two-control markup with an immutable-cached
older script, leaving both Services labels visible. There is now only one
trigger in the HTML. Script URLs are versioned automatically by the chrome
helper. Hover follows input capability, not a 980px width cutoff.

Real pointer paths exposed a gap across wrapped navigation on narrow mouse
browsers. The submenu now stays open while crossing that row. The audit also
found and fixed footer social icons overflowing at 980px, preserving their
usual desktop placement and 44px targets.

Verification on localhost:

- 180 page/viewport cases in Chromium and WebKit; hover regression widths
  include 905px and both sides of the 980px breakpoint.
- Eight realistic pointer-path checks and 28 actual submenu navigations
  cover all seven destinations with mouse and touch in both engines.
- 140 real header-link navigations over HTTP and file URLs; 56 quotation
  layout cases; 225 image placements. Image checks now wait for decoding
  before asserting readiness, avoiding a transient loading race.
- 825 local references checked, including fragments and assets. Canonicals,
  sitemap inclusion, one H1 per page, JSON-LD and script version hashes pass.
- Contact validation and WhatsApp destination checks send no enquiries.
- All ten pages scored 100 Accessibility, Best Practices and SEO on mobile
  and desktop. Desktop Performance was 100 throughout. Mobile Performance:
  Home 91–96 across two runs, About 98, Projects 99, Testimonials 99; all other pages 100.
  These are local single-run measurements, not live-site guarantees.
- Firefox could not start (`spawn UNKNOWN`); no Firefox pass is claimed.
  Physical iPhone testing remains outside this desktop audit.

Reproduce with `audit_site_update.cjs`, `audit_hover_path.cjs`,
`audit_service_destinations.cjs`, `audit_static_links.py`,
`audit_compatibility.cjs chromium webkit edge`, `audit_quotation_layout.cjs`,
`audit_header_navigation.cjs`, `audit_image_delivery.cjs` and
`audit_lighthouse.mjs`. Set `AUDIT_BASE_URL=http://127.0.0.1:8003`.
Raw Lighthouse reports use the `-hover-audit` suffix under ignored `audits/`;
the final homepage recheck uses `-hover-final`.
This remains a review-branch update, not a merge or WebHostMost deployment.

### Hover switching refinement

Hovering any other top-level navigation heading now collapses Services, even
when Services retains keyboard focus. Moving through empty ribbon space or
into the submenu keeps it reachable; crossing another heading intentionally
closes it. Verified at 320, 390, 905 and 1440px in Chromium and WebKit,
including reopening and all seven service destinations with mouse and touch.
