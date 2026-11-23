// Styled after navigator.ca and redesign.navigator.ca: anchor header, blue-to-purple hero gradient,
// Montserrat 800 headlines (Cera Pro is licensed and not loadable cross-domain), anchor cards, yellow primary button.
// Brand colours from the project instructions: Blue #4F90C6, Anchor #1C2E3A, White; secondary accents only.
export const CSS = `
:root{--anchor:#1C2E3A;--ink:#16252F;--blue:#4F90C6;--purple:#7D83E6;--lilac:#9BA0F5;--yellow:#FCBF49;--sail:#F2EFE9;
--paper:#FFFFFF;--mist:#F4F7FA;--text:#1C2E3A;--soft:#55636E;--line:#DCE3E9;
--strong:#2F8A5B;--good:#4F90C6;--maybe:#B87C0C;--weak:#8A97A2;
--display:"Cera Pro","Montserrat",system-ui,-apple-system,"Segoe UI",sans-serif;--body:"Montserrat",system-ui,-apple-system,"Segoe UI",sans-serif;
--grad:linear-gradient(120deg,#16252F,#234A66 30%,#4F90C6 55%,#7D83E6 75%,#16252F);color-scheme:light}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--text);font:16px/1.65 var(--body)}
h1,h2,h3{margin:0;text-wrap:balance;line-height:1.15}
p{margin:0}
a{color:var(--blue)}
.wrap{max-width:1120px;margin:0 auto;padding-inline:24px}
.wrap.narrow{max-width:820px}
.band{padding-block:72px}
.mist{background:var(--mist)}
.small{font-size:13px}.muted{color:var(--soft)}
.lp-head{position:sticky;top:0;z-index:10;background:var(--anchor);color:#fff}
.lp-head .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;height:72px}
.lp-head .logo{display:block;color:#fff;width:170px;max-width:46vw}
.lp-head .logo svg{display:block;width:100%;height:auto}
.btn-head{background:var(--blue);color:#fff;text-decoration:none;text-transform:uppercase;font-weight:500;font-size:14px;letter-spacing:.02em;padding:10px 14px;white-space:nowrap;border:0;cursor:pointer;font-family:inherit}
.btn-head:hover{background:#3F7FB5}
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--blue)}
.hero{background:var(--grad);color:#fff}
.hero .eyebrow,.res-hero .eyebrow{color:rgba(255,255,255,.82)}
.hero .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:56px;row-gap:28px;padding-block:88px 96px;align-items:center}
.hero .copy{display:grid;gap:18px}
.hero h1{font-family:var(--body);font-weight:800;font-size:clamp(34px,4.4vw,52px);letter-spacing:-1px;line-height:1.06}
.hero .sub{font-size:clamp(18px,2vw,21px);font-weight:700;line-height:1.45}
.hero .body{color:rgba(255,255,255,.9);max-width:56ch}
.trust{display:flex;flex-wrap:wrap;gap:8px 22px;list-style:none;margin:0;padding:0;font-size:13px;font-weight:700}
.trust li{display:flex;align-items:center;gap:8px}
.trust li::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--yellow)}
.since{display:inline-block;background:var(--yellow);color:var(--ink);font-weight:700;font-size:.42em;letter-spacing:-.5px;padding:.25em .65em;border-radius:40px;vertical-align:.45em;white-space:nowrap}
.btn-y{display:inline-block;width:100%;margin-top:16px;background:var(--yellow);color:var(--ink);font:inherit;font-weight:700;font-size:17px;padding:16px 28px;border:0;border-radius:12px;cursor:pointer;text-align:center;text-decoration:none}
.btn-y:hover{background:#F5B02E}
.btn-y.inline{width:auto}
.btn-y:focus-visible,.opt:focus-visible,.back:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:3px}
/* Quiz card */
.qcard{scroll-margin-top:88px;background:var(--paper);color:var(--text);border-radius:16px;padding:28px;box-shadow:0 24px 60px rgba(10,22,32,.35);min-width:0;min-height:460px;display:flex;flex-direction:column}
.qcard .ct{font-family:var(--display);font-weight:800;font-size:23px;line-height:1.2;color:var(--anchor)}
.qcard .cs{color:var(--soft);font-size:15px;margin-top:8px}
.chips{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:8px}
.chips li{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.chips li::before{content:"";flex:0 0 10px;height:10px;border-radius:50%;background:var(--blue)}
.qtop{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px;font-weight:700;color:var(--soft)}
.prog{height:6px;background:var(--mist);border-radius:99px;overflow:hidden;margin:10px 0 20px}
.prog span{display:block;height:100%;background:linear-gradient(90deg,var(--blue),var(--purple));border-radius:99px;transition:width .25s}
.qcard h3{font-family:var(--display);font-weight:800;font-size:21px;line-height:1.25;color:var(--anchor);outline:none}
.opts{display:grid;gap:10px;margin-top:18px}
.opt{display:block;width:100%;text-align:left;font:inherit;font-size:15px;font-weight:600;color:var(--text);background:var(--paper);border:1.5px solid var(--line);border-radius:12px;padding:14px 16px;cursor:pointer;transition:border-color .15s,background .15s}
.opt:hover{border-color:var(--blue);background:#F1F7FC}
.opt.sel{border-color:var(--blue);background:#E6F0F9}
.back{background:none;border:0;padding:0;font:inherit;font-size:13px;font-weight:700;color:var(--blue);cursor:pointer}
.back[hidden]{display:none}
.qcard form{display:grid;gap:2px;margin-top:6px}
.qcard label{display:block;font-weight:700;font-size:14px;margin:12px 0 6px}
.qcard label .opt-l{font-weight:500;color:var(--soft)}
.qcard input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border:1.5px solid var(--line);border-radius:10px;background:var(--paper);color:var(--text)}
.qcard input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(79,144,198,.25)}
.fine{font-size:12px;color:var(--soft);line-height:1.55;margin-top:12px}
.err{background:#FDF4E1;border-left:4px solid #B87C0C;color:var(--text);padding:10px 12px;border-radius:6px;font-size:14px;margin-top:12px}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.ready{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--strong)}
.ready::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--strong)}
/* Sections */
.sec-head{display:grid;gap:12px;max-width:760px;margin-bottom:36px}
.sec-head h2,h2.h{font-family:var(--display);font-weight:800;font-size:clamp(26px,3.2vw,38px);color:var(--anchor);letter-spacing:-.5px}
.sec-head p{font-size:18px;color:var(--soft)}
.chan{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;list-style:none;margin:0;padding:0}
.chan li{background:var(--anchor);color:#fff;padding:24px 20px 26px;display:grid;gap:10px;align-content:start;min-width:0;border-top:4px solid var(--blue)}
.chan h3{font-family:var(--display);font-weight:800;font-size:16px;letter-spacing:.02em;text-transform:uppercase;line-height:1.25}
.chan p{color:#D5E0E8;font-size:14px}
.chan .best{color:var(--lilac);font-weight:600}
.honest .wrap{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:56px;align-items:center}
.honest .copy{display:grid;gap:16px;font-size:17px;max-width:62ch}
.looks{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.looks li{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-weight:600}
.looks li::before{content:"";width:18px;height:18px;margin-top:3px;border-radius:50%;background:var(--yellow);box-shadow:inset 0 0 0 5px var(--paper),0 0 0 2px var(--yellow)}
.since-band{background:var(--anchor);color:#fff}
.since-band .wrap{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:center}
.since-band h2.h{color:#fff}
.since-band p{color:#D5E0E8;font-size:17px;margin-top:12px;max-width:62ch}
.stats{display:flex;gap:40px}
.stats div{display:grid}
.stats b{font-family:var(--display);font-weight:800;font-size:46px;line-height:1;color:var(--yellow)}
.stats span{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);font-weight:600;margin-top:6px}
.faq .list{display:grid;gap:12px;max-width:820px}
details{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:0 22px}
summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;padding:18px 0;font-weight:700;font-size:17px;color:var(--anchor)}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";color:var(--blue);font-weight:800;font-size:22px;line-height:1}
details[open] summary::after{content:"\\2212"}
details .a{padding-bottom:18px;color:var(--soft)}
.lp-foot{background:var(--ink);color:#B8C6D1;font-size:13px;padding-block:28px}
.lp-foot .row{display:flex;flex-wrap:wrap;gap:8px 24px}
.lp-foot a{color:#fff}
/* Result */
.res-hero{background:var(--grad);color:#fff}
.res-hero .wrap{padding-block:72px 80px;display:grid;gap:16px;max-width:820px}
.res-hero h1{font-family:var(--body);font-weight:800;font-size:clamp(34px,5vw,56px);letter-spacing:-1px;line-height:1.05}
.res-hero .sub{font-size:clamp(18px,2vw,21px);font-weight:600;max-width:60ch;color:rgba(255,255,255,.92)}
.fits{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.fits li{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr) 150px;gap:14px;align-items:center;font-weight:600}
.fits li.top .fl{font-weight:800}
.fits .ft{height:16px;background:var(--mist);border-radius:99px;overflow:hidden;display:block}
.fits .ft span{display:block;height:100%;border-radius:99px;background:var(--c)}
.fits .fv{font-size:14px;color:var(--soft)}
.fits .fv b{color:var(--c);font-variant-numeric:tabular-nums;margin-right:4px}
.f-strong{--c:var(--strong)}.f-good{--c:var(--good)}.f-maybe{--c:var(--maybe)}.f-weak{--c:var(--weak)}
.flags{display:grid;gap:12px;margin-top:32px}
.flagbox{border-left:5px solid var(--yellow);background:#FFF8E8;border-radius:0 12px 12px 0;padding:16px 18px;display:grid;gap:6px}
.flagbox h3{font-size:17px;font-weight:800;color:var(--anchor)}
ul.why{list-style:none;margin:0;padding:0;display:grid;gap:12px}
ul.why li{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:16px;font-size:16px}
ul.why li::before{content:"";width:18px;height:18px;margin-top:4px;border-radius:50%;background:var(--strong);box-shadow:inset 0 0 0 5px var(--paper),0 0 0 2px var(--strong)}
ol.plan{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;counter-reset:p}
ol.plan li{counter-increment:p;display:grid;gap:10px;align-content:start;border-top:4px solid var(--blue);padding-top:20px;min-width:0}
ol.plan li::before{content:counter(p);font-family:var(--display);font-weight:800;font-size:40px;line-height:1;color:var(--purple)}
ol.plan h3{font-size:17px;font-weight:800;color:var(--anchor)}
ol.plan p{color:var(--soft);font-size:15px}
.measure{margin-top:28px;padding:14px 16px;border-left:4px solid var(--blue);background:var(--mist);border-radius:0 10px 10px 0}
ul.watch{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
ul.watch li{background:var(--anchor);color:#fff;padding:22px 20px;display:grid;gap:8px;align-content:start;min-width:0}
ul.watch h3{font-size:16px;font-weight:800}
ul.watch p{color:#D5E0E8;font-size:14px}
.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.pcard{border:1px solid var(--line);border-top:4px solid var(--blue);border-radius:0 0 12px 12px;padding:20px;display:grid;gap:10px;align-content:start;min-width:0}
.pcard.dim{border-top-color:var(--weak)}
.pcard h3{font-family:var(--display);font-size:21px;font-weight:800;color:var(--anchor)}
.cta-band{background:var(--anchor);color:#fff;padding-block:64px}
.cta-band .wrap{display:grid;gap:16px}
.cta-band h2.h{color:#fff}
.cta-band p{color:#D5E0E8;font-size:17px;max-width:62ch}
.answers ul{list-style:none;margin:0;padding:0 0 18px;display:grid;gap:10px}
.answers li{display:grid;gap:2px;font-size:14px;border-bottom:1px solid var(--line);padding-bottom:10px}
.answers li span{color:var(--soft)}
.answers + p{margin-top:16px}
@media (max-width:1000px){.chan{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){.hero .wrap,.honest .wrap,.since-band .wrap{grid-template-columns:1fr}.hero .wrap{padding-block:56px 64px}.band{padding-block:56px}
ol.plan,ul.watch,.pair{grid-template-columns:1fr}.fits li{grid-template-columns:1fr;gap:6px}.qcard{min-height:0}}
@media (max-width:520px){.chan{grid-template-columns:1fr}.qcard{padding:22px}.wrap{padding-inline:18px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;
