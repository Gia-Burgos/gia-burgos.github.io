// ==========================
// Site JS: theme toggle + reveal + projects filter
// ==========================

(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------
  // THEME
  // --------------------------
  const root = document.documentElement;
  const STORAGE_KEY = "gb_theme";

  function setTheme(theme){
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn){
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      const label = btn.querySelector('[data-theme-label]');
      if (label) label.textContent = isDark ? "Dark" : "Light";
    }
  }

  function initTheme(){
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
    if (saved === "dark" || saved === "light") return setTheme(saved);

    // Default to light, but respect system preference on first visit if you want:
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(sysDark ? "dark" : "light");
  }

  initTheme();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const current = root.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });

  // --------------------------
  // REVEAL (your existing idea, kept)
  // --------------------------
  const revealTargets = [];
  const selectors = [
    '.hero',
    '.sections-inner',
    '.card',
    '.t-card',
    'iframe',
    'h1',
    'h2',
    'p',
    'ul',
    'ol'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.tagName === 'LI') return;
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      revealTargets.push(el);
    });
  });

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });

    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------
  // PROJECT FILTER (projects.html)
  // --------------------------
  function initProjectsFilter(){
    const container = document.querySelector('[data-projects]');
    if (!container) return;

    const chips = document.querySelectorAll('[data-filter]');
    const cards = container.querySelectorAll('[data-category]');

    function applyFilter(cat){
      cards.forEach(card => {
        const c = (card.getAttribute('data-category') || '').split(',').map(s => s.trim());
        const show = (cat === 'all') ? true : c.includes(cat);
        card.style.display = show ? '' : 'none';
      });

      chips.forEach(ch => {
        const on = ch.getAttribute('data-filter') === cat;
        ch.setAttribute('aria-pressed', String(on));
      });
    }

    chips.forEach(ch => {
      ch.addEventListener('click', () => applyFilter(ch.getAttribute('data-filter')));
    });

    // default
    applyFilter('all');
  }

  initProjectsFilter();
})();
