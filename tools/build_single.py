"""Inline css/js into one self-contained file: python3 tools/build_single.py -> dist/inclusive-unitime.html"""
import re,os
r=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
h=open(r+"/index.html",encoding="utf-8").read()
h=h.replace('<link rel="stylesheet" href="css/styles.css">',"<style>\n"+open(r+"/css/styles.css",encoding="utf-8").read()+"</style>")
h=re.sub(r'<script src="(js/[^"]+)"></script>',lambda m:"<script>\n"+open(r+"/"+m.group(1),encoding="utf-8").read()+"</script>",h)
os.makedirs(r+"/dist",exist_ok=True);open(r+"/dist/inclusive-unitime.html","w",encoding="utf-8").write(h)
print("built dist/inclusive-unitime.html",len(h),"bytes")
