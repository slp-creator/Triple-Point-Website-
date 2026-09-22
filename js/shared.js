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

// Home page self-check: counts what the visitor recognises and changes the
// message under the list. The symptoms themselves are plain HTML, so the
// section still reads correctly if this never runs.
function initSelfCheck() {
  const boxes = document.querySelectorAll('.chk-input');
  const count = document.getElementById('chk-count');
  const message = document.getElementById('chk-message');
  if (!boxes.length || !count || !message) return;

  const messages = [
    '<strong>Check anything that sounds like you.</strong> Most adults who come to Triple Point recognize themselves in more than one column &mdash; which is exactly the point.',
    '<strong>One is worth asking about.</strong> A single symptom can have an ordinary explanation &mdash; or it can simply be the one that is easiest to notice. A free 30-minute consultation will tell you which.',
    '<strong>Two is rarely a coincidence.</strong> Symptoms in different columns usually share one cause, which is why treating them separately so often fails. A free 30-minute consultation is the place to start.',
    '<strong>Three or more is a pattern, not a coincidence.</strong> A free 30-minute consultation will tell you whether a myofunctional evaluation is the right next step &mdash; and if it is not, Lauren will say so.',
  ];

  function update() {
    const n = [...boxes].filter(b => b.checked).length;
    count.textContent = n;
    message.innerHTML = messages[Math.min(n, 3)];
  }
  boxes.forEach(b => b.addEventListener('change', update));
  update();
}

initSelfCheck();
