(() => {
  'use strict';

  // ============ Dev/Prod app URL rewrite ============
  // In production, landing and app share the same origin (app at /app/).
  // In local dev, landing runs on :4173 and Vite serves the app on :5173/app/.
  // Rewrite all /app/ links so they resolve correctly in either environment.
  (() => {
    const isLocalDev =
      location.hostname === 'localhost' && location.port === '4173';
    if (!isLocalDev) return;
    document.querySelectorAll('a[href^="/app"], a[href="/app/"]').forEach((a) => {
      const path = a.getAttribute('href').replace(/^\/app\/?/, '');
      a.setAttribute('href', `http://localhost:5173/app/${path}`);
    });
  })();

  // ============ Theme (Dark Mode) ============
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  const initTheme = () => {
    root.classList.add('no-transition');
    const saved = localStorage.getItem('talima-theme');
    if (saved === 'dark') root.classList.add('dark');
    requestAnimationFrame(() => root.classList.remove('no-transition'));
  };
  initTheme();

  themeBtn?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('talima-theme', root.classList.contains('dark') ? 'dark' : 'light');
  });

  // ============ Language ============
  const langBtn   = document.getElementById('langBtn');
  const langMenu  = document.getElementById('langMenu');
  const langLabel = document.getElementById('langLabel');

  const applyLang = (lang) => {
    const dict = window.TRANSLATIONS?.[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    localStorage.setItem('talima-lang', lang);
  };

  langBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu?.classList.toggle('hidden');
  });

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLang(lang);
      langMenu?.classList.add('hidden');
    });
  });

  document.addEventListener('click', (e) => {
    if (!langMenu?.contains(e.target) && !langBtn?.contains(e.target)) {
      langMenu?.classList.add('hidden');
    }
  });

  applyLang(localStorage.getItem('talima-lang') || 'ru');

  // ============ Mobile menu ============
  const mobileBtn  = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
  mobileMenu?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );

  // ============ Navbar shrink on scroll ============
  const header = document.getElementById('navbar');
  const topBtn = document.getElementById('topBtn');

  const onScroll = () => {
    const y = window.scrollY;
    if (y > 20) header?.classList.add('nav-scrolled');
    else        header?.classList.remove('nav-scrolled');

    if (y > 600) topBtn?.classList.remove('hidden');
    else         topBtn?.classList.add('hidden');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topBtn?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // ============ Reveal on scroll — disabled (CSS keeps content always visible) ============

  // ============ Showcase tabs ============
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach((p) => {
        if (p.getAttribute('data-panel') === target) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });

  // ============ FAQ accordion ============
  document.querySelectorAll('.faq-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const content = item?.querySelector('.faq-content');
      const isOpen = item?.classList.toggle('open');
      if (isOpen) content?.classList.remove('hidden');
      else        content?.classList.add('hidden');
    });
  });

  // ============ Lucide icons ============
  // Render once after the DOM is parsed. No MutationObserver: the previous one
  // looped forever against Tailwind CDN's own runtime observer (page froze).
  if (window.lucide?.createIcons) window.lucide.createIcons();
})();
