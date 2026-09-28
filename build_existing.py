from pathlib import Path
s=Path('recover.py').read_text(encoding='utf-8-sig')
prefix=s.split("queue=[BASE+'/']")[0]
final=s[s.index('for u,path in mapping.items():'):]
exec(prefix)
for p in archive.glob('*.html'):
    pages[BASE+('/'+p.stem.replace('__','/') if p.stem!='index' else '')]=p.read_text(encoding='utf-8-sig')
texts=list(pages.values())+[p.read_text(encoding='utf-8') for p in assets.glob('*.css')]
for source in texts:
    for u in re.findall(r'https?://[^\s"\'<>\\)]+',unescape(source.replace('\\/','/'))):
        for candidate in {u,u.split('/v1/')[0]}:
            matches=list(assets.glob(hashlib.sha256(candidate.encode()).hexdigest()[:20]+'.*'))
            if matches: mapping[candidate]='assets/'+matches[0].name
exec(final)
