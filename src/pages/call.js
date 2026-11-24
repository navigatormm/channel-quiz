import { shell } from './landing.js';
import { QUESTIONS, CHANNELS, fitLabel } from '../quiz.js';
import { RESULT, FLAGS, GENERIC_WHY, GENERIC_SKIP } from '../content.js';
import { esc } from '../lib/util.js';

// Call version of the quiz, for the sales team to fill in while talking to a prospect (/call).
// Every question on one screen, result beside it. Nothing is stored, nothing is emailed, no tracking scripts.
// Scoring runs on the server (POST /api/score) so the weights stay out of the page.

const CALL_CSS = `
.call-top{padding:calc(5rem + 1vw) 0 2rem}
.call-top h1{font-size:clamp(1.8rem,3.4vw,2.6rem);margin:.3rem 0 .5rem;max-width:none}
.call-top .lede{font-size:1rem}
.call{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(1.2rem,3vw,2.4rem);align-items:start;padding:2rem 0 4rem}
.cq{background:#fff;border-radius:14px;padding:1rem 1.1rem 1.1rem;margin-bottom:10px}
.cq.off{display:none}
.cq h3{font-size:1rem;display:flex;gap:.6rem;align-items:baseline}
.cq h3 span{font-family:var(--display);color:var(--label);font-size:.8rem;letter-spacing:.1em;flex:none}
.cq .hint{font-size:.82rem;color:var(--label);margin-top:.2rem}
.cq .chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.7rem}
.cq button{font-size:.88rem;font-weight:600;line-height:1.3;text-align:left;padding:.5rem .8rem;border-radius:10px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
.cq button:hover{box-shadow:inset 0 0 0 1.5px var(--ink)}
.cq button.sel{background:var(--ink);color:var(--paper);box-shadow:none}
.cq.done h3 span{color:#2F6B47}
.res{position:sticky;top:1rem;max-height:calc(100vh - 2rem);overflow:auto;background:#fff;border-radius:16px;padding:1.4rem 1.5rem}
.res .wait{color:var(--ink-2)}
.res .count{font-family:var(--display);font-weight:700;font-size:2.4rem;line-height:1}
.res h2{font-size:clamp(1.5rem,2.4vw,2rem);margin:.2rem 0 .4rem}
.res h3{margin:1.3rem 0 .5rem;font-size:.78rem;letter-spacing:.14em;color:var(--label);font-weight:600}
.res p,.res li{font-size:.93rem;color:var(--ink-2)}
.res .fits{gap:.5rem}
.res .fits li{grid-template-columns:minmax(0,150px) minmax(0,1fr) 110px;gap:.7rem;font-size:.88rem;color:var(--ink)}
.res .fits li.top .fl{font-size:.95rem}
.res ul.pts{padding-left:1.1rem;display:grid;gap:.4rem}
.res .flagbox{background:#FFF8E8;margin-top:.6rem}
.res .two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.res .two b{display:block;font-family:var(--display);text-transform:uppercase;font-size:1.05rem;color:var(--ink)}
.res ol.steps{padding-left:1.1rem;display:grid;gap:.4rem}
.res ol.steps b{color:var(--ink)}
.call-actions{display:flex;gap:.6rem;margin-top:1.2rem}
@media (max-width:900px){.call{grid-template-columns:1fr}.res{position:static;max-height:none}}
`;

// Compact result for the side panel. r = score() output.
export function callResult(r) {
  const top = r.top, c = RESULT[top];
  const why = (r.why[top] || []).slice(0, 4);
  if (why.length < 2) why.push(GENERIC_WHY);
  const bars = r.ranked.map((k, i) => {
    const f = r.fit[k], cls = f >= 70 ? 'f-strong' : f >= 50 ? 'f-good' : f >= 30 ? 'f-maybe' : 'f-weak';
    return `<li class="${cls}${i === 0 ? ' top' : ''}"><span class="fl">${esc(CHANNELS[k].name)}</span><span class="ft" aria-hidden="true"><span style="width:${Math.max(3, f)}%"></span></span><span class="fv"><b>${f}%</b> ${fitLabel(f)}</span></li>`;
  }).join('');
  const flags = r.flags.map(f => `<div class="flagbox"><h3 style="margin:0;color:var(--ink);letter-spacing:.005em;font-size:.95rem">${esc(FLAGS[f][0])}</h3><p>${esc(FLAGS[f][1])}</p></div>`).join('');
  return `<p class="card-k">Recommendation${r.hot ? ' · hot lead' : ''}</p>
<h2>${esc(c.headline)}</h2>
<p>${esc(c.summary)}</p>
<h3>How each option fits</h3><ol class="fits">${bars}</ol>
${flags}
<h3>Why, from their answers</h3><ul class="pts">${why.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
<h3>Next best and what to hold</h3>
<div class="two"><div><b>${esc(CHANNELS[r.second].title)}</b><p>${esc((r.why[r.second] || [])[0] || RESULT[r.second].later)}</p></div>
<div><b>Hold: ${esc(CHANNELS[r.last].title)}</b><p>${esc((r.skip[r.last] || [])[0] || GENERIC_SKIP)}</p></div></div>
<h3>First 90 days</h3><ol class="steps">${c.first90.map(([t, d]) => `<li><b>${esc(t)}.</b> ${esc(d)}</li>`).join('')}</ol>
<h3>Be upfront about</h3><ul class="pts">${c.watch.map(([t, d]) => `<li><b style="color:var(--ink)">${esc(t)}.</b> ${esc(d)}</li>`).join('')}</ul>
<h3>How they'll know it's working</h3><p>${esc(c.measure)}</p>`;
}

export function callPage() {
  const qs = QUESTIONS.map((q, i) => `<div class="cq" data-q="${q.id}"${q.only ? ` data-only='${JSON.stringify(q.only)}'` : ''}>
<h3><span>${String(i + 1).padStart(2, '0')}</span>${esc(q.q)}</h3>${q.hint ? `<p class="hint">${esc(q.hint)}</p>` : ''}
<div class="chips">${q.options.map(o => `<button type="button" data-o="${o.id}">${esc(o.label)}</button>`).join('')}</div></div>`).join('');
  const body = `<style>${CALL_CSS}</style>
<section class="hero-sub on-dark call-top"><div class="wrap">
  <p class="eyebrow">Internal tool, for sales calls</p>
  <h1>Call Quiz</h1>
  <p class="lede">Ask the questions, click the answers. The recommendation appears on the right. Nothing is saved or emailed.</p>
</div></section>
<div class="wrap call">
  <div id="qs">${qs}</div>
  <div class="res" id="res" aria-live="polite"></div>
</div>
<script>${CALL_JS}</script>`;
  return shell({ title: 'Call Quiz | Navigator Multimedia', body, head: '<meta name="robots" content="noindex,nofollow">', tracking: false, ctaHref: '/call', ctaLabel: 'Start over' });
}

const CALL_JS = `(function(){
var answers={},res=document.getElementById('res'),cards=[].slice.call(document.querySelectorAll('.cq')),seq=0;
function shown(c){var o=c.getAttribute('data-only');if(!o)return true;o=JSON.parse(o);for(var k in o){if(answers[k]&&o[k].indexOf(answers[k])<0)return false}return true}
function refresh(){var need=0,have=0;cards.forEach(function(c){var id=c.getAttribute('data-q'),on=shown(c);c.classList.toggle('off',!on);if(!on){delete answers[id];[].forEach.call(c.querySelectorAll('button'),function(b){b.classList.remove('sel')})}else{need++;if(answers[id])have++}c.classList.toggle('done',!!answers[id])});
if(have<need){res.innerHTML='<p class="card-k">Recommendation</p><p class="count">'+have+' of '+need+'</p><p class="wait">answered. The recommendation shows once every question has an answer.</p>';return}
var my=++seq;fetch('/api/score',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({answers:answers})}).then(function(r){return r.json()}).then(function(j){if(my!==seq)return;res.innerHTML=j.html||'<p class="err">Could not score those answers. Try Start over.</p>';res.scrollTop=0}).catch(function(){res.innerHTML='<p class="err">No connection. Check the internet and click an answer again.</p>'})}
cards.forEach(function(c){[].forEach.call(c.querySelectorAll('button'),function(b){b.addEventListener('click',function(){answers[c.getAttribute('data-q')]=b.getAttribute('data-o');[].forEach.call(c.querySelectorAll('button'),function(x){x.classList.toggle('sel',x===b)});refresh()})})});
[].forEach.call(document.querySelectorAll('[data-start]'),function(a){a.addEventListener('click',function(e){e.preventDefault();answers={};cards.forEach(function(c){[].forEach.call(c.querySelectorAll('button'),function(b){b.classList.remove('sel')})});refresh();window.scrollTo(0,0)})});
refresh();
})();`;
