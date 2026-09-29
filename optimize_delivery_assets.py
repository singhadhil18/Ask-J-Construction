"""Generate separately named delivery assets, retaining originals and fallbacks."""
from pathlib import Path
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent
replacements = {}
for stem in ('bf404cfad15b1903aa04', 'b774e3d1b3849da11311', 'a39782841d3d9dc4dbfa'):
    original = Image.open(ROOT / 'assets' / (stem + '.png'))
    for old in (ROOT / 'assets').glob(stem + '-*.avif'):
        if '-delivery-' in old.name:
            continue
        width = int(old.stem.rsplit('-', 1)[1])
        resized = original.copy()
        resized.thumbnail((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
        target = old.with_name(f'{stem}-delivery-{width}.avif')
        resized.save(target, 'AVIF', quality=55, speed=6)
        replacements['assets/' + old.name] = 'assets/' + target.name

# Keep the original desktop logo, with a smaller high-density mobile source.
logo = ROOT / 'assets/cb37f97098ee7cf8e55d.jpeg'
image = Image.open(logo)
image.thumbnail((320, 204), Image.Resampling.LANCZOS)
image.save(logo.with_name('cb37f97098ee7cf8e55d-mobile.webp'), 'WEBP', lossless=True, method=6)

# Footer artwork is displayed at 130px; retain a 3x-density copy.
footer = ROOT / 'assets/7c52c5b9af68590ad02c.jpeg'
image = Image.open(footer)
image.thumbnail((390, 255), Image.Resampling.LANCZOS)
image.save(footer.with_name('7c52c5b9af68590ad02c-delivery.webp'), 'WEBP', quality=90, method=6)
replacements['assets/' + footer.name] = 'assets/7c52c5b9af68590ad02c-delivery.webp'

for page in ROOT.glob('*.html'):
    html = page.read_text(encoding='utf-8')
    for old, new in replacements.items():
        html = html.replace(old, new)
    html = html.replace('assets/cb37f97098ee7cf8e55d-delivery.webp', 'assets/' + logo.name)
    def responsive_logo(match):
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', match[0])
        return tag.replace('<img ', '<img srcset="assets/cb37f97098ee7cf8e55d-mobile.webp 320w, assets/cb37f97098ee7cf8e55d.jpeg 518w" sizes="(max-width: 360px) 120px, (max-width: 979px) 160px, 259px" ', 1)
    html = re.sub(r'<img\b[^>]*src="assets/cb37f97098ee7cf8e55d.jpeg"[^>]*>', responsive_logo, html)
    page.write_text(html, encoding='utf-8')
