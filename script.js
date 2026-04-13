// ============================
// LOBI – Main Script
// ============================

// --- Circular favicon ---
(function () {
  const img = new Image();
  img.src = 'assets/lobi_logo.jpeg';
  img.onload = function () {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    const link = document.querySelector("link[rel='icon']");
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  };
})();

// --- Scroll progress bar (scaleX — no layout trigger) ---
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;
}, { passive: true });

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Mobile hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Scroll-reveal with staggered delays ---
// Cards and grid items use different reveal directions per section
const revealMap = [
  { selector: '.service-card',      cls: 'reveal'       },
  { selector: '.earn-card',         cls: 'reveal'       },
  { selector: '.testimonial-card',  cls: 'reveal-scale' },
  { selector: '.safety-feature',    cls: 'reveal-left'  },
  { selector: '.step',              cls: 'reveal-left'  },
  { selector: '.section-header',    cls: 'reveal'       },
  { selector: '.fleet-text',        cls: 'reveal-right' },
  { selector: '.fleet-img-wrap',    cls: 'reveal-left'  },
  { selector: '.download-content',  cls: 'reveal-left'  },
  { selector: '.download-visual',   cls: 'reveal-right' },
  { selector: '.hiw-content',       cls: 'reveal-right' },
  { selector: '.safety-content',    cls: 'reveal-left'  },
  { selector: '.safety-visual',     cls: 'reveal-right' },
];

revealMap.forEach(({ selector, cls }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add(cls);
    el.style.animationDelay = `${i * 0.1}s`;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
).forEach(el => revealObserver.observe(el));

// --- Hero image parallax on scroll ---
(function () {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Only run on devices that aren't flagged as preferring reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY  = window.scrollY;
      const heroBot  = document.querySelector('.hero-wrapper').getBoundingClientRect().bottom + scrollY;
      // Only apply while the hero is in view
      if (scrollY < heroBot) {
        heroImg.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
})();

// --- Step circles cycle animation ---
const stepCircles = document.querySelectorAll('.step-circle');
let stepIndex = 0;

const cycleSteps = () => {
  stepCircles.forEach(c => c.classList.remove('active'));
  stepCircles[stepIndex].classList.add('active');
  stepIndex = (stepIndex + 1) % stepCircles.length;
};

// Only start cycling when section is visible
const hiwObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    cycleSteps();
    setInterval(cycleSteps, 1800);
    hiwObserver.disconnect();
  }
}, { threshold: 0.3 });

const hiwSection = document.querySelector('.how-it-works');
if (hiwSection) hiwObserver.observe(hiwSection);

// --- Stats counter animation ---
function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const statEls = document.querySelectorAll('.stat strong');
    statEls.forEach((el, i) => {
      if (i === 0) animateCounter(el, 50,   'K+');
      if (i === 1) animateCounter(el, 2000, '+');
      if (i === 2) animateCounter(el, 10,   '+');
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// --- Cookie consent banner ---
(function () {
  const banner  = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const reject  = document.getElementById('cookieReject');
  if (!banner) return;

  // Show only if not already answered
  if (!localStorage.getItem('lobi_cookie_consent')) {
    setTimeout(() => banner.classList.add('visible'), 1200);
  }

  function dismiss(choice) {
    localStorage.setItem('lobi_cookie_consent', choice);
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 500);
  }

  accept.addEventListener('click', () => dismiss('accepted'));
  reject.addEventListener('click', () => dismiss('rejected'));
})();

// --- Testimonials carousel (drag + auto-scroll + dots) ---
(function () {
  const track     = document.getElementById('testimonialsTrack');
  const dotsWrap  = document.getElementById('carouselDots');
  if (!track) return;

  const cards     = Array.from(track.children);
  const cardCount = cards.length;
  let current     = 0;
  let startX      = 0;
  let isDragging  = false;
  let dragDelta   = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.carousel-dot'); }

  function getOffset(index) {
    // Offset = sum of widths + gaps of all cards before index,
    // minus the leading padding so first card aligns to container edge
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap       = 24;
    return index * (cardWidth + gap);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, cardCount - 1));
    track.style.transform = `translateX(-${getOffset(current)}px)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current < cardCount - 1 ? current + 1 : 0); }

  // Auto-scroll every 3.5 s
  function startAuto() { autoTimer = setInterval(next, 3500); }
  function stopAuto()  { clearInterval(autoTimer); }

  startAuto();

  // Drag support (mouse + touch)
  track.addEventListener('mousedown', e => {
    isDragging = true; startX = e.pageX; dragDelta = 0;
    stopAuto();
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDelta = e.pageX - startX;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragDelta < -50)      next();
    else if (dragDelta > 50)  goTo(current > 0 ? current - 1 : 0);
    startAuto();
  });

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX; dragDelta = 0;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    dragDelta = e.touches[0].pageX - startX;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    if (dragDelta < -50)      next();
    else if (dragDelta > 50)  goTo(current > 0 ? current - 1 : 0);
    startAuto();
  });

  // Pause on hover
  track.closest('.testimonials-carousel-wrap').addEventListener('mouseenter', stopAuto);
  track.closest('.testimonials-carousel-wrap').addEventListener('mouseleave', startAuto);
})();

// --- Back to top button ---
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Active nav link on scroll ---
const navSections = document.querySelectorAll('section[id], div[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.remove('nav-active');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('nav-active');
        }
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });

navSections.forEach(section => activeSectionObserver.observe(section));

// --- Button ripple effect ---
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// --- Pulse ring on safety icons via pseudo-element ---
// The CSS ::after handles the visual; JS re-triggers by toggling a class
document.querySelectorAll('.safety-feature').forEach(row => {
  row.addEventListener('mouseenter', () => {
    const icon = row.querySelector('.safety-feat-icon');
    icon.classList.remove('pulsing');
    void icon.offsetWidth; // reflow to restart animation
    icon.classList.add('pulsing');
  });
  row.addEventListener('mouseleave', () => {
    row.querySelector('.safety-feat-icon').classList.remove('pulsing');
  });
});
