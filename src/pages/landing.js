import { CSS } from './css.js';
import { LOGO } from '../assets/logo.js';
import { QUESTIONS, CHANNELS } from '../quiz.js';
import { esc, WHATCONVERTS } from '../lib/util.js';

// One reader (a business owner or marketing manager deciding where to spend), one promise (a straight answer on
// which channel to start with), one action (take the quiz).

const PRIVACY = 'https://www.navigator.ca/privacy-policy/';

export function shell({ title, description = '', body, head = '', tracking = true }) {
  return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>${description ? `<meta name="description" content="${esc(description)}">` : ''}
<meta property="og:title" content="${esc(title)}">${description ? `<meta property="og:description" content="${esc(description)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap">
${tracking ? WHATCONVERTS : ''}${head}<style>${CSS}</style></head>
<body><header class="lp-head"><div class="wrap"><a class="logo" href="https://www.navigator.ca/" aria-label="Navigator Multimedia home">${LOGO}</a><a class="btn-head" href="/#quiz">Take the quiz</a></div></header>
<main>${body}</main>
<footer class="lp-foot"><div class="wrap"><div class="row"><span>Navigator Multimedia</span><span>460 Doyle Ave #201, Kelowna, BC V1Y 0C2</span><span>250-862-9868</span><a href="https://www.navigator.ca/">navigator.ca</a><a href="${PRIVACY}" target="_blank" rel="noopener">Privacy policy</a></div></div></footer>
</body></html>`;
}

const BEST = {
  google: 'Best when people search for what you sell and need it soon.',
  meta: 'Best when what you sell looks good in a photo and people buy on impulse.',
  seo: 'Best when buyers research first and you can play the long game.',
  local: 'Best when customers are nearby and find you on Google Maps.',
  outreach: 'Best when a few big customers are worth chasing one by one.',
};

const FAQ = [
  ['Is this really free?', 'Yes. Answer the questions, tell us where to send your result, and you\'ll see it right away. We email you a copy too.'],
  ['How accurate is it?', 'It\'s a starting point built from your answers, not an audit. It doesn\'t look at your website, your competitors or your numbers. For that, book a free strategy call and we\'ll check the result against the real thing.'],
  ['Can I use more than one channel?', 'Yes, and you probably will as you grow. The quiz tells you where to start, so your first marketing dollars go where they\'re most likely to work.'],
  ['What if I\'m already running ads?', 'Take it anyway. If your result matches what you\'re doing, it\'s worth checking how well it\'s set up. If it doesn\'t match, that\'s worth a conversation.'],
  ['What happens to my email address?', `We use it to send your result and to follow up once about it. You can unsubscribe any time. <a href="${PRIVACY}" target="_blank" rel="noopener">Read our privacy policy</a>.`],
];

// Only what the browser needs: question text and option labels. Weights stay on the server.
const PUBLIC_QUESTIONS = QUESTIONS.map(q => ({ id: q.id, q: q.q, options: q.options.map(o => ({ id: o.id, label: o.label })) }));

export function landingPage({ error = '', values = {}, answers = null, preview = false } = {}) {
  const state = { questions: PUBLIC_QUESTIONS, error, values: { name: values.name || '', email: values.email || '', website: values.website || '' }, answers, preview };
  const body = `
<section class="hero" id="quiz"><div class="wrap">
  <div class="copy">
    <p class="eyebrow">Free 2-minute quiz</p>
    <h1>Which Marketing Channel Should You Start With? <span class="since">Since 1993</span></h1>
    <p class="sub">Answer 10 quick questions about your customers, your budget and your timing. Get a straight answer on where to put your next marketing dollar, and what to skip.</p>
    <p class="body">Google Ads, Facebook and Instagram ads, SEO and AI search, local search or direct outreach. Each one works for some businesses and burns money for others. The difference is how your customers buy.</p>
    <ul class="trust"><li>10 questions</li><li>About 2 minutes</li><li>Result on screen and by email</li></ul>
  </div>
  <div class="qcard" id="qcard" aria-live="polite">
    <p class="ct">Which channel fits your business?</p>
    <p class="cs">The quiz compares five channels against how your customers buy:</p>
    <ul class="chips">${Object.values(CHANNELS).map(c => `<li>${esc(c.name)}</li>`).join('')}</ul>
    <button type="button" class="btn-y" data-start>Start the quiz</button>
    <noscript><p class="err">The quiz needs JavaScript. Call us at 250-862-9868 and we'll walk through it with you.</p></noscript>
  </div>
</div></section>

<section class="band"><div class="wrap">
  <div class="sec-head"><h2>Five Channels, One Honest Answer</h2><p>Every channel below works. None of them works for everyone.</p></div>
  <ul class="chan">${Object.entries(CHANNELS).map(([k, c]) => `<li><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><p class="best">${esc(BEST[k])}</p></li>`).join('')}</ul>
</div></section>

<section class="band mist honest"><div class="wrap">
  <div class="copy">
    <p class="eyebrow">Why we built it</p>
    <h2 class="h">Ask a Vendor and You'll Hear What They Sell</h2>
    <p>An ad agency recommends ads. An SEO agency recommends SEO. That doesn't make either one right for you.</p>
    <p>We run all five channels for clients, so the quiz has no reason to favour one. It looks at how your customers buy, what each one is worth and how fast you need results, then tells you where to start. It also tells you what to hold off on.</p>
  </div>
  <ul class="looks">
    <li>Who your customers are and where they are</li>
    <li>What they do when they need you</li>
    <li>How urgent and how visual your offer is</li>
    <li>What a customer is worth and how many you can take on</li>
    <li>Your budget and how soon you need results</li>
    <li>Whether your website and follow-up are ready for more leads</li>
  </ul>
</div></section>

<section class="band since-band"><div class="wrap">
  <div><h2 class="h">30+ Years of Watching What Works</h2>
  <p>Navigator Multimedia has built and marketed businesses across Canada since 1993. The quiz is the same first question we ask on every strategy call: how do your customers actually buy?</p></div>
  <div class="stats"><div><b>1993</b><span>Founded</span></div><div><b>30+</b><span>Years</span></div></div>
</div></section>

<section class="band faq"><div class="wrap">
  <div class="sec-head"><h2>Questions</h2></div>
  <div class="list">${FAQ.map(([q, a]) => `<details><summary><span>${esc(q)}</span></summary><div class="a">${a}</div></details>`).join('')}</div>
  <p style="margin-top:28px"><a class="btn-y inline" href="#quiz" data-start>Take the quiz</a></p>
</div></section>

<script>window.__CQ=${JSON.stringify(state).replace(/</g, '\\u003c')};</script>
<script>${QUIZ_JS}</script>`;
  return shell({
    title: 'Which Marketing Channel Should You Start With? | Navigator Multimedia',
    description: 'A free 2-minute quiz that compares Google Ads, Facebook and Instagram ads, SEO and AI search, local search and direct outreach against how your customers buy.',
    body,
    tracking: !preview,
  });
}

// Browser side of the quiz. Kept dependency-free and plain ES2017 so it runs everywhere.
// Sends small funnel events to /api/e (start, each answer, gate, submit) so drop-off per question can be measured.
export const QUIZ_JS = `(function(){
var S=window.__CQ,Q=S.questions,N=Q.length,card=document.getElementById('qcard'),answers=S.answers||{},idx=0;
var PRIVACY='${PRIVACY}';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var sid;try{sid=sessionStorage.getItem('cq_sid')}catch(e){}
if(!sid){sid=Math.random().toString(36).slice(2,12);try{sessionStorage.setItem('cq_sid',sid)}catch(e){}}
function ev(e){if(S.preview)return;try{var b=JSON.stringify({s:sid,e:e});if(navigator.sendBeacon){navigator.sendBeacon('/api/e',new Blob([b],{type:'application/json'}))}else{fetch('/api/e',{method:'POST',body:b,keepalive:true,headers:{'content-type':'application/json'}})}}catch(x){}}
var utm={};try{var sp=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_content','gclid','fbclid'].forEach(function(k){if(sp.get(k))utm[k]=sp.get(k).slice(0,120)})}catch(e){}
var started=false;
function start(){if(!started){started=true;ev('start');if(window.fbq)try{fbq('trackCustom','QuizStart')}catch(e){}}idx=0;showQ();card.scrollIntoView({behavior:'smooth',block:'start'})}
function showQ(){var q=Q[idx],pct=Math.round(idx/N*100);
card.innerHTML='<div class="qtop"><button type="button" class="back"'+(idx?'':' hidden')+'>&larr; Back</button><span>Question '+(idx+1)+' of '+N+'</span></div>'+
'<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="'+N+'" aria-valuenow="'+idx+'"><span style="width:'+pct+'%"></span></div>'+
'<h3 tabindex="-1">'+esc(q.q)+'</h3><div class="opts">'+q.options.map(function(o){return '<button type="button" class="opt'+(answers[q.id]===o.id?' sel':'')+'" data-o="'+esc(o.id)+'">'+esc(o.label)+'</button>'}).join('')+'</div>';
card.querySelector('h3').focus({preventScroll:true});
card.querySelector('.back').onclick=function(){idx--;showQ()};
Array.prototype.forEach.call(card.querySelectorAll('.opt'),function(b){b.onclick=function(){answers[q.id]=b.getAttribute('data-o');b.classList.add('sel');ev('q'+(idx+1));setTimeout(function(){idx++;if(idx>=N){gate()}else{showQ()}},160)}})}
function gate(err){var v=S.values||{};ev('gate');
card.innerHTML='<div class="qtop"><button type="button" class="back">&larr; Back</button><span class="ready">Your result is ready</span></div>'+
'<div class="prog"><span style="width:100%"></span></div>'+
'<h3 tabindex="-1">Where should we send your result?</h3><p class="cs">You\\'ll see it on the next screen, and we\\'ll email you a copy to keep.</p>'+
(err?'<p class="err" role="alert">'+esc(err)+'</p>':'')+
'<form method="post" action="/api/submit" novalidate>'+
'<label for="cq-name">First name</label><input id="cq-name" name="name" autocomplete="given-name" required maxlength="80" value="'+esc(v.name)+'">'+
'<label for="cq-email">Work email</label><input id="cq-email" name="email" type="email" autocomplete="email" required maxlength="160" value="'+esc(v.email)+'">'+
'<label for="cq-web">Your website <span class="opt-l">(optional)</span></label><input id="cq-web" name="website" autocomplete="url" inputmode="url" maxlength="200" placeholder="example.com" value="'+esc(v.website)+'">'+
'<div class="hp" aria-hidden="true"><label for="cq-hp">Leave blank</label><input id="cq-hp" name="company_url" tabindex="-1" autocomplete="off"></div>'+
'<input type="hidden" name="answers" value="'+esc(JSON.stringify(answers))+'"><input type="hidden" name="utm" value="'+esc(JSON.stringify(utm))+'"><input type="hidden" name="ref" value="'+esc(document.referrer.slice(0,300))+'"><input type="hidden" name="sid" value="'+esc(sid)+'">'+
'<button type="submit" class="btn-y">Show my result</button>'+
'<p class="fine">By getting your result, you agree that Navigator Multimedia can email you your result and follow up once about it. Unsubscribe any time. <a href="'+PRIVACY+'" target="_blank" rel="noopener">Privacy policy</a></p></form>';
card.querySelector('h3').focus({preventScroll:true});
card.querySelector('.back').onclick=function(){idx=N-1;showQ()};
var f=card.querySelector('form');f.onsubmit=function(e){var n=f.name.value.trim(),m=f.email.value.trim();
if(!n){e.preventDefault();S.values={name:n,email:m,website:f.website.value};gate('Please enter your first name.');return}
if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(m)){e.preventDefault();S.values={name:n,email:m,website:f.website.value};gate('Please enter a valid email address.');return}
ev('submit');var btn=f.querySelector('button[type=submit]');
if(S.preview&&window.__CQ_PREVIEW_SUBMIT){e.preventDefault();window.__CQ_PREVIEW_SUBMIT({name:n,email:m,website:f.website.value},answers);return}
setTimeout(function(){btn.disabled=true;btn.textContent='Working out your result...'},0)}}
Array.prototype.forEach.call(document.querySelectorAll('[data-start]'),function(b){b.addEventListener('click',function(e){e.preventDefault();start()})});
var hb=document.querySelector('.btn-head');if(hb)hb.addEventListener('click',function(e){e.preventDefault();start()});
if(S.answers&&Object.keys(S.answers).length===N){gate(S.error)}
})();`;
