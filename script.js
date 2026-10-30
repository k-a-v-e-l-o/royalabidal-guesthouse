const CLOUD = 'dopqw0sji';
const ids = [
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
const $ = s => document.querySelector(s);
const cld = (id, t) => `https://res.cloudinary.com/${CLOUD}/image/upload/${t}/${id}`;

function toggleMenu() { $('#mmenu').classList.toggle('open'); }
function closeMenu() { $('#mmenu').classList.remove('open'); }

// Photos placed by index: <img data-g="3" data-w="600">
document.querySelectorAll('img[data-g]').forEach(img => {
  img.src = cld(ids[+img.dataset.g], `f_auto,q_auto,w_${img.dataset.w || 800},c_limit`);
});

// Gallery
const grid = $('#galleryGrid');
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
const BIG = new Set([0, 10]), WIDE = new Set([7, 18]);
grid.innerHTML = ids.map((id, i) =>
  `<div class="g ${BIG.has(i) ? 'big' : WIDE.has(i) ? 'wide' : ''}" onclick="openLightbox(${i})">
    <img src="${cld(id, 'f_auto,q_auto,w_700,h_700,c_fill,g_auto')}" alt="Royal Abidal Guesthouse photo ${i + 1}" loading="lazy" onload="this.classList.add('on')">
  </div>`).join('');

// Tiles rise in column by column as the gallery scrolls into view
const reveal = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const t = en.target;
  t.style.transitionDelay = ([...grid.children].indexOf(t) % 4) * 80 + 'ms';
  t.classList.add('in');
  setTimeout(() => t.style.transitionDelay = '', 1300);
  reveal.unobserve(t);
}), { threshold: .12 });
[...grid.children].forEach(t => reveal.observe(t));

// "View" bubble that follows the cursor over the tiles
const bub = document.createElement('div');
bub.className = 'bub'; bub.textContent = 'View';
document.body.append(bub);
grid.addEventListener('mousemove', e => {
  bub.style.left = e.clientX + 'px'; bub.style.top = e.clientY + 'px';
  bub.classList.toggle('on', !!e.target.closest('.g'));
});
grid.addEventListener('mouseleave', () => bub.classList.remove('on'));

// Lightbox: the photo grows out of its tile, slides between photos, shrinks back on close
const lb = $('#lightbox'), lbImg = $('#lightboxImg'), lbCount = $('#lightboxCounter'), thumbs = $('#lightboxThumbs');
let cur = 0;
function shift(tile) {
  const a = tile.getBoundingClientRect(), b = lbImg.getBoundingClientRect();
  const s = Math.max(a.width / b.width, a.height / b.height);
  return `translate(${a.left + a.width / 2 - b.left - b.width / 2}px,${a.top + a.height / 2 - b.top - b.height / 2}px) scale(${s})`;
}
function render(dir, tile) {
  lbImg.onload = () => {
    lbImg.onload = null;
    if (calm) return;
    if (tile) lbImg.animate([{ transform: shift(tile), opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
    else if (dir) lbImg.animate([{ transform: `translateX(${dir * 70}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 350, easing: 'ease-out' });
  };
  lbImg.src = cld(ids[cur], 'f_auto,q_auto,w_1600,c_limit');
  lbCount.textContent = `${cur + 1} / ${ids.length}`;
  [...thumbs.children].forEach((t, i) => t.classList.toggle('active', i === cur));
  thumbs.children[cur]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  [cur - 1, cur + 1].forEach(i => { new Image().src = cld(ids[(i + ids.length) % ids.length], 'f_auto,q_auto,w_1600,c_limit'); });
}
function go(n) { const d = n > cur ? 1 : -1; cur = n; render(d); }
function openLightbox(i) {
  cur = i;
  if (!thumbs.childElementCount) {
    thumbs.innerHTML = ids.map((id, n) => `<img src="${cld(id, 'f_auto,q_auto,w_120,h_120,c_fill,g_auto')}" alt="Thumbnail ${n + 1}" onclick="go(${n})">`).join('');
  }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  bub.classList.remove('on');
  render(0, grid.children[i].querySelector('img'));
}
function closeLightbox() {
  const done = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.removeAttribute('src'); };
  const tile = grid.children[cur].querySelector('img'), r = tile.getBoundingClientRect();
  if (calm || r.bottom < 0 || r.top > innerHeight) return done();
  lbImg.animate([{ transform: 'none', opacity: 1 }, { transform: shift(tile), opacity: .3 }], { duration: 300, easing: 'ease-in' }).onfinish = done;
}
function nextImg(e) { e && e.stopPropagation(); cur = (cur + 1) % ids.length; render(1); }
function prevImg(e) { e && e.stopPropagation(); cur = (cur - 1 + ids.length) % ids.length; render(-1); }
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImg();
  if (e.key === 'ArrowLeft') prevImg();
});
let sx = 0, sy = 0;
lb.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? nextImg() : prevImg();
}, { passive: true });

// Back to top
window.addEventListener('scroll', () => $('#backToTop').classList.toggle('show', scrollY > 600), { passive: true });

// Enquiry form (Supabase edge function, same as before)
(function () {
  const FN_URL = 'https://nqnnxmllftmpavobymjo.supabase.co/functions/v1/send-enquiry';
  const KEY = 'sb_publishable_H0oT8EKItI3fL7dSlze6VA_oLfEzgH3';
  const ADMIN = 'Abidaltsale@gmail.com';
  const form = $('#enquiryForm'), status = $('#formStatus'), btn = $('#enquirySubmitBtn');
  const say = (t, c) => { status.textContent = t; status.className = 'status ' + (c || ''); };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = {
      name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(),
      location: form.location.value, message: form.message.value.trim() || 'No additional details provided.'
    };
    if (!d.name || !d.phone) return say('Please add your name and phone number.', 'error');

    if (!d.email) {
      const body = `Name: ${d.name}\nPhone: ${d.phone}\nPreferred location: ${d.location}\nMessage: ${d.message}`;
      location.href = `mailto:${ADMIN}?subject=${encodeURIComponent('Enquiry from ' + d.name)}&body=${encodeURIComponent(body)}`;
      say('Opening your email app. Press send to complete your enquiry.', 'success');
      form.reset();
      return;
    }

    btn.disabled = true; btn.textContent = 'Sending...'; say('');
    fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
      body: JSON.stringify(d)
    })
      .then(r => { if (!r.ok) throw new Error('Request failed'); return r.json(); })
      .then(() => { say("Thanks! We've received your enquiry. Please check your email.", 'success'); form.reset(); })
      .catch(err => { console.error('Enquiry error:', err); say('Something went wrong. Please try WhatsApp instead.', 'error'); })
      .finally(() => { btn.disabled = false; btn.textContent = 'Send enquiry'; });
  });
})();