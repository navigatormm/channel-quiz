# Channel Quiz

Quiz funnel lead magnet for Navigator Multimedia at `https://channel.navigator.ca`. A visitor answers 10 questions and learns which of five channels to start with: Google Ads, Facebook and Instagram ads, SEO and AI search, local search, or direct outreach. Email is gated before the result. The result page shows a fit score for all five channels, the reasons from their own answers, a 90-day plan, trade-offs, a runner-up, one channel to hold off on, and the strategy-call CTA.

Same stack and deploy pattern as `redesign-risk-audit` and `ownership-check`: one Cloudflare Worker on the Free plan, D1, Postmark, Workers Builds from GitHub.

## Flow

```
GET /            landing + quiz (one question per screen, in the hero card)
POST /api/e      funnel events from the page: start, q1..q10, gate, submit (one row per session per step)
POST /api/submit validate, score, store, email (in the background), 303 to /r/{id}
GET /r/{id}      result page (noindex). First load after submit fires the Meta Lead event once.
GET /health      config check
GET /api/admin/funnel?days=30   drop-off per step, lead count, hot leads, results by channel (Bearer ADMIN_TOKEN)
```

## Scoring (`src/quiz.js`)

Questions 1 to 8 give each channel 0 to 5 points per answer. Fit = points / most possible points for that channel, as a percentage. Labels: 70+ Strong fit, 50 to 69 Good fit, 30 to 49 Possible, under 30 Weak fit.

| # | Question | Mostly separates |
|---|---|---|
| 1 | Who buys from you? | Local vs national, people vs businesses (local search, outreach) |
| 2 | What do they do first when they need you? | Search demand vs discovery vs referral |
| 3 | How urgent is the need? | Google Ads and local vs Meta and outreach |
| 4 | Can a photo or video sell it? | Meta |
| 5 | What is one customer worth? | Outreach at the top end, Meta and local at the bottom |
| 6 | How many new customers a month? | Outreach (few) vs Meta and ads (many) |
| 7 | How soon do you need business? | Paid vs SEO |
| 8 | Monthly budget including ad spend | Paid ads need room to learn |
| 9 | How does the website do today? | Flags only: fix the foundation, or set up tracking |
| 10 | How fast is lead follow-up? | Flag only: speed up follow-up |

Hard rule: national sellers (question 1) get local search capped at 10%. Visitors and travellers keep local search in play.

Hot lead = budget of $3,000+ a month and results wanted within three months. The alert subject starts with "Hot lead:".

Tests cover seven personas (plumber, cafe, B2B manufacturer, online store, national professional services, local B2B service, small local trade), every one of the ~13,000 answer combinations, that every channel can win, flags, and the brand copy rules (no em dashes, no banned words, no unqualified "best"). Tune weights in `QUESTIONS` after the first 50 real results; run `npm test` after any change.

Copy lives in `src/content.js` (result page) and `src/pages/landing.js`. Only the numbers are stored per result; the reasons are rebuilt from the stored answers on display, so copy edits apply to old results too.

## Emails (`src/email.js`)

Postmark, from `quiz@navigator.ca` (navigator.ca is a verified Postmark domain).
- Lead alert to `NOTIFY_TO` (Jessey), Reply-To set to the lead, with every answer, the top three channels, flags and UTM source.
- Result email to the quiz taker with the fit table, the result link and the strategy-call link. `SEND_RESULT_EMAIL = "off"` stops it.
- Optional `NOTIFY_WEBHOOK` gets the same data as JSON (HighLevel inbound webhook or Zapier) for nurture sequences by result.

## Tracking

WhatConverts script on every page (account 172577). Meta Pixel `1495860834011066`: PageView, a `QuizStart` custom event on the first question, and `Lead` once per accepted submission with the result id as eventID and the winning channel as `content_category`, so audiences can be built per result.

## Deploy

1. Create the empty GitHub repo `navigatormm/channel-quiz` and push this folder to `main`.
2. Create the D1 database: `npx wrangler d1 create channel-quiz`. Put the id in `wrangler.toml` (`REPLACE_WITH_D1_ID`), then `npx wrangler d1 execute channel-quiz --remote --file=schema.sql`.
3. Workers & Pages > Create > Import a repository: `navigatormm/channel-quiz`, branch `main`, root `/`, build command blank, deploy command `npx wrangler deploy`.
4. Secrets (Worker > Settings > Variables and Secrets): `POSTMARK_TOKEN` (same server token as redesign-risk-audit), `ADMIN_TOKEN` (any long random string). `NOTIFY_WEBHOOK` optional.
5. Custom domain: Worker > Settings > Domains & Routes > Add > Custom domain > `channel.navigator.ca`.
6. WAF rate limit on `channel.navigator.ca/api/*`: 20 requests per minute per IP (the quiz sends about 13 small events per visitor).
7. Smoke test: `/health` should show `db`, `postmark` and `metaPixel` all `true`. Take the quiz once with a real address and confirm both emails arrive. If one doesn't, the `notify_error` column on that row says why.

## Reading the data

```sql
SELECT created_at, name, email, website, top, second, hot, flags, utm FROM results ORDER BY created_at DESC LIMIT 50;
SELECT top, COUNT(*) FROM results GROUP BY top;
```

Funnel: `curl -H "Authorization: Bearer $ADMIN_TOKEN" https://channel.navigator.ca/api/admin/funnel?days=30`

## Preview

`npm run preview` writes `dist/preview.html`: the real landing and result pages in one static file, scored in the browser with the same code. Nothing is saved or emailed.
