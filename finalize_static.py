from pathlib import Path
import re,json
root=Path(__file__).resolve().parent
m=json.loads((root/'recovery-manifest.json').read_text())['assets']
for p in root.glob('*.html'):
    s=p.read_text(encoding='utf-8')
    for remote,local in m.items():
        original=remote.split('/v1/')[0]
        if '/media/' in remote and original in m and '/v1/' in remote:
            s=s.replace(local,m[original])
    s=re.sub(r'(assets/[a-f0-9]+\.(?:bin|png|jpg|jpeg))\)\.(?:png|jpg|jpeg)',r'\1',s)
    s=s.replace('</head>', '''<style>
#comp-jnlmesk0{display:none!important}.recovered-nav{position:absolute;top:65px;right:20px;z-index:100;display:flex;gap:14px;flex-wrap:wrap;max-width:520px;font:14px Arial}.recovered-nav a{color:#222;text-decoration:none}@media(max-width:800px){.recovered-nav{position:relative;top:0;right:0;padding:15px;background:white;max-width:none}}
#comp-jnlmesk0itemsContainer{display:flex!important;flex-wrap:wrap;justify-content:flex-end;overflow:visible!important}
#comp-jnlmesk0itemsContainer>li{width:auto!important;min-width:65px;display:inline-block!important}
#comp-jnlmesk0moreContainer{display:none!important}
</style></head>''')
    nav='<nav class="recovered-nav" aria-label="Main navigation">'+''.join('<a href="'+file+'.html">'+label+'</a>' for file,label in [('index','Home'),('about','About'),('services','Services'),('projects','Projects'),('customer-testimonials','Testimonials'),('contact','Contact')])+'</nav>'
    s=re.sub(r'(<body\b[^>]*>)',lambda match:match.group(1)+nav,s,count=1)
    p.write_text(s,encoding='utf-8')

