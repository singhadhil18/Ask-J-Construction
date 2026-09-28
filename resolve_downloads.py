import json,hashlib
from pathlib import Path
from urllib.request import urlopen
p=Path('recovery-manifest.json'); m=json.loads(p.read_text()); unresolved=[]; resolved=[]
for e in m['failures']:
    u=e['url']
    if u=='sitemap discovery': resolved.append({**e,'resolution':'Recovered pages-sitemap.xml using PowerShell; all six pages accounted for.'}); continue
    if '/media/' in u and u.split('/v1/')[0] in m['assets']:
        resolved.append({**e,'resolution':'Original full-resolution image recovered: '+m['assets'][u.split('/v1/')[0]]}); continue
    try:
        fixed=u.replace('\\ ','%20'); data=urlopen(fixed,timeout=30).read(); local='assets/'+hashlib.sha256(fixed.encode()).hexdigest()[:20]+'.woff2'; Path(local).write_bytes(data); m['assets'][fixed]=local
        for css in Path('assets').glob('*.css'):
            text=css.read_text(); css.write_text(text.replace(u,Path(local).name))
        resolved.append({**e,'resolution':'Downloaded corrected escaped-space URL: '+fixed})
    except Exception as ex: unresolved.append({**e,'retry_error':str(ex)})
m['failures']=unresolved; m['resolved_download_issues']=resolved; p.write_text(json.dumps(m,indent=2)); print('Unresolved:',len(unresolved))
