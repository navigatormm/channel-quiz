// Channel Quiz: questions, weights and scoring. No imports, so scripts/build-preview.mjs can inline this file
// into the static preview page and the browser runs exactly the same scoring as the Worker.
//
// Design rule (v3, 2026-11-23): every question is a fact the owner already knows about their own business.
// Nothing asks them to explain how their customers think or to know anything about marketing.
//
// How scoring works:
//   Each answer gives every channel 0 to 5 points (w). A channel's fit is its points divided by the most it
//   could have scored on the questions that person saw, as a percentage. Hard rules sit on top (see RULES).
//   `only` hides a question unless an earlier answer matches (the reviews question is for local businesses).
//   The website question carries no points; it raises a flag on the result page.
//   `why` is shown on the result when that answer pushed the channel up; `skip` when it pushed it down.

export const CHANNELS = {
  google: { name: 'Google Ads', plain: 'Ads on Google', title: 'Google Ads', short: 'Google Ads', blurb: 'Paid ads at the top of Google when people search for what you sell.' },
  meta: { name: 'Facebook and Instagram ads', plain: 'Ads on Facebook and Instagram', title: 'Facebook and Instagram Ads', short: 'Meta ads', blurb: 'Paid ads in front of the right people while they scroll, before they go looking.' },
  seo: { name: 'SEO and AI search', plain: 'Showing up in Google and AI answers', title: 'SEO and AI Search', short: 'SEO and AI search', blurb: 'Showing up in Google results and AI answers without paying per click.' },
  local: { name: 'Local search', plain: 'Google Maps and reviews', title: 'Local Search', short: 'Local search', blurb: 'Your Google Business Profile, Maps listing and reviews, for people searching nearby.' },
  outreach: { name: 'Direct outreach', plain: 'Reaching out to customers directly', title: 'Direct Outreach', short: 'Outreach', blurb: 'Reaching out by email, LinkedIn and phone to a hand-picked list of ideal customers.' },
};
export const CHANNEL_KEYS = Object.keys(CHANNELS);

export const QUESTIONS = [
  {
    id: 'who', q: 'Who do you sell to?',
    options: [
      { id: 'people', label: 'Mostly people and families', w: { google: 2, meta: 4, seo: 2, local: 3, outreach: 0 },
        why: { meta: 'You sell to people and families, and that\'s who spends time on Facebook and Instagram.' },
        skip: { outreach: 'You sell to people and families, so there\'s no list of customers to contact one by one.' } },
      { id: 'biz', label: 'Mostly other businesses', w: { google: 2, meta: 0, seo: 3, local: 1, outreach: 4 },
        why: { outreach: 'You sell to other businesses, and businesses can be found and contacted directly.', seo: 'Business buyers look things up before they call, so being the one with the answers gets you on their shortlist.' },
        skip: { meta: 'You sell to businesses, and people scrolling Facebook and Instagram are rarely there to buy for work.' } },
      { id: 'both', label: 'Both', w: { google: 2, meta: 2, seo: 2, local: 2, outreach: 2 } },
    ],
  },
  {
    id: 'where', q: 'Where are your customers?',
    options: [
      { id: 'local', label: 'Close by. They come to me, or I go to them', w: { google: 3, meta: 2, seo: 1, local: 5, outreach: 2 },
        why: { local: 'Your customers are close by, and nearby customers pick from Google Maps.', google: 'Google Ads can be limited to the exact area you serve, so you only pay for nearby clicks.' } },
      { id: 'visitors', label: 'Visitors and travellers coming to my area', w: { google: 3, meta: 3, seo: 3, local: 4, outreach: 0 },
        why: { local: 'Travellers check Google Maps while they plan and when they arrive, so your listing is often their first look at you.', meta: 'Travellers pick where to go from what they see, and Facebook and Instagram put your photos in front of them while they plan.', seo: 'People plan trips for weeks, and pages that answer their questions put you on the itinerary.' },
        skip: { outreach: 'Your customers are travellers you can\'t list in advance, so there\'s no one to reach out to.' } },
      { id: 'anywhere', label: 'Anywhere. I ship, or work remotely', w: { google: 2, meta: 3, seo: 4, local: 0, outreach: 3 },
        why: { seo: 'You can sell anywhere, so every page that shows up on Google can bring in customers from across the country.', meta: 'Your customers are spread out, and Facebook and Instagram can reach them wherever they are.' },
        skip: { local: 'You don\'t rely on customers close by, so Google Maps won\'t bring you much.' } },
    ],
  },
  {
    id: 'kind', q: 'Which sounds most like what you sell?',
    options: [
      { id: 'problem', label: 'Something people need when a problem comes up (a leak, a toothache, a legal issue)', w: { google: 5, meta: 0, seo: 2, local: 4, outreach: 0 },
        why: { google: 'People with a problem search Google for someone to fix it. Google Ads puts you at the top of that search from the day you start.', local: 'People with a problem pick from the map and call. Reviews and a complete listing decide who gets that call.' },
        skip: { meta: 'People look for what you sell when a problem comes up. Facebook and Instagram reach them before that, when they aren\'t looking.', outreach: 'You can\'t predict who will have the problem next, so there\'s no one to reach out to ahead of time.' } },
      { id: 'planned', label: 'Something people plan for and compare (a renovation, new equipment, a wedding venue)', w: { google: 3, meta: 2, seo: 4, local: 2, outreach: 2 },
        why: { seo: 'Your customers compare before they buy. Pages that answer their questions put you in front of them while they decide, on Google and in AI answers.', google: 'People planning a purchase search and compare, and ads put you in that comparison.' } },
      { id: 'want', label: 'Something people want but don\'t need (a treat, a hobby, a gift)', w: { google: 0, meta: 5, seo: 1, local: 1, outreach: 0 },
        why: { meta: 'People don\'t go looking for a treat. They buy when they see one, and Facebook and Instagram are where they see it.' },
        skip: { google: 'Few people search for something they don\'t need, so there\'s little for Google Ads to catch.', outreach: 'A want is an impulse buy, and one-by-one outreach is too slow for that.' } },
      { id: 'new', label: 'Something new that most people don\'t know exists yet', w: { google: 0, meta: 3, seo: 1, local: 0, outreach: 4 },
        why: { outreach: 'Nobody searches for something they haven\'t heard of, so you have to go to them. Outreach does that.', meta: 'Nobody searches for something they haven\'t heard of. Facebook and Instagram ads introduce it to the right people.' },
        skip: { google: 'People can\'t search for something they don\'t know exists, so there\'s little for Google Ads to catch.', seo: 'People can\'t search for something they don\'t know exists, so there\'s little to show up for yet.', local: 'People can\'t search for something they don\'t know exists, so a Maps listing has little to catch.' } },
    ],
  },
  {
    id: 'source', q: 'Where do most of your customers come from today?', hint: 'A rough guess is fine.',
    options: [
      { id: 'referral', label: 'Word of mouth and referrals', w: { google: 1, meta: 1, seo: 1, local: 2, outreach: 2 },
        why: { outreach: 'Your business already grows through relationships. Outreach builds new ones on purpose, with people you choose.', local: 'People who hear about you from a friend look you up before they call. Your reviews are what they find.' } },
      { id: 'google', label: 'They find us on Google', w: { google: 2, meta: 0, seo: 2, local: 2, outreach: 0 },
        why: { google: 'Customers already find you on Google, so you know people search for what you sell. Ads get you more of those searches.', seo: 'Customers already find you on Google, so you know people search for what you sell. SEO gets you in front of more of them.', local: 'Customers already find you on Google, which shows people search for what you do nearby.' } },
      { id: 'social', label: 'Social media', w: { google: 0, meta: 2, seo: 0, local: 0, outreach: 0 },
        why: { meta: 'Social media already brings you customers for free. Paying to reach more of the same people is the natural next step.' } },
      { id: 'passby', label: 'They walk or drive past', w: { google: 0, meta: 1, seo: 0, local: 2, outreach: 0 },
        why: { local: 'People who pass your location also look nearby on their phones, and Google Maps is where they look.' } },
      { id: 'sales', label: 'We go out and find them', w: { google: 0, meta: 0, seo: 1, local: 0, outreach: 2 },
        why: { outreach: 'You already win customers by going after them. A proper outreach system makes that steady instead of occasional.' } },
      { id: 'unsure', label: 'Not sure', w: { google: 1, meta: 1, seo: 1, local: 1, outreach: 1 } },
    ],
  },
  {
    id: 'list', q: 'Could you write a list of customers you\'d love to have?',
    options: [
      { id: 'named', label: 'Yes, I could name them', w: { google: 1, meta: 0, seo: 1, local: 0, outreach: 5 },
        why: { outreach: 'You can name the customers you want. When you know exactly who they are, the direct route is to contact them.' },
        skip: { meta: 'You want specific customers you can name, and ads to a broad audience are a roundabout way to reach them.' } },
      { id: 'type', label: 'I know the type, but not the names', w: { google: 2, meta: 2, seo: 2, local: 1, outreach: 3 },
        why: { outreach: 'You know the type of customer you want, and a list of them can be researched and built.' } },
      { id: 'anyone', label: 'No. It could be almost anyone', w: { google: 3, meta: 3, seo: 2, local: 3, outreach: 0 },
        why: { google: 'Your next customer could be anyone, so the way to catch them is to be there when they search.', meta: 'Your next customer could be almost anyone, and Facebook and Instagram are built to reach a lot of people at once.', local: 'Your next customer could be anyone nearby, so you need to be easy to find when they look.' },
        skip: { outreach: 'Your next customer could be almost anyone, so there\'s no list to reach out to.' } },
    ],
  },
  {
    id: 'photos', q: 'Do you have photos or videos of your work you\'d be proud to show off?',
    options: [
      { id: 'lots', label: 'Yes, lots', w: { google: 1, meta: 4, seo: 1, local: 2, outreach: 1 },
        why: { meta: 'You have plenty of photos and videos worth showing off, and that\'s what Facebook and Instagram ads are made of.', local: 'Good photos make a Google Maps listing stand out from the ones around it.' } },
      { id: 'few', label: 'A few', w: { google: 2, meta: 2, seo: 2, local: 1, outreach: 1 } },
      { id: 'none', label: 'Not really. There isn\'t much to see', w: { google: 2, meta: 0, seo: 3, local: 1, outreach: 2 },
        why: { seo: 'What you do is hard to show in a photo but easy to explain in writing, and well-explained pages are what SEO runs on.' },
        skip: { meta: 'There isn\'t much to photograph in what you do, and Facebook and Instagram ads depend on pictures.' } },
    ],
  },
  {
    id: 'value', q: 'What does a typical new customer spend with you in their first year?', hint: 'The total they pay you, not your profit. A rough guess is fine.',
    options: [
      { id: 'u250', label: 'Under $250', w: { google: 0, meta: 3, seo: 2, local: 3, outreach: 0 },
        why: { meta: 'With smaller sales, you need lots of customers at a low cost each, and Meta can reach a lot of people for the money.', local: 'Smaller sales need a steady flow of nearby customers without paying for every click, which is what a strong local listing brings.' },
        skip: { outreach: 'At this price point, reaching out one by one costs more time than a sale is worth.', google: 'At this price point, paying per click leaves little room once you count the clicks that don\'t buy.' } },
      { id: '250_1k', label: '$250 to $1,000', w: { google: 2, meta: 3, seo: 2, local: 3, outreach: 0 },
        why: { meta: 'Customers in this range can be won affordably with ads that show what you sell.', local: 'Customers in this range are worth asking for a review, and every review helps you win the next one.' },
        skip: { outreach: 'At this price point, reaching out one by one costs more time than a sale is worth.' } },
      { id: '1k_5k', label: '$1,000 to $5,000', w: { google: 3, meta: 3, seo: 2, local: 3, outreach: 1 },
        why: { google: 'A customer worth a few thousand dollars can pay for the clicks it took to win them.', meta: 'A customer worth a few thousand dollars leaves room to pay for the ads that found them.', local: 'Customers in this range are worth asking for a review, and every review helps you win the next one.' } },
      { id: '5k_25k', label: '$5,000 to $25,000', w: { google: 3, meta: 2, seo: 3, local: 2, outreach: 3 },
        why: { google: 'At this value, one new customer can cover a lot of ad spend.', seo: 'Each customer is worth enough that ranking for a handful of buying searches pays off.', outreach: 'A customer worth this much justifies the time it takes to reach out personally.' } },
      { id: '25k_100k', label: '$25,000 to $100,000', w: { google: 2, meta: 1, seo: 3, local: 1, outreach: 4 },
        why: { outreach: 'When one customer is worth this much, it\'s worth reaching out to each prospect personally.', seo: 'Big-ticket buyers do their homework. Being the business that answers their questions builds trust before the first call.' } },
      { id: '100k', label: 'More than $100,000', w: { google: 2, meta: 1, seo: 3, local: 1, outreach: 5 },
        why: { outreach: 'When one customer is worth this much, it\'s worth reaching out to each prospect personally.', seo: 'Big-ticket buyers do their homework. Being the business that answers their questions builds trust before the first call.' } },
    ],
  },
  {
    id: 'timing', q: 'How soon do you need more customers?',
    options: [
      { id: 'now', label: 'This month. We have room now', w: { google: 4, meta: 3, seo: 0, local: 1, outreach: 3 },
        why: { google: 'You need business now. Ads start showing the day they go live, while SEO takes months.', meta: 'Meta ads can start bringing in leads within days of launch.', outreach: 'Outreach starts conversations this week, not next quarter.' },
        skip: { seo: 'You need business this month, and SEO takes months to pay off.' } },
      { id: '3mo', label: 'Within three months', w: { google: 3, meta: 3, seo: 1, local: 3, outreach: 3 },
        why: { google: 'Three months gives ads time to launch, learn and improve.', meta: 'Three months gives ads time to launch, learn and improve.', local: 'Fixing a local listing is a short list of jobs, which fits a three-month window.', outreach: 'Three months is enough to build a list, start conversations and book meetings.' } },
      { id: 'long', label: 'We\'re building for the next year or two', w: { google: 1, meta: 1, seo: 4, local: 3, outreach: 2 },
        why: { seo: 'You\'re building for the long run, and SEO builds on itself. Pages that rank keep bringing people in without paying per click.', local: 'Reviews and a strong listing keep paying off year after year.' } },
    ],
  },
  {
    id: 'budget', q: 'What can you spend each month to get more customers, all in?', hint: 'Everything together: ads, agency or freelancer fees, and tools.',
    options: [
      { id: 'u1k', label: 'Under $1,000', w: { google: 0, meta: 0, seo: 2, local: 4, outreach: 2 },
        why: { local: 'Your Google Business Profile is free to run and brings in calls when it\'s set up well, which suits a tight budget.' },
        skip: { google: 'With under $1,000 a month all in, there\'s little left for clicks once the ads are set up and managed.' } },
      { id: '1k_2500', label: '$1,000 to $2,500', w: { google: 1, meta: 2, seo: 3, local: 4, outreach: 3 },
        why: { seo: 'This budget can fund steady content and site improvements month after month, which is what SEO needs.', outreach: 'Outreach costs mostly time and tools, not ad spend, so this budget goes a long way.', local: 'This budget covers proper local listing work with room to spare.' },
        skip: { google: 'At this budget, once the ads are set up and managed, there isn\'t much left for clicks.' } },
      { id: '2500_5k', label: '$2,500 to $5,000', w: { google: 3, meta: 3, seo: 3, local: 3, outreach: 3 },
        why: { google: 'This budget covers ad spend and proper management, enough for Google to learn what works.', meta: 'This budget covers ad spend and fresh creative, enough for Meta to find the people who buy.', seo: 'This budget can fund content, technical fixes and earning links together.', outreach: 'This budget can fund a researched list and real follow-up.', local: 'This budget covers local listing work with room for a second channel.' } },
      { id: '5k_10k', label: '$5,000 to $10,000', w: { google: 4, meta: 4, seo: 3, local: 2, outreach: 3 },
        why: { google: 'With this budget you can compete for the valuable searches in your market.', meta: 'With this budget you can test several ads at once and put money behind the winners.', seo: 'This budget can fund content, technical fixes and earning links together.', outreach: 'This budget can fund a researched list and real follow-up.' } },
      { id: '10k', label: 'More than $10,000', w: { google: 4, meta: 4, seo: 4, local: 2, outreach: 3 },
        why: { google: 'With this budget you can compete for the valuable searches in your market.', meta: 'With this budget you can test several ads at once and put money behind the winners.', seo: 'This budget can fund SEO properly, alongside a paid channel.', outreach: 'This budget can fund a researched list and real follow-up.' } },
    ],
  },
  {
    id: 'reviews', q: 'Roughly how many Google reviews does your business have?', only: { where: ['local', 'visitors'] },
    options: [
      { id: 'few', label: 'None, or just a handful', w: { google: 0, local: 4 },
        why: { local: 'You have very few Google reviews. That\'s the quickest thing to fix, and it costs nothing but asking.' },
        skip: { google: 'With very few Google reviews, people who click an ad and look you up have little to go on. Build reviews first.' } },
      { id: 'mid', label: '10 to 50', w: { google: 2, local: 3 },
        why: { local: 'You have a base of reviews to build on, and a steady habit of asking will move you up the map.' } },
      { id: 'many', label: 'More than 50', w: { google: 4, local: 1 },
        why: { google: 'You already have plenty of Google reviews, so people who click an ad and look you up will like what they find.' } },
      { id: 'unsure', label: 'Not sure', w: { google: 1, local: 3 },
        why: { local: 'You\'re not sure how many Google reviews you have, which usually means the listing hasn\'t had much attention yet.' } },
    ],
  },
  {
    id: 'website', q: 'Does your website bring in calls or enquiries?',
    options: [
      { id: 'regular', label: 'Yes, regularly', w: {} },
      { id: 'sometimes', label: 'Now and then', w: {} },
      { id: 'rarely', label: 'Rarely or never', w: {} },
      { id: 'none', label: 'We don\'t have a website', w: {} },
    ],
  },
];

// Is this question shown, given the answers so far?
export function applies(q, answers) {
  if (!q.only) return true;
  return Object.keys(q.only).every(k => q.only[k].includes(answers[k]));
}

// Hard rules applied after the points.
export const RULES = [
  { channel: 'local', when: a => a.where === 'anywhere', cap: 10 },
  { channel: 'outreach', when: a => a.list === 'anyone', cap: 20 },
  // Nobody scrolls Facebook looking for an emergency fix; nobody searches Google for a treat or something unheard of.
  { channel: 'meta', when: a => a.kind === 'problem', cap: 40 },
  { channel: 'google', when: a => a.kind === 'want' || a.kind === 'new', cap: 35 },
];

export function fitLabel(fit) {
  if (fit >= 70) return 'Strong fit';
  if (fit >= 50) return 'Good fit';
  if (fit >= 30) return 'Possible';
  return 'Weak fit';
}

// Validates answers ({questionId: optionId}). Returns null if a question that applies is missing or unknown.
// Answers to questions that don't apply are dropped.
export function cleanAnswers(raw) {
  const out = {};
  for (const q of QUESTIONS) {
    if (!applies(q, out)) continue;
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
    if (!applies(q, answers)) continue;
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
  if (answers.website === 'none') flags.push('nosite');
  if (answers.website === 'rarely') flags.push('foundation');
  if (answers.budget === 'u1k' && (top === 'google' || top === 'meta')) flags.push('smallbudget');

  const hot = ['2500_5k', '5k_10k', '10k'].includes(answers.budget) && (answers.timing === 'now' || answers.timing === '3mo');

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
