// Builds dist/preview.html: the real landing page and result page in one static file, with scoring done in the
// browser using the same quiz.js, content.js and render.js the Worker uses. No tracking, no emails, nothing saved.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { landingPage } from '../src/pages/landing.js';

const src = f => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace(/^export /gm, '');
const lib = ['quiz.js', 'content.js', 'render.js'].map(src).join('\n');
const CTA = 'https://api.leadconnectorhq.com/widget/bookings/website-strat';

const hook = `<script>(function(){${lib}
window.__CQ_PREVIEW_SUBMIT=function(v,answers){
  var r=score(answers);r.answers=answers;r.name=v.name;
  var main=document.querySelector('main');
  main.innerHTML='<div class="pv">Preview: nothing was saved or emailed. <a href="#" onclick="location.reload();return false">Take it again</a></div>'+resultBody(r,{ctaUrl:'${CTA}'});
  window.scrollTo(0,0);
};})();</script>
`;

let html = landingPage({ preview: true });
html = html.replace('</body>', hook + '</body>')
  .replace('<main>', '<main><div class="pv">Preview of channel.navigator.ca. Results show on screen; nothing is saved or emailed.</div>');
// Artifact pages can't load remote images, so the navigator.ca art is inlined as small WebP data URIs.
// Needs a local copy of navigator-2-0 (NAV_REPO, default ../navigator-2-0) and Python with Pillow.
const NAV = process.env.NAV_REPO || new URL('../../navigator-2-0/', import.meta.url).pathname;
if (existsSync(NAV)) {
  const urls = [...new Set(html.match(/https:\/\/www\.navigator\.ca\/assets\/[\w\/.-]+\.webp/g) || [])];
  for (const u of urls) {
    const file = NAV + 'site/public/assets/' + u.split('/assets/')[1];
    const width = /hero|statband/.test(u) ? 1600 : 640;
    const b64 = execFileSync('python3', ['-c', `import sys,io,base64;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((${width},${width}));b=io.BytesIO();im.save(b,'WEBP',quality=58);print(base64.b64encode(b.getvalue()).decode())`, file]).toString().trim();
    html = html.split(u).join('data:image/webp;base64,' + b64);
  }
}
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/preview.html', import.meta.url), html);
console.log('dist/preview.html', html.length, 'bytes');
