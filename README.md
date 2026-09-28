# ASKJ Construction — recovered website

Recovered from https://www.askjconstruction.com/ on 28 September 2026.

## Open locally

Run `python serve_site.py --port 8000` in this folder, then open http://localhost:8000.

- Root HTML files: static versions of Home, About, Services, Projects, Customer Testimonials and Contact, with local navigation and downloaded assets.
- `recovered-original/`: untouched published Wix HTML plus available discovery files.
- `assets/`: downloaded images (including exposed originals), fonts, stylesheets and published JavaScript bundles. Wix shared font CSS may reference many font variants.
- `recovery-manifest.json`: original asset URLs, local filenames and download failures.
- `recover.py`: repeatable recovery script; uses archived page HTML when available.

## Scope and limitations

This is a recovery of publicly delivered files, not the original Wix editor project, a Git repository, or server-side source code. The static copy preserves server-rendered content and styles but removes Wix scripts that depend on the live domain and Wix services. Forms, interactive galleries, menus and other Wix-powered behavior may need rebuilding. Archived originals retain their scripts and remote dependencies for reference. This recovery has not been certified as a fully functional or responsive replacement for the live Wix website.

Do not deploy the static contact form as a working submission endpoint without implementing and testing a backend.

After re-running recover.py, run python finalize_static.py and python verify_recovery.py to restore static navigation/full-resolution images and check local file references. The downloadable JavaScript bundles are retained as recovery material; the static pages do not execute them.

## Optimized compatibility preview

Run `python serve_site.py --port 8001` for the preview with compression and caching, then open http://127.0.0.1:8001/. See COMPATIBILITY-REPORT.md for measured Lighthouse scores, browser coverage, reproduction commands and remaining verification limits. Desktop design is retained; small-screen layouts stack and fit the viewport.

The contact form now opens a prefilled email or WhatsApp message; the visitor reviews and sends in that app. It does not require a form-submission backend for this handoff. The inherited testimonial submission still needs a separate backend or handoff implementation.
