# ASKJ Construction: local search and answer content brief

Status: initial implementation complete locally. Owner confirmed all construction enquiries, frameless showers and maintenance, across all Durban suburbs and the North Coast through Ballito and surrounding suburbs. Business information and testimonials are sourced from the original site as instructed.

## Implemented

- Unique titles, descriptions and social metadata across seven pages.
- Absolute canonical URLs, English (South Africa) language, business/service structured data, sitemap and robots rules.
- Service-area and FAQ page using the original header/footer and matching typography, with links from all existing pages.
- Business address: 103 Clarendon Road, Durban North, 4051. Telephone: +27 83 732 2142 and +27 78 568 0809. Email: askjconstruction@gmail.com.
- Maintenance examples drawn from the original testimonials. Original quotes remain unchanged; no invented ratings, locations, hours or registration numbers.
- FAQ markup matches the visible questions and answers; no claim of a Google FAQ rich result or guaranteed AI citation.

## Deployment notes

Canonical URLs and sitemap use https://www.askjconstruction.com/ and the current .html routes. Before replacing the Wix site, preserve old extensionless routes with redirects to the corresponding .html pages (or revise the generator to the final hosting routes). These changes are local and are not published.

Run `python update_seo.py` to regenerate the answer page, metadata and sitemap. If the recovery is regenerated, reapply the header changes as well. The generator does not rebuild the sticky header.

Google Business Profile status/link and opening hours remain unknown. No opening hours have been invented. The contact form now hands off a prefilled enquiry to email or WhatsApp. The visitor reviews and sends in the selected app. The new FAQ page also provides direct telephone and email links.

## Information to confirm

- Priority services, actual suburbs served, travel limits and preferred project sizes.
- Exact public business name, telephone/WhatsApp, email, hours and whether customers visit the business address.
- Google Business Profile URL, existing domain ownership and Search Console access/status.
- Registration details, insurance, years trading and warranty terms that can be substantiated.
- Completed projects: suburb, service, scope, original photographs and permission to feature client feedback.
- Quote process: site visits, fees/exclusions, turnaround, required information and next steps.
- Common customer questions about approvals, timelines, occupied-home renovations, budgets and project management.

## Implementation after confirmation

1. Write unique page titles and descriptions around each page's service and genuine service area.
2. Add accurate business/service structured data matching visible page content. Do not invent ratings, credentials or locations.
3. Add concise customer questions and factual answers using the existing design; use project evidence to support local claims.
4. Create suburb pages only where distinct service information and genuine project evidence justify them; avoid duplicated suburb-name pages.
5. Align business contact details with Google Business Profile and link verified profiles.
6. Confirm production URL routing before creating the sitemap, canonical links and robots rules. The current copy uses .html routes; the original Wix site may use different routes.
7. Validate indexing, mobile usability, enquiry paths and performance before publishing. Existing static contact form requires a working submission service.

## Baseline findings

- Six static public pages; navigation was outside the sticky header.
- Generic page titles; no standard name="description" tags found in the initial check.
- The recovered desktop layout originally overflowed narrow screens. Responsive-only adaptations are now implemented; see COMPATIBILITY-REPORT.md.
- Keep the current visual design while adding metadata and evidence-based content.

## Primary references

- Google AI search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Local ranking guidance: https://support.google.com/business/answer/7091?hl=en

SEO fundamentals support AI search visibility. Local visibility also depends on relevance, distance and prominence/popularity; no ranking position is guaranteed.
