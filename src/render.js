import { CHANNELS, QUESTIONS, fitLabel } from './quiz.js';
import { RESULT, FLAGS, GENERIC_WHY, GENERIC_SKIP, ART } from './content.js';

// Result page body. Pure string building, used by the Worker (/r/{id}) and inlined into the static preview.
// r: output of score(), plus answers and the visitor's first name. o: { ctaUrl }.

function escR(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// The navigator.ca section eyebrow (compass + dashed route). Same markup as brand.js route(), kept here so this
// file stays import-free for the preview build.
const ROUTE = '<div class="ebw" aria-hidden="true"><svg class="ebw-ic" viewBox="-66 -62 132 124"><use href="#navMark" x="-66" y="-62" width="132" height="124"/></svg><span class="rt"><svg viewBox="0 0 200 30"><path class="rt-line" d="M13 15 C40 4 66 26 98 15 S150 5 172 15"/><circle class="rt-start" cx="6" cy="15" r="3.4"/><g transform="translate(186 15)"><path class="rt-x" d="M-6 -6 L6 6 M6 -6 L-6 6"/></g></svg></span></div>';

function fitClass(fit) {
  return fit >= 70 ? 'f-strong' : fit >= 50 ? 'f-good' : fit >= 30 ? 'f-maybe' : 'f-weak';
}

export function resultBody(r, o) {
  const top = r.top, c = RESULT[top];
  const name = (r.name || '').trim().split(/\s+/)[0];
  const why = (r.why[top] || []).slice(0, 4);
  if (why.length < 2) why.push(GENERIC_WHY);
  const second = r.second, last = r.last;
  const secondWhy = (r.why[second] || [])[0];
  const lastWhy = (r.skip[last] || [])[0] || GENERIC_SKIP;

  const bars = r.ranked.map((k, i) => `<li class="${fitClass(r.fit[k])}${i === 0 ? ' top' : ''}">
<span class="fl">${escR(CHANNELS[k].name)}</span>
<span class="ft" aria-hidden="true"><span style="width:${Math.max(3, r.fit[k])}%"></span></span>
<span class="fv"><b>${r.fit[k]}%</b> ${fitLabel(r.fit[k])}</span></li>`).join('');

  const flags = r.flags.map(f => `<div class="flagbox"><h3>${escR(FLAGS[f][0])}</h3><p>${escR(FLAGS[f][1])}</p></div>`).join('');

  const answers = QUESTIONS.filter(q => r.answers[q.id]).map(q => {
    const opt = q.options.find(x => x.id === r.answers[q.id]);
    return `<li><span>${escR(q.q)}</span><b>${escR(opt ? opt.label : '')}</b></li>`;
  }).join('');

  return `
<section class="hero-sub on-dark res-hero">
  <div class="hero-sub-bg" aria-hidden="true"><img src="${ART[top]}" alt="" width="800" height="531"></div>
  <div class="wrap">
    <p class="eyebrow">${name ? escR(name) + ', your' : 'Your'} result</p>
    <h1>${escR(c.headline)}</h1>
    <p class="lede">${escR(c.summary)}</p>
  </div>
</section>

<section class="section"><div class="wrap">
  <div class="head-split">
    <div>${ROUTE}<h2>How Each Option Fits</h2></div>
    <p class="lede">Based on your answers about who you sell to, what you sell, what customers spend and how soon you need results.</p>
  </div>
  <div class="card"><ol class="fits">${bars}</ol></div>
  ${flags ? `<div class="flags">${flags}</div>` : ''}
</div></section>

<section class="section section--paper"><div class="wrap">
  <div class="head-split">
    <div>${ROUTE}<h2>Why ${escR(CHANNELS[top].title)} Fits You</h2></div>
    <p class="lede">Pulled from your own answers.</p>
  </div>
  <div class="card why-card"><ul class="checks">${why.map(w => `<li>${escR(w)}</li>`).join('')}</ul></div>
</div></section>

<section class="section"><div class="wrap">
  <div class="head-split">
    <div>${ROUTE}<h2>Your First 90 Days</h2></div>
    <p class="lede">What getting started looks like, done properly.</p>
  </div>
  <ol class="plan">${c.first90.map(([t, d]) => `<li><h3>${escR(t)}</h3><p>${escR(d)}</p></li>`).join('')}</ol>
  <div class="card measure"><p class="card-k">How you'll know it's working</p><p>${escR(c.measure)}</p></div>
</div></section>

<section class="section section--paper"><div class="wrap">
  <div class="head-split">
    <div>${ROUTE}<h2>What to Watch Out For</h2></div>
    <p class="lede">Every kind of marketing has trade-offs. Here are this one's.</p>
  </div>
  <ul class="watch">${c.watch.map(([t, d]) => `<li><h3>${escR(t)}</h3><p>${escR(d)}</p></li>`).join('')}</ul>
</div></section>

<section class="section"><div class="wrap">
  <div class="pair">
    <div class="card"><p class="card-k">Runner-up</p><h3>${escR(CHANNELS[second].title)}</h3>
      ${secondWhy ? `<p>${escR(secondWhy)}</p>` : ''}<p>${escR(RESULT[second].later)}</p></div>
    <div class="card dim"><p class="card-k">Hold off on</p><h3>${escR(CHANNELS[last].title)}</h3><p>${escR(lastWhy)}</p></div>
  </div>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap"><div class="band-dark on-dark">
  <div class="band-dark-bg" aria-hidden="true"><img src="https://www.navigator.ca/assets/statband-chart.webp" alt="" width="2480" height="658" loading="lazy"></div>
  ${ROUTE}<h2>Get a Second Opinion on This Result</h2>
  <p style="margin-top:1rem;max-width:62ch">The quiz works from your answers alone. It hasn't seen your website, your market or your numbers. Book a free 30-minute strategy call and we'll check this result against all three. If the quiz got it wrong, we'll tell you.</p>
  <div class="ctas"><a class="btn btn--light" href="${escR(o.ctaUrl)}" target="_blank" rel="noopener">Book a free strategy call</a></div>
</div></div></section>

<section class="section" style="padding-top:0"><div class="wrap">
  <div class="faq answers"><details class="faq-item"><summary>Your answers</summary><div class="faq-a"><ul>${answers}</ul></div></details></div>
  <p class="small muted" style="margin-top:1.2rem">This result is a starting point built from your answers, not an audit. ${o.resultUrl ? `Your result link: <a href="${escR(o.resultUrl)}">${escR(o.resultUrl)}</a>` : ''}</p>
</div></section>`;
}
