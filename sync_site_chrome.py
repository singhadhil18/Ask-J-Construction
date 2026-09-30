"""Synchronise the static header navigation and footer social links on all pages."""
from pathlib import Path
import re
import hashlib

ROOT = Path(__file__).resolve().parent
SERVICES = [
    ('luxury-home-builds.html', 'Luxury home builds'),
    ('home-renovations.html', 'Home renovations and additions'),
    ('frameless-showers.html', 'Frameless showers and maintenance'),
    ('services.html#folding-sliding-systems', 'Folding and sliding systems'),
    ('services.html#clearview-fencing', 'Clearview security fencing'),
    ('services.html#project-management', 'Project management'),
    ('services.html', 'See all services'),
]
nav = '<nav class="recovered-nav" aria-label="Main navigation">'
for href, label in [('index.html','Home'),('about.html','About'),('services.html','Services'),('projects.html','Projects'),('customer-testimonials.html','Testimonials'),('service-areas-faq.html','FAQs'),('contact.html','Contact')]:
    if label == 'Services':
        nav += '<div class="services-navigation"><div class="services-trigger"><a href="services.html">Services</a><button class="services-toggle" type="button" aria-label="Expand service links" aria-controls="services-submenu" aria-expanded="false"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button></div><ul id="services-submenu" class="services-submenu">'
        nav += ''.join(f'<li><a href="{url}">{name}</a></li>' for url,name in SERVICES)
        nav += '</ul></div>'
    else:
        nav += f'<a href="{href}">{label}</a>'
nav += '</nav>'
menu = '<button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-controls="mobile-navigation" aria-expanded="false"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>'
drawer = '<dialog id="mobile-navigation" class="mobile-navigation" aria-label="Navigation menu"><div class="drawer-heading"><span>Menu</span><button class="menu-close" type="button" aria-label="Close navigation menu"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button></div></dialog>'
socials = [
    ('TikTok', 'https://www.tiktok.com/@askjconstruction', 'assets/d41d241118edbf01f2ef.png'),
    ('Instagram', 'https://www.instagram.com/askj_construction?igsh=MW93cG5hbHI2cDFsZQ==', 'assets/59c69081446a87c2f0eb.png'),
    ('Facebook', 'https://www.facebook.com/share/1AafZhKBTP/', 'assets/cd3c4888b112a472325b.png'),
    ('WhatsApp', 'https://wa.me/27785680809', 'assets/whatsapp-black-official-2026.svg'),
]
# Preserve the established TikTok destination instead of inferring an account.
home = (ROOT/'index.html').read_text(encoding='utf-8')
tiktok = re.search(r'<a\b[^>]*href="([^"]+)"[^>]*aria-label="TikTok"', home)
if tiktok:
    socials[0] = ('TikTok', tiktok[1], socials[0][2])
social_html = '<ul class="site-socials">' + ''.join(
    f'<li><a href="{url}" target="_blank" rel="noopener noreferrer" aria-label="{label}"><img src="{asset}" alt="" width="23" height="23" loading="lazy"></a></li>'
    for label,url,asset in socials) + '</ul>'

for page in ROOT.glob('*.html'):
    s = page.read_text(encoding='utf-8')
    s,n = re.subn(r'<nav class="recovered-nav".*?</nav>',lambda _:nav,s,flags=re.S)
    assert n == 1, page
    # Keep the source order aligned with the desktop reading order. The same
    # navigation moves into the native modal drawer on compact screens.
    start = s.index('<header'); end = s.index('</header>', start) + len('</header>')
    header = s[start:end]
    logo = re.search(r'<a class="header-logo".*?</a>', header, re.S).group()
    logo = re.sub(r'sizes="[^"]*"', 'sizes="(max-width: 979px) 112px, (max-width: 1199px) 168px, 196px"', logo)
    quote = re.search(r'<a class="header-quote".*?</a>', header, re.S).group()
    s = s[:start] + header[:header.index('>')+1] + menu + logo + nav + quote + drawer + '</header>' + s[end:]
    # Each footer has a single social list. Keep the original surrounding layout.
    a=s.index('<footer'); b=s.index('</footer>',a)
    footer=s[a:b]
    footer,n=re.subn(r'<ul\b[^>]*>.*?</ul>',lambda _:social_html,footer,count=1,flags=re.S)
    assert n == 1, page
    s=s[:a]+footer+s[b:]
    version = hashlib.sha256((ROOT/'assets/site-navigation.js').read_bytes()).hexdigest()[:12]
    script = f'<script defer src="assets/site-navigation.js?v={version}"></script>'
    s,n = re.subn(r'<script defer src="assets/site-navigation\.js(?:\?[^"]*)?"></script>', lambda _:script, s)
    if not n:
        s=s.replace('</head>',script+'\n</head>',1)
    if 'id="navigation-ready"' not in s:
        s=s.replace('<head>','<head><script id="navigation-ready">document.documentElement.classList.add("nav-js")</script>',1)
    page.write_text(s,encoding='utf-8')
