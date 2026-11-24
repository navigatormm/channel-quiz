import { score, cleanAnswers } from './quiz.js';
import { landingPage } from './pages/landing.js';
import { resultPage } from './pages/result.js';
import { callPage, callResult } from './pages/call.js';
import { notify } from './email.js';
import { newId, cleanWebsite, cleanPhone, PERSONAL_DOMAINS, CONSENT_TEXT, CONSENT_VERSION } from './lib/util.js';
import { pageViewPixel, leadPixel, withHead, freshCookie, clearFreshCookie, freshId } from './lib/pixel.js';

const html = (body, status = 200, extra = {}) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...extra } });
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
const EVENTS = new Set(['start', 'gate', 'submit', ...Array.from({ length: 11 }, (_, i) => 'q' + (i + 1))]);

const landing = (opts, env, status = 200) => html(withHead(landingPage(opts), pageViewPixel(env)), status);

async function readForm(request) {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await request.json();
  const fd = await request.formData();
  return Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
}

function parseJson(s, fallback) {
  try { const v = JSON.parse(s); return v && typeof v === 'object' ? v : fallback; } catch { return fallback; }
}

async function submit(request, env, ctx, fetchImpl) {
  const f = await readForm(request);
  const answers = cleanAnswers(parseJson(f.answers, {}));
  const consent = f.consent === 'yes' || f.consent === true;
  const values = { name: f.name, email: f.email, phone: f.phone, website: f.website, consent };
  if (f.company_url) return landing({ error: 'Something went wrong. Please try again.', values, answers }, env, 400); // honeypot
  if (!answers) return landing({ error: 'Some answers were missing. Please take the quiz again.', values }, env, 400);
  const name = String(f.name || '').trim().slice(0, 80);
  const email = String(f.email || '').trim().toLowerCase().slice(0, 160);
  if (!name) return landing({ error: 'Please enter your first name.', values, answers }, env, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return landing({ error: 'Please enter a valid email address.', values, answers }, env, 400);
  const phone = cleanPhone(f.phone);
  if (!phone) return landing({ error: 'Please enter a phone number with area code.', values, answers }, env, 400);
  // Mandatory marketing opt-in: no tick, no result, and nothing is stored or emailed.
  if (!consent) return landing({ error: 'Please tick the box so we can email you your result.', values, answers }, env, 400);

  const r = score(answers);
  const utm = parseJson(f.utm, {});
  const row = {
    id: newId(), name, email, phone, website: cleanWebsite(f.website),
    personal: PERSONAL_DOMAINS.has(email.split('@')[1]) ? 1 : 0,
    utm: JSON.stringify(Object.fromEntries(Object.entries(utm).filter(([k]) => /^(utm_\w+|gclid|fbclid)$/.test(k)).map(([k, v]) => [k, String(v).slice(0, 120)]))),
    ref: String(f.ref || '').slice(0, 300),
    sid: String(f.sid || '').replace(/[^a-z0-9]/gi, '').slice(0, 20),
  };
  const { why, skip, ...stored } = r; // store the numbers; the wording is rebuilt from the answers on display, so copy edits apply to old results
  await env.DB.prepare(
    `INSERT INTO results (id, created_at, name, email, website, personal, answers_json, result_json, top, second, hot, flags, utm, ref, sid, consent_at, consent_text, consent_version, phone)
     VALUES (?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)`
  ).bind(row.id, row.name, row.email, row.website, row.personal, JSON.stringify(answers), JSON.stringify(stored), r.top, r.second,
    r.hot ? 1 : 0, r.flags.join(','), row.utm, row.ref, row.sid, CONSENT_TEXT, CONSENT_VERSION, row.phone).run();

  const send = (async () => {
    const errors = await notify(env, row, r, answers, fetchImpl);
    await env.DB.prepare('UPDATE results SET notify_error = ? WHERE id = ?').bind(errors.length ? errors.join(' | ').slice(0, 500) : null, row.id).run();
  })().catch(e => console.error('notify', e));
  if (ctx && ctx.waitUntil) ctx.waitUntil(send); else await send;

  return new Response(null, { status: 303, headers: { location: new URL('/r/' + row.id, request.url).toString(), 'set-cookie': freshCookie(row.id) } });
}

async function event(request, env) {
  let b;
  try { b = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const s = String(b?.s || '').replace(/[^a-z0-9]/gi, '').slice(0, 20), e = String(b?.e || '');
  if (s && EVENTS.has(e)) {
    await env.DB.prepare(`INSERT OR IGNORE INTO events (sid, event, created_at) VALUES (?, ?, datetime('now'))`).bind(s, e).run();
  }
  return new Response(null, { status: 204 });
}

async function funnel(env, days) {
  const since = `-${Math.max(1, Math.min(365, days | 0 || 30))} days`;
  const { results } = await env.DB.prepare(
    `SELECT event, COUNT(DISTINCT sid) AS sessions FROM events WHERE created_at >= datetime('now', ?) GROUP BY event`
  ).bind(since).all();
  const by = Object.fromEntries((results || []).map(r => [r.event, r.sessions]));
  const order = ['start', ...Array.from({ length: 11 }, (_, i) => 'q' + (i + 1)), 'gate', 'submit'];
  const leads = await env.DB.prepare(`SELECT COUNT(*) AS n, SUM(hot) AS hot FROM results WHERE created_at >= datetime('now', ?)`).bind(since).first();
  const tops = await env.DB.prepare(`SELECT top, COUNT(*) AS n FROM results WHERE created_at >= datetime('now', ?) GROUP BY top ORDER BY n DESC`).bind(since).all();
  return { since, funnel: order.map(e => ({ step: e, sessions: by[e] || 0 })), leads: leads?.n || 0, hot: leads?.hot || 0, results: tops.results || [] };
}

export default {
  async fetch(request, env, ctx, fetchImpl = fetch) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p === '/' && request.method === 'GET') return landing({}, env);
      if (p === '/api/submit' && request.method === 'POST') return await submit(request, env, ctx, fetchImpl);
      if (p === '/api/e' && request.method === 'POST') return await event(request, env);
      // Sales-call version: scores and returns the result. Stores nothing, sends nothing.
      if ((p === '/call' || p === '/call/') && request.method === 'GET') return html(callPage(), 200, { 'x-robots-tag': 'noindex' });
      if (p === '/api/score' && request.method === 'POST') {
        let b; try { b = await request.json(); } catch { b = null; }
        const answers = cleanAnswers(b && b.answers);
        return answers ? json({ html: callResult(score(answers)) }) : json({ error: 'incomplete' }, 400);
      }
      if (p === '/health') {
        let db = false;
        try { await env.DB.prepare('SELECT 1').first(); db = true; } catch { /* false */ }
        return json({ ok: true, db, postmark: !!env.POSTMARK_TOKEN, leadEmailTo: env.NOTIFY_TO || null, webhook: !!env.NOTIFY_WEBHOOK, metaPixel: !!String(env.META_PIXEL_ID || '').replace(/\D/g, ''), cta: env.CTA_URL || null });
      }
      if (p === '/api/admin/funnel') {
        if (!env.ADMIN_TOKEN || request.headers.get('authorization') !== 'Bearer ' + env.ADMIN_TOKEN) return json({ error: 'unauthorized' }, 401);
        return json(await funnel(env, +url.searchParams.get('days')));
      }
      const m = p.match(/^\/r\/([a-z0-9]+)\/?$/);
      if (m && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM results WHERE id = ?').bind(m[1]).first();
        if (!row) return html('<h1>Result not found</h1><p><a href="/">Take the quiz</a></p>', 404);
        const fresh = freshId(request) === row.id;
        let body = resultPage(row, env);
        body = withHead(body, fresh ? leadPixel(env, row.id, row.top) : pageViewPixel(env));
        const res = html(body, 200, { 'x-robots-tag': 'noindex' });
        if (fresh) res.headers.append('set-cookie', clearFreshCookie(row.id));
        return res;
      }
      if (p === '/robots.txt') return new Response('User-agent: *\nDisallow: /r/\nDisallow: /api/\n', { headers: { 'content-type': 'text/plain' } });
      return html('<h1>Not found</h1><p><a href="/">Take the quiz</a></p>', 404);
    } catch (e) {
      console.error(e);
      return html('<h1>Something went wrong</h1><p>Please try again in a minute.</p>', 500);
    }
  },
};
