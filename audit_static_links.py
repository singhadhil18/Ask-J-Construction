from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, hashlib
import xml.etree.ElementTree as ET
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(); self.path=path; self.ids=set(); self.refs=[]; self.canon=[]; self.h1=0; self.nav=[]
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='link' and a.get('rel')=='canonical': self.canon.append(a['href'])
        for k in ['href','src']:
            if a.get(k): self.refs.append(a[k])
        for k in ['srcset','imagesrcset']:
            if a.get(k): self.refs.extend(v.strip().split()[0] for v in a[k].split(','))
root=Path.cwd(); pages={p.name:Page(p) for p in root.glob('*.html')}; count=0
for name,p in pages.items():
    assert p.h1==1,(name,'h1',p.h1)
    assert len(p.canon)==1,(name,'canonical')
    s=p.path.read_text(encoding='utf-8')
    for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S): json.loads(block)
    v=hashlib.sha256((root/'assets/site-navigation.js').read_bytes()).hexdigest()[:12]
    assert 'assets/site-navigation.js?v='+v in s,(name,'cache version')
    for ref in p.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc: continue
        target=unquote(u.path).lstrip('/') or name
        if target.endswith('/'): target+='index.html'
        assert (root/target).is_file(),(name,'missing',ref)
        if u.fragment and target in pages: assert unquote(u.fragment) in pages[target].ids,(name,'fragment',ref)
        count+=1
urls=[n.text for n in ET.parse('sitemap.xml').iter() if n.tag.endswith('}loc')]
for p in pages.values(): assert p.canon[0] in urls,(p.path.name,'not in sitemap')
print(f'{len(pages)} pages: {count} local references, fragments, H1s, canonicals, JSON-LD, sitemap and navigation versions PASS')
