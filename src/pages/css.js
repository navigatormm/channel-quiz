import { BRAND_CSS } from './brand.js';

// Quiz and result page styles, on top of the shared navigator.ca brand kit (brand.js).
export const CSS = BRAND_CSS + `
/* hero: copy left, quiz card right, like the Free Website SEO Audit page */
.hero-sub .hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(2rem,5vw,4.5rem);align-items:center}
.qcard{scroll-margin-top:24px;background:#fff;color:var(--ink);border-radius:16px;padding:clamp(1.4rem,2.6vw,2.1rem);box-shadow:0 30px 70px rgba(0,0,0,.35);min-width:0;min-height:500px;display:flex;flex-direction:column}
.qcard .ct{font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:1.55rem;line-height:1.05}
.qcard .cs{color:var(--ink-2);font-size:.95rem;margin-top:.5rem}
.qcard .chans{list-style:none;padding:0;margin:1.2rem 0 1.4rem;display:grid;gap:.5rem}
.qcard .chans li{display:flex;align-items:center;gap:.7rem;padding:.7rem .9rem;border-radius:10px;background:var(--paper);font-weight:600;font-size:.95rem}
.qcard .chans li::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 1px var(--gold);flex:none}
.qcard .btn--block{margin-top:auto}
.qtop{display:flex;justify-content:space-between;align-items:center;gap:12px}
.qtop .card-k{color:var(--label)}
.prog{position:relative;height:10px;margin:.9rem 0 1.4rem}
.prog::before{content:"";position:absolute;left:0;right:0;top:4px;height:2px;background:var(--line)}
.prog span{position:absolute;left:0;top:3px;height:4px;border-radius:2px;background:repeating-linear-gradient(90deg,var(--red) 0 7px,transparent 7px 13px);transition:width .3s var(--ease)}
.prog span::after{content:"";position:absolute;right:-5px;top:-3px;width:10px;height:10px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 1px var(--gold)}
.qcard h3{font-family:var(--display);font-weight:700;font-size:clamp(1.35rem,2vw,1.6rem);line-height:1.08;outline:none}
.opts{display:grid;gap:.55rem;margin-top:1.1rem}
.opt{display:block;width:100%;text-align:left;font:inherit;font-size:.97rem;font-weight:600;color:var(--ink);background:var(--paper);border-radius:12px;padding:.9rem 1rem;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .2s var(--ease),background-color .2s var(--ease)}
@media (hover:hover){.opt:hover{background:#fff;box-shadow:inset 0 0 0 1.5px var(--ink)}}
.opt.sel{background:var(--ink);color:var(--paper);box-shadow:none}
.back{font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2)}
.back[hidden]{visibility:hidden;display:inline}
.ready{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#2F6B47}
.ready::before{content:"";width:8px;height:8px;border-radius:50%;background:#2F8A5B}
.qcard form{display:grid;gap:.9rem;margin-top:1.1rem}
.qcard .err{margin-top:.8rem}
/* channels: chart-art cards, like "Why choose Navigator" on the homepage */
.chan{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;list-style:none;padding:0}
.chan li{position:relative;isolation:isolate;overflow:hidden;border-radius:16px;background:var(--dark);color:var(--on-dark);min-height:400px;display:flex;flex-direction:column;justify-content:flex-end;padding:1.3rem 1.2rem 1.4rem;gap:.5rem;min-width:0}
.chan img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.chan li::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(12,11,8,.96) 0%,rgba(12,11,8,.86) 42%,rgba(12,11,8,.15) 75%,rgba(12,11,8,0) 100%)}
.chan h3{font-weight:700;font-size:1.3rem;line-height:1.02}
.chan p{font-size:.88rem;color:var(--on-dark-soft)}
.chan .best{color:var(--on-dark);font-weight:600}
/* why we built it */
.looks-card .checks{grid-template-columns:repeat(2,minmax(0,1fr));gap:.9rem 1.6rem}
.since-band{display:grid;grid-template-columns:minmax(0,1.3fr) auto;gap:2.5rem;align-items:center}
.since-band p{margin-top:1rem;max-width:58ch}
.ctas{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.8rem}
/* result */
.res-hero h1{max-width:13em}
.fits{list-style:none;padding:0;display:grid;gap:1rem}
.fits li{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr) 150px;gap:1rem;align-items:center;font-weight:600}
.fits li.top .fl{font-family:var(--display);text-transform:uppercase;font-weight:700;font-size:1.1rem}
.fits .ft{height:12px;background:var(--parchment);border-radius:99px;overflow:hidden;display:block}
.fits .ft span{display:block;height:100%;border-radius:99px;background:var(--c)}
.fits li.top .ft span{background:repeating-linear-gradient(90deg,var(--red) 0 10px,#C2392D 10px 20px)}
.fits .fv{font-size:.85rem;color:var(--label)}
.fits .fv b{font-family:var(--display);font-size:1.1rem;color:var(--ink);margin-right:.35rem;font-variant-numeric:tabular-nums}
.f-strong{--c:var(--ink)}.f-good{--c:#5f5e5b}.f-maybe{--c:var(--gold)}.f-weak{--c:rgba(10,10,10,.22)}
.flags{display:grid;gap:.8rem;margin-top:1.6rem}
.flagbox{background:#fff;border-radius:14px;padding:1.1rem 1.3rem;box-shadow:inset 4px 0 0 var(--amber);display:grid;gap:.35rem}
.flagbox h3{font-size:1.02rem}
.flagbox p{color:var(--ink-2);font-size:.95rem}
.why-card .checks{gap:1rem;font-size:1.02rem}
ol.plan{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1.2rem,3vw,2.4rem);counter-reset:p}
ol.plan li{counter-increment:p;display:grid;gap:.6rem;align-content:start;min-width:0;padding-top:1.1rem;background:linear-gradient(90deg,var(--red) 0 7px,transparent 7px 13px) top left/13px 2.4px repeat-x}
ol.plan li::before{content:"0" counter(p);font-family:var(--display);font-weight:700;font-size:2.6rem;line-height:1;color:var(--ink)}
ol.plan p{color:var(--ink-2);font-size:.95rem}
.measure{margin-top:2rem}
.measure b{font-family:var(--display);text-transform:uppercase;font-weight:600;letter-spacing:.01em}
ul.watch{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
ul.watch li{background:var(--dark);color:var(--on-dark);border-radius:16px;padding:1.5rem 1.4rem;display:grid;gap:.5rem;align-content:start;min-width:0}
ul.watch p{color:var(--on-dark-soft);font-size:.93rem}
.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.pair h3{font-size:1.5rem;font-weight:700}
.pair .dim{background:rgba(255,255,255,.5)}
.answers{max-width:880px}
.answers ul{list-style:none;padding:0 0 1.2rem;display:grid;gap:.7rem}
.answers li{display:grid;gap:.15rem;font-size:.93rem;padding-bottom:.7rem;border-bottom:1px solid var(--line)}
.answers li span{color:var(--label)}
.pv{background:var(--amber);color:var(--ink);font-weight:600;font-size:.85rem;text-align:center;padding:.6rem 1rem;position:fixed;left:0;right:0;bottom:0;z-index:50}
.pv a{text-decoration:underline}
@media (max-width:1100px){.chan{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:900px){.hero-sub .hero-grid,.since-band{grid-template-columns:1fr}ol.plan,ul.watch,.pair{grid-template-columns:1fr}.fits li{grid-template-columns:1fr;gap:.35rem}.qcard{min-height:0}.chan{grid-template-columns:repeat(2,minmax(0,1fr))}.chan li{min-height:340px}}
@media (max-width:560px){.chan{grid-template-columns:1fr}.chan li{min-height:300px}.looks-card .checks{grid-template-columns:1fr}}
`;
