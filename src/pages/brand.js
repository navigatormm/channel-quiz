import { LOGO } from '../assets/logo.js';
import { NAVMARK_SYMBOL } from '../assets/navmark.js';

// Navigator brand kit for landing pages on navigator.ca subdomains, matched to the rebuilt navigator.ca
// (repo navigatormm/navigator-2-0, site/public/style.css, Nov 2026): parchment ground, ink type, Oswald uppercase
// display, Inter Tight body, pill buttons, the compass mark with its dashed red "set course" route, dark bands
// over the antique chart art. Images load from www.navigator.ca so they stay in step with the main site.
// Same file in redesign-risk-audit and channel-quiz: change both together.

export const ASSET = 'https://www.navigator.ca/assets/';
export const PRIVACY = 'https://www.navigator.ca/privacy-policy/';
export const PHONE = '250 862 9868';
export const PHONE_TEL = '+12508629868';
export const EMAIL = 'hello@navigator.ca';

export const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap">';

// The section eyebrow from navigator.ca: compass, then the dashed route from a gold start dot to a red X.
export function route() {
  return `<div class="ebw" aria-hidden="true"><svg class="ebw-ic" viewBox="-66 -62 132 124"><use href="#navMark" x="-66" y="-62" width="132" height="124"/></svg><span class="rt"><svg viewBox="0 0 200 30"><path class="rt-line" d="M13 15 C40 4 66 26 98 15 S150 5 172 15"/><circle class="rt-start" cx="6" cy="15" r="3.4"/><g transform="translate(186 15)"><path class="rt-x" d="M-6 -6 L6 6 M6 -6 L-6 6"/></g></svg></span></div>`;
}

export function siteHeader({ ctaHref = '#top', ctaLabel = 'Contact us', ctaAttrs = '' } = {}) {
  return `${NAVMARK_SYMBOL}<header class="nav"><div class="wrap nav-in"><a class="nav-logo" href="https://www.navigator.ca/" aria-label="Navigator Multimedia home">${LOGO}</a><a class="btn btn--light" href="${ctaHref}" ${ctaAttrs}>${ctaLabel}</a></div></header>`;
}

export function siteFooter({ note = '' } = {}) {
  const year = new Date().getFullYear();
  return `<footer class="footer"><div class="footer-rule" aria-hidden="true"><span><svg class="footer-mark" viewBox="-66 -62 132 124"><use href="#navMark" x="-66" y="-62" width="132" height="124"/></svg></span></div>
<div class="wrap"><div class="footer-top">
  <div class="footer-brand"><a class="footer-logo" href="https://www.navigator.ca/" aria-label="Navigator Multimedia home">${LOGO}</a>
  <p>Navigator Multimedia is a Kelowna web design company and digital marketing agency that has been building businesses since 1993.</p></div>
  <ul class="footer-contact"><li>460 Doyle Ave #201, Kelowna, BC V1Y 0C2</li><li><a href="tel:${PHONE_TEL}">${PHONE}</a></li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul>
</div>
${note ? `<p class="footer-note">${note}</p>` : ''}<div class="footer-bar"><small>Copyright &copy; ${year} navigator.ca. All rights reserved.</small><ul class="footer-legal"><li><a href="https://www.navigator.ca/">navigator.ca</a></li><li><a href="${PRIVACY}" target="_blank" rel="noopener">Privacy policy</a></li></ul></div>
</div></footer>`;
}

export const BRAND_CSS = `
:root{--parchment:#E4E2DB;--parchment-2:#DDDDD1;--paper:#EFEEE8;--ink:#0A0A0A;--ink-2:#333333;--muted:rgba(10,10,10,.56);--faint:rgba(10,10,10,.34);
--label:#5f5e5b;--line:rgba(10,10,10,.14);--line-2:rgba(10,10,10,.22);--on-dark:#F2F0EA;--on-dark-soft:rgba(242,240,234,.72);--dark:#14140F;
--red:#A3241B;--red-on-dark:#E0533F;--amber:#FCBF49;--gold:#C98A1E;--sepia:#3B2616;
--display:"Oswald","Haettenschweiler","Arial Narrow",sans-serif;--sans:"Inter Tight",-apple-system,"Segoe UI",Roboto,sans-serif;
--ease:cubic-bezier(.4,0,.2,1);--wrap:1240px;--gut:clamp(1.1rem,4vw,2.6rem);--sp:clamp(4rem,8vw,7rem);color-scheme:light}
*,*::before,*::after{box-sizing:border-box}*{margin:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{background:var(--parchment);color:var(--ink);font-family:var(--sans);font-size:clamp(1rem,.96rem + .18vw,1.09rem);font-weight:500;line-height:1.55;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}
a{color:inherit}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.wrap{width:min(100% - var(--gut)*2,var(--wrap));margin-inline:auto}
.display,h1,h2{font-family:var(--display);font-weight:700;text-transform:uppercase;line-height:.98;letter-spacing:-.015em;text-wrap:balance}
h2{font-size:clamp(1.9rem,4.2vw,3.3rem);line-height:1.02}
h3{font-family:var(--display);font-weight:600;text-transform:uppercase;letter-spacing:.005em;font-size:1.12rem;line-height:1.15}
.eyebrow{font-size:.82rem;font-weight:600;letter-spacing:.01em;color:var(--label)}
.lede{font-size:clamp(1.02rem,1.4vw,1.2rem);color:var(--ink-2);max-width:52ch}
.muted{color:var(--ink-2)}.small{font-size:.85rem}
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;padding:.95rem 1.7rem;border-radius:999px;background:var(--ink);color:var(--paper);font-size:.74rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;transition:transform .35s var(--ease),background-color .35s var(--ease)}
.btn:hover{transform:translateY(-2px);background:#2A2A22}
.btn:active{transform:translateY(0) scale(.97);transition-duration:.08s}
.btn--light{background:var(--paper);color:var(--ink)}.btn--light:hover{background:#fff}
.btn--ghost{background:transparent;color:inherit;box-shadow:inset 0 0 0 1px var(--line-2)}
.btn--block{width:100%;padding-block:1.1rem;font-size:.8rem}
.btn[disabled]{opacity:.6;pointer-events:none}
/* nav: sits over the dark hero */
.nav{position:absolute;inset:0 0 auto 0;z-index:20;padding:1.1rem 0}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:1.5rem}
.nav-logo{display:block;color:var(--on-dark);width:clamp(150px,16vw,190px)}
.nav-logo svg{display:block;width:100%;height:auto}
.nav .btn{padding:.72rem 1.3rem}
/* section eyebrow: compass + set-course route */
.ebw{display:inline-flex;align-items:center;gap:.32rem;min-height:40px;margin-bottom:.35rem;--r:var(--red)}
.ebw-ic{width:34px;height:34px;flex:none;fill:var(--sepia);overflow:visible}
.rt{position:relative;width:170px;height:26px;flex:none}
.rt svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.rt-line{fill:none;stroke:var(--r);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:7 6}
.rt-start{fill:var(--amber);stroke:var(--gold);stroke-width:.8}
.rt-x{fill:none;stroke:var(--r);stroke-width:3.2;stroke-linecap:round}
.on-dark .ebw-ic{fill:var(--on-dark)}.on-dark .ebw{--r:var(--red-on-dark)}
/* hero: one column of copy over the shaded chart art, as on navigator.ca inner pages */
.hero-sub{position:relative;isolation:isolate;overflow:hidden;background:var(--dark);color:var(--on-dark);padding:calc(6rem + 2vw) 0 clamp(3.6rem,7vw,6rem)}
.hero-sub-bg{position:absolute;inset:0;z-index:-1}
.hero-sub-bg img{width:100%;height:100%;object-fit:cover;object-position:70% 40%}
.hero-sub-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to right,rgba(12,11,8,.93) 0%,rgba(12,11,8,.87) 45%,rgba(12,11,8,.66) 75%,rgba(12,11,8,.54) 100%),linear-gradient(to top,rgba(12,11,8,.92) 0%,rgba(12,11,8,0) 45%),linear-gradient(to bottom,rgba(12,11,8,.5) 0%,rgba(12,11,8,0) 30%)}
.hero-sub h1{font-size:clamp(2.5rem,5.6vw,4.8rem);margin:.6rem 0 1.2rem;max-width:11em}
.hero-sub .lede{color:var(--on-dark-soft);font-size:clamp(1.06rem,1.5vw,1.25rem);max-width:56ch}
.hero-sub .eyebrow{color:var(--on-dark-soft)}
.trust{display:flex;flex-wrap:wrap;gap:.5rem;list-style:none;padding:0;margin-top:1.6rem}
.chip{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .9rem;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-size:.8rem;font-weight:600;color:var(--ink-2)}
.chip::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--amber);flex:none}
.on-dark .chip{background:rgba(255,255,255,.06);color:var(--on-dark);box-shadow:inset 0 0 0 1px rgba(242,240,234,.2)}
/* sections */
.section{padding:var(--sp) 0}
.section--paper{background:var(--paper)}
.section-head{max-width:62ch;margin-bottom:clamp(2rem,4vw,3rem)}
.section-head h2{margin:.4rem 0 1rem}
.head-split{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(1.5rem,4vw,4rem);align-items:end;margin-bottom:clamp(2rem,4vw,3rem)}
.head-split h2{margin-top:.4rem}
.card{background:#fff;border-radius:16px;padding:clamp(1.3rem,2.2vw,1.9rem);display:flex;flex-direction:column;gap:.6rem;min-width:0}
.card p{color:var(--ink-2);font-size:.95rem}
.card-k{font-family:var(--display);text-transform:uppercase;font-size:.7rem;letter-spacing:.16em;color:var(--label)}
.checks{list-style:none;padding:0;display:grid;gap:.7rem;color:var(--ink-2)}
.checks li{display:grid;grid-template-columns:18px minmax(0,1fr);gap:.7rem;align-items:start}
.checks li::before{content:"";width:18px;height:18px;margin-top:.15rem;border-radius:50%;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230A0A0A' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center/10px no-repeat;box-shadow:inset 0 0 0 1px var(--line)}
/* dark band over the chart art (stat band / CTA band on navigator.ca) */
.band-dark{position:relative;overflow:hidden;isolation:isolate;border-radius:20px;background:var(--dark);color:var(--on-dark);padding:clamp(2.2rem,4.5vw,3.8rem) clamp(1.4rem,3.5vw,3.2rem)}
.band-dark-bg{position:absolute;inset:0;z-index:-1}
.band-dark-bg img{width:100%;height:100%;object-fit:cover}
.band-dark-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to right,rgba(12,11,8,.94),rgba(12,11,8,.8) 55%,rgba(12,11,8,.6))}
.band-dark h2{color:var(--on-dark)}
.band-dark p{color:var(--on-dark-soft)}
.band-dark :is(.card,.formcard) p{color:var(--ink-2)}.band-dark .fine{color:var(--label)}
.stats{display:flex;flex-wrap:wrap;gap:clamp(1.5rem,4vw,3.5rem)}
.stats strong{display:block;font-family:var(--display);font-weight:700;font-size:clamp(2.2rem,4.4vw,3.4rem);line-height:1;color:var(--on-dark)}
.stats span{display:block;margin-top:.55rem;font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--on-dark-soft)}
/* faq */
.faq{border-top:1px solid var(--line-2);max-width:880px}
.faq-item{border-bottom:1px solid var(--line-2)}
.faq-item summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) 28px;gap:1rem;align-items:center;padding:1.15rem 0;font-family:var(--display);text-transform:uppercase;font-weight:600;font-size:clamp(1rem,1.3vw,1.15rem);line-height:1.15}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"";width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line-2);background:linear-gradient(var(--ink),var(--ink)) center/10px 1.5px no-repeat,linear-gradient(var(--ink),var(--ink)) center/1.5px 10px no-repeat;transition:transform .3s var(--ease)}
.faq-item[open] summary::after{transform:rotate(45deg)}
.faq-a{padding:0 2.6rem 1.3rem 0;color:var(--ink-2);font-size:.97rem}
.faq-a a{text-decoration:underline;text-underline-offset:3px}
/* forms */
.field{display:grid;gap:.4rem}
.field label,.flabel{font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--label)}
.field label .opt-l{text-transform:none;letter-spacing:0;font-weight:500}
.field input{width:100%;font:inherit;font-size:1rem;padding:.85rem 1rem;border:0;border-radius:10px;background:var(--paper);color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
.field input:focus{outline:none;box-shadow:inset 0 0 0 1.5px var(--ink)}
.fine{font-size:.78rem;color:var(--label);line-height:1.5}
.fine a{text-decoration:underline;text-underline-offset:2px}
.err{background:#FBEDEA;box-shadow:inset 3px 0 0 var(--red);color:var(--ink);padding:.7rem .9rem;border-radius:8px;font-size:.9rem}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
/* footer */
.footer{position:relative;padding:calc(var(--sp) + 1.2rem) 0 2rem;margin-top:var(--sp)}
.footer-rule{position:absolute;left:0;right:0;top:0;width:min(100% - var(--gut)*2,var(--wrap));margin-inline:auto}
.footer-rule::before{content:"";position:absolute;left:0;right:0;top:-.5px;height:1px;background:rgba(10,10,10,.22)}
.footer-rule span{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:var(--parchment);box-shadow:0 0 0 1px rgba(10,10,10,.22),0 0 0 6px var(--parchment),0 0 0 7px rgba(10,10,10,.12);display:grid;place-items:center}
.footer-mark{width:30px;height:30px;fill:var(--ink)}
.footer-top{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(1.8rem,4vw,3.5rem);align-items:start}
.footer-logo{display:block;width:170px;color:var(--ink)}.footer-logo svg{display:block;width:100%;height:auto}
.footer-brand p{margin-top:1.1rem;color:var(--ink-2);font-size:.95rem;max-width:42ch}
.footer-contact{list-style:none;padding:0;display:grid;gap:.6rem;font-size:.95rem;color:var(--ink-2)}
.footer-contact a{text-decoration:none}
.footer-note{margin-top:2rem;font-size:.85rem;color:var(--label);max-width:80ch}
.footer-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;margin-top:clamp(2.5rem,5vw,4rem);padding-top:1.6rem;border-top:1px solid var(--line)}
.footer-bar small{color:var(--faint);font-size:.8rem}
.footer-legal{list-style:none;padding:0;display:flex;gap:1.4rem}
.footer-legal a{font-size:.8rem;color:var(--faint);text-decoration:none}
@media (max-width:860px){.head-split,.footer-top{grid-template-columns:1fr}.faq-a{padding-right:0}}
@media (max-width:600px){.rt{width:130px;height:20px}.ebw-ic{width:30px;height:30px}.nav .btn{padding:.6rem 1rem;font-size:.68rem}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;
