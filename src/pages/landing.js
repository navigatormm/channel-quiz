import { CSS } from './css.js';
import { QUESTIONS, CHANNELS } from '../quiz.js';
import { ART } from '../content.js';
import { esc, WHATCONVERTS } from '../lib/util.js';
import { FONTS, ASSET, PRIVACY, route, siteHeader, siteFooter } from './brand.js';

// One reader (a business owner or marketing manager deciding where to spend), one promise (a straight answer on
// where to start), one action (take the quiz). Copy rule: say "ways to get customers" or "kind of marketing", not "channel". Styled to match the rebuilt navigator.ca (brand.js).

export function shell({ title, description = '', body, head = '', tracking = true, ctaHref = '/#quiz', ctaLabel = 'Take the quiz' }) {
  return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>${description ? `<meta name="description" content="${esc(description)}">` : ''}
<meta property="og:title" content="${esc(title)}">${description ? `<meta property="og:description" content="${esc(description)}">` : ''}
${FONTS}${tracking ? WHATCONVERTS : ''}${head}<style>${CSS}</style></head>
<body>${siteHeader({ ctaHref, ctaLabel, ctaAttrs: 'data-start' })}
<main id="top">${body}</main>
${siteFooter()}
</body></html>`;
}

const BEST = {
  google: 'Best when people search for what you sell and need it soon.',
  meta: 'Best when you sell to the public and have photos worth showing.',
  seo: 'Best when buyers research first and you can play the long game.',
  local: 'Best when customers are nearby and find you on Google Maps.',
  outreach: 'Best when you sell to businesses you could name.',
};

const FAQ = [
  ['Do I need to know anything about marketing?', 'No. Every question is about your own business: who you sell to, what you sell and where your customers come from today. If you can describe your business, you can answer them.'],
  ['Is this really free?', 'Yes. Answer the questions, tell us where to send your result, and you\'ll see it right away. We email you a copy too.'],
  ['How accurate is it?', 'It\'s a starting point built from your answers, not an audit. It doesn\'t look at your website, your competitors or your numbers. For that, book a free strategy call and we\'ll check the result against the real thing.'],
  ['Can I do more than one?', 'Yes, and you probably will as you grow. The quiz tells you where to start, so your first marketing dollars go where they\'re most likely to work.'],
  ['What if I\'m already running ads?', 'Take it anyway. If your result matches what you\'re doing, it\'s worth checking how well it\'s set up. If it doesn\'t match, that\'s worth a conversation.'],
  ['What happens to my email address?', `We use it to send your result and to follow up once about it. You can unsubscribe any time. <a href="${PRIVACY}" target="_blank" rel="noopener">Read our privacy policy</a>.`],
];

// Only what the browser needs: question text, hints and option labels. Weights stay on the server.
const PUBLIC_QUESTIONS = QUESTIONS.map((q, i) => ({ id: q.id, n: i + 1, q: q.q, hint: q.hint || '', only: q.only || null, options: q.options.map(o => ({ id: o.id, label: o.label })) }));

export function landingPage({ error = '', values = {}, answers = null, preview = false } = {}) {
  const state = { questions: PUBLIC_QUESTIONS, error, values: { name: values.name || '', email: values.email || '', website: values.website || '' }, answers, preview };
  const body = `
<section class="hero-sub on-dark" id="quiz">
  <div class="hero-sub-bg" aria-hidden="true"><img src="${ASSET}hero-ship-wide.webp" alt="" width="2400" height="1029" fetchpriority="high"></div>
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Free 2-minute quiz</p>
      <h1>Need More Customers? Find Out Where to Start.</h1>
      <p class="lede">Answer a few quick questions about your business. You don't need to know anything about marketing. You'll get a straight answer on which kind of marketing fits your business, and which to skip for now.</p>
      <ul class="trust"><li class="chip">About 2 minutes</li><li class="chip">No marketing knowledge needed</li><li class="chip">Result on screen and by email</li><li class="chip">Since 1993</li></ul>
    </div>
    <div class="qcard" id="qcard" aria-live="polite">
      <p class="card-k">Five ways to get customers</p>
      <p class="ct" style="margin-top:.5rem">Which one fits your business?</p>
      <p class="cs">The quiz checks each one against how your business works:</p>
      <ul class="chans">${Object.values(CHANNELS).map(c => `<li>${esc(c.plain)}</li>`).join('')}</ul>
      <button type="button" class="btn btn--block" data-start>Start the quiz</button>
      <noscript><p class="err">The quiz needs JavaScript. Call us at 250 862 9868 and we'll walk through it with you.</p></noscript>
    </div>
  </div>
</section>

<section class="section"><div class="wrap">
  <div class="head-split">
    <div>${route()}<h2>Five Ways to Get Customers. None Works for Everyone.</h2></div>
    <p class="lede">Every one of these brings in customers for the right business, and wastes money for the wrong one. What decides it is who you sell to, what you sell and where your customers are.</p>
  </div>
  <ul class="chan">${Object.entries(CHANNELS).map(([k, c]) => `<li><img src="${ART[k]}" alt="" width="800" height="531" loading="lazy"><h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p><p class="best">${esc(BEST[k])}</p></li>`).join('')}</ul>
</div></section>

<section class="section section--paper"><div class="wrap">
  <div class="head-split">
    <div>${route()}<p class="eyebrow">Why we built it</p><h2>Ask a Vendor and You'll Hear What They Sell</h2></div>
    <div class="lede"><p>An ad agency recommends ads. An SEO agency recommends SEO. That doesn't make either one right for you.</p><p style="margin-top:1rem">We do more than one kind of marketing, so the quiz has no favourite to push. It tells you where to start, and what to hold off on.</p></div>
  </div>
  <div class="card looks-card"><p class="card-k">What the quiz looks at</p>
  <ul class="checks" style="margin-top:.6rem">
    <li>Who you sell to and where they are</li>
    <li>What kind of thing you sell</li>
    <li>Where your customers come from today</li>
    <li>What a customer spends with you</li>
    <li>How soon you need results, and your budget</li>
    <li>Whether your website is ready for more enquiries</li>
  </ul></div>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap"><div class="band-dark on-dark">
  <div class="band-dark-bg" aria-hidden="true"><img src="${ASSET}statband-chart.webp" alt="" width="2480" height="658" loading="lazy"></div>
  <div class="since-band">
    <div>${route()}<h2>30+ Years of Watching What Works</h2>
    <p>Navigator Multimedia has built and marketed businesses across Canada since 1993. The quiz is built on what we've seen work, and not work, for businesses like yours over those years.</p></div>
    <div class="stats"><div><strong>1993</strong><span>Founded</span></div><div><strong>30+</strong><span>Years</span></div></div>
  </div>
</div></div></section>

<section class="section" style="padding-top:0"><div class="wrap">
  <div class="section-head">${route()}<h2>Questions</h2></div>
  <div class="faq">${FAQ.map(([q, a]) => `<details class="faq-item"><summary>${esc(q)}</summary><div class="faq-a">${a}</div></details>`).join('')}</div>
  <div class="ctas"><a class="btn" href="#quiz" data-start>Take the quiz</a></div>
</div></section>

<script>window.__CQ=${JSON.stringify(state).replace(/</g, '\\u003c')};</script>
<script>${QUIZ_JS}</script>`;
  return shell({
    title: 'Need More Customers? Find Out Where to Start | Navigator Multimedia',
    description: 'A free 2-minute quiz for business owners. Answer a few questions about your business and find out which kind of marketing to start with, and which to skip for now.',
    body,
    tracking: !preview,
  });
}

// Browser side of the quiz. Kept dependency-free and plain ES2017 so it runs everywhere.
// Sends small funnel events to /api/e (start, each answer, gate, submit) so drop-off per question can be measured.
export const QUIZ_JS = `(function(){
var S=window.__CQ,ALL=S.questions,Q=ALL,N=ALL.length,card=document.getElementById('qcard'),answers=S.answers||{},idx=0;
function shown(q){if(!q.only)return true;for(var k in q.only){if(answers[k]&&q.only[k].indexOf(answers[k])<0)return false}return true}
function refresh(){Q=ALL.filter(shown);N=Q.length;ALL.forEach(function(q){if(!shown(q))delete answers[q.id]})}
var PRIVACY='${PRIVACY}';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var sid;try{sid=sessionStorage.getItem('cq_sid')}catch(e){}
if(!sid){sid=Math.random().toString(36).slice(2,12);try{sessionStorage.setItem('cq_sid',sid)}catch(e){}}
function ev(e){if(S.preview)return;try{var b=JSON.stringify({s:sid,e:e});if(navigator.sendBeacon){navigator.sendBeacon('/api/e',new Blob([b],{type:'application/json'}))}else{fetch('/api/e',{method:'POST',body:b,keepalive:true,headers:{'content-type':'application/json'}})}}catch(x){}}
var utm={};try{var sp=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_content','gclid','fbclid'].forEach(function(k){if(sp.get(k))utm[k]=sp.get(k).slice(0,120)})}catch(e){}
var started=false;
function start(){if(!started){started=true;ev('start');if(window.fbq)try{fbq('trackCustom','QuizStart')}catch(e){}}idx=0;showQ();card.scrollIntoView({behavior:'smooth',block:'start'})}
function showQ(){refresh();var q=Q[idx],pct=Math.round(idx/N*100);
card.innerHTML='<div class="qtop"><button type="button" class="back"'+(idx?'':' hidden')+'>&larr; Back</button><span class="card-k">Question '+(idx+1)+' of '+N+'</span></div>'+
'<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="'+N+'" aria-valuenow="'+idx+'"><span style="width:'+Math.max(4,pct)+'%"></span></div>'+
'<h3 tabindex="-1">'+esc(q.q)+'</h3>'+(q.hint?'<p class="cs">'+esc(q.hint)+'</p>':'')+'<div class="opts">'+q.options.map(function(o){return '<button type="button" class="opt'+(answers[q.id]===o.id?' sel':'')+'" data-o="'+esc(o.id)+'">'+esc(o.label)+'</button>'}).join('')+'</div>';
card.querySelector('h3').focus({preventScroll:true});
card.querySelector('.back').onclick=function(){idx--;showQ()};
Array.prototype.forEach.call(card.querySelectorAll('.opt'),function(b){b.onclick=function(){answers[q.id]=b.getAttribute('data-o');b.classList.add('sel');ev('q'+q.n);setTimeout(function(){refresh();idx=Q.indexOf(q)+1;if(idx>=N){gate()}else{showQ()}},160)}})}
function gate(err){var v=S.values||{};ev('gate');
card.innerHTML='<div class="qtop"><button type="button" class="back">&larr; Back</button><span class="ready">Your result is ready</span></div>'+
'<div class="prog"><span style="width:100%"></span></div>'+
'<h3 tabindex="-1">Where should we send your result?</h3><p class="cs">You\\'ll see it on the next screen, and we\\'ll email you a copy to keep.</p>'+
(err?'<p class="err" role="alert">'+esc(err)+'</p>':'')+
'<form method="post" action="/api/submit" novalidate>'+
'<div class="field"><label for="cq-name">First name</label><input id="cq-name" name="name" autocomplete="given-name" required maxlength="80" value="'+esc(v.name)+'"></div>'+
'<div class="field"><label for="cq-email">Work email</label><input id="cq-email" name="email" type="email" autocomplete="email" required maxlength="160" value="'+esc(v.email)+'"></div>'+
'<div class="field"><label for="cq-web">Your website <span class="opt-l">(optional)</span></label><input id="cq-web" name="website" autocomplete="url" inputmode="url" maxlength="200" placeholder="example.com" value="'+esc(v.website)+'"></div>'+
'<div class="hp" aria-hidden="true"><label for="cq-hp">Leave blank</label><input id="cq-hp" name="company_url" tabindex="-1" autocomplete="off"></div>'+
'<input type="hidden" name="answers" value="'+esc(JSON.stringify(answers))+'"><input type="hidden" name="utm" value="'+esc(JSON.stringify(utm))+'"><input type="hidden" name="ref" value="'+esc(document.referrer.slice(0,300))+'"><input type="hidden" name="sid" value="'+esc(sid)+'">'+
'<button type="submit" class="btn btn--block">Show my result</button>'+
'<p class="fine">By getting your result, you agree that Navigator Multimedia can email you your result and follow up once about it. Unsubscribe any time. <a href="'+PRIVACY+'" target="_blank" rel="noopener">Privacy policy</a></p></form>';
card.querySelector('h3').focus({preventScroll:true});
card.querySelector('.back').onclick=function(){refresh();idx=N-1;showQ()};
var f=card.querySelector('form');f.onsubmit=function(e){var n=f.name.value.trim(),m=f.email.value.trim();
if(!n){e.preventDefault();S.values={name:n,email:m,website:f.website.value};gate('Please enter your first name.');return}
if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(m)){e.preventDefault();S.values={name:n,email:m,website:f.website.value};gate('Please enter a valid email address.');return}
ev('submit');var btn=f.querySelector('button[type=submit]');
if(S.preview&&window.__CQ_PREVIEW_SUBMIT){e.preventDefault();window.__CQ_PREVIEW_SUBMIT({name:n,email:m,website:f.website.value},answers);return}
setTimeout(function(){btn.disabled=true;btn.textContent='Working out your result...'},0)}}
Array.prototype.forEach.call(document.querySelectorAll('[data-start]'),function(b){b.addEventListener('click',function(e){e.preventDefault();start()})});
if(S.answers&&Object.keys(S.answers).length){refresh();gate(S.error)}
})();`;
