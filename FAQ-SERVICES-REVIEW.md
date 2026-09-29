# FAQ, services and image clarity review

29 September 2026. Review branch: `codex/2026-09-29-faq-services-images`.
Local preview: http://127.0.0.1:8003. This update is not merged or deployed.

## What changed

- FAQs now appears immediately before Contact in the header on all ten pages.
- Services has a separate disclosure button and seven submenu links. The
  Services text remains a normal link. Hover, keyboard, touch, Escape and
  outside-click dismissal are supported. Links remain available without JS.
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

- 120 layout/navigation cases: all ten pages at 320, 390, 430, 768, 1440 and
  1920 CSS pixels, in Chromium 153.0.8010.12 and WebKit 26.6.
- Additional interaction coverage: hover, keyboard focus, Enter, Escape,
  outside click, repeated phone taps, following submenu links, 844x390
  landscape, doubled text and JavaScript disabled.
- 88 compatibility cases: all ten pages in both engines at four widths,
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
| Home | 91 | 100 | 100 / 100 / 100 |
| Services | 100 | 100 | 100 / 100 / 100 |
| FAQs | 100 | 100 | 100 / 100 / 100 |
| Luxury home builds | 99 | 100 | 100 / 100 / 100 |
| Home renovations | 100 | 100 | 100 / 100 / 100 |
| Frameless showers | 100 | 100 | 100 / 100 / 100 |

Home, FAQs and Luxury home builds were confirmed with three runs; the table
uses their medians. Other pages use the final single run. All measured pages
have zero CLS and zero TBT. The homepage's approximately 3.5s simulated mobile
LCP reflects its sharper, native-size hero. Image quality was explicitly
prioritised over preserving the previous 99 Performance score. These are local
lab scores, not live-site results or a ranking guarantee.

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
