// Minimal, content-safe UI polish: scroll reveals + optional crossfade swap.

(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Scroll reveal (adds no content, only classes)
  const revealTargets = [];
  const selectors = [
    '.hero',
    '.sections-inner',
    '.card',
    'iframe',
    'h1',
    'h2',
    'p',
    'ul',
    'ol'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Avoid adding reveal to very small elements like individual list items.
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

  // 2) Optional crossfade swap for paired images.
  // Usage (doesn't require changing your existing content, only adding attributes if desired):
  // <img data-swap-group="bw" data-swap-index="0" ...>
  // <img data-swap-group="bw" data-swap-index="1" ...>
  // They will crossfade in place every 4s.
  if (!prefersReduced) {
    const groups = new Map();
    document.querySelectorAll('img[data-swap-group]').forEach(img => {
      const g = img.getAttribute('data-swap-group');
      const arr = groups.get(g) || [];
      arr.push(img);
      groups.set(g, arr);
    });

    groups.forEach((imgs) => {
      if (imgs.length < 2) return;
      imgs.sort((a,b) => (parseInt(a.getAttribute('data-swap-index')||'0',10) - parseInt(b.getAttribute('data-swap-index')||'0',10)));

      // Make them stack
      const parent = imgs[0].parentElement;
      if (!parent) return;
      parent.style.position = parent.style.position || 'relative';

      imgs.forEach((img, i) => {
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.transition = 'opacity 700ms ease';
        img.style.opacity = i === 0 ? '1' : '0';
      });

      // Ensure parent has height
      const rect = imgs[0].getBoundingClientRect();
      if (rect.height > 0) parent.style.height = rect.height + 'px';

      let idx = 0;
      setInterval(() => {
        const next = (idx + 1) % imgs.length;
        imgs[idx].style.opacity = '0';
        imgs[next].style.opacity = '1';
        idx = next;
      }, 4000);
    });
  }
})();
