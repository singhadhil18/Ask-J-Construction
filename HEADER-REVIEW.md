# Responsive header review — 30 September 2026

Changes based on main at c2fbba3. Delivery target: GitHub `main`, as requested on 30 September 2026. Live hosting deployment is outside this delivery request.
Preview: http://127.0.0.1:8001/ (`python serve_site.py --port 8001`).

- Desktop: logo left, padded heading tiles through the middle, quote action right. The ribbon is approximately 132–150px high, depending on viewport width.
- Below 980px: approximately 88px sticky ribbon containing the left hamburger, logo and quote action. All seven headings move into a drawer that slides in from the left.
- The native modal drawer supports Services disclosure, keyboard focus containment, Escape, close button, backdrop dismissal, scroll preservation, breakpoint changes and reduced motion. Navigation remains available without JavaScript.
- Corrected an existing mobile hero box-sizing defect: the title and estimate button now retain 16px padding on both sides.

Verification used local static production HTML, Chromium 153.0.8010.12 and WebKit 26.6. This is browser emulation, not physical Android/iPhone testing.

- Responsive header: all ten pages at 320, 390, 430, 768, 979, 980, 1076, 1440 and 1920px in both engines. Checked gutters, control overlap, header consistency, sticky positioning, drawer interactions, quote/service destinations, keyboard focus, scroll restoration, resizing, 200% text, short landscape, reduced motion and no-JavaScript navigation.
- Real link navigation: 140 checks passed across both engines, direct HTML files and HTTP.
- Existing navigation hover, focus and quote feedback checks passed in both engines with mouse/keyboard and touch.
- Hero spacing: both engines passed at 320, 390, 430, 768 and 979px, with measured 16px gutters.
- Static validation: 846 local references plus fragments, H1s, canonicals, JSON-LD, sitemap and navigation cache versions passed. `git diff --check` passed.
- One localhost Lighthouse run per profile before the final hero padding correction: desktop 100/100/100/100; mobile 99/100/100/100 (performance/accessibility/best practices/SEO). These are single lab runs, not live results or repeated medians.

Reproduce with `node audit_responsive_header.cjs`, `node audit_header_navigation.cjs`, `node audit_navigation_feedback.cjs`, and `python audit_static_links.py`. Diagnostic screenshots and JSON are in the ignored `audits/` directory.

Shared header markup comes from `sync_site_chrome.py`. After editing navigation JavaScript or header markup, run that script; after changing either shared CSS file, run `python inline_delivery_styles.py` to update all ten HTML pages.

## Same-page scrolling

Selecting the current page's header link now eases to the top over 1.1 seconds without reloading. This covers every navigation heading and the home logo; links to other pages or specific section anchors retain their destinations. Mobile drawer dismissal restores the original scroll position before animation begins. Wheel, touch, pointer or scrolling-key input interrupts the animation; reduced-motion preferences skip it. An existing fragment is cleared without adding a history entry.

Services now has a separate mobile/touch disclosure arrow: its label is a normal page link, and the arrow expands service destinations. This lets the Services heading use the same scroll behavior as all other headings.

`node audit_same_page_scroll.cjs` passed in Chromium and WebKit for desktop and mobile: all seven headings, intermediate animation position, final top position, no reload, preservation of an unfinished Contact form, logo, Escape interruption, reduced motion, other-page navigation and service disclosure destinations. The existing navigation feedback suite was rerun as well.
