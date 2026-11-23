export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function newId() {
  const b = new Uint8Array(9);
  crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(36).padStart(2, '0')).join('').slice(0, 14);
}

export function cleanWebsite(s) {
  const v = String(s || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v) ? v : '';
}

export const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.ca', 'hotmail.com', 'hotmail.ca', 'outlook.com', 'live.com', 'live.ca',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'shaw.ca', 'telus.net', 'protonmail.com', 'proton.me',
  'msn.com', 'rogers.com', 'sympatico.ca', 'gmx.com', 'yandex.com', 'mail.com',
]);

// WhatConverts lead tracking (account script 172577), same as redesign.navigator.ca.
export const WHATCONVERTS = '<script>var $wc_load=function(a){return JSON.parse(JSON.stringify(a))},$wc_leads=$wc_leads||{doc:{url:$wc_load(document.URL),ref:$wc_load(document.referrer),search:$wc_load(location.search),hash:$wc_load(location.hash)}};</script>\n<script src="//s.ksrndkehqnwntyxlhgto.com/172577.js"></script>';
