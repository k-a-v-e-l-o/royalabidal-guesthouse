/* ============================================================
   Royal Abidal Guesthouse — interactivity
   NOTE: fill GALLERY_IMAGES with your 22 Cloudinary photo URLs
   (same pattern as the one already in the About section).
   ============================================================ */

const CLOUD_NAME = 'dopqw0sji';

const galleryIds = [
  'v1785706209/WhatsApp_Image_2026-08-02_at_19.43.12_2_acqqaa.jpg',
  'v1785706208/WhatsApp_Image_2026-08-02_at_19.43.12_1_aj277d.jpg',
  'v1785706208/WhatsApp_Image_2026-08-02_at_19.50.24_whojrk.jpg',
  'v1785706081/WhatsApp_Image_2026-08-02_at_19.50.24_7_uxjexh.jpg',
  'v1785706066/WhatsApp_Image_2026-08-02_at_19.50.24_6_rivg0m.jpg',
  'v1785705727/WhatsApp_Image_2026-08-02_at_19.50.24_5_tgfgfp.jpg',
  'v1785705726/WhatsApp_Image_2026-08-02_at_19.50.24_4_txyf8n.jpg',
  'v1785705725/WhatsApp_Image_2026-08-02_at_19.50.24_3_wh9wyz.jpg',
  'v1785705724/WhatsApp_Image_2026-08-02_at_19.50.24_2_xwuill.jpg',
  'v1785705723/WhatsApp_Image_2026-08-02_at_19.50.24_1_mjej7j.jpg',
  'v1785705723/WhatsApp_Image_2026-08-02_at_19.44.48_prwqwv.jpg',
  'v1785705722/WhatsApp_Image_2026-08-02_at_19.44.48_8_bz1mfu.jpg',
  'v1785705721/WhatsApp_Image_2026-08-02_at_19.44.48_5_kvw8vp.jpg',
  'v1785705720/WhatsApp_Image_2026-08-02_at_19.44.48_4_sg1qqi.jpg',
  'v1785705719/WhatsApp_Image_2026-08-02_at_19.44.48_2_wxiks7.jpg',
  'v1785705718/WhatsApp_Image_2026-08-02_at_19.44.48_1_mpqwuj.jpg',
  'v1785705717/WhatsApp_Image_2026-08-02_at_19.43.38_z4mble.jpg',
  'v1785705717/WhatsApp_Image_2026-08-02_at_19.43.38_1_pfed13.jpg',
  'v1785705716/WhatsApp_Image_2026-08-02_at_19.43.12_dyzwtw.jpg',
  'v1785705716/WhatsApp_Image_2026-08-02_at_19.43.12_3_qvufjv.jpg',
  'v1785705715/WhatsApp_Image_2026-08-02_at_19.43.12_2_yrqpa1.jpg',
  'v1785705715/WhatsApp_Image_2026-08-02_at_19.43.12_1_l11nvt.jpg'
];

function cldUrl(publicId, transform) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

// ---------- Mobile menu ----------
function toggleMenu() {
  document.getElementById('mmenu').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('mmenu').classList.remove('open');
}

// ---------- Gallery ----------
// A repeating rhythm so the wall isn't a flat, uniform grid.
// Index positions (0-based) that get a bigger treatment:
const BENTO_BIG = new Set([0, 10]);          // large feature tiles
const BENTO_TALL = new Set([4, 15]);         // portrait tiles
const BENTO_WIDE = new Set([7, 18]);         // landscape tiles

function bentoClass(i) {
  if (BENTO_BIG.has(i)) return 'g-big';
  if (BENTO_TALL.has(i)) return 'g-tall';
  if (BENTO_WIDE.has(i)) return 'g-wide';
  return '';
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = galleryIds.map((id, i) =>
    `<div class="g-item ${bentoClass(i)}" onclick="openLightbox(${i})">
      <img src="${cldUrl(id, 'f_auto,q_auto,w_700,h_700,c_fill,g_auto')}" alt="Royal Abidal Guesthouse — photo ${i + 1}" loading="lazy" onload="this.classList.add('loaded')">
      <span class="g-caption">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/></svg>
        View photo ${i + 1} of ${galleryIds.length}
      </span>
    </div>`
  ).join('');
}

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxThumbs = document.getElementById('lightboxThumbs');
let currentIndex = 0;

function renderThumbs() {
  if (!lightboxThumbs) return;
  lightboxThumbs.innerHTML = galleryIds.map((id, i) =>
    `<img src="${cldUrl(id, 'f_auto,q_auto,w_120,h_120,c_fill,g_auto')}" alt="Photo ${i + 1} thumbnail" data-i="${i}" onclick="jumpToImg(${i})">`
  ).join('');
}

function jumpToImg(i) {
  currentIndex = i;
  updateLightbox();
}

function preloadNeighbours() {
  [currentIndex - 1, currentIndex + 1].forEach(i => {
    const idx = (i + galleryIds.length) % galleryIds.length;
    const img = new Image();
    img.src = cldUrl(galleryIds[idx], 'f_auto,q_auto,w_1600,c_limit');
  });
}

function openLightbox(index) {
  currentIndex = index;
  if (!lightboxThumbs.childElementCount) renderThumbs();
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function updateLightbox() {
  lightboxImg.src = cldUrl(galleryIds[currentIndex], 'f_auto,q_auto,w_1600,c_limit');
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryIds.length}`;
  if (lightboxThumbs) {
    [...lightboxThumbs.children].forEach((el, i) => el.classList.toggle('active', i === currentIndex));
    const activeThumb = lightboxThumbs.children[currentIndex];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  preloadNeighbours();
}
function nextImg(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryIds.length;
  updateLightbox();
}
function prevImg(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryIds.length) % galleryIds.length;
  updateLightbox();
}
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImg();
  if (e.key === 'ArrowLeft') prevImg();
});

// Touch swipe — the main way to "move around" the gallery on a phone
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextImg(); else prevImg();
  }
}, { passive: true });

renderGallery();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Scroll-aware nav + back-to-top ----------
const navEl = document.querySelector('nav');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  if (navEl) navEl.classList.toggle('scrolled', scrolled);
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}