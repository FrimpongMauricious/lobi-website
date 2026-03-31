// ============================
// LOBI – Main Script
// ============================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// Animate step circles when How It Works section is in view
const stepCircles = document.querySelectorAll('.step-circle');
let stepIndex = 0;

function cycleSteps() {
  stepCircles.forEach(c => c.classList.remove('active'));
  stepCircles[stepIndex].classList.add('active');
  stepIndex = (stepIndex + 1) % stepCircles.length;
}

setInterval(cycleSteps, 1800);

// Scroll-triggered fade-in animations
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to cards and sections
const animatables = document.querySelectorAll(
  '.service-card, .earn-card, .step, .testimonial-card, .safety-feature, .section-header'
);

animatables.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  observer.observe(el);
});

// Hero stats counter animation
function animateCounter(el, target, suffix = '') {
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
    const values = [50000, 2000, 10];
    const suffixes = ['K+', '+', '+'];
    statEls.forEach((el, i) => {
      if (i === 0) animateCounter(el, 50, 'K+');
      else if (i === 1) animateCounter(el, 2000, '+');
      else animateCounter(el, 10, '+');
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
