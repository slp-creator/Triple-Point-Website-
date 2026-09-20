#!/usr/bin/env node
/*
 * Writes the shared nav and footer directly into every .html page.
 *
 * Why: the nav and footer used to be injected at runtime by js/shared.js, which
 * meant the site's entire internal link structure only existed after JavaScript
 * ran. Search crawlers had to render the page to find any link, and the nav
 * popped in after first paint. Now the markup ships in the HTML itself.
 *
 * This is NOT a build step — the repo still contains exactly what gets served.
 * It is a maintenance tool. Edit the templates below, then run:
 *
 *     node tools/build-shared.js
 *
 * and commit the resulting HTML changes.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BOOKING_URL = 'https://triplepointspeechtherapy.janeapp.com/';

// Which nav item is highlighted on each page.
const PAGES = {
  'index.html': 'home',
  'myofunctional-therapy.html': 'services',
  'early-intervention.html': 'services',
  'tongue-tie-support.html': 'services',
  'speech-therapy.html': 'services',
  'telehealth-bay-area.html': 'services',
  'about.html': 'about',
  'faq.html': 'faq',
  'resources.html': 'resources',
  'contact.html': 'contact',
  'thank-you.html': 'contact',
};

const NAV_ITEMS = [
  { href: 'index.html', label: 'Home', key: 'home' },
  { href: 'myofunctional-therapy.html', label: 'Services', key: 'services', dropdown: [
    { href: 'myofunctional-therapy.html', label: 'Myofunctional Therapy' },
    { href: 'early-intervention.html', label: 'Early Intervention Coaching' },
    { href: 'tongue-tie-support.html', label: 'Tongue Tie Support' },
    { href: 'speech-therapy.html', label: 'Speech Therapy' },
    { href: 'telehealth-bay-area.html', label: 'Telehealth' },
  ]},
  { href: 'about.html', label: 'About', key: 'about' },
  { href: 'faq.html', label: 'FAQ', key: 'faq' },
  { href: 'resources.html', label: 'Resources', key: 'resources' },
  { href: 'contact.html', label: 'Contact', key: 'contact' },
];

const DROPDOWN_LINK_STYLE = "display:block;padding:10px 16px;font-size:14px;color:var(--muted);border-bottom:1px solid var(--border);text-decoration:none;transition:background .15s";

function navLinks(activePage) {
  return NAV_ITEMS.map(p => {
    const active = p.key === activePage ? ' class="active"' : '';
    if (p.dropdown) {
      const items = p.dropdown.map(d =>
        `<a href="${d.href}" style="${DROPDOWN_LINK_STYLE}" onmouseover="this.style.background='var(--mist)';this.style.color='var(--deep)'" onmouseout="this.style.background='';this.style.color='var(--muted)'">${d.label}</a>`
      ).join('');
      return `<div style="position:relative;display:inline-flex;align-items:center" class="nav-dropdown"><a href="${p.href}"${active} style="display:flex;align-items:center;gap:4px">${p.label} <span style="font-size:10px;opacity:.6">&#9662;</span></a><div class="nav-dropdown-menu" style="display:none;position:absolute;top:100%;left:0;padding-top:8px;background:transparent;z-index:300"><div style="background:var(--white);border:1px solid var(--border);border-radius:4px;min-width:240px;box-shadow:0 8px 24px rgba(44,79,94,.1);overflow:hidden">${items}</div></div></div>`;
    }
    return `<a href="${p.href}"${active}>${p.label}</a>`;
  }).join('');
}

function navHtml(activePage) {
  const links = navLinks(activePage);
  return `<nav id="main-nav">
  <a href="index.html" class="nav-logo">
    <img src="logo.png" alt="Triple Point Speech Therapy logo" width="36" height="36" style="height:36px;width:36px;object-fit:contain;border-radius:3px">
    <span>Triple Point <em>Speech Therapy</em></span>
  </a>
  <div class="nav-links">
    ${links}
    <a href="${BOOKING_URL}" class="nav-book" target="_blank" rel="noopener">Book Now</a>
  </div>
  <button class="nav-hamburger" onclick="toggleMenu()" aria-label="Toggle menu">&#9776;</button>
</nav>
<div class="nav-mobile" id="nav-mobile">
  ${links}
  <a href="${BOOKING_URL}" class="nav-book-mobile" target="_blank" rel="noopener">Book a Free Consultation</a>
</div>`;
}

function footerHtml() {
  return `<footer>
  <div class="footer-brand">
    <div class="footer-name">Triple Point Speech Therapy</div>
    <div class="footer-tagline">Breathe &middot; Eat &middot; Speak</div>
    <a href="${BOOKING_URL}" class="btn-light footer-cta" target="_blank" rel="noopener">Book a Free Consultation</a>
  </div>
  <div class="footer-col">
    <h4>Navigation</h4>
    <a href="index.html">Home</a>
    <a href="about.html">About Lauren</a>
    <a href="faq.html">FAQ</a>
    <a href="resources.html">Resources &amp; Research</a>
    <a href="contact.html">Contact</a>
  </div>
  <div class="footer-col">
    <h4>Services</h4>
    <a href="myofunctional-therapy.html">Myofunctional Therapy</a>
    <a href="early-intervention.html">Early Intervention Coaching</a>
    <a href="tongue-tie-support.html">Tongue Tie Support</a>
    <a href="speech-therapy.html">Speech Therapy</a>
    <a href="telehealth-bay-area.html">Telehealth</a>
  </div>
  <div class="footer-col">
    <h4>Contact</h4>
    <p>10775 Pioneer Trail, Suite 216a<br>Truckee, CA 96161</p>
    <a href="mailto:SLP@triplepointspeechtherapy.com">SLP@triplepointspeechtherapy.com</a>
    <p style="margin-top:6px;font-size:14px;opacity:.9"><a href="tel:+15303625983">Phone: (530) 362-5983</a></p>
    <p style="margin-top:4px;font-size:14px;opacity:.85">Fax: (530) 316-8762</p>
  </div>
</footer>
<div class="footer-bottom">
  <span>&copy; 2026 Triple Point Speech Therapy. All Rights Reserved.</span>
  <a href="${BOOKING_URL}" target="_blank" rel="noopener">Patient Portal &rarr;</a>
</div>`;
}

// Replace everything between the markers. On the first run the old
// JS placeholder div is swapped for a marker block.
function writeRegion(html, name, body, legacyPlaceholder) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const block = `${start}\n${body}\n${end}`;
  const existing = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (existing.test(html)) return html.replace(existing, block);
  if (html.includes(legacyPlaceholder)) return html.replace(legacyPlaceholder, block);
  throw new Error(`no ${name} marker or placeholder found`);
}

let changed = 0;
for (const [file, activePage] of Object.entries(PAGES)) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  let after = writeRegion(before, 'nav', navHtml(activePage), '<div id="nav-placeholder"></div>');
  after = writeRegion(after, 'footer', footerHtml(), '<div id="footer-placeholder"></div>');
  if (after !== before) {
    fs.writeFileSync(full, after);
    changed++;
    console.log('  updated', file);
  }
}
console.log(changed ? `\n${changed} page(s) updated.` : '\nAll pages already up to date.');
