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
      if (entry.target.classList.contains('booking-region')) {
        entry.target.querySelectorAll('.booking-card.reveal').forEach(card => {
          card.classList.add('visible');
        });
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '60px 0px -20px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('.booking-page') && !el.classList.contains('booking-card') && !el.classList.contains('booking-region')) {
      el.classList.add('visible');
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80 && rect.bottom > 0) {
      el.classList.add('visible');
      if (el.classList.contains('booking-region')) {
        el.querySelectorAll('.booking-card.reveal').forEach(card => card.classList.add('visible'));
      }
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

function createStars(container, isMobile) {
  const count = isMobile ? 50 : 85;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() < 0.18 ? Math.random() * 2 + 2.2 : Math.random() * 1.4 + 0.7;
    const bright = Math.random() < 0.22;
    p.className = 'particle star' + (bright ? ' star-bright' : '');
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --twinkle-dur: ${(Math.random() * 3.5 + 2).toFixed(2)}s;
      --twinkle-delay: ${(Math.random() * 6).toFixed(2)}s;
    `;
    container.appendChild(p);
  }
  const shootingCount = isMobile ? 2 : 4;
  for (let i = 0; i < shootingCount; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.cssText = `
      left: ${8 + Math.random() * 55}%;
      top: ${4 + Math.random() * 38}%;
      --shoot-delay: ${(Math.random() * 10 + 3).toFixed(2)}s;
      --shoot-dur: ${(Math.random() * 1.2 + 0.7).toFixed(2)}s;
    `;
    container.appendChild(s);
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
  document.querySelectorAll('.ambient-stars').forEach(c => createStars(c, isMobile));
}
initAmbientEffects();

/* ---- Hero parallax ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translate3d(0, ${window.scrollY * 0.2}px, 0)`;
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
function scrollToAnchorTarget(selector, behavior = 'smooth') {
  const target = document.querySelector(selector);
  if (!target) return;
  const offset = navbar ? navbar.offsetHeight + 20 : 80;
  window.scrollTo({ top: target.offsetTop - offset, behavior });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    scrollToAnchorTarget(anchor.getAttribute('href'));
  });
});

const BOOKING_REGION_IDS = ['northeast', 'south', 'midwest', 'west'];

function scrollToBookingRegionHead(regionId, behavior = 'smooth') {
  const bookingPage = document.querySelector('.booking-page');
  if (!bookingPage) return;
  const head =
    regionId === 'all'
      ? bookingPage.querySelector('#booking-cities-list .booking-region-head')
      : bookingPage.querySelector(`#region-${regionId} .booking-region-head`);
  if (!head) return;
  const offset = navbar ? navbar.offsetHeight + 20 : 80;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const top = head.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
    });
  });
}

function selectBookingRegion(regionId, { updateHash = true, scroll = false } = {}) {
  const bookingPage = document.querySelector('.booking-page');
  if (!bookingPage || !BOOKING_REGION_IDS.includes(regionId)) return;

  bookingPage.querySelector('.booking-region-jump-all')?.classList.remove('is-active');
  bookingPage.querySelector('.booking-show-all-btn')?.classList.remove('is-active');

  bookingPage.querySelectorAll('.booking-region-jump-item[data-region]').forEach(item => {
    if (item.dataset.region === 'all') return;
    const active = item.dataset.region === regionId;
    item.classList.toggle('is-active', active);
  });

  bookingPage.querySelectorAll('.booking-region-jump-btn[data-region]').forEach(btn => {
    const active = btn.dataset.region === regionId;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  bookingPage.querySelectorAll('.booking-region[data-region]').forEach(panel => {
    const active = panel.dataset.region === regionId;
    panel.classList.toggle('booking-region-hidden', !active);
    panel.classList.toggle('booking-region-focus', active);
    panel.hidden = !active;
  });

  const label = bookingPage.querySelector(`.booking-region-jump-btn[data-region="${regionId}"]`)?.textContent?.trim();
  const intro = bookingPage.querySelector('.booking-intro');
  if (intro && label) {
    intro.textContent = `Choose your city in ${label} to open the private chef calendar. Every location includes live hibachi show cooking at your home or venue.`;
  }

  if (updateHash) {
    const nextHash = `#region-${regionId}`;
    if (location.hash !== nextHash) {
      history.replaceState(null, '', `${location.pathname}${location.search}${nextHash}`);
    }
  }

  if (scroll) {
    scrollToBookingRegionHead(regionId, 'smooth');
  }
}

function showAllBookingRegions({ updateHash = true, scroll = false } = {}) {
  const bookingPage = document.querySelector('.booking-page');
  if (!bookingPage) return;

  bookingPage.querySelectorAll('.booking-region-jump-item[data-region]').forEach(item => {
    if (item.dataset.region !== 'all') item.classList.remove('is-active');
  });

  bookingPage.querySelectorAll('.booking-region-jump-btn[data-region]').forEach(btn => {
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  });

  bookingPage.querySelector('.booking-region-jump-all')?.classList.add('is-active');
  bookingPage.querySelector('.booking-show-all-btn')?.classList.add('is-active');

  bookingPage.querySelectorAll('.booking-region[data-region]').forEach(panel => {
    panel.classList.remove('booking-region-hidden', 'booking-region-focus');
    panel.hidden = false;
  });

  const intro = bookingPage.querySelector('.booking-intro');
  if (intro) {
    intro.textContent =
      'Browse all booking locations across Northeast, South, Midwest and West — pick a city to open the private chef calendar.';
  }

  if (updateHash) {
    const nextHash = '#all';
    if (location.hash !== nextHash) {
      history.replaceState(null, '', `${location.pathname}${location.search}${nextHash}`);
    }
  }

  if (scroll) {
    scrollToBookingRegionHead('all', 'smooth');
  }
}

function initBookingRegionNav() {
  const bookingPage = document.querySelector('.booking-page');
  if (!bookingPage) return;

  const wireJumpItem = (item, go) => {
    item.querySelector('.booking-region-jump-map')?.addEventListener('click', go);
    item.querySelector('.booking-region-jump-map')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
    item.querySelector('.booking-region-jump-btn')?.addEventListener('click', e => {
      e.preventDefault();
      go();
    });
  };

  const allItem = bookingPage.querySelector('.booking-region-jump-all');
  if (allItem) wireJumpItem(allItem, () => showAllBookingRegions({ scroll: true }));

  bookingPage.querySelectorAll('.booking-region-jump-item[data-region]').forEach(item => {
    if (item.dataset.region === 'all') return;
    wireJumpItem(item, () => selectBookingRegion(item.dataset.region, { scroll: true }));
  });

  if (location.hash === '#all') {
    showAllBookingRegions({ updateHash: false, scroll: false });
    return;
  }

  const hashMatch = location.hash.match(/^#region-(northeast|south|midwest|west)$/);
  if (hashMatch) {
    selectBookingRegion(hashMatch[1], { updateHash: false, scroll: false });
    return;
  }

  showAllBookingRegions({ updateHash: false, scroll: false });
}

if (location.hash) {
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      const onBookingPage = document.querySelector('.booking-page');
      const regionMatch = location.hash.match(/^#region-(northeast|south|midwest|west)$/);
      if (onBookingPage && regionMatch) {
        initBookingRegionNav();
        scrollToBookingRegionHead(regionMatch[1], 'auto');
      } else if (onBookingPage && location.hash === '#all') {
        initBookingRegionNav();
        scrollToBookingRegionHead('all', 'auto');
      } else {
        scrollToAnchorTarget(location.hash, 'auto');
      }
    }, 80);
  });
} else {
  window.addEventListener('load', () => {
    window.setTimeout(initBookingRegionNav, 0);
  });
}

/* ---- Locations map: click/hover state to jump & highlight region ---- */
function regionPanel(regionId) {
  return document.getElementById(`region-${regionId}`);
}

function setActiveMapRegion(regionId) {
  document.querySelectorAll('.locations-us-map path.served[data-region]').forEach(path => {
    path.classList.toggle('map-region-active', path.dataset.region === regionId);
  });
  document.querySelectorAll('.locations-region[data-region]').forEach(panel => {
    panel.classList.toggle('locations-region-hover', panel.dataset.region === regionId);
  });
}

function clearActiveMapRegion() {
  setActiveMapRegion('');
}

function scrollToRegion(regionId) {
  const target = regionPanel(regionId);
  if (!target) return;
  const offset = navbar ? navbar.offsetHeight + 20 : 80;
  window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  setActiveMapRegion(regionId);
  target.classList.add('locations-region-focus');
  window.setTimeout(() => {
    target.classList.remove('locations-region-focus');
    clearActiveMapRegion();
  }, 1600);
}

document.querySelectorAll('.locations-us-map path.served[data-region]').forEach(path => {
  const regionId = path.dataset.region;
  const go = () => scrollToRegion(regionId);
  path.addEventListener('click', go);
  path.addEventListener('mouseenter', () => setActiveMapRegion(regionId));
  path.addEventListener('mouseleave', clearActiveMapRegion);
  path.addEventListener('focus', () => setActiveMapRegion(regionId));
  path.addEventListener('blur', clearActiveMapRegion);
  path.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  });
});

document.querySelectorAll('.locations-region[data-region]').forEach(panel => {
  const regionId = panel.dataset.region;
  panel.addEventListener('mouseenter', () => setActiveMapRegion(regionId));
  panel.addEventListener('mouseleave', clearActiveMapRegion);
});

document.querySelectorAll('.locations-jump a[href^="#region-"]').forEach(link => {
  const regionId = link.getAttribute('href').replace('#region-', '');
  link.addEventListener('mouseenter', () => setActiveMapRegion(regionId));
  link.addEventListener('mouseleave', clearActiveMapRegion);
  link.addEventListener('focus', () => setActiveMapRegion(regionId));
  link.addEventListener('blur', clearActiveMapRegion);
});

/* ---- Cost estimation calculator ---- */
function initEstimationCalculator() {
  const page = document.querySelector('.estimation-page');
  if (!page) return;

  const fields = {
    adults: document.getElementById('est-adults'),
    kids: document.getElementById('est-kids'),
    scallop: document.getElementById('est-scallop'),
    filet: document.getElementById('est-filet'),
    lobster: document.getElementById('est-lobster'),
    extraProtein: document.getElementById('est-extra-protein'),
    noodles: document.getElementById('est-noodles'),
    edamame: document.getElementById('est-edamame'),
    gyoza: document.getElementById('est-gyoza'),
    travel: document.getElementById('est-travel'),
  };
  const receiptEl = document.getElementById('est-receipt');
  const resetBtn = document.getElementById('est-reset');
  const copyBtn = document.getElementById('est-copy');
  if (!receiptEl) return;

  const RATES = {
    adult: 50,
    kid: 25,
    minFood: 500,
    scallop: 5,
    filet: 5,
    lobster: 10,
    extraProtein: 10,
    noodles: 5,
    edamame: 5,
    gyoza: 10,
  };

  const money = n =>
    `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const val = el => Math.max(0, Math.floor(Number(el?.value) || 0));

  function listOrNone(items) {
    return items.length
      ? `<ul class="estimate-receipt-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`
      : '<ul class="estimate-receipt-list"><li>None</li></ul>';
  }

  function buildReceiptText(data) {
    const lines = [
      'Hibachi2Party — Cost Estimate',
      '',
      `${data.adults} Adults`,
      `${data.kids} Kids under 12`,
      '',
      'Premium upgrades:',
      ...(data.premiumItems.length ? data.premiumItems.map(i => `- ${i}`) : ['- None']),
      '',
      'Appetizers/Extras:',
      ...(data.extraItems.length ? data.extraItems.map(i => `- ${i}`) : ['- None']),
      '',
      `Traveling fees (distance-based): ${money(data.travel)}`,
      '',
      'Calculation:',
      ...data.calcLines.map(l => `- ${l}`),
      `Food total: ${money(data.foodSubtotal)}`,
      `Total cash: ${money(data.foodSubtotal)} + ${money(data.travel)} = ${money(data.preTipTotal)}`,
      ...(data.belowMinimum ? [`$${RATES.minFood} event minimum applies.`] : []),
      '',
      'Tips Suggestion',
      ...data.tipLines.map(l => `- ${l}`),
      '',
      '* Gratuity and sales tax not included in Total cash.',
      'Sales tax varies by event state/location.',
      'hibachi2partys.com',
    ];
    return lines.join('\n');
  }

  function calculate() {
    const adults = val(fields.adults);
    const kids = val(fields.kids);
    const scallop = val(fields.scallop);
    const filet = val(fields.filet);
    const lobster = val(fields.lobster);
    const extraProtein = val(fields.extraProtein);
    const noodles = val(fields.noodles);
    const edamame = val(fields.edamame);
    const gyoza = val(fields.gyoza);
    const travel = Math.max(0, Number(fields.travel?.value) || 0);

    const adultTotal = adults * RATES.adult;
    const kidTotal = kids * RATES.kid;
    const scallopTotal = scallop * RATES.scallop;
    const filetTotal = filet * RATES.filet;
    const lobsterTotal = lobster * RATES.lobster;
    const premiumTotal = scallopTotal + filetTotal + lobsterTotal;
    const extraProteinTotal = extraProtein * RATES.extraProtein;
    const noodlesTotal = noodles * RATES.noodles;
    const edamameTotal = edamame * RATES.edamame;
    const gyozaTotal = gyoza * RATES.gyoza;
    const extrasTotal = extraProteinTotal + noodlesTotal + edamameTotal + gyozaTotal;

    const rawFood = adultTotal + kidTotal + premiumTotal + extrasTotal;
    const hasGuests = adults + kids > 0;

    const foodSubtotal = rawFood;
    const belowMinimum = hasGuests && rawFood < RATES.minFood;
    const preTipTotal = foodSubtotal + travel;

    const premiumItems = [];
    if (scallop) premiumItems.push(`Scallops × ${scallop}`);
    if (filet) premiumItems.push(`Filet Mignon × ${filet}`);
    if (lobster) premiumItems.push(`Lobster × ${lobster}`);

    const extraItems = [];
    if (extraProtein) extraItems.push(`3rd protein × ${extraProtein}`);
    if (noodles) extraItems.push(`Noodles × ${noodles}`);
    if (edamame) extraItems.push(`Edamame × ${edamame}`);
    if (gyoza) extraItems.push(`Gyoza × ${gyoza}`);

    const calcLines = [
      `Adults: ${adults} × $${RATES.adult} = ${money(adultTotal)}`,
      `Kids: ${kids} × $${RATES.kid} = ${money(kidTotal)}`,
      `Premium upgrades: ${money(premiumTotal)}`,
    ];
    calcLines.push(`Appetizers/Extras: ${money(extrasTotal)}`);

    const tipLines = [20, 25, 30].map(
      pct => `${pct}% tips: ${money(preTipTotal * (pct / 100))}`
    );

    const data = {
      adults,
      kids,
      travel,
      premiumItems,
      extraItems,
      calcLines,
      foodSubtotal,
      preTipTotal,
      tipLines,
      belowMinimum,
    };

    const minimumNote = belowMinimum
      ? `<p class="estimate-receipt-minimum">$${RATES.minFood} event minimum applies.</p>`
      : '';

    receiptEl.innerHTML = `
      <div class="estimate-receipt-brand">Hibachi2Party</div>
      <div class="estimate-receipt-meta">Hibachi at Home · Estimate</div>
      <hr class="estimate-receipt-divider">
      <div class="estimate-receipt-line">${adults} Adults</div>
      <div class="estimate-receipt-line">${kids} Kids under 12</div>
      <hr class="estimate-receipt-divider">
      <div class="estimate-receipt-label">Premium upgrades:</div>
      ${listOrNone(premiumItems)}
      <div class="estimate-receipt-label">Appetizers/Extras:</div>
      ${listOrNone(extraItems)}
      <div class="estimate-receipt-line">Traveling fees (distance-based): ${money(travel)}</div>
      <hr class="estimate-receipt-divider">
      <div class="estimate-receipt-label">Calculation:</div>
      <ul class="estimate-receipt-list estimate-receipt-calc">
        ${calcLines.map(line => `<li>${line}</li>`).join('')}
      </ul>
      <div class="estimate-receipt-total">Food total: ${money(foodSubtotal)}</div>
      <div class="estimate-receipt-total estimate-receipt-total-strong">Total cash: ${money(foodSubtotal)} + ${money(travel)} = ${money(preTipTotal)}</div>
      ${minimumNote}
      <hr class="estimate-receipt-divider">
      <div class="estimate-receipt-label">Tips Suggestion</div>
      <ul class="estimate-receipt-list">
        ${tipLines.map(line => `<li>${line}</li>`).join('')}
      </ul>
      <p class="estimate-receipt-fineprint">* Gratuity and sales tax not included in Total cash.<br>Sales tax varies by event state/location.</p>
    `;

    return { ...data, receiptText: buildReceiptText(data) };
  }

  function setStepValue(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = String(Math.max(0, val(input) + delta));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function syncTravelChips(amount) {
    page.querySelectorAll('[data-travel-preset]').forEach(chip => {
      const preset = Number(chip.dataset.travelPreset);
      const match = preset === 200 ? amount >= 200 : amount === preset;
      chip.classList.toggle('is-active', match);
    });
  }

  function resetForm() {
    Object.values(fields).forEach(el => {
      if (el) el.value = '0';
    });
    syncTravelChips(0);
    calculate();
  }

  function copyQuote() {
    const data = calculate();

    navigator.clipboard?.writeText(data.receiptText).then(() => {
      if (!copyBtn) return;
      const prev = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      window.setTimeout(() => {
        copyBtn.textContent = prev;
      }, 1800);
    });
  }

  Object.values(fields).forEach(el => {
    el?.addEventListener('input', () => {
      if (el === fields.travel) syncTravelChips(Math.max(0, Number(el.value) || 0));
      calculate();
    });
  });

  page.querySelectorAll('[data-step-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStepValue(btn.dataset.stepTarget, Number(btn.dataset.stepDelta));
    });
  });

  page.querySelectorAll('[data-travel-preset]').forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = Number(chip.dataset.travelPreset);
      if (fields.travel) {
        fields.travel.value = String(preset === 200 ? 200 : preset);
        fields.travel.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  resetBtn?.addEventListener('click', resetForm);
  copyBtn?.addEventListener('click', copyQuote);
  calculate();
}

initEstimationCalculator();
