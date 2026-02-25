/* ============================================
   ADITYA KUMAR TIWARI — PORTFOLIO SCRIPT
   ============================================ */

// ─── CUSTOM CURSOR ──────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '0.4';
});

// ─── CANVAS STARFIELD ────────────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
let nebulae = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initStars(count = 200) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.005,
    });
  }
  nebulae = [];
  for (let i = 0; i < 3; i++) {
    nebulae.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 200 + Math.random() * 300,
      color: i === 0 ? '74,242,161' : i === 1 ? '123,94,167' : '242,95,76',
      opacity: 0.03 + Math.random() * 0.04,
    });
  }
}
initStars();

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);

  // Nebulae glow
  nebulae.forEach(n => {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grad.addColorStop(0, `rgba(${n.color},${n.opacity})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stars
  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const tw = 0.5 + 0.5 * Math.sin(s.twinkle);
    ctx.save();
    ctx.globalAlpha = s.opacity * (0.5 + 0.5 * tw);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Slow upward drift
    s.y -= s.speed;
    if (s.y < -5) {
      s.y = H + 5;
      s.x = Math.random() * W;
    }
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ─── NAV SCROLL EFFECT ───────────────────────────────────
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  lastScroll = scrollY;
  updateActiveNav();
});

// ─── ACTIVE NAV LINK ─────────────────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}

// ─── HAMBURGER / MOBILE MENU ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

// ─── TYPEWRITER ──────────────────────────────────────────
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Web Developer',
  'DSA Enthusiast',
  'Problem Solver',
  'CS Student',
  'Builder of STELLAX'
];
let phraseIdx = 0, charIdx = 0, deleting = false, pauseTime = 0;

function typeNext() {
  const phrase = phrases[phraseIdx];

  if (deleting) {
    charIdx--;
    typewriterEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      pauseTime = 400;
    }
  } else {
    charIdx++;
    typewriterEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      pauseTime = 2200;
    }
  }

  const speed = deleting ? 55 : 100;
  setTimeout(typeNext, speed + pauseTime);
  pauseTime = 0;
}
setTimeout(typeNext, 800);

// ─── REVEAL ON SCROLL ────────────────────────────────────
function revealElements() {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const vh = window.innerHeight;
    if (top < vh - 80) {
      el.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealElements);
window.addEventListener('load', () => {
  // Trigger hero elements immediately
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), parseFloat(getComputedStyle(el).getPropertyValue('--delay') || 0) * 1000);
  });
  setTimeout(revealElements, 100);
});

// ─── SKILL BARS ANIMATION ────────────────────────────────
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const top = skillsSection.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const w = bar.dataset.width;
      setTimeout(() => { bar.style.width = w + '%'; }, 200);
    });
  }
}
window.addEventListener('scroll', animateSkillBars);

// ─── COUNTER ANIMATION ───────────────────────────────────
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  const top = aboutSection.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    countersStarted = true;
    document.querySelectorAll('.fact-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 40);
    });
  }
}
window.addEventListener('scroll', startCounters);

// ─── CONTACT FORM ────────────────────────────────────────
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-btn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span>Sending…</span>';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.opacity = '1';
    btn.disabled = false;
    form.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1600);
});

// ─── SKILL CARD HOVER TILT ───────────────────────────────
document.querySelectorAll('.skill-card, .info-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    card.style.transition = 'box-shadow 0.1s, border-color 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(.4,0,.2,1)';
  });
});

// ─── SMOOTH SCROLL ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

// ─── ORBIT LABELS COUNTER-ROTATE (keep labels readable) ──
// Labels remain pointing downward regardless of orbit rotation
function setupOrbitLabels() {
  const orbit1 = document.querySelector('.orbit-1');
  const orbit2 = document.querySelector('.orbit-2');
  const orbit3 = document.querySelector('.orbit-3');
  // Counter-rotate the dots so labels stay readable (handled by CSS pseudo-elements - no changes needed)
}

// ─── PAGE LOAD ANIMATION ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});
