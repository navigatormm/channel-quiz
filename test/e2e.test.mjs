import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import { makeD1, fakeFetch, ANS } from './harness.mjs';

const ENV = () => ({ DB: makeD1(), POSTMARK_TOKEN: 'pm', NOTIFY_TO: 'jessey@navigator.ca', NOTIFY_FROM: 'quiz@navigator.ca', CTA_URL: 'https://book.test', PUBLIC_ORIGIN: 'https://channel.navigator.ca', META_PIXEL_ID: '123', ADMIN_TOKEN: 'secret' });
const form = obj => { const f = new FormData(); for (const [k, v] of Object.entries(obj)) f.append(k, v); return f; };
const answers = ANS('local_biz', 'google', 'planned', 'some', '5k_25k', '5_20', '3mo', '2500_5k', 'untracked', 'day');

test('landing renders the quiz with questions but no weights', async () => {
  const res = await worker.fetch(new Request('https://channel.navigator.ca/'), ENV());
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /Which Marketing Channel Should You Start With\?/);
  assert.match(body, /fbq\('track','PageView'\)/);
  assert.ok(body.includes('"id":"budget"'));
  assert.ok(!body.includes('"w":'), 'weights not shipped to the browser');
});

test('submit stores, emails both people, redirects, and the result page fires Lead once', async () => {
  const env = ENV(), sent = [];
  const res = await worker.fetch(new Request('https://channel.navigator.ca/api/submit', { method: 'POST', body: form({ name: 'Pat', email: 'pat@acme.ca', website: 'https://www.acme.ca/about', answers: JSON.stringify(answers), utm: JSON.stringify({ utm_source: 'meta', evil: 'x' }), ref: '', sid: 'abc123' }) }), env, null, fakeFetch(sent));
  assert.equal(res.status, 303);
  const loc = res.headers.get('location');
  const id = loc.split('/r/')[1];
  const row = await env.DB.prepare('SELECT * FROM results WHERE id = ?').bind(id).first();
  assert.equal(row.website, 'acme.ca');
  assert.equal(row.top, 'google');
  assert.equal(row.hot, 1);
  assert.equal(row.flags, 'tracking');
  assert.equal(row.utm, '{"utm_source":"meta"}');
  assert.equal(row.notify_error, null);
  assert.ok(!JSON.parse(row.result_json).why, 'wording not stored');

  const pm = sent.filter(s => s.url.includes('postmarkapp'));
  assert.equal(pm.length, 2);
  const alert = pm.find(s => s.body.To === 'jessey@navigator.ca').body;
  assert.match(alert.Subject, /^Hot lead: acme\.ca \(Google Ads\)$/);
  assert.equal(alert.ReplyTo, 'pat@acme.ca');
  assert.match(alert.TextBody, /How fast does someone get back|how fast does someone get back/i);
  const mine = pm.find(s => s.body.To === 'pat@acme.ca').body;
  assert.match(mine.Subject, /Google Ads/);
  assert.match(mine.TextBody, /Here's to your success!\nThe Team at Navigator/);
  assert.ok(!/[—–]/.test(mine.TextBody + mine.HtmlBody + alert.TextBody));

  const cookie = res.headers.get('set-cookie').split(';')[0];
  const first = await worker.fetch(new Request(loc, { headers: { cookie } }), env);
  const html = await first.text();
  assert.match(html, /Start With Google Ads/);
  assert.match(html, /fbq\('track','Lead'/);
  assert.match(html, /Set up lead tracking first/);
  assert.match(first.headers.get('set-cookie'), /Max-Age=0/);
  const again = await (await worker.fetch(new Request(loc), env)).text();
  assert.ok(!again.includes("'Lead'"));
});

test('bad submissions go back to the form with the answers kept', async () => {
  const env = ENV();
  let res = await worker.fetch(new Request('https://x/api/submit', { method: 'POST', body: form({ name: 'Pat', email: 'nope', answers: JSON.stringify(answers) }) }), env, null, fakeFetch([]));
  assert.equal(res.status, 400);
  const body = await res.text();
  assert.match(body, /valid email/);
  assert.match(body, /"answers":\{"who":"local_biz"/);
  res = await worker.fetch(new Request('https://x/api/submit', { method: 'POST', body: form({ name: 'Pat', email: 'p@a.ca', answers: '{"who":"local_biz"}' }) }), env, null, fakeFetch([]));
  assert.match(await res.text(), /Some answers were missing/);
  res = await worker.fetch(new Request('https://x/api/submit', { method: 'POST', body: form({ name: 'Bot', email: 'b@a.ca', company_url: 'spam', answers: JSON.stringify(answers) }) }), env, null, fakeFetch([]));
  assert.equal(res.status, 400);
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM results').first()).n, 0);
});

test('funnel events and admin report', async () => {
  const env = ENV();
  for (const [s, e] of [['a1', 'start'], ['a1', 'q1'], ['a1', 'q1'], ['b2', 'start'], ['b2', 'bogus']]) {
    const r = await worker.fetch(new Request('https://x/api/e', { method: 'POST', body: JSON.stringify({ s, e }), headers: { 'content-type': 'application/json' } }), env);
    assert.equal(r.status, 204);
  }
  assert.equal((await worker.fetch(new Request('https://x/api/admin/funnel'), env)).status, 401);
  const rep = await (await worker.fetch(new Request('https://x/api/admin/funnel', { headers: { authorization: 'Bearer secret' } }), env)).json();
  assert.equal(rep.funnel[0].sessions, 2);
  assert.equal(rep.funnel[1].sessions, 1);
});

test('health and robots', async () => {
  const h = await (await worker.fetch(new Request('https://x/health'), ENV())).json();
  assert.equal(h.db, true);
  assert.equal(h.postmark, true);
  assert.match(await (await worker.fetch(new Request('https://x/robots.txt'), ENV())).text(), /Disallow: \/r\//);
});
