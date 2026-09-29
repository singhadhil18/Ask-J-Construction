import urllib.request,urllib.error,json,xml.etree.ElementTree as ET
base='https://askjconstruction.co.za'
for path in ['/','/about.html','/services.html','/projects.html','/contact.html','/customer-testimonials.html','/service-areas-faq.html','/luxury-home-builds.html','/home-renovations.html','/frameless-showers.html','/sitemap.xml','/robots.txt','/release.json','/.git/HEAD','/README.md','/.qa-tools/package.json','/audits/','/not-a-real-page-93842']:
 try:
  with urllib.request.urlopen(base+path,timeout=15) as r:
   data=r.read();print(path,r.status,r.headers.get('Content-Type'),len(data))
   if path=='/sitemap.xml':assert all(e.text.startswith(base+'/') for e in ET.fromstring(data).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'))
   if path=='/release.json':print(data.decode())
 except urllib.error.HTTPError as e:print(path,e.code)
for url in ['http://askjconstruction.co.za/','https://www.askjconstruction.co.za/','https://askjconstruction.co.za/index.html','https://askjconstruction.co.za/about']:
 with urllib.request.urlopen(url,timeout=15) as r:print('REDIRECT',url,'=>',r.url,r.status)
