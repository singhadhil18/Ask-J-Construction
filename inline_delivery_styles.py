"""Embed the small shared layout sheets without changing their cascade order.

Run after editing either CSS source; no JavaScript or extra blocking requests
are needed to deliver these critical styles.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent

for page in ROOT.glob('*.html'):
    html = page.read_text(encoding='utf-8')
    for name in ('site-updates.css', 'mobile-compatibility.css'):
        css = (ROOT / name).read_text(encoding='utf-8').strip()
        pattern = (r'<link rel="stylesheet" href="' + re.escape(name)
                   + r'(?:\?[^\"]*)?">|<style data-source="'
                   + re.escape(name) + r'">.*?</style>')
        html, count = re.subn(pattern, lambda _: f'<style data-source="{name}">\n{css}\n</style>',
                              html, flags=re.S)
        if count != 1:
            raise ValueError(f'{page.name}: expected one reference to {name}, got {count}')
    page.write_text(html, encoding='utf-8')
