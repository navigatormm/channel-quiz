import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function makeD1() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    async first() { return db.prepare(sql).get(...args) ?? null; },
    async all() { return { results: db.prepare(sql).all(...args) }; },
    async run() { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
  });
  return { prepare: sql => stmt(sql), raw: db };
}

export function fakeFetch(sent) {
  return async (url, opts = {}) => {
    sent.push({ url: String(url), body: opts.body ? JSON.parse(opts.body) : null, headers: opts.headers });
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

export const ANS = (who, search, urgency, visual, value, capacity, timing, budget, website = 'tracked', followup = 'hour') =>
  ({ who, search, urgency, visual, value, capacity, timing, budget, website, followup });
