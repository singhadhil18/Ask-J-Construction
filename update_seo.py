"""Apply local search metadata and a visible answer page to the static recovery.

Run after recovery/finalization. Production URLs assume the current .html routes.
"""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parent
BASE = 'https://askjconstruction.co.za'
AREA = 'Durban and the KwaZulu-Natal North Coast through Ballito and surrounding suburbs'
AREAS = ['Durban', 'Durban North', 'La Lucia', 'Umhlanga', 'Umdloti',
         'Westbrook', 'Tongaat', 'Ballito', 'Shaka’s Rock', 'Salt Rock']
SERVICES = ['Luxury home builds', 'Home renovations and additions',
            'Frameless shower installation and maintenance', 'Property maintenance',
            'Frameless folding and sliding glass systems', 'Clearview security fencing',
            'Construction project management']
PAGES = {
    'index': ('Construction, Showers & Maintenance Durban | ASKJ',
              'ASKJ Construction serves Durban and the North Coast through Ballito: home builds, renovations, frameless showers and maintenance. Request a free consultation.'),
    'about': ('About ASKJ Construction | Durban & North Coast Builders',
              'Meet ASKJ Construction, a family-run homebuilding and renovation company serving Durban and the North Coast through Ballito. Explore our building process.'),
    'services': ('Building, Renovations & Frameless Showers Durban | ASKJ',
                 'Explore home builds, renovations, frameless showers, maintenance, glass systems, Clearview fencing and project management in Durban and the North Coast.'),
    'projects': ('Construction & Renovation Projects | ASKJ Durban',
                 'Explore the ASKJ Construction project gallery and discuss your home build, renovation or frameless shower project in Durban, Ballito and the North Coast.'),
    'customer-testimonials': ('Customer Testimonials | ASKJ Construction Durban',
                              'Read ASKJ customer testimonials about home builds, bathroom renovations, frameless shower installations, shower servicing, glass replacement and repainting.'),
    'contact': ('Contact ASKJ Construction | Durban & Ballito Quotes',
                'Call ASKJ Construction on +27 83 732 2142 or +27 78 568 0809 for a free in-home consultation. Serving Durban and the North Coast through Ballito.'),
    'service-areas-faq': ('Durban & Ballito Construction, Showers & Maintenance FAQs',
                         'Find ASKJ service areas and answers about construction, renovations, frameless showers, maintenance and free consultations in Durban and the North Coast.'),
}
FAQ = [
    ('Which areas does ASKJ Construction serve?',
     f'We serve all Durban suburbs and the KwaZulu-Natal North Coast through Ballito and surrounding suburbs. This includes Durban North, La Lucia, Umhlanga, Umdloti, Westbrook, Tongaat, Ballito, Shaka’s Rock and Salt Rock. Contact us with your suburb and project details to arrange the next step.'),
    ('What construction services can I enquire about?',
     'Contact ASKJ about new home builds, renovations, home additions and construction project management. Our services also include frameless showers, folding and sliding glass systems, Clearview security fencing and maintenance. Tell us the scope of your project so we can discuss the work required.'),
    ('Do you install and maintain frameless showers?',
     'Yes. ASKJ offers custom frameless shower installation, maintenance and servicing. Our published testimonials describe shower installations, shower servicing and replacement of a broken glass door. Contact us to discuss your installation or repair.'),
    ('Do you take on maintenance and smaller renovation work?',
     'Yes. Alongside new builds and renovations, we welcome maintenance enquiries. Customers on our testimonials page describe shower and toilet servicing, bathroom renovations, glass-door replacement and apartment repainting. Contact us to discuss the work you need.'),
    ('How do I request a free quote or consultation?',
     'Call +27 83 732 2142 or +27 78 568 0809, or email askjconstruction@gmail.com to arrange the free in-home consultation offered on our contact page. Include your suburb and a description of the work you would like done.'),
    ('Where is ASKJ Construction based?',
     'Our listed address is 103 Clarendon Road, Durban North, 4051, KwaZulu-Natal, South Africa. We serve Durban and the North Coast through Ballito and surrounding suburbs. Call us to arrange a consultation.'),
    ('Can I read feedback from previous customers?',
     'Yes. Our customer testimonials cover new home builds, bathroom renovations, frameless shower installations and maintenance work. Read the original customer comments on our testimonials page.'),
]


def url(stem):
    return BASE + ('/' if stem == 'index' else '/' + stem + '.html')


def create_answers_page():
    s = (ROOT / 'services.html').read_text(encoding='utf-8')
    questions = ''.join(f'<section class="answer-item"><h2>{escape(q)}</h2><p>{escape(a)}</p></section>' for q, a in FAQ)
    body = f'''<main id="PAGES_CONTAINER" class="PAGES_CONTAINER" tabindex="-1" data-main-content="true">
<article class="local-answers">
<h1>Construction, Showers &amp; Maintenance</h1>
<p class="answer-intro">Serving {escape(AREA)}.</p>
<p>ASKJ Construction brings together homebuilding, renovations, frameless glass and maintenance. Find answers below, <a href="services.html">explore our services</a>, or <a href="customer-testimonials.html">read our customer testimonials</a>.</p>
{questions}
<p class="answer-contact"><a href="tel:+27837322142">+27 83 732 2142</a> &nbsp; / &nbsp; <a href="tel:+27785680809">+27 78 568 0809</a><br><a href="mailto:askjconstruction@gmail.com">askjconstruction@gmail.com</a></p>
<a class="answer-button" href="contact.html">Get A Free Quote</a>
</article></main>'''
    s, count = re.subn(r'<main\b[^>]*>.*?</main>', lambda _: body, s, count=1, flags=re.S)
    assert count == 1
    (ROOT / 'service-areas-faq.html').write_text(s, encoding='utf-8')


def apply():
    create_answers_page()
    for stem, (title, description) in PAGES.items():
        p = ROOT / (stem + '.html')
        s = p.read_text(encoding='utf-8')
        s = re.sub(r'<!-- local-search:start -->.*?<!-- local-search:end -->\s*', '', s, flags=re.S)
        s = re.sub(r'<title>.*?</title>', '<title>' + escape(title) + '</title>', s, count=1, flags=re.S)
        s = re.sub(r'<link\b[^>]*rel=[\"\']canonical[\"\'][^>]*>', '', s)
        s = re.sub(r'<meta\b[^>]*(?:name|property)=[\"\'](?:description|og:title|og:description|og:url|og:locale|twitter:title|twitter:description)[\"\'][^>]*>', '', s)
        s = s.replace('<html lang="en">', '<html lang="en-ZA">')
        webpage = {'@type': 'WebPage', '@id': url(stem) + '#webpage', 'url': url(stem),
                   'name': title, 'description': description, 'inLanguage': 'en-ZA',
                   'isPartOf': {'@id': BASE + '/#website'}, 'about': {'@id': BASE + '/#business'}}
        graph = [webpage, {'@type': 'WebSite', '@id': BASE + '/#website',
                           'url': BASE + '/', 'name': 'ASKJ Construction', 'inLanguage': 'en-ZA'}]
        if stem in ('contact', 'service-areas-faq'):
            graph.append({'@type': 'GeneralContractor', '@id': BASE + '/#business',
                          'name': 'ASKJ Construction', 'url': BASE + '/',
                          'telephone': '+27 83 732 2142', 'email': 'askjconstruction@gmail.com',
                          'contactPoint': [{'@type': 'ContactPoint', 'telephone': phone,
                                            'contactType': 'customer service'} for phone in ['+27 83 732 2142', '+27 78 568 0809']],
                          'address': {'@type': 'PostalAddress', 'streetAddress': '103 Clarendon Road',
                                      'addressLocality': 'Durban North', 'addressRegion': 'KwaZulu-Natal',
                                      'postalCode': '4051', 'addressCountry': 'ZA'},
                          'areaServed': [{'@type': 'Place', 'name': area} for area in AREAS],
                          'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Construction, glass and maintenance services',
                              'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': name,
                                'provider': {'@id': BASE + '/#business'}, 'areaServed': AREA}} for name in SERVICES]}})
        if stem == 'service-areas-faq':
            webpage['@type'] = 'FAQPage'
            webpage['mainEntity'] = [{'@type': 'Question', 'name': q,
                                     'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]
        metadata = f'''<!-- local-search:start -->
<link rel="canonical" href="{url(stem)}">
<meta name="description" content="{escape(description, quote=True)}">
<meta property="og:title" content="{escape(title, quote=True)}">
<meta property="og:description" content="{escape(description, quote=True)}">
<meta property="og:url" content="{url(stem)}">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:title" content="{escape(title, quote=True)}">
<meta name="twitter:description" content="{escape(description, quote=True)}">
<script type="application/ld+json">{json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False)}</script>
<!-- local-search:end -->'''
        s = s.replace('</head>', metadata + '\n</head>')
        # One compact footer link makes the answer page discoverable without changing the main navigation.
        s = re.sub(r'<div class="local-search-link">.*?</div>', '', s, flags=re.S)
        s = s.replace('</main>', '<div class="local-search-link"><a href="service-areas-faq.html">Durban &amp; North Coast service areas and FAQs</a></div></main>')
        p.write_text(s, encoding='utf-8')
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += ''.join(f'  <url><loc>{url(stem)}</loc></url>\n' for stem in PAGES)
    (ROOT / 'sitemap.xml').write_text(sitemap + '</urlset>\n', encoding='utf-8')
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /recovered-original/\n\nSitemap: ' + BASE + '/sitemap.xml\n', encoding='utf-8')


if __name__ == '__main__':
    apply()
    print('Updated seven pages, sitemap.xml and robots.txt.')
