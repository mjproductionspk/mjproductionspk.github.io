(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  window.MJ_observeReveal = (element) => observer.observe(element);

  document.querySelectorAll('[data-reveal]').forEach((item) => observer.observe(item));

  const parallax = window.matchMedia('(max-width: 680px)').matches ? null : document.querySelector('[data-parallax]');
  if (parallax) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const amount = Math.max(-16, Math.min(16, window.scrollY * -.025));
        parallax.style.setProperty('--parallax-y', `${amount}px`);
        ticking = false;
      });
    }, { passive: true });
  }
})();
