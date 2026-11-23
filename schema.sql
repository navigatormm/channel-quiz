-- Channel Quiz schema. Apply with:
-- npx wrangler d1 execute channel-quiz --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT, email TEXT NOT NULL, website TEXT, personal INTEGER DEFAULT 0,
  answers_json TEXT NOT NULL,       -- {questionId: optionId}
  result_json TEXT NOT NULL,        -- score() output: ranked, fit, top, second, last, why, skip, flags, hot
  top TEXT, second TEXT, hot INTEGER DEFAULT 0, flags TEXT,
  utm TEXT, ref TEXT, sid TEXT,
  -- Proof of marketing consent (CASL): when they ticked the box and the exact wording they agreed to.
  consent_at TEXT, consent_text TEXT, consent_version TEXT,
  notify_error TEXT
);
CREATE INDEX IF NOT EXISTS results_created ON results (created_at);

-- Funnel events from the quiz page: start, q1..q11, gate, submit. One row per session per step.
CREATE TABLE IF NOT EXISTS events (
  sid TEXT NOT NULL,
  event TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (sid, event)
);
CREATE INDEX IF NOT EXISTS events_created ON events (created_at);
