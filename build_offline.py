from pathlib import Path
import base64
import re

root = Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
data = (root / 'data.js').read_text(encoding='utf-8')
app = (root / 'app.js').read_text(encoding='utf-8')
favicon = (root / 'assets' / 'favicon.svg').read_bytes()
favicon_uri = 'data:image/svg+xml;base64,' + base64.b64encode(favicon).decode('ascii')

html = html.replace(
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
    f'<link rel="icon" href="{favicon_uri}" type="image/svg+xml">'
)
html = re.sub(r'<link rel="stylesheet" href="styles\.css(?:\?[^"]*)?">', lambda _: f'<style>\n{css}\n</style>', html, count=1)
for image in sorted((root / 'assets' / 'artifacts').glob('*.jpg')):
    uri = 'data:image/jpeg;base64,' + base64.b64encode(image.read_bytes()).decode('ascii')
    data = data.replace(f'assets/artifacts/{image.name}', uri)
html = re.sub(r'<script src="data\.js(?:\?[^"]*)?"></script>', lambda _: f'<script>\n{data}\n</script>', html, count=1)
html = re.sub(r'<script src="app\.js(?:\?[^"]*)?"></script>', lambda _: f'<script>\n{app}\n</script>', html, count=1)

out = root / '纹以载道_离线版.html'
out.write_text(html, encoding='utf-8')
print('已生成', out)
