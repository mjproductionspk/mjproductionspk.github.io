const params = new URLSearchParams(window.location.search);
const slug = params.get('category');
const category = (window.MJ_CATEGORIES || []).find((item) => item.slug === slug);

if (category) {
  document.title = `${category.title} — MJ Productions`;
  document.getElementById('category-title').textContent = category.title;
  document.getElementById('category-description').textContent = category.description || 'Photos and project details for this category will be added here.';

  const renderPhotos = (photos, categoryTitle) => (photos || []).map((photo) => photo.type === 'video' ? `
      <figure class="gallery-video">
        <video controls playsinline preload="metadata" ${photo.poster ? `poster="${photo.poster}"` : ''} aria-label="${photo.alt || categoryTitle}"><source src="${photo.src}" type="video/mp4">Your browser does not support video playback.</video>
        ${photo.caption ? `<figcaption>${photo.caption}</figcaption>` : ''}
      </figure>
    ` : `
      <a class="gallery-photo" href="${photo.src}" target="_blank" rel="noopener noreferrer">
        <img src="${photo.src}" alt="${photo.alt || categoryTitle}" loading="lazy" decoding="async">
        ${photo.caption ? `<span>${photo.caption}</span>` : ''}
      </a>
    `).join('');

  const gallery = document.getElementById('category-gallery');
  const photos = category.photos || [];
  gallery.innerHTML = renderPhotos(photos, category.title);

  const subcategoryList = document.getElementById('subcategory-list');
  const subcategories = category.subcategories || [];
  if (subcategories.length) {
    subcategoryList.hidden = false;
    subcategoryList.innerHTML = subcategories.map((sub) => `<a href="#${sub.slug}">${sub.title}</a>`).join('');
    const groups = document.createElement('div');
    groups.className = 'subcategory-galleries';
    groups.innerHTML = subcategories.map((sub) => `
      <section class="subcategory-gallery" id="${sub.slug}">
        <h2>${sub.title}</h2>
        <div class="category-gallery">${renderPhotos(sub.photos, `${category.title} — ${sub.title}`)}</div>
      </section>
    `).join('');
    document.querySelector('.category-gallery-section').appendChild(groups);
  }

  const hasPhotos = photos.length || subcategories.some((sub) => (sub.photos || []).length);
  if (hasPhotos) document.getElementById('gallery-placeholder').hidden = true;
} else {
  document.title = 'Portfolio category — MJ Productions';
  document.getElementById('category-title').textContent = 'Category not found';
  document.getElementById('category-description').textContent = 'Please return to the portfolio and choose a category.';
  document.getElementById('gallery-placeholder').hidden = true;
}
