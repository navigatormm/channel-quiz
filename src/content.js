// Result page copy, per channel and per flag. No imports (inlined into the preview by scripts/build-preview.mjs).
// Brand Guide rules: Title Case H1/H2, sentence case H3, no em dashes, no superlatives, no invented figures,
// owner language ("people who find you on Google", not "organic traffic").

export const RESULT = {
  google: {
    headline: 'Start With Google Ads',
    summary: 'Pay to show up at the top of Google when people search for what you sell, and only pay when someone clicks.',
    first90: [
      ['Weeks 1 to 2: set up the basics', 'Pick the searches that bring buyers, not browsers. Build ads and a landing page for your most profitable service, and track every call and form.'],
      ['Weeks 3 to 6: cut the waste', 'Review the actual searches people typed, block the ones that don\'t fit, and move budget to what brings in leads.'],
      ['Weeks 7 to 12: grow what works', 'Raise spend on the campaigns bringing in customers you want, and test new ads against the winners.'],
    ],
    watch: [
      ['It stops when the money stops', 'Ads are rented visibility. Over time, pair them with something you own, like SEO.'],
      ['Loose settings waste money', 'Left on broad settings, Google will spend your budget on loosely related searches.'],
      ['Judge it by customers, not clicks', 'A cheap click that never buys costs more than an expensive one that does.'],
    ],
    measure: 'Cost per lead and cost per customer, tracked from the search all the way to the sale.',
    later: 'Add Google Ads when you need leads faster than rankings can deliver, or to cover searches you don\'t rank for yet.',
  },
  meta: {
    headline: 'Start With Facebook and Instagram Ads',
    summary: 'Put what you sell in front of the right people on Facebook and Instagram, before they ever go looking for it.',
    first90: [
      ['Weeks 1 to 2: one offer, several ads', 'Lead with one clear offer. Make several ads that show it: photos, short videos, before-and-afters.'],
      ['Weeks 3 to 6: let it learn', 'Run the ads side by side, give Meta time to find who responds, then switch off the ones that don\'t bring customers.'],
      ['Weeks 7 to 12: back the winners', 'Put more budget behind the ads that bring customers, and show reminders to people who visited but didn\'t buy.'],
    ],
    watch: [
      ['Ads wear out', 'The same ad stops working after a while, so plan on making new ones regularly.'],
      ['Cheap leads aren\'t always good leads', 'People on social are browsing, not shopping, so expect to qualify harder.'],
      ['Tracking takes care', 'If leads aren\'t counted correctly, Meta learns from the wrong people.'],
    ],
    measure: 'Cost per customer. Not cost per click, and not likes.',
    later: 'Add Meta when you have a clear offer and visuals to show, or to stay in front of people who visited your website.',
  },
  seo: {
    headline: 'Start With SEO and AI Search',
    summary: 'Show up in Google and in AI answers (ChatGPT, Google\'s AI Overviews) for the questions your buyers ask, without paying per click.',
    first90: [
      ['Month 1: fix the foundation', 'Find the searches your buyers use, fix technical problems holding the site back, and give every service its own page.'],
      ['Month 2: answer real questions', 'Publish pages that answer what buyers ask before they buy: costs, comparisons, how it works. Write them so AI tools can quote them.'],
      ['Month 3: earn trust', 'Get mentioned and linked by other credible sites, and put proof on every page: reviews, examples, credentials.'],
    ],
    watch: [
      ['It\'s slow', 'Expect months, not weeks, before rankings bring in steady leads.'],
      ['It builds on itself', 'Pages that rank keep working, which is why it\'s worth starting before you need it.'],
      ['Thin pages don\'t cut it', 'Pages need real expertise and specifics to rank and to get quoted by AI tools.'],
    ],
    measure: 'People who find you on Google, the leads they turn into, and how often AI answers mention you.',
    later: 'Start SEO as soon as you can. It takes months to build, so the best time to begin is before you need it.',
  },
  local: {
    headline: 'Start With Local Search',
    summary: 'Win the map: a complete Google Business Profile, steady reviews and consistent listings, so you\'re one of the first businesses people see nearby.',
    first90: [
      ['Weeks 1 to 2: complete your profile', 'Fill in every field on your Google Business Profile: services, service area, hours and photos. Make your name, address and phone match everywhere they\'re listed.'],
      ['Weeks 3 to 6: build a review habit', 'Ask every happy customer for a Google review with a direct link, and reply to every review you get.'],
      ['Weeks 7 to 12: add local pages', 'Give each main service and service area its own page on your website, and post updates to your profile regularly.'],
    ],
    watch: [
      ['Distance matters', 'You\'ll show up most easily close to your address. It gets harder the farther out you go.'],
      ['Reviews are a habit, not a project', 'Recent reviews matter to the people reading them, so keep them coming.'],
      ['It only covers local searches', 'If you sell beyond your area, you\'ll need a second channel too.'],
    ],
    measure: 'Calls, direction requests and website clicks from your Google Business Profile, plus new reviews each month.',
    later: 'Your Google Business Profile is free, so it\'s worth setting up properly alongside any other channel.',
  },
  outreach: {
    headline: 'Start With Direct Outreach',
    summary: 'Pick the customers you want most, then reach out to them directly by email, LinkedIn and phone.',
    first90: [
      ['Weeks 1 to 3: build the list', 'Define your ideal customer, then research the companies and the right person at each one. A short, accurate list does more than a long, generic one.'],
      ['Weeks 4 to 8: start conversations', 'Send short, personal messages that show you understand their business. Follow up across email, LinkedIn and phone.'],
      ['Weeks 9 to 12: refine and repeat', 'Track who replies and why, sharpen the message, and add new prospects every week.'],
    ],
    watch: [
      ['Follow Canada\'s anti-spam law', 'CASL sets rules on who you can email and what every message must include. Get this right from day one.'],
      ['It takes persistence', 'Replies often come after several follow-ups, not the first message.'],
      ['Someone has to sell', 'Outreach books conversations. Someone on your team needs to show up and run them.'],
    ],
    measure: 'Replies, meetings booked and deals won from your list.',
    later: 'Add outreach when you know exactly who your best customers are and want more like them.',
  },
};

export const FLAGS = {
  foundation: ['Fix the website before you pay for traffic', 'You said your website rarely brings in leads. Almost every channel here sends people to your website, so a site that doesn\'t turn visitors into enquiries wastes what you spend getting them there. Fix it first, or fix it alongside.'],
  tracking: ['Set up lead tracking first', 'You can\'t tell where your leads come from, so you won\'t know whether this channel is working. Track every call and form back to its source before you spend more.'],
  speed: ['Speed up your follow-up', 'You said leads can wait a few days for a reply. People asking for a quote usually ask more than one business. Paying for leads and answering late is how good channels get blamed for bad results.'],
  smallbudget: ['Keep it narrow', 'With under $1,000 a month all in, pick one service and one audience and keep the spend there. Spread thin, no ad gets enough budget to learn.'],
};

export const GENERIC_WHY = 'Your answers about who buys, how they decide and how fast you need results all point here.';
export const GENERIC_SKIP = 'It scored lowest on your answers. Worth another look as your business changes.';

// Chart art from navigator.ca for each channel (cards on the landing page, hero of the result page).
export const ART = {
  google: 'https://www.navigator.ca/assets/brand/chart-ppc-800.webp',
  meta: 'https://www.navigator.ca/assets/brand/chart-social-800.webp',
  seo: 'https://www.navigator.ca/assets/brand/chart-beacon-800.webp',
  local: 'https://www.navigator.ca/assets/brand/chart-okanagan-800.webp',
  outreach: 'https://www.navigator.ca/assets/brand/chart-email-800.webp',
};
