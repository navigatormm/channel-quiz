import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { score, cleanAnswers, QUESTIONS, CHANNEL_KEYS, fitLabel } from '../src/quiz.js';
import { RESULT, FLAGS } from '../src/content.js';
import { resultBody } from '../src/render.js';
import { ANS } from './harness.mjs';

const top = a => score(a).top;

test('personas land on the channel a strategist would pick', () => {
  assert.equal(top(ANS('local_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k')), 'local', 'plumber');
  assert.equal(top(ANS('local_people', 'impulse', 'want', 'very', 'u500', '20plus', 'now', 'u1k')), 'meta', 'cafe');
  assert.equal(top(ANS('national_biz', 'research', 'long', 'no', '50k', 'few', '3mo', '3_7k')), 'outreach', 'B2B manufacturer');
  assert.equal(top(ANS('national_people', 'impulse', 'want', 'very', 'u500', 'unlimited', 'now', '3_7k')), 'meta', 'online store');
  assert.equal(top(ANS('national_biz', 'research', 'planned', 'no', '5k_50k', '5_20', 'long', '1_3k')), 'seo', 'national professional services');
  assert.equal(top(ANS('local_biz', 'google', 'planned', 'some', '5k_50k', '5_20', '3mo', '3_7k')), 'google', 'local B2B service, decent budget');
  assert.equal(top(ANS('local_people', 'google', 'now', 'some', 'u500', '20plus', 'now', 'u1k')), 'local', 'small local trade on a tight budget');
});

test('visitors keep local search in play; national sellers do not', () => {
  const v = score(ANS('visitors', 'research', 'want', 'very', '500_5k', '20plus', '3mo', '3_7k'));
  assert.ok(v.fit.local >= 50, 'tourism operator local fit ' + v.fit.local);
  const n = score(ANS('national_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k'));
  assert.ok(n.fit.local <= 10);
});

test('flags', () => {
  assert.deepEqual(score(ANS('local_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k', 'quiet', 'depends')).flags, ['foundation', 'speed']);
  assert.deepEqual(score(ANS('national_biz', 'research', 'planned', 'no', '5k_50k', '5_20', 'long', '1_3k', 'untracked', 'days')).flags, ['tracking'], 'no speed flag when SEO wins');
  assert.ok(score(ANS('local_people', 'impulse', 'want', 'very', 'u500', '20plus', 'now', 'u1k')).flags.includes('smallbudget'));
});

test('hot lead = $3k+ budget and results within three months', () => {
  assert.equal(score(ANS('local_biz', 'google', 'planned', 'some', '5k_50k', '5_20', '3mo', '3_7k')).hot, true);
  assert.equal(score(ANS('local_biz', 'google', 'planned', 'some', '5k_50k', '5_20', 'long', '7k')).hot, false);
});

test('every answer combination scores without errors and fits stay 0 to 100', () => {
  let n = 0;
  const walk = (i, a) => {
    if (i === QUESTIONS.length) { const r = score(a); n++; for (const k of CHANNEL_KEYS) assert.ok(r.fit[k] >= 0 && r.fit[k] <= 100); assert.equal(r.ranked.length, 5); return; }
    for (const o of QUESTIONS[i].options) walk(i + 1, { ...a, [QUESTIONS[i].id]: o.id });
  };
  walk(0, {});
  assert.ok(n > 10000);
});

test('every channel can win', () => {
  const wins = new Set();
  const walk = (i, a) => {
    if (i === 8) { wins.add(score({ ...a, website: 'tracked', followup: 'hour' }).top); return; }
    for (const o of QUESTIONS[i].options) walk(i + 1, { ...a, [QUESTIONS[i].id]: o.id });
  };
  walk(0, {});
  assert.deepEqual([...wins].sort(), [...CHANNEL_KEYS].sort());
});

test('cleanAnswers rejects missing and unknown answers', () => {
  const ok = ANS('local_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k');
  assert.deepEqual(cleanAnswers(ok), ok);
  assert.equal(cleanAnswers({ ...ok, budget: 'lots' }), null);
  const { timing, ...missing } = ok;
  assert.equal(cleanAnswers(missing), null);
});

test('copy: no em or en dashes anywhere in source', () => {
  for (const f of ['quiz.js', 'content.js', 'render.js', 'email.js', 'pages/landing.js', 'pages/result.js']) {
    const s = readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
    assert.ok(!/[—–]/.test(s), f + ' has a dash');
  }
});

test('copy: banned words and superlatives stay out', () => {
  const s = ['quiz.js', 'content.js', 'render.js', 'email.js', 'pages/landing.js'].map(f => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8')).join('\n').toLowerCase();
  for (const w of ['unlock', 'elevate', 'game-changer', 'game changer', 'delve', 'seamless', 'robust', 'leading', 'most trusted', 'guarantee']) assert.ok(!s.includes(w), w);
  // "best" is fine as plain advice ("best when", "best customers"); never as a claim about Navigator.
  const claims = s.replace(/best (when|customers|time)|work best|class="best"|best\[k\]|const best =/g, '');
  assert.ok(!/\bbest\b/.test(claims), 'unqualified "best"');
});

test('result body renders every channel with flags', () => {
  for (const k of CHANNEL_KEYS) assert.ok(RESULT[k].first90.length === 3 && RESULT[k].watch.length === 3);
  const r = score(ANS('local_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k', 'quiet', 'depends'));
  const html = resultBody({ ...r, answers: ANS('local_people', 'google', 'now', 'some', '500_5k', '20plus', '3mo', '1_3k', 'quiet', 'depends'), name: 'Pat <b>' }, { ctaUrl: 'https://x.test/book' });
  assert.match(html, /Start With Local Search/);
  assert.match(html, /Pat, your channel result/);
  assert.ok(!html.includes('<b>,'), 'name escaped');
  assert.match(html, new RegExp(FLAGS.foundation[0]));
  assert.match(html, /https:\/\/x\.test\/book/);
  assert.equal(fitLabel(70), 'Strong fit');
});
