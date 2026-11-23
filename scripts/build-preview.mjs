// Builds dist/preview.html: the real landing page and result page in one static file, with scoring done in the
// browser using the same quiz.js, content.js and render.js the Worker uses. No tracking, no emails, nothing saved.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
<style>.pv{background:#FCBF49;color:#16252F;font-weight:700;font-size:14px;text-align:center;padding:10px 16px}.pv a{color:#16252F}</style>`;

let html = landingPage({ preview: true });
html = html.replace('</body>', hook + '</body>')
  .replace('<main>', '<main><div class="pv">Preview of channel.navigator.ca. Results show on screen; nothing is saved or emailed.</div>');
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/preview.html', import.meta.url), html);
console.log('dist/preview.html', html.length, 'bytes');
