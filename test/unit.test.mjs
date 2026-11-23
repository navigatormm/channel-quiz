import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { score, cleanAnswers, applies, QUESTIONS, CHANNEL_KEYS, fitLabel } from '../src/quiz.js';
import { RESULT, FLAGS } from '../src/content.js';
import { resultBody } from '../src/render.js';
import { ANS } from './harness.mjs';

const top = a => score(a).top;
const P = {
  plumberNew: ANS('people', 'local', 'problem', 'referral', 'anyone', 'few', '1k_5k', '3mo', '1k_2500', 'few'),
  plumberEstablished: ANS('people', 'local', 'problem', 'google', 'anyone', 'few', '1k_5k', 'now', '2500_5k', 'many'),
  cafe: ANS('people', 'local', 'want', 'passby', 'anyone', 'lots', 'u250', 'now', 'u1k', 'mid'),
  manufacturer: ANS('biz', 'anywhere', 'planned', 'sales', 'named', 'few', '100k', '3mo', '2500_5k'),
  store: ANS('people', 'anywhere', 'want', 'social', 'anyone', 'lots', 'u250', 'now', '5k_10k'),
  consultant: ANS('biz', 'anywhere', 'planned', 'referral', 'type', 'none', '5k_25k', 'long', '1k_2500'),
  tourism: ANS('people', 'visitors', 'want', 'google', 'anyone', 'lots', '250_1k', '3mo', '5k_10k', 'mid'),
  newProduct: ANS('biz', 'anywhere', 'new', 'unsure', 'type', 'none', '1k_5k', '3mo', '2500_5k'),
  roofer: ANS('people', 'local', 'planned', 'referral', 'anyone', 'lots', '5k_25k', 'now', '5k_10k', 'many'),
};

test('personas land on the channel a strategist would pick', () => {
  assert.equal(top(P.plumberNew), 'local', 'local trade with few reviews fixes the listing first');
  assert.equal(top(P.plumberEstablished), 'google', 'same trade with 50+ reviews and budget moves to ads');
  assert.equal(top(P.cafe), 'local');
  assert.equal(top(P.manufacturer), 'outreach');
  assert.equal(top(P.store), 'meta');
  assert.equal(top(P.consultant), 'seo');
  assert.equal(top(P.tourism), 'meta');
  assert.equal(top(P.newProduct), 'outreach');
  assert.equal(top(P.roofer), 'google');
});

test('hard rules', () => {
  assert.ok(score(P.store).fit.local <= 10, 'sells anywhere: no local search');
  assert.ok(score(P.cafe).fit.outreach <= 20, 'cannot name customers: no outreach');
  assert.ok(score(P.plumberNew).fit.meta <= 40, 'problem purchase: Meta capped');
  assert.ok(score(P.store).fit.google <= 35, 'a want: Google Ads capped');
  assert.ok(score(P.tourism).fit.local >= 50, 'visitors keep local search in play');
});

test('reviews question only applies to local and visitor businesses', () => {
  assert.equal(applies(QUESTIONS.find(q => q.id === 'reviews'), { where: 'anywhere' }), false);
  assert.equal(cleanAnswers({ ...P.store, reviews: 'many' }).reviews, undefined, 'stray answer dropped');
  const { reviews, ...missing } = P.cafe;
  assert.equal(cleanAnswers(missing), null, 'required when local');
});

test('flags', () => {
  assert.deepEqual(score({ ...P.plumberNew, website: 'rarely' }).flags, ['foundation']);
  assert.deepEqual(score({ ...P.plumberNew, website: 'none' }).flags, ['nosite']);
  assert.ok(score({ ...P.store, budget: 'u1k' }).flags.includes('smallbudget'));
});

test('hot lead = $2,500+ all-in budget and results within three months', () => {
  assert.equal(score(P.manufacturer).hot, true);
  assert.equal(score(P.consultant).hot, false);
});

const each = fn => {
  const walk = (i, a) => {
    if (i === QUESTIONS.length) return fn(a);
    const q = QUESTIONS[i];
    if (!applies(q, a)) return walk(i + 1, a);
    if (q.id === 'website') return walk(i + 1, { ...a, website: 'regular' });
    for (const o of q.options) walk(i + 1, { ...a, [q.id]: o.id });
  };
  walk(0, {});
};

test('every answer combination scores cleanly and every channel can win', () => {
  let n = 0; const wins = new Set();
  each(a => { const r = score(a); n++; wins.add(r.top); for (const k of CHANNEL_KEYS) assert.ok(r.fit[k] >= 0 && r.fit[k] <= 100); });
  assert.ok(n > 100000);
  assert.deepEqual([...wins].sort(), [...CHANNEL_KEYS].sort());
});

test('cleanAnswers rejects missing and unknown answers', () => {
  assert.deepEqual(cleanAnswers(P.cafe), P.cafe);
  assert.equal(cleanAnswers({ ...P.cafe, budget: 'lots' }), null);
  const { timing, ...missing } = P.cafe;
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
  assert.ok(!/channel/.test(['content.js', 'render.js', 'pages/landing.js'].map(f => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8').replace(/\/\/.*$/gm, '')).join('').replace(/CHANNELS|CHANNEL_KEYS|channel-quiz|channel\.navigator/g, '')), 'visitor copy says "channel"');
  for (const w of ['unlock', 'elevate', 'game-changer', 'game changer', 'delve', 'seamless', 'robust', 'leading', 'most trusted', 'guarantee']) assert.ok(!s.includes(w), w);
  // "best" is fine as plain advice ("best when", "best customers"); never as a claim about Navigator.
  const claims = s.replace(/best (when|customers|time)|work best|class="best"|best\[k\]|const best =/g, '');
  assert.ok(!/\bbest\b/.test(claims), 'unqualified "best"');
});

test('result body renders every channel with flags', () => {
  for (const k of CHANNEL_KEYS) assert.ok(RESULT[k].first90.length === 3 && RESULT[k].watch.length === 3);
  const answers = { ...P.plumberNew, website: 'rarely' };
  const r = score(answers);
  const html = resultBody({ ...r, answers, name: 'Pat <b>' }, { ctaUrl: 'https://x.test/book' });
  assert.match(html, /Start With Local Search/);
  assert.match(html, /Pat, your result/);
  assert.ok(!html.includes('<b>,'), 'name escaped');
  assert.match(html, new RegExp(FLAGS.foundation[0]));
  assert.match(html, /https:\/\/x\.test\/book/);
  assert.equal(fitLabel(70), 'Strong fit');
});
