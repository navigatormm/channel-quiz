import { shell } from './landing.js';
import { resultBody } from '../render.js';
import { RESULT } from '../content.js';
import { score } from '../quiz.js';

export function resultPage(row, env) {
  const answers = JSON.parse(row.answers_json);
  // Numbers (fit, ranking, flags) as stored at submission; reasons rebuilt from the answers with today's wording.
  const { why, skip } = score(answers);
  const r = { ...JSON.parse(row.result_json), why, skip, answers };
  r.name = row.name;
  const origin = env.PUBLIC_ORIGIN || 'https://channel.navigator.ca';
  return shell({
    title: `${RESULT[r.top].headline} | Your Channel Quiz Result`,
    body: resultBody(r, { ctaUrl: env.CTA_URL, resultUrl: `${origin}/r/${row.id}` }),
    head: '<meta name="robots" content="noindex,nofollow">',
  });
}
