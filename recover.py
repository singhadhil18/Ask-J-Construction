from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlsplit, urljoin, unquote
from html import unescape
import re, json, hashlib, concurrent.futures
ROOT=Path(__file__).resolve().parent
BASE='https://www.askjconstruction.com'
archive=ROOT/'recovered-original'; archive.mkdir(exist_ok=True)
assets=ROOT/'assets'; assets.mkdir(exist_ok=True)
pages={}; errors=[]; mapping={}
def get(url):
    return urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}),timeout=45).read()
def save_asset(url):
    try:
        data=get(url)
        suffix=Path(unquote(urlsplit(url).path)).suffix
        if not re.fullmatch(r'\.[a-zA-Z0-9]{1,8}',suffix): suffix='.bin'
        filename=hashlib.sha256(url.encode()).hexdigest()[:20]+suffix
        (assets/filename).write_bytes(data)
        return url,'assets/'+filename,data
    except Exception as e:
        errors.append({'url':url,'error':str(e)}); return url,None,None
queue=[BASE+'/']
try:
    for name in ['robots.txt','sitemap.xml']:
        data=get(BASE+'/'+name); (archive/name).write_bytes(data)
        if name=='sitemap.xml':
            for u in re.findall(r'<loc>(.*?)</loc>',data.decode()):
                if u.endswith('.xml'):
                    sub=get(u); (archive/Path(urlsplit(u).path).name).write_bytes(sub)
                    queue.extend(re.findall(r'<loc>(.*?)</loc>',sub.decode()))
                else: queue.append(u)
except Exception as e: errors.append({'url':'sitemap discovery','error':str(e)})
while queue:
    url=queue.pop(0).rstrip('/') or BASE
    if url in pages or urlsplit(url).netloc!=urlsplit(BASE).netloc: continue
    try:
        saved=archive/((urlsplit(url).path.strip('/').replace('/','__') or 'index')+'.html')
        source=saved.read_text(encoding='utf-8-sig') if saved.exists() else get(url).decode('utf-8'); pages[url]=source
        slug=urlsplit(url).path.strip('/')
        name=(slug.replace('/','__') or 'index')+'.html'
        (archive/name).write_text(source,encoding='utf-8')
        for link in re.findall(r'href=["\']([^"\']+)',source):
            link=urljoin(url,unescape(link)).split('#')[0].split('?')[0].rstrip('/')
            if urlsplit(link).netloc==urlsplit(BASE).netloc and not Path(urlsplit(link).path).suffix and link not in pages: queue.append(link)
        print('Recovered page:',url,flush=True)
    except Exception as e: errors.append({'url':url,'error':str(e)})
urls=set()
for source in pages.values():
    normalized=unescape(source.replace('\\/','/'))
    for u in re.findall(r'https?://[^\s"\'<>\\)]+',normalized):
        if '[' in u or ']' in u: continue
        host=urlsplit(u).netloc
        if host.endswith(('wixstatic.com','parastorage.com','googleapis.com','gstatic.com')) and re.search(r'\.(?:jpe?g|png|gif|webp|avif|svg|ico|mp4|woff2?|ttf|css|js)(?:[/?#]|$)',u,re.I): urls.add(u)
    for u in list(urls):
        if '/media/' in u and '/v1/' in u: urls.add(u.split('/v1/')[0])
print('Downloading',len(urls),'assets',flush=True)
pending=urls; seen=set()
while pending:
    batch=pending-seen; seen.update(batch); pending=set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for u,path,data in pool.map(save_asset,batch):
            if not path: continue
            mapping[u]=path
            if urlsplit(u).path.endswith('.css'):
                css=data.decode('utf-8')
                for ref in re.findall(r'url\(["\']?([^\)"\']+)',css):
                    if not ref.startswith('data:'): pending.add(urljoin(u,ref))
for u,path in mapping.items():
    if path.endswith('.css'):
        css=(ROOT/path).read_text(encoding='utf-8')
        def cssref(m):
            ref=m.group(1).strip('"\' '); resolved=urljoin(u,ref)
            return 'url("'+(Path(mapping[resolved]).name if resolved in mapping else ref)+'")'
        (ROOT/path).write_text(re.sub(r'url\(([^)]+)\)',cssref,css),encoding='utf-8')
for url,source in pages.items():
    # Preserve server-rendered markup and styling; omit Wix's domain-bound runtime.
    output=re.sub(r'<script\b[^>]*>.*?</script\s*>','',source,flags=re.S|re.I)
    output=re.sub(r'<link\b[^>]*rel=["\'](?:preload|prefetch|preconnect|dns-prefetch)["\'][^>]*>','',output,flags=re.I)
    for remote,local in sorted(mapping.items(),key=lambda x:-len(x[0])):
        output=output.replace(remote,local).replace(remote.replace('&','&amp;'),local)
    for remote in sorted(pages,key=len,reverse=True):
        slug=urlsplit(remote).path.strip('/')
        local=(slug.replace('/','__') or 'index')+'.html'
        output=output.replace('href="'+remote+'"','href="'+local+'"').replace('href="'+remote+'/"','href="'+local+'"')
    output=output.replace('</head>','<style>html{scroll-behavior:smooth} [data-motion-enter="done"]{visibility:visible}</style></head>')
    slug=urlsplit(url).path.strip('/')
    (ROOT/((slug.replace('/','__') or 'index')+'.html')).write_text(output,encoding='utf-8')
(ROOT/'recovery-manifest.json').write_text(json.dumps({'source':BASE,'pages':list(pages),'assets':mapping,'failures':errors},indent=2),encoding='utf-8')
print(json.dumps({'pages':len(pages),'assets':len(mapping),'failures':len(errors)}),flush=True)


