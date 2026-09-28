from pathlib import Path
import re,urllib.parse,shutil,json,subprocess,datetime
root=Path.cwd(); target=root/'.release-stage'
assert not target.exists(),'Staging already exists; inspect before reusing'
target.mkdir()
files={p.name for p in root.glob('*.html')}|{'.htaccess','robots.txt','sitemap.xml','site-updates.css','mobile-compatibility.css','contact-form.js'}
queue=list(files)
while queue:
 name=queue.pop();p=root/name
 if p.suffix not in {'.html','.css','.js'}:continue
 s=p.read_text(encoding='utf8')
 found=set(re.findall(r'assets/[A-Za-z0-9_.-]+',s))
 if p.suffix=='.css':
  for url in re.findall(r'url\([\s\"\']*([^\s\"\')]+)',s):
   if not re.match(r'(https?:|data:|//|#)',url):
    q=(p.parent/urllib.parse.unquote(url.split('?')[0].split('#')[0])).resolve()
    if q.is_relative_to(root):found.add(q.relative_to(root).as_posix())
 for f in found:
  if f.endswith('.map'):continue
  assert (root/f).is_file(),f
  if f not in files:files.add(f);queue.append(f)
for f in files:
 dest=target/f;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/f,dest)
print('Prepared',len(files),'production files;',sum((target/f).stat().st_size for f in files),'bytes')
