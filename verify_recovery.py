from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
root=Path(__file__).resolve().parent
class Check(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]
    def handle_starttag(self, tag, attrs):
        for key,val in attrs:
            if key in ('src','href') and val and not urlsplit(val).scheme and not val.startswith(('#','//')):
                self.refs.append(val)
missing=[]
for page in root.glob('*.html'):
    p=Check(); p.feed(page.read_text(encoding='utf-8'))
    missing.extend({'page':page.name,'reference':r} for r in p.refs if not (root/unquote(r.split('#')[0].split('?')[0])).exists())
manifest=json.loads((root/'recovery-manifest.json').read_text())
result={'pages':len(manifest['pages']),'downloaded_assets':len(manifest['assets']),'missing_local_references':missing,'download_failures':manifest['failures']}
(root/'verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
