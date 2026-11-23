import { CHANNELS, QUESTIONS, fitLabel } from './quiz.js';
import { RESULT, FLAGS, GENERIC_WHY, GENERIC_SKIP } from './content.js';

// Result page body. Pure string building, used by the Worker (/r/{id}) and inlined into the static preview.
// r: output of score(), plus answers and the visitor's first name. o: { ctaUrl }.

function escR(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

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

  const answers = QUESTIONS.map(q => {
    const opt = q.options.find(x => x.id === r.answers[q.id]);
    return `<li><span>${escR(q.q)}</span><b>${escR(opt ? opt.label : '')}</b></li>`;
  }).join('');

  return `
<section class="res-hero"><div class="wrap">
  <p class="eyebrow">${name ? escR(name) + ', your' : 'Your'} channel result</p>
  <h1>${escR(c.headline)}</h1>
  <p class="sub">${escR(c.summary)}</p>
</div></section>

<section class="band"><div class="wrap narrow">
  <div class="sec-head"><h2 class="h">How Each Channel Fits</h2><p>Based on your answers about who buys, how they decide, what they're worth and how fast you need results.</p></div>
  <ol class="fits">${bars}</ol>
  ${flags ? `<div class="flags">${flags}</div>` : ''}
</div></section>

<section class="band mist"><div class="wrap narrow">
  <div class="sec-head"><h2 class="h">Why ${escR(CHANNELS[top].title)} Fits You</h2></div>
  <ul class="why">${why.map(w => `<li>${escR(w)}</li>`).join('')}</ul>
</div></section>

<section class="band"><div class="wrap narrow">
  <div class="sec-head"><h2 class="h">Your First 90 Days</h2><p>What getting started looks like, done properly.</p></div>
  <ol class="plan">${c.first90.map(([t, d]) => `<li><h3>${escR(t)}</h3><p>${escR(d)}</p></li>`).join('')}</ol>
  <p class="measure"><b>How you'll know it's working:</b> ${escR(c.measure)}</p>
</div></section>

<section class="band mist"><div class="wrap narrow">
  <div class="sec-head"><h2 class="h">What to Watch Out For</h2><p>Every channel has trade-offs. Here are this one's.</p></div>
  <ul class="watch">${c.watch.map(([t, d]) => `<li><h3>${escR(t)}</h3><p>${escR(d)}</p></li>`).join('')}</ul>
</div></section>

<section class="band"><div class="wrap narrow">
  <div class="pair">
    <div class="pcard"><p class="eyebrow">Runner-up</p><h3>${escR(CHANNELS[second].name)}</h3>
      ${secondWhy ? `<p>${escR(secondWhy)}</p>` : ''}<p class="muted">${escR(RESULT[second].later)}</p></div>
    <div class="pcard dim"><p class="eyebrow">Hold off on</p><h3>${escR(CHANNELS[last].name)}</h3><p>${escR(lastWhy)}</p></div>
  </div>
</div></section>

<section class="cta-band"><div class="wrap narrow">
  <h2 class="h">Get a Second Opinion on This Result</h2>
  <p>The quiz works from your answers alone. It hasn't seen your website, your market or your numbers. Book a free 30-minute strategy call and we'll check this result against all three. If the quiz got it wrong, we'll tell you.</p>
  <a class="btn-y inline" href="${escR(o.ctaUrl)}" target="_blank" rel="noopener">Book a free strategy call</a>
</div></section>

<section class="band"><div class="wrap narrow">
  <details class="answers"><summary><span>Your answers</span></summary><ul>${answers}</ul></details>
  <p class="small muted">This result is a starting point built from your answers, not an audit. ${o.resultUrl ? `Your result link: <a href="${escR(o.resultUrl)}">${escR(o.resultUrl)}</a>` : ''}</p>
</div></section>`;
}
