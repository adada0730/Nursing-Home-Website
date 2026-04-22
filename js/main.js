/* =============================================
   Navigation
   ============================================= */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (navbar) {
  const heroSection = document.querySelector('.hero-section');

  function updateNav() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    if (heroSection) navbar.classList.toggle('transparent', !scrolled);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

/* =============================================
   Scroll Reveal
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.08) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   Back to Top
   ============================================= */
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   FAQ Accordion
   ============================================= */
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    if (!isOpen) item.classList.add('open');
  });
});

/* =============================================
   Lightbox Gallery
   ============================================= */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxCap  = document.getElementById('lightboxCaption');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
let currentIndex   = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  if (!item || !lightbox) return;
  lightboxImg.src = item.dataset.src;
  if (lightboxCap) lightboxCap.textContent = item.dataset.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

if (lightbox) {
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => lightboxNav(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => lightboxNav(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
}

/* =============================================
   Virtual Tour
   ============================================= */
const rooms = [
  { id: 'lobby',   name: '迎賓大廳', en: 'Grand Lobby',     emoji: '🏛️',  color: '#2C4A6E', gradient: 'linear-gradient(135deg,#1a2a4a 0%,#2C4A6E 100%)', hotspots: [{x:'30%',y:'60%',label:'前台服務區'},{x:'70%',y:'40%',label:'休閒等候區'}] },
  { id: 'room',    name: '溫馨居室', en: 'Private Room',     emoji: '🛏️',  color: '#5C3A20', gradient: 'linear-gradient(135deg,#3a2010 0%,#5C3A20 100%)', hotspots: [{x:'25%',y:'50%',label:'緊急呼叫系統'},{x:'60%',y:'65%',label:'醫療升降床'}] },
  { id: 'garden',  name: '康養花園', en: 'Wellness Garden',  emoji: '🌿',  color: '#2E5A3A', gradient: 'linear-gradient(135deg,#1a3a24 0%,#2E5A3A 100%)', hotspots: [{x:'40%',y:'70%',label:'步道漫步區'},{x:'75%',y:'45%',label:'戶外休憩亭'}] },
  { id: 'dining',  name: '餐飲廳',  en: 'Dining Hall',      emoji: '🍽️',  color: '#6E3A2C', gradient: 'linear-gradient(135deg,#3a1a10 0%,#6E3A2C 100%)', hotspots: [{x:'35%',y:'55%',label:'自助餐區'},{x:'68%',y:'60%',label:'私人包廂'}] },
  { id: 'rehab',   name: '復健中心', en: 'Rehab Center',     emoji: '🏋️',  color: '#2C3E6E', gradient: 'linear-gradient(135deg,#1a2040 0%,#2C3E6E 100%)', hotspots: [{x:'28%',y:'58%',label:'物理治療區'},{x:'65%',y:'42%',label:'職能復健區'}] },
];

let currentRoom = 0;

function renderTour() {
  const viewer = document.getElementById('tourViewer');
  if (!viewer) return;

  const room = rooms[currentRoom];
  const scene = viewer.querySelector('.tour-scene');
  const info  = viewer.querySelector('.tour-info-title');
  const infoEn = viewer.querySelector('.tour-info-sub');
  const emoji = viewer.querySelector('.tour-room-emoji');
  const hotspot = viewer.querySelector('.tour-hotspots');

  if (scene)   scene.style.background = room.gradient;
  if (info)    info.textContent = room.name;
  if (infoEn)  infoEn.textContent = room.en;
  if (emoji)   emoji.textContent = room.emoji;
  if (hotspot) {
    hotspot.innerHTML = room.hotspots.map(h => `
      <div class="hotspot" style="left:${h.x};top:${h.y}">
        ℹ️<span class="hotspot-label">${h.label}</span>
      </div>
    `).join('');
  }

  viewer.querySelectorAll('.tour-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentRoom);
  });
}

function initTour() {
  const viewer = document.getElementById('tourViewer');
  if (!viewer) return;

  renderTour();

  viewer.querySelectorAll('.tour-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      currentRoom = i;
      renderTour();
    });
  });

  let isDragging = false, startX = 0;

  viewer.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; });
  viewer.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 80) {
      currentRoom = (currentRoom + (delta < 0 ? 1 : -1) + rooms.length) % rooms.length;
      renderTour();
      isDragging = false;
    }
  });
  viewer.addEventListener('mouseup', () => { isDragging = false; });

  let touchStart = 0;
  viewer.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
  viewer.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 60) {
      currentRoom = (currentRoom + (delta < 0 ? 1 : -1) + rooms.length) % rooms.length;
      renderTour();
    }
  });
}

initTour();

/* =============================================
   Booking Multi-Step Form
   ============================================= */
let bookingStep = 1;
let bookingData = {};

const bookingPanels = document.querySelectorAll('.booking-panel');
const steps         = document.querySelectorAll('.step');
const connectors    = document.querySelectorAll('.step-connector');

function goToStep(n) {
  bookingStep = n;

  bookingPanels.forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 === n)  s.classList.add('active');
    if (i + 1 <  n)   s.classList.add('done');
  });

  connectors.forEach((c, i) => c.classList.toggle('done', i < n - 1));

  const form = document.querySelector('.booking-form-wrap');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Step 1: Service selection
document.querySelectorAll('.service-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    bookingData.service = opt.dataset.service;
  });
});

document.getElementById('step1Next')?.addEventListener('click', () => {
  if (!bookingData.service) { showToast('請先選擇服務類型'); return; }
  goToStep(2);
});

document.getElementById('step2Back')?.addEventListener('click', () => goToStep(1));
document.getElementById('step2Next')?.addEventListener('click', () => {
  const name  = document.getElementById('residentName')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  if (!name)  { showToast('請填寫住民姓名'); return; }
  if (!phone) { showToast('請填寫聯絡電話'); return; }
  bookingData.name  = name;
  bookingData.phone = phone;
  goToStep(3);
});

document.getElementById('step3Back')?.addEventListener('click', () => goToStep(2));
document.getElementById('step3Next')?.addEventListener('click', () => {
  const date    = document.getElementById('visitDate')?.value;
  const timeEl  = document.querySelector('input[name="visitTime"]:checked');
  if (!date)   { showToast('請選擇參觀日期'); return; }
  if (!timeEl) { showToast('請選擇參觀時段'); return; }
  bookingData.date = date;
  bookingData.time = timeEl.value;
  const refNum = 'NH' + Date.now().toString().slice(-6);
  const refEl  = document.getElementById('bookingRef');
  if (refEl) refEl.textContent = refNum;
  goToStep(4);
});

/* Set min date for booking */
const visitDate = document.getElementById('visitDate');
if (visitDate) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  visitDate.min = tomorrow.toISOString().split('T')[0];
}

/* =============================================
   Toast notification
   ============================================= */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* =============================================
   Counter animation
   ============================================= */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.count);
  const isFloat = String(target).includes('.');
  const duration = 2000;
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const val      = target * ease;
    el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* =============================================
   Contact Form
   ============================================= */
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '傳送中…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ 已成功送出！';
    btn.style.background = '#4F7E5F';
    showToast('訊息已成功送出，我們將於 24 小時內與您聯繫。');
    setTimeout(() => {
      this.reset();
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  }, 1500);
});

/* =============================================
   Smooth internal links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
