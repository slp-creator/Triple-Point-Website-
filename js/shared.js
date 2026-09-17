// ── Google Analytics 4 ──
// Paste your GA4 Measurement ID below — it looks like 'G-XXXXXXXXXX'.
// While this is empty, no analytics script loads and nothing is tracked.
const GA_MEASUREMENT_ID = '';

(function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();

// ── Nav and footer behavior ──
// The nav and footer MARKUP now lives in each .html file, between the
// <!-- nav:start --> / <!-- nav:end --> and <!-- footer:start --> / <!-- footer:end -->
// markers, so crawlers see the links without running JavaScript.
// To change that markup, edit the templates in tools/build-shared.js and run:
//     node tools/build-shared.js
// This file only handles behavior.

function toggleMenu() {
  document.getElementById('nav-mobile').classList.toggle('open');
}

function initDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach(d => {
    const menu = d.querySelector('.nav-dropdown-menu');
    let timeout;
    d.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      menu.style.display = 'block';
    });
    d.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => { menu.style.display = 'none'; }, 150);
    });
    menu.addEventListener('mouseenter', () => clearTimeout(timeout));
    menu.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => { menu.style.display = 'none'; }, 150);
    });
  });
}

function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// shared.js is loaded at the end of <body>, so the nav markup already exists.
initDropdowns();
initNavScroll();
