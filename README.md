# Channel Quiz

Quiz funnel lead magnet for Navigator Multimedia at `https://channel.navigator.ca`. A visitor answers 10 or 11 questions and learns which of five channels to start with: Google Ads, Facebook and Instagram ads, SEO and AI search, local search, or direct outreach. Email is gated before the result. The result page shows a fit score for all five channels, the reasons from their own answers, a 90-day plan, trade-offs, a runner-up, one channel to hold off on, and the strategy-call CTA.

Styled to match the rebuilt navigator.ca (shared kit in `src/pages/brand.js`, same file as in `redesign-risk-audit`; images load from www.navigator.ca/assets). Same stack and deploy pattern as `redesign-risk-audit` and `ownership-check`: one Cloudflare Worker on the Free plan, D1, Postmark, Workers Builds from GitHub.

## Flow

```
GET /            landing + quiz (one question per screen, in the hero card)
POST /api/e      funnel events from the page: start, q1..q11, gate, submit (one row per session per step)
POST /api/submit validate, score, store, email (in the background), 303 to /r/{id}
GET /r/{id}      result page (noindex). First load after submit fires the Meta Lead event once.
GET /health      config check
GET /api/admin/funnel?days=30   drop-off per step, lead count, hot leads, results by channel (Bearer ADMIN_TOKEN)
```

## Scoring (`src/quiz.js`)

Design rule (v3, 2026-11-23): every question is a fact the owner already knows about their own business. Nothing asks them to explain how customers think or to know any marketing terms. Visitor-facing copy says "ways to get customers" or "kind of marketing", never "channel" (a test enforces it).

Each answer gives each channel 0 to 5 points. Fit = points / most possible points on the questions that person saw, as a percentage. Labels: 70+ Strong fit, 50 to 69 Good fit, 30 to 49 Possible, under 30 Weak fit.

| # | Question | Mostly separates |
|---|---|---|
| 1 | Who do you sell to? (people / businesses / both) | Meta vs outreach |
| 2 | Where are your customers? (close by / visitors / anywhere) | Local search in or out |
| 3 | Which sounds most like what you sell? (problem / planned and compared / a want / new and unknown) | Google Ads and local vs SEO vs Meta vs outreach |
| 4 | Where do most of your customers come from today? | Light weight: evidence of where demand already exists. Most useful line in the lead alert |
| 5 | Could you write a list of customers you'd love to have? | Outreach |
| 6 | Do you have photos or videos of your work you'd be proud to show off? | Meta |
| 7 | What does a typical new customer spend in their first year? (revenue, six bands) | Whether paid clicks or one-by-one outreach can pay back |
| 8 | How soon do you need more customers? | Paid vs SEO |
| 9 | What can you spend each month, all in? | Paid ads need room after management costs |
| 10 | Roughly how many Google reviews? (only shown when Q2 is close by or visitors) | Local search vs Google Ads for local businesses |
| 11 | Does your website bring in calls or enquiries? | No points. Flags: no website, or fix the website first |

Hard rules: sells anywhere caps local search at 10%. "Could be almost anyone" on Q5 caps outreach at 20%. A problem purchase caps Meta at 40%. A want or an unknown product caps Google Ads at 35%.

Hot lead = $2,500+ a month all in, and results wanted within three months. The alert subject starts with "Hot lead:".

Tests cover nine personas, the hard rules, the conditional reviews question, every answer combination (about 525,000), that every channel can win, flags, and the brand copy rules. Before launch: run the quiz as 10 existing clients whose right answer is already known, and retune if it misses more than two. Run `npm test` after any change.

Copy lives in `src/content.js` (result page) and `src/pages/landing.js`. Only the numbers are stored per result; the reasons are rebuilt from the stored answers on display, so copy edits apply to old results too.

## Marketing opt-in

The email form has a mandatory, unticked checkbox (wording in `CONSENT_TEXT`, `src/lib/util.js`). No tick, no result: the server rejects the submission and stores nothing. Each result row keeps `consent_at`, `consent_text` and `consent_version` as proof of consent. Navigator's name, mailing address, phone and email sit under the button, as CASL asks for in a consent request. If the wording changes, change `CONSENT_VERSION` too. Existing database: `ALTER TABLE results ADD COLUMN consent_at TEXT; ALTER TABLE results ADD COLUMN consent_text TEXT; ALTER TABLE results ADD COLUMN consent_version TEXT;`

## Emails (`src/email.js`)

Postmark, from `quiz@navigator.ca` (navigator.ca is a verified Postmark domain).
- Lead alert to `NOTIFY_TO` (Jessey), Reply-To set to the lead, with every answer, the top three channels, flags and UTM source.
- Result email to the quiz taker with the fit table, the result link and the strategy-call link. `SEND_RESULT_EMAIL = "off"` stops it.
- Optional `NOTIFY_WEBHOOK` gets the same data as JSON (HighLevel inbound webhook or Zapier) for nurture sequences by result.

## Tracking

WhatConverts script on every page (account 172577). Meta Pixel `1495860834011066`: PageView, a `QuizStart` custom event on the first question, and `Lead` once per accepted submission with the result id as eventID and the winning channel as `content_category`, so audiences can be built per result.

## Deploy

1. Create the empty GitHub repo `navigatormm/channel-quiz` and push this folder to `main`.
2. Create the D1 database: `npx wrangler d1 create channel-quiz`. (Done 2026-11-24: id is in `wrangler.toml`.) Schema: `npx wrangler d1 execute channel-quiz --remote --file=schema.sql`.
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
