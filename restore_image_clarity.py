"""Build high-quality responsive copies from original recovered photographs.

Uses the measured layout inventory in audits/image-before.json to account for
cover crops. Keeps originals and existing cached assets intact.
"""
from pathlib import Path
import re,json,math
from PIL import Image

ROOT=Path(__file__).resolve().parent
rows=json.loads((ROOT/'audits/image-before.json').read_text())
generated={}; report=[]

def variants(asset):
    if asset in generated:return generated[asset]
    original=Image.open(ROOT/asset)
    if original.width<600:return None
    stem=Path(asset).stem
    choices=sorted(set(min(w,original.width) for w in (480,768,1200,1920,original.width)))
    sources={fmt:[] for fmt in ('avif','webp')}
    for width in choices:
        resized=original.copy()
        resized.thumbnail((width,round(original.height*width/original.width)),Image.Resampling.LANCZOS)
        for fmt in sources:
            target=f'assets/{stem}-sharp-{width}.{fmt}'
            if not (ROOT/target).exists():
                resized.save(ROOT/target,fmt.upper(),**({'quality':75,'speed':6} if fmt=='avif' else {'quality':90,'method':6}))
            sources[fmt].append(f'{target} {resized.width}w')
    result=(original.width,original.height,sources)
    generated[asset]=result
    return result

for page in ROOT.glob('*.html'):
    text=page.read_text(encoding='utf-8')
    # Unwrap old copies. The fallback img still points to the original source.
    text=re.sub(r'<picture class="delivery-picture">(?:<source\b[^>]*>)+(<img\b[^>]*>)</picture>',r'\1',text)
    start=text.index('<main');end=text.index('</main>',start)
    def picture(match):
        tag=match[0];m=re.search(r'\ssrc="(assets/[a-f0-9]{20}\.(?:png|jpg|jpeg))"',tag)
        if not m:return tag
        asset=m[1];data=variants(asset)
        if not data:return tag
        width,height,sources=data;ratio=width/height
        placement=[r for r in rows if r['page']==page.stem and r['src']==asset]
        bg=any(r['background'] for r in placement)
        desktop=max([max(r['width'],r['height']*ratio) for r in placement if r['viewport']>=980]+[0])
        mobileheight=max([r['height'] for r in placement if r['viewport']<980]+[0])
        if 'service-photo' in tag:
            sizes='(max-width: 979px) calc(100vw - 40px), 900px'
        elif bg:
            # Tall background containers require more source pixels than their width suggests.
            sizes=f'(max-width: 979px) max(calc(100vw - 40px), {math.ceil(mobileheight*ratio)}px), {math.ceil(desktop or width)}px'
        else:
            declared=re.search(r'\swidth="(\d+)"',tag)
            sizes=f'(max-width: 979px) calc(100vw - 40px), {math.ceil(desktop or int(declared[1]) if declared else width)}px'
        tag=re.sub(r'\s(?:srcset|sizes)="[^"]*"','',tag,flags=re.I)
        report.append({'page':page.name,'original':asset,'originalWidth':width,'originalHeight':height,'background':bg,'sizes':sizes})
        return '<picture class="delivery-picture">'+''.join(f'<source type="image/{fmt}" srcset="{", ".join(src)}" sizes="{sizes}">' for fmt,src in sources.items())+tag+'</picture>'
    text=text[:start]+re.sub(r'<img\b[^>]*>',picture,text[start:end])+text[end:]
    # Use exactly the same source set for preload and picture selection.
    text=re.sub(r'<link rel="preload" as="image"[^>]*>','',text)
    eager=next((m for m in re.finditer(r'<picture class="delivery-picture">.*?</picture>',text,re.S) if 'loading="eager"' in m[0]),None)
    if eager:
        source=re.search(r'<source type="image/avif" srcset="([^"]+)" sizes="([^"]+)"',eager[0])
        preload=f'<link rel="preload" as="image" type="image/avif" imagesrcset="{source[1]}" imagesizes="{source[2]}" fetchpriority="high">'
        text=re.sub(r'(<meta\b[^>]*name="viewport"[^>]*>)',lambda m:m[0]+preload,text,count=1)
    page.write_text(text,encoding='utf-8')
(ROOT/'audits/image-delivery.json').write_text(json.dumps(report,indent=2))
print('Regenerated',len(generated),'original photographs for',len(report),'placements')
