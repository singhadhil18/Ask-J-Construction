"""Optimize delivery without changing artwork, layout or typography."""
from pathlib import Path
import re
import json
from PIL import Image

ROOT = Path(__file__).resolve().parent
manifest = json.loads((ROOT / 'recovery-manifest.json').read_text())['assets']
pages = list(ROOT.glob('*.html'))
image_map = {}
for page in pages:
    text = page.read_text(encoding='utf-8')
    for asset in set(re.findall(r'assets/[a-f0-9]+\.(?:png|jpg|jpeg)', text)):
        source = ROOT / asset
        if source.stat().st_size < 100000:
            continue
        target = source.with_suffix('.lossless.webp')
        if not target.exists():
            with Image.open(source) as im:
                im.save(target, 'WEBP', lossless=True, method=6)
        if target.stat().st_size < source.stat().st_size:
            image_map[asset] = target.relative_to(ROOT).as_posix()

font_count = 0
for page in pages:
    text = page.read_text(encoding='utf-8')
    while re.search(r'<picture class="delivery-picture">(?:<source\b[^>]*>)+(<img\b[^>]*>)</picture>', text):
        text = re.sub(r'<picture class="delivery-picture">(?:<source\b[^>]*>)+(<img\b[^>]*>)</picture>', r'\1', text)
    def font(match):
        global font_count
        remote = match[0]
        key = 'https:' + remote if remote.startswith('//') else remote.replace('http:', 'https:')
        local = manifest.get(key)
        if local and (ROOT / local).exists():
            font_count += 1
            return local
        return key
    text = re.sub(r'(?:https?:)?//static\.parastorage\.com/[^\s\"\'()<>]+\.(?:woff2|woff|ttf)', font, text)
    for old, new in image_map.items():
        text = text.replace(old, new)
    def responsive(match):
        tag = match[0]
        source = re.search(r'\ssrc="(assets/[^\"]+)"', tag)
        if not source:
            return tag
        path = ROOT / source[1]
        if not path.exists() or path.stat().st_size < 150000:
            return tag
        with Image.open(path) as original:
            if original.width < 600:
                return tag
            widths = sorted(set(min(w, original.width) for w in (480, 960, 1600)))
            variants = {'webp': [], 'avif': []}
            for width in widths:
                for fmt in variants:
                    target = path.with_name(path.name.split('.')[0] + '-' + str(width) + '.' + fmt)
                    if not target.exists():
                        resized = original.copy()
                        resized.thumbnail((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
                        if fmt == 'webp':
                            resized.save(target, 'WEBP', quality=90, method=6)
                        else:
                            resized.save(target, 'AVIF', quality=75, speed=6)
                    variants[fmt].append(f'{target.relative_to(ROOT).as_posix()} {width}w')
        declared_width = re.search(r'\swidth="(\d+)"', tag)
        size = declared_width[1] + 'px' if declared_width else '100vw'
        sizes = '(max-width: 979px) calc(100vw - 40px), ' + size
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', tag, flags=re.I)
        # Typed sources allow older Safari to skip unsupported formats.
        fallback = source[1]
        if fallback.endswith('.lossless.webp'):
            for extension in ('.png', '.jpg', '.jpeg'):
                candidate = 'assets/' + path.name.split('.')[0] + extension
                if (ROOT / candidate).exists():
                    tag = tag.replace('src="' + fallback + '"', 'src="' + candidate + '"')
                    break
        return '<picture class="delivery-picture"><source type="image/avif" srcset="' + ', '.join(variants['avif']) + '" sizes="' + sizes + '"><source type="image/webp" srcset="' + ', '.join(variants['webp']) + '" sizes="' + sizes + '">' + tag + '</picture>'
    text = re.sub(r'<img\b[^>]*>', responsive, text)
    main_index = text.index('<main')
    first_main_image = re.search(r'<img\b[^>]*>', text[main_index:])
    eager_start = main_index + first_main_image.start() if first_main_image else -1
    def image(match):
        tag = match[0]
        if match.start() < main_index:
            return tag
        tag = re.sub(r'\s(?:loading|fetchpriority|decoding)="[^"]*"', '', tag, flags=re.I)
        eager = match.start() == eager_start
        attributes = ' loading="eager" fetchpriority="high"' if eager else ' loading="lazy" fetchpriority="low"'
        return tag.replace('<img', '<img' + attributes + ' decoding="async"', 1)
    text = re.sub(r'<img\b[^>]*>', image, text)
    page.write_text(text, encoding='utf-8')
print(json.dumps({'image_replacements': image_map, 'local_font_references': font_count}, indent=2))
