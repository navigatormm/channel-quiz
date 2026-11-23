// Meta Pixel. Nothing renders unless META_PIXEL_ID is set.
// Landing: PageView (plus a QuizStart custom event from the quiz script). Lead fires once, on the first load of
// /r/{id} after a server-accepted submission, never on the button click. The result id is the eventID so Meta
// drops duplicates and a later Conversions API event can share it.
const FRESH = 'cq_new';
export const pixelId = env => String(env?.META_PIXEL_ID || '').replace(/\D/g, '');
const base = id => `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');`;

export function pageViewPixel(env) {
  const id = pixelId(env);
  return id ? `<script>${base(id)}fbq('track','PageView');</script>` : '';
}
export function leadPixel(env, resultId, channel) {
  const id = pixelId(env);
  if (!id) return '';
  const eventId = 'cq-' + String(resultId).replace(/[^a-z0-9]/gi, '');
  return `<script>${base(id)}fbq('track','PageView');fbq('track','Lead',{content_name:'Channel Quiz',content_category:'${String(channel).replace(/[^a-z]/g, '')}'},{eventID:'${eventId}'});</script>`;
}
export const withHead = (page, extra) => (extra ? page.replace('</head>', extra + '</head>') : page);
export const freshCookie = id => `${FRESH}=${id}; Path=/r/${id}; Max-Age=900; HttpOnly; Secure; SameSite=Lax`;
export const clearFreshCookie = id => `${FRESH}=; Path=/r/${id}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
export function freshId(request) {
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)cq_new=([a-z0-9]+)/i);
  return m ? m[1] : '';
}
