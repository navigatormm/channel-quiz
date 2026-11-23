// Channel Quiz: questions, weights and scoring. No imports, so scripts/build-preview.mjs can inline this file
// into the static preview page and the browser runs exactly the same scoring as the Worker.
//
// How scoring works:
//   Each answer gives every channel 0 to 5 points (w). A channel's fit is its points divided by the most it
//   could have scored, as a percentage. Two hard rules sit on top (see RULES). Questions 9 and 10 carry no
//   points; they raise flags on the result page instead (website, tracking, follow-up speed).
//   `why` is shown on the result when that answer pushed the channel up; `skip` when it pushed it down.

export const CHANNELS = {
  google: { name: 'Google Ads', title: 'Google Ads', short: 'Google Ads', blurb: 'Paid ads at the top of Google when people search for what you sell.' },
  meta: { name: 'Facebook and Instagram ads', title: 'Facebook and Instagram Ads', short: 'Meta ads', blurb: 'Paid ads in front of the right people while they scroll, before they go looking.' },
  seo: { name: 'SEO and AI search', title: 'SEO and AI Search', short: 'SEO and AI search', blurb: 'Showing up in Google results and AI answers without paying per click.' },
  local: { name: 'Local search', title: 'Local Search', short: 'Local search', blurb: 'Your Google Business Profile, Maps listing and reviews, for people searching nearby.' },
  outreach: { name: 'Direct outreach', title: 'Direct Outreach', short: 'Outreach', blurb: 'Reaching out by email, LinkedIn and phone to a hand-picked list of ideal customers.' },
};
export const CHANNEL_KEYS = Object.keys(CHANNELS);

export const QUESTIONS = [
  {
    id: 'who', q: 'Who buys from you?',
    options: [
      { id: 'local_people', label: 'People in my area (homeowners, families, locals)', w: { google: 2, meta: 2, seo: 1, local: 4, outreach: 0 },
        why: { local: 'You sell to people nearby, and nearby is exactly what Google Maps and your Business Profile are built for.' },
        skip: { outreach: 'You sell to individual people nearby, which makes one-by-one outreach slow and awkward.' } },
      { id: 'local_biz', label: 'Businesses in my area', w: { google: 2, meta: 0, seo: 1, local: 3, outreach: 3 },
        why: { local: 'Local businesses still check Google Maps when they look for a supplier, so your listing is part of how they size you up.', outreach: 'You sell to local businesses, which is a list you can name and contact directly.' },
        skip: { meta: 'You sell to businesses, and people scrolling Facebook and Instagram are rarely in buying mode for work.' } },
      { id: 'visitors', label: 'Visitors and travellers coming to my area', w: { google: 3, meta: 3, seo: 3, local: 4, outreach: 0 },
        why: { local: 'Travellers check Google Maps while they plan and when they arrive, so your listing is often their first look at you.', meta: 'Travellers decide where to go from what they see, and Meta puts your photos in front of them while they plan.', seo: 'Trip planners research for weeks, and pages that answer their questions put you on the itinerary.', google: 'Travellers search for things to do and places to stay, and ads put you at the top while they\'re deciding.' },
        skip: { outreach: 'Your customers are travellers you can\'t list in advance, so there\'s no one to reach out to.' } },
      { id: 'national_people', label: 'People across Canada or beyond (online or by delivery)', w: { google: 2, meta: 3, seo: 3, local: 0, outreach: 0 },
        why: { meta: 'Your buyers are spread out, and Meta lets you reach them anywhere without a storefront.', seo: 'Your market isn\'t tied to one town, so every page that ranks can bring in buyers from across the country.' },
        skip: { local: 'You don\'t sell to one local area, so local search won\'t bring you much.' } },
      { id: 'national_biz', label: 'Businesses across Canada or beyond', w: { google: 2, meta: 1, seo: 3, local: 0, outreach: 4 },
        why: { outreach: 'You sell to businesses across a wide area, which means a defined list of companies worth going after one by one.', seo: 'Business buyers research before they buy, and content that answers their questions keeps you on the shortlist.' },
        skip: { local: 'You don\'t sell to one local area, so local search won\'t bring you much.' } },
    ],
  },
  {
    id: 'search', q: 'When someone needs what you sell, what do they do first?',
    options: [
      { id: 'google', label: 'Search Google, often with "near me" or a city name', w: { google: 4, meta: 0, seo: 2, local: 4, outreach: 0 },
        why: { google: 'People search for what you sell when they need it. Google Ads puts you at the top of that search the day you launch.', local: 'Searches with "near me" or a city name show the map first, ahead of the regular results.' },
        skip: { meta: 'Your buyers go looking for you on Google. Social ads reach people before they need you, not while they\'re searching.' } },
      { id: 'research', label: 'Research for a while, reading and comparing before they reach out', w: { google: 1, meta: 1, seo: 4, local: 1, outreach: 1 },
        why: { seo: 'Your buyers research before they reach out. Pages that answer their questions put you in front of them while they decide, in Google and in AI answers.' } },
      { id: 'impulse', label: 'Nothing. They buy when they see it or someone suggests it', w: { google: 0, meta: 4, seo: 0, local: 0, outreach: 2 },
        why: { meta: 'People don\'t go looking for what you sell. Meta ads create the demand by putting it in front of them.' },
        skip: { google: 'People don\'t search for what you sell, so there\'s little for search ads to catch.', seo: 'People don\'t search for what you sell, so there\'s little to rank for.', local: 'People don\'t search for what you sell, so a Maps listing has little to catch.' } },
      { id: 'referral', label: 'Ask people they know for a referral', w: { google: 0, meta: 1, seo: 1, local: 2, outreach: 4 },
        why: { outreach: 'Your business runs on relationships. Outreach builds them on purpose, with a list you choose, instead of waiting for referrals.' },
        skip: { google: 'Your buyers ask people they know rather than search, so search ads have less to catch.' } },
    ],
  },
  {
    id: 'urgency', q: 'How urgent is the need when a customer reaches out?',
    options: [
      { id: 'now', label: 'Urgent. They need it today or this week', w: { google: 4, meta: 0, seo: 1, local: 4, outreach: 0 },
        why: { google: 'Urgent buyers call one of the first businesses they see. Ads put you first.', local: 'Urgent buyers pick from the map and call. Reviews and a complete profile decide who gets that call.' },
        skip: { meta: 'Urgent buyers search, they don\'t scroll. Social ads reach people before they need you, not while they do.', outreach: 'Urgent buyers can\'t wait for a sales conversation to start.' } },
      { id: 'planned', label: 'Planned. They decide within a month or two', w: { google: 3, meta: 2, seo: 2, local: 2, outreach: 1 },
        why: { google: 'Buyers on a one-to-two-month timeline are searching and comparing now, which is when ads catch them.' } },
      { id: 'long', label: 'A long decision. Months, with several people involved', w: { google: 1, meta: 1, seo: 3, local: 0, outreach: 4 },
        why: { outreach: 'Long decisions with several people involved are won by building relationships early, before anyone asks for quotes.', seo: 'Long buying cycles mean lots of research, and that research is where good content earns trust.' },
        skip: { local: 'Long, considered decisions aren\'t made from a map listing.' } },
      { id: 'want', label: 'No rush. It\'s a want, not a need', w: { google: 0, meta: 4, seo: 1, local: 1, outreach: 0 },
        why: { meta: 'When buying is optional, the business that shows up at the right moment with the right picture wins. That\'s what Meta does.' },
        skip: { google: 'Few people urgently search for a want, so there\'s less for search ads to catch.' } },
    ],
  },
  {
    id: 'visual', q: 'Can people get what you sell from a photo or short video?',
    options: [
      { id: 'very', label: 'Yes. It\'s very visual (food, travel, homes, products, before-and-afters)', w: { google: 1, meta: 4, seo: 1, local: 2, outreach: 0 },
        why: { meta: 'What you sell shows well in a picture, and Facebook and Instagram are built around pictures and video.' } },
      { id: 'some', label: 'Somewhat. A photo helps, but it needs explaining', w: { google: 2, meta: 2, seo: 2, local: 1, outreach: 1 } },
      { id: 'no', label: 'Not really. It\'s a service, expertise or something technical', w: { google: 2, meta: 0, seo: 3, local: 1, outreach: 2 },
        why: { seo: 'Expertise is hard to show in a photo but easy to prove in writing. Pages that answer real questions do the selling.' },
        skip: { meta: 'What you sell is hard to show in a photo, which makes social ads harder to win with.' } },
    ],
  },
  {
    id: 'value', q: 'Roughly what is one new customer worth to you over the whole relationship?',
    options: [
      { id: 'u500', label: 'Under $500', w: { google: 1, meta: 3, seo: 2, local: 3, outreach: 0 },
        why: { meta: 'With smaller sales, you need lots of customers at a low cost each, and Meta can reach a lot of people for the money.', local: 'Smaller sales need a steady flow of nearby customers without paying for every click, which is what a strong local listing brings.' },
        skip: { outreach: 'At under $500 a customer, reaching out one by one costs more time than the sale is worth.' } },
      { id: '500_5k', label: '$500 to $5,000', w: { google: 3, meta: 3, seo: 2, local: 3, outreach: 1 },
        why: { google: 'A customer worth hundreds to thousands of dollars can pay for the clicks it took to win them.', meta: 'A customer worth hundreds to thousands of dollars leaves room to pay for the ads that found them.', local: 'Customers in this range are worth asking for a review, and every review helps you win the next one.' } },
      { id: '5k_50k', label: '$5,000 to $50,000', w: { google: 3, meta: 2, seo: 3, local: 2, outreach: 3 },
        why: { outreach: 'A customer worth this much justifies the time it takes to reach out personally.', google: 'At this value, a single new customer can cover a lot of ad spend.', seo: 'Each customer is worth enough that ranking for a handful of buying searches pays off.' } },
      { id: '50k', label: 'More than $50,000', w: { google: 2, meta: 1, seo: 3, local: 1, outreach: 5 },
        why: { outreach: 'When one customer is worth this much, it\'s worth reaching out to each prospect personally.', seo: 'Big-ticket buyers do their homework. Being the business that answers their questions builds trust before the first call.' } },
    ],
  },
  {
    id: 'capacity', q: 'How many new customers could you take on in a month?',
    options: [
      { id: 'few', label: 'A few. Each one is a big deal', w: { google: 1, meta: 0, seo: 2, local: 1, outreach: 4 },
        why: { outreach: 'You only need a few new customers, so you can pick exactly which ones and go after them.' },
        skip: { meta: 'You only need a few customers, and social ads work best when you can take on many.' } },
      { id: '5_20', label: '5 to 20', w: { google: 3, meta: 2, seo: 2, local: 3, outreach: 2 },
        why: { google: 'Ads can be turned up or down to match the number of customers you can handle.', local: 'A steady handful of local customers a month is the kind of flow a strong local listing is built for.' } },
      { id: '20plus', label: '20 or more', w: { google: 3, meta: 3, seo: 3, local: 3, outreach: 0 },
        why: { meta: 'You can take on lots of customers, and Meta can reach lots of people.', google: 'Ads can grow with you as you add capacity.', seo: 'At that volume, people who find you without a paid click keep your cost per customer down.', local: 'With lots of nearby customers a month, your Maps listing has a lot of calls to win.' },
        skip: { outreach: 'You need more customers than one-by-one outreach can bring in.' } },
      { id: 'unlimited', label: 'As many as want to buy (online store, or no real limit)', w: { google: 3, meta: 4, seo: 3, local: 0, outreach: 0 },
        why: { meta: 'With no limit on what you can sell, you can keep raising the budget on ads that work.', google: 'With no ceiling on sales, ads that pay back can keep growing.', seo: 'With no ceiling on sales, every page that ranks keeps adding customers without a cost per click.' },
        skip: { outreach: 'You need more customers than one-by-one outreach can bring in.' } },
    ],
  },
  {
    id: 'timing', q: 'How soon do you need new business coming in?',
    options: [
      { id: 'now', label: 'This month. We have room now', w: { google: 4, meta: 3, seo: 0, local: 1, outreach: 3 },
        why: { google: 'You need business now. Ads start showing the day they go live, while SEO takes months.', meta: 'Meta ads can start bringing in leads within days of launch.', outreach: 'Outreach starts conversations this week, not next quarter.' },
        skip: { seo: 'You need business this month, and SEO takes months to pay off.' } },
      { id: '3mo', label: 'Within three months', w: { google: 3, meta: 3, seo: 1, local: 3, outreach: 3 },
        why: { google: 'Three months gives ads time to launch, learn and improve.', meta: 'Three months gives ads time to launch, learn and improve.', local: 'Fixing a local listing is a short list of jobs, which fits a three-month window.', outreach: 'Three months is enough to build a list, start conversations and book meetings.' } },
      { id: 'long', label: 'We\'re building for the next year or two', w: { google: 1, meta: 1, seo: 4, local: 3, outreach: 1 },
        why: { seo: 'You\'re building for the long run, and SEO builds on itself. Pages that rank keep bringing people in without paying per click.', local: 'Reviews and a strong listing keep paying off year after year.' } },
    ],
  },
  {
    id: 'budget', q: 'What can you put toward marketing each month, including ad spend?',
    options: [
      { id: 'u1k', label: 'Under $1,000', w: { google: 0, meta: 1, seo: 2, local: 4, outreach: 2 },
        why: { local: 'Your Google Business Profile is free to run and brings in calls when it\'s set up well, which suits a tight budget.' },
        skip: { google: 'With under $1,000 a month, ad spend gets thin fast, and Google Ads needs room to learn what works.' } },
      { id: '1_3k', label: '$1,000 to $3,000', w: { google: 2, meta: 2, seo: 3, local: 3, outreach: 3 },
        why: { seo: 'This budget can fund steady content and site improvements month after month, which is what SEO needs.', outreach: 'Outreach costs mostly time and tools, not ad spend, so this budget goes a long way.', local: 'This budget covers proper local listing work with room to spare.' } },
      { id: '3_7k', label: '$3,000 to $7,500', w: { google: 3, meta: 3, seo: 3, local: 2, outreach: 3 },
        why: { google: 'This budget covers ad spend plus proper management, enough for Google to learn what works.', meta: 'This budget covers ad spend plus new creative, enough for Meta to find the people who buy.', seo: 'This budget can fund content, technical fixes and earning links together.', outreach: 'This budget can fund a researched list and real follow-up.' } },
      { id: '7k', label: 'More than $7,500', w: { google: 4, meta: 4, seo: 3, local: 2, outreach: 3 },
        why: { google: 'With this budget you can compete for the most valuable searches in your market.', meta: 'With this budget you can test several ads at once and put money behind the winners.', seo: 'This budget can fund content, technical fixes and earning links together.', outreach: 'This budget can fund a researched list and real follow-up.' } },
    ],
  },
  {
    id: 'website', q: 'How does your website do today?',
    options: [
      { id: 'none', label: 'We don\'t have one, or we\'re embarrassed by it', w: {} },
      { id: 'quiet', label: 'It looks fine, but it rarely brings in leads', w: {} },
      { id: 'untracked', label: 'It brings in leads, but we can\'t tell where they come from', w: {} },
      { id: 'tracked', label: 'It brings in leads, and we know where each one comes from', w: {} },
    ],
  },
  {
    id: 'followup', q: 'When a new lead comes in, how fast does someone get back to them?',
    options: [
      { id: 'hour', label: 'Within the hour', w: {} },
      { id: 'day', label: 'Same day', w: {} },
      { id: 'days', label: 'Within a few days', w: {} },
      { id: 'depends', label: 'Honestly, it depends who\'s around', w: {} },
    ],
  },
];

// Hard rules applied after the points. Each returns a cap and the reason shown to the visitor.
export const RULES = [
  { channel: 'local', when: a => a.who === 'national_people' || a.who === 'national_biz', cap: 10 },
];

export function fitLabel(fit) {
  if (fit >= 70) return 'Strong fit';
  if (fit >= 50) return 'Good fit';
  if (fit >= 30) return 'Possible';
  return 'Weak fit';
}

// Validates answers ({questionId: optionId}). Returns null if anything is missing or unknown.
export function cleanAnswers(raw) {
  const out = {};
  for (const q of QUESTIONS) {
    const v = raw && raw[q.id];
    if (!q.options.some(o => o.id === v)) return null;
    out[q.id] = v;
  }
  return out;
}

export function score(answers) {
  const raw = {}, max = {};
  for (const k of CHANNEL_KEYS) { raw[k] = 0; max[k] = 0; }
  const why = {}, skip = {};
  for (const k of CHANNEL_KEYS) { why[k] = []; skip[k] = []; }

  for (const q of QUESTIONS) {
    const opt = q.options.find(o => o.id === answers[q.id]);
    for (const k of CHANNEL_KEYS) {
      const ceiling = Math.max(0, ...q.options.map(o => o.w[k] || 0));
      if (!ceiling) continue;
      max[k] += ceiling;
      const pts = (opt && opt.w[k]) || 0;
      raw[k] += pts;
      if (opt && opt.why && opt.why[k]) why[k].push({ pts, text: opt.why[k] });
      if (opt && opt.skip && opt.skip[k]) skip[k].push({ pts, text: opt.skip[k] });
    }
  }

  const fit = {};
  for (const k of CHANNEL_KEYS) fit[k] = max[k] ? Math.round((raw[k] / max[k]) * 100) : 0;
  for (const r of RULES) if (r.when(answers)) fit[r.channel] = Math.min(fit[r.channel], r.cap);

  // Ties go to the order in CHANNEL_KEYS, so the result is stable.
  const ranked = CHANNEL_KEYS.slice().sort((a, b) => fit[b] - fit[a] || CHANNEL_KEYS.indexOf(a) - CHANNEL_KEYS.indexOf(b));

  const flags = [];
  const top = ranked[0];
  if (answers.website === 'none' || answers.website === 'quiet') flags.push('foundation');
  if (answers.website === 'untracked') flags.push('tracking');
  if ((answers.followup === 'days' || answers.followup === 'depends') && top !== 'seo') flags.push('speed');
  if (answers.budget === 'u1k' && (top === 'google' || top === 'meta')) flags.push('smallbudget');

  const hot = (answers.budget === '3_7k' || answers.budget === '7k') && (answers.timing === 'now' || answers.timing === '3mo');

  return {
    ranked,
    fit,
    top,
    second: ranked[1],
    last: ranked[ranked.length - 1],
    why: Object.fromEntries(CHANNEL_KEYS.map(k => [k, why[k].sort((a, b) => b.pts - a.pts).map(x => x.text)])),
    skip: Object.fromEntries(CHANNEL_KEYS.map(k => [k, skip[k].map(x => x.text)])),
    flags,
    hot,
  };
}
