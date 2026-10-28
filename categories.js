window.MJ_CATEGORIES = [
  { slug: 'wedding-events', title: 'Wedding Events', subcategories: [], photos: [] },
  { slug: 'fashion-shoots', title: 'Fashion Shoots', subcategories: [], photos: [] },
  { slug: 'birthday-events', title: 'Birthday Events', subcategories: [], photos: [] },
  { slug: 'product-shoots', title: 'Product Shoots', subcategories: [], photos: [] },
  { slug: 'models-shoots', title: 'Models Shoots', subcategories: [], photos: [] },
  { slug: 'religious-events', title: 'Religious Events', subcategories: [], photos: [] },
  { slug: 'educational-events', title: 'Educational Events', subcategories: [], photos: [] },
  { slug: 'documentary', title: 'Documentary', subcategories: [], photos: [] },
  { slug: 'restaurant-shoots', title: 'Restaurant Shoots', subcategories: [], photos: [] },
  { slug: 'influencer-meetup', title: 'Influencer Meetup', subcategories: [], photos: [] }
];

const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.getElementById('primary-navigation');
const closeMenu = () => {
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
};
menuToggle?.addEventListener('click', () => {
  const opening = !document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', opening);
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
primaryNavigation?.querySelectorAll('a').forEach((link, index) => {
  link.style.setProperty('--menu-index', index);
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 18);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const heroSlides = document.getElementById('hero-slides');
if (heroSlides) {
  const slides = [...heroSlides.querySelectorAll('.hero-slide')];
  let activeSlide = 0;
  const prepareHeroSlide = (index) => {
    const image = slides[(index + slides.length) % slides.length]?.querySelector('img');
    if (image) image.loading = 'eager';
  };
  const showHeroSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    prepareHeroSlide(activeSlide);
    heroSlides.style.transform = `translateX(-${activeSlide * 100}%)`;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
    prepareHeroSlide(activeSlide + 1);
  };
  prepareHeroSlide(1);
  document.querySelector('[data-hero-prev]')?.addEventListener('click', () => showHeroSlide(activeSlide - 1));
  document.querySelector('[data-hero-next]')?.addEventListener('click', () => showHeroSlide(activeSlide + 1));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      if (!document.hidden) showHeroSlide(activeSlide + 1);
    }, 6000);
  }
}

const categoryTrack = document.getElementById('category-track');
if (categoryTrack) {
  categoryTrack.innerHTML = window.MJ_CATEGORIES.map((category, index) => `
    <a class="category-card" href="category.html?category=${category.slug}" target="_blank" rel="noopener noreferrer" data-index="${String(index + 1).padStart(2, '0')}" data-reveal style="--reveal-delay:${Math.min(index % 4, 3) * 70}ms">
      <span class="category-number">${String(index + 1).padStart(2, '0')} / 10</span>
      <span class="category-title">${category.title}</span>
      <span class="category-arrow" aria-hidden="true">↗</span>
    </a>
  `).join('');
  categoryTrack.querySelectorAll('[data-reveal]').forEach((item) => window.MJ_observeReveal?.(item));

  const progress = document.getElementById('gallery-progress-fill');
  const updateProgress = () => {
    const maxScroll = categoryTrack.scrollWidth - categoryTrack.clientWidth;
    const ratio = maxScroll > 0 ? categoryTrack.scrollLeft / maxScroll : 0;
    if (progress) progress.style.width = `${Math.max(8, ratio * 100)}%`;
  };
  categoryTrack.addEventListener('scroll', updateProgress, { passive: true });
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.scroll === 'next' ? 1 : -1;
      categoryTrack.scrollBy({ left: direction * categoryTrack.clientWidth * .78, behavior: 'smooth' });
    });
  });

  let pointerStart = null;
  let dragDistance = 0;
  categoryTrack.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    pointerStart = { x: event.clientX, scroll: categoryTrack.scrollLeft };
    dragDistance = 0;
  });
  window.addEventListener('mousemove', (event) => {
    if (!pointerStart) return;
    const delta = event.clientX - pointerStart.x;
    if (Math.abs(delta) > 5) categoryTrack.classList.add('is-dragging');
    dragDistance = Math.max(dragDistance, Math.abs(delta));
    categoryTrack.scrollLeft = pointerStart.scroll - delta;
  });
  const endDrag = () => {
    pointerStart = null;
    categoryTrack.classList.remove('is-dragging');
    window.setTimeout(() => { dragDistance = 0; }, 90);
  };
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('blur', endDrag);
  categoryTrack.addEventListener('dragstart', (event) => event.preventDefault());
  categoryTrack.addEventListener('click', (event) => {
    if (dragDistance > 8) {
      event.preventDefault();
      event.stopPropagation();
      dragDistance = 0;
    }
  }, true);
  updateProgress();
}
