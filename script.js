/* ============================================================
   PIRATE HIBACHI - Main JavaScript
   ============================================================ */

/* ---- Navbar scroll effect ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ---- Mobile hamburger menu ---- */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + window.scrollY + 'px';
  }
  function unlockScroll() {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) { lockScroll(); } else { unlockScroll(); }
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      unlockScroll();
    });
  });
}

/* ---- Active nav link ---- */
function normalizePath(p) {
  return p.replace(/\/$/, '').replace(/\.html$/, '') || '/';
}
const currentPath = normalizePath(window.location.pathname);
document.querySelectorAll('.nav-menu a').forEach(a => {
  const href = normalizePath(a.getAttribute('href') || '');
  if (href === currentPath || (currentPath === '/' && href === '/')) {
    a.classList.add('active');
  }
});

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '60px 0px -20px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('.booking-page')) {
      el.classList.add('visible');
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80 && rect.bottom > 0) {
      el.classList.add('visible');
      return;
    }
    revealObserver.observe(el);
  });
}

initReveal();

/* ---- Ambient effects (hero embers, page-specific FX) ---- */
function createEmbers(container, isMobile) {
  const isPageEmber = container.closest('.faq-fire-section, .booking-fire-section');
  const count = isPageEmber ? (isMobile ? 22 : 32) : (isMobile ? 28 : 42);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 7 + 3;
    const drift = (Math.random() - 0.5) * 80;
    const duration = Math.random() * 2.8 + 2;
    const variant = Math.random() < 0.35 ? ' ember-sm' : Math.random() < 0.15 ? ' ember-lg' : '';
    p.className = 'particle' + variant;
    p.style.cssText = `
      left: ${8 + Math.random() * 84}%;
      width: ${size}px;
      height: ${size}px;
      --drift: ${drift}px;
      animation-duration: ${duration}s, ${Math.random() * 1.2 + 0.6}s;
      animation-delay: ${Math.random() * 4}s, ${Math.random() * 2}s;
    `;
    container.appendChild(p);
  }
}

function createSparks(container, isMobile) {
  const count = isMobile ? 18 : 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = -50 - Math.random() * 80;
    const len = Math.random() * 20 + 10;
    const dx = (Math.random() - 0.25) * 140;
    const dy = -(Math.random() * 180 + 60);
    p.className = 'particle spark';
    p.style.cssText = `
      left: ${4 + Math.random() * 92}%;
      bottom: ${4 + Math.random() * 28}%;
      --angle: ${angle}deg;
      --len: ${len}px;
      --dx: ${dx}px;
      --dy: ${dy}px;
      animation-duration: ${Math.random() * 0.7 + 0.35}s;
      animation-delay: ${Math.random() * 2.5}s;
    `;
    container.appendChild(p);
  }
}

function createDust(container, isMobile) {
  const count = isMobile ? 14 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 6 + 3;
    const drift = (Math.random() - 0.5) * 120;
    p.className = 'particle dust';
    p.style.cssText = `
      left: ${6 + Math.random() * 88}%;
      width: ${size}px;
      height: ${size}px;
      --drift: ${drift}px;
      animation-duration: ${Math.random() * 5 + 4}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(p);
  }
}

function initAmbientEffects() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  document.querySelectorAll('.fire-particles').forEach(c => createEmbers(c, isMobile));
  document.querySelectorAll('.ambient-sparks').forEach(c => createSparks(c, isMobile));
  document.querySelectorAll('.ambient-dust').forEach(c => createDust(c, isMobile));
}
initAmbientEffects();

/* ---- Hero parallax ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
}

/* ---- FAQ Accordion ---- */
function measureFaqAnswer(answer) {
  answer.style.maxHeight = 'none';
  answer.style.overflow = 'visible';
  const height = answer.scrollHeight;
  answer.style.overflow = '';
  return height;
}

function setFaqAnswerHeight(answer, open) {
  if (!answer) return;
  if (open) {
    answer.classList.add('open');
    answer.style.maxHeight = 'none';
    const height = answer.scrollHeight;
    answer.style.maxHeight = '0px';
    void answer.offsetHeight;
    answer.style.maxHeight = height + 'px';
  } else {
    answer.style.maxHeight = measureFaqAnswer(answer) + 'px';
    void answer.offsetHeight;
    answer.classList.remove('open');
    answer.style.maxHeight = '0px';
  }
}

function initFaqAccordion() {
  document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'max-height') return;
      if (answer.classList.contains('open')) {
        answer.style.maxHeight = 'none';
        answer.style.overflow = 'visible';
      }
    });
  });

  document.querySelectorAll('.faq-item.open .faq-answer').forEach(answer => {
    setFaqAnswerHeight(answer, true);
    answer.style.maxHeight = 'none';
    answer.style.overflow = 'visible';
  });

  function toggleFaq(question) {
    const item = question.closest('.faq-item');
    const answer = item && item.querySelector('.faq-answer');
    if (!item || !answer) return;

    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      const q = openItem.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
      setFaqAnswerHeight(openItem.querySelector('.faq-answer'), false);
    });

    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      answer.style.overflow = 'hidden';
      setFaqAnswerHeight(answer, true);
    }
  }

  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.open .faq-answer').forEach(answer => {
      answer.style.maxHeight = measureFaqAnswer(answer) + 'px';
    });
  });

  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;
    e.preventDefault();
    toggleFaq(question);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const question = e.target.closest('.faq-question');
    if (!question) return;
    e.preventDefault();
    toggleFaq(question);
  });
}
initFaqAccordion();

/* ---- Gallery lightbox ---- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg   = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      lightboxImg.src = el.dataset.lightbox;
      lightboxImg.alt = el.dataset.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
initLightbox();

/* ---- Gallery Load More ---- */
function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreGallery');
  if (!loadMoreBtn) return;
  const hiddenItems = document.querySelectorAll('.gal-item.hidden');
  let revealed = 0;
  const BATCH = 12;

  loadMoreBtn.addEventListener('click', () => {
    const toShow = Array.from(hiddenItems).slice(revealed, revealed + BATCH);
    toShow.forEach(item => {
      item.classList.remove('hidden');
      item.style.animation = 'scale-in 0.4s ease forwards';
    });
    revealed += BATCH;
    if (revealed >= hiddenItems.length) {
      loadMoreBtn.style.display = 'none';
    }
  });
}
initLoadMore();

/* ---- Counter animation ---- */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---- Smooth anchor offset for fixed nav ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 20 : 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
