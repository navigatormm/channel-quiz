import { CHANNELS, QUESTIONS, fitLabel } from './quiz.js';
import { RESULT, FLAGS } from './content.js';
import { esc } from './lib/util.js';

// Postmark (navigator.ca is a verified sender domain on Navigator's Postmark account, same as redesign.navigator.ca).
// Two messages per submission: the result to the person who took the quiz, and a lead alert to NOTIFY_TO with
// Reply-To set to the lead. Optional NOTIFY_WEBHOOK gets the same data as JSON (Zapier, HighLevel, etc.).

async function postmark(env, fetchImpl, msg) {
  const res = await fetchImpl('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', 'X-Postmark-Server-Token': env.POSTMARK_TOKEN },
    body: JSON.stringify({ MessageStream: env.POSTMARK_STREAM || 'outbound', ...msg }),
  });
  if (!res.ok) {
    let detail = '';
    try { const j = await res.json(); detail = `${j.ErrorCode ?? ''} ${j.Message ?? ''}`.trim(); } catch { /* blank */ }
    throw new Error(`Postmark ${res.status} ${detail}`.trim());
  }
}

const team = env => String(env.NOTIFY_TO || '').split(',').map(x => x.trim()).filter(Boolean);
const urlFor = (env, id) => `${env.PUBLIC_ORIGIN || 'https://channel.navigator.ca'}/r/${id}`;

export function leadAlert(env, row, r, answers) {
  const top3 = r.ranked.slice(0, 3).map(k => `${CHANNELS[k].name} ${r.fit[k]}%`).join(', ');
  const lines = [
    `${row.name} <${row.email}>${row.website ? ` (${row.website})` : ''}${row.personal ? ' [personal email]' : ''}`,
    row.phone ? `Phone: ${row.phone}` : '',
    `Result: ${CHANNELS[r.top].name}. Top three: ${top3}.`,
    r.hot ? 'Hot: $2,500+ a month all in, and wants results within three months.' : '',
    r.flags.length ? `Flags: ${r.flags.map(f => FLAGS[f][0]).join('; ')}.` : '',
    '',
    'Answers:',
    ...QUESTIONS.filter(q => answers[q.id]).map(q => `- ${q.q} ${q.options.find(o => o.id === answers[q.id])?.label || ''}`),
    '',
    `Result page: ${urlFor(env, row.id)}`,
    row.utm && row.utm !== '{}' ? `Source: ${row.utm}` : '',
    row.ref ? `Referrer: ${row.ref}` : '',
    '',
    'Marketing consent: yes (ticked the opt-in box on the form).',
    'Reply to this email to reach them directly.',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '');
  const subject = `${r.hot ? 'Hot lead: ' : 'New quiz lead: '}${row.website || row.email} (${CHANNELS[r.top].name})`;
  return { subject, text: lines.join('\n') };
}

export function resultEmail(env, row, r) {
  const c = RESULT[r.top];
  const url = urlFor(env, row.id);
  const first = String(row.name || '').trim().split(/\s+/)[0] || 'there';
  const fits = r.ranked.map(k => `${CHANNELS[k].name}: ${r.fit[k]}% (${fitLabel(r.fit[k])})`);
  const text = [
    `Hi ${first},`,
    '',
    `Thanks for taking the quiz. Your answers point to: ${CHANNELS[r.top].name}.`,
    '',
    c.summary,
    '',
    'How each option fits:',
    ...fits.map(f => '- ' + f),
    '',
    `Your full result, with a 90-day plan and what to watch out for: ${url}`,
    '',
    'The quiz works from your answers alone. If you want a second opinion that looks at your website, your market and your numbers, book a free 30-minute strategy call:',
    env.CTA_URL,
    '',
    'Here\'s to your success!',
    'The Team at Navigator',
    'Navigator Multimedia, 460 Doyle Ave #201, Kelowna, BC V1Y 0C2, 250-862-9868',
  ].join('\n');
  const html = `<div style="font:15px/1.6 Arial,Helvetica,sans-serif;color:#0A0A0A;max-width:560px">
<p>Hi ${esc(first)},</p>
<p>Thanks for taking the quiz. Your answers point to:</p>
<p style="font-size:22px;font-weight:800;margin:8px 0 4px">${esc(c.headline)}</p>
<p>${esc(c.summary)}</p>
<table role="presentation" style="border-collapse:collapse;margin:12px 0 16px">${r.ranked.map(k => `<tr><td style="padding:4px 14px 4px 0">${esc(CHANNELS[k].name)}</td><td style="padding:4px 0;font-weight:700">${r.fit[k]}%</td><td style="padding:4px 0 4px 10px;color:#5f5e5b">${fitLabel(r.fit[k])}</td></tr>`).join('')}</table>
<p><a href="${esc(url)}" style="display:inline-block;background:#0A0A0A;color:#EFEEE8;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px">See your full result</a></p>
<p>Your result page has a 90-day plan for ${esc(CHANNELS[r.top].name.toLowerCase())} and the trade-offs to watch for.</p>
<p>The quiz works from your answers alone. If you'd like a second opinion that looks at your website, your market and your numbers, <a href="${esc(env.CTA_URL)}" style="color:#0A0A0A">book a free 30-minute strategy call</a>.</p>
<p>Here's to your success!<br>The Team at Navigator</p>
<p style="font-size:12px;color:#5f5e5b">Navigator Multimedia, 460 Doyle Ave #201, Kelowna, BC V1Y 0C2, 250-862-9868. You're getting this because you asked for your quiz result at channel.navigator.ca and agreed to hear from us by email. Reply "unsubscribe" and we won't email you again.</p>
</div>`;
  return { subject: `Your quiz result: start with ${CHANNELS[r.top].name}`, text, html };
}

export async function notify(env, row, r, answers, fetchImpl = fetch) {
  const errors = [];
  const to = team(env);
  const from = env.NOTIFY_FROM || 'quiz@navigator.ca';
  if (env.POSTMARK_TOKEN) {
    if (to.length) {
      const { subject, text } = leadAlert(env, row, r, answers);
      try { await postmark(env, fetchImpl, { From: `Channel Quiz <${from}>`, To: to.join(','), ReplyTo: row.email, Subject: subject, TextBody: text, Tag: 'quiz-lead-alert' }); }
      catch (e) { errors.push('lead alert: ' + e.message); }
    }
    if (env.SEND_RESULT_EMAIL !== 'off') {
      const { subject, text, html } = resultEmail(env, row, r);
      try { await postmark(env, fetchImpl, { From: `Navigator Multimedia <${from}>`, To: row.email, ReplyTo: to[0] || from, Subject: subject, TextBody: text, HtmlBody: html, Tag: 'quiz-result' }); }
      catch (e) { errors.push('result email: ' + e.message); }
    }
  }
  if (env.NOTIFY_WEBHOOK) {
    const payload = {
      source: 'channel-quiz', id: row.id, url: urlFor(env, row.id), name: row.name, email: row.email, phone: row.phone, website: row.website,
      personal: !!row.personal, marketing_consent: true, result: r.top, second: r.second, fit: r.fit, flags: r.flags, hot: r.hot, answers,
      utm: JSON.parse(row.utm || '{}'),
    };
    try {
      const res = await fetchImpl(env.NOTIFY_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) errors.push('webhook: HTTP ' + res.status);
    } catch (e) { errors.push('webhook: ' + e.message); }
  }
  return errors;
}
