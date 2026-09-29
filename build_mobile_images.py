"""Create mobile hero crops from the original without changing visible composition.

Run after restore_image_clarity.py. Crops retain the complete original height
and centred region; media conditions guarantee that region covers the current
100vh/min-500px hero. Desktop and landscape retain their original sources.
"""
from pathlib import Path
from PIL import Image
import hashlib, re
ROOT=Path(__file__).resolve().parent
original=ROOT/'assets/bf404cfad15b1903aa04.png'
im=Image.open(original)
version=hashlib.sha256(original.read_bytes()).hexdigest()[:8]
configs=[('portrait',768,'(max-width: 979px) and (max-aspect-ratio: 3/4)',.75),
         ('square',1024,'(max-width: 979px) and (aspect-ratio &gt; 3/4) and (max-aspect-ratio: 1/1)',1)]
sources=[];preloads=[]
for name,cropwidth,media,ratio in configs:
    crop=im.crop(((im.width-cropwidth)//2,0,(im.width+cropwidth)//2,im.height))
    sizes=f'max(calc(100vw - 40px), {ratio*100:g}vh, {ratio*500:g}px)'
    for fmt,q in [('avif',75),('webp',90)]:
        choices=[]
        for width in sorted(set([480,640,cropwidth])):
            resized=crop.resize((width,round(width/ratio)),Image.Resampling.LANCZOS)
            file=f'assets/bf404cfad15b1903aa04-mobile-{name}-{version}-{width}.{fmt}'
            resized.save(ROOT/file,fmt.upper(),**({'quality':q,'speed':6} if fmt=='avif' else {'quality':q,'method':6}))
            choices.append(f'{file} {width}w')
        srcset=', '.join(choices)
        sources.append(f'<source data-mobile-hero="true" media="{media}" type="image/{fmt}" srcset="{srcset}" sizes="{sizes}">')
        if fmt=='avif': preloads.append(f'<link data-mobile-hero="true" rel="preload" as="image" type="image/avif" media="{media}" imagesrcset="{srcset}" imagesizes="{sizes}" fetchpriority="high">')
p=ROOT/'index.html';s=p.read_text(encoding='utf-8')
s=re.sub(r'<(?:source|link)\b[^>]*data-mobile-hero="true"[^>]*>','',s)
def enhance(m):
    return m[0].replace('<picture class="delivery-picture">','<picture class="delivery-picture">'+''.join(sources),1) if 'bf404cfad15b1903aa04' in m[0] else m[0]
s=re.sub(r'<picture class="delivery-picture">.*?</picture>',enhance,s,flags=re.S)
def preload(m):
    tag=m[0]
    if 'bf404cfad15b1903aa04' not in tag:return tag
    tag=re.sub(r'\smedia="[^"]*"','',tag)
    return tag[:-1]+' media="not all and (max-width: 979px) and (max-aspect-ratio: 1/1)">'+''.join(preloads)
s=re.sub(r'<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>',preload,s)
# Fill the gap between 480 and 768 pixels for the first below-fold photograph.
detail=Image.open(ROOT/'assets/fc641aaae36b1fb35c75.jpeg')
for fmt,q in [('avif',75),('webp',90)]:
    file=f'assets/fc641aaae36b1fb35c75-sharp-672.{fmt}'
    scaled=detail.copy()
    scaled.thumbnail((672,round(detail.height*672/detail.width)),Image.Resampling.LANCZOS)
    scaled.save(ROOT/file,fmt.upper(),**({'quality':q,'speed':6} if fmt=='avif' else {'quality':q,'method':6}))
    candidate=f'{file} 672w'
    if candidate not in s:
        s=s.replace(f'assets/fc641aaae36b1fb35c75-sharp-768.{fmt} 768w',candidate+f', assets/fc641aaae36b1fb35c75-sharp-768.{fmt} 768w')
p.write_text(s,encoding='utf-8')
for file in (ROOT/'assets').glob('bf404cfad15b1903aa04-mobile-*avif'): print(file.name,file.stat().st_size)
