'use strict';

const EMAILJS_SERVICE_ID = 'service_b0penph';
const EMAILJS_TEMPLATE_ID = 'template_phi6soj';
const EMAILJS_PUBLIC_KEY = 'U3eMRXs9xU-xLhpat';

/* ─── helpers ─── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = $('#loader');
    if (l) l.classList.add('out');
  }, 900);
});

/* ─── THEME TOGGLE ─── */
(function () {
  const btn = $('#themeBtn');
  const ico = $('#themeIco');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (ico) ico.textContent = theme === 'dark' ? '🌙' : '☀️';
    try { localStorage.setItem('nc-theme', theme); } catch (e) { }
  }

  // restore saved theme
  let saved = 'dark';
  try { saved = localStorage.getItem('nc-theme') || 'dark'; } catch (e) { }
  applyTheme(saved);

  on(btn, 'click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();

/* ─── CUSTOM CURSOR ─── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const outer = $('#cOuter');
  const inner = $('#cInner');
  if (!outer || !inner) return;

  let mx = -100, my = -100, ox = -100, oy = -100;
  let raf;

  on(document, 'mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function loop() {
    ox += (mx - ox) * 0.12;
    oy += (my - oy) * 0.12;
    outer.style.transform = `translate(${ox}px,${oy}px)`;
    inner.style.transform = `translate(${mx}px,${my}px)`;
    raf = requestAnimationFrame(loop);
  })();

  // hover state on links / buttons
  $$('a, button, [role="button"], input, textarea, .pj, .sk, .cert, .exp-card').forEach(el => {
    on(el, 'mouseenter', () => { outer.classList.add('hov'); inner.classList.add('hov'); });
    on(el, 'mouseleave', () => { outer.classList.remove('hov'); inner.classList.remove('hov'); });
  });

  on(document, 'mouseleave', () => { outer.style.opacity = '0'; inner.style.opacity = '0'; });
  on(document, 'mouseenter', () => { outer.style.opacity = ''; inner.style.opacity = ''; });
})();

/* ─── NAVBAR — scroll shrink + active link ─── */
(function () {
  const nav = $('#nav');
  const links = $$('.nl');
  const sections = $$('section[id]');

  function onScroll() {
    // shrink navbar on scroll
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);

    // highlight active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.id;
    });
    links.forEach(l => {
      const href = l.getAttribute('href');
      l.classList.toggle('active', href === '#' + current);
    });
  }

  on(window, 'scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ─── VISIT COUNTER ─── */
(function () {
  const pillEl = $('#vpNum');
  const heroEl = $('#heroViewCount');

  const STORAGE_KEY = 'nc_views_v1';
  const LAST_KEY = 'nc_last_visit';

  function getLocal() {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); } catch (e) { return 0; }
  }
  function setLocal(n) {
    try { localStorage.setItem(STORAGE_KEY, n); } catch (e) { }
  }
  function isNewSession() {
    try {
      const last = parseInt(localStorage.getItem(LAST_KEY) || '0', 10);
      const now = Date.now();
      if (now - last > 24 * 60 * 60 * 1000) {
        localStorage.setItem(LAST_KEY, now);
        return true;
      }
      return false;
    } catch (e) { return true; }
  }

  function animateCount(el, target, from) {
    if (!el) return;
    from = Math.max(0, from);
    const t0 = performance.now();
    (function anim(now) {
      const p = Math.min((now - t0) / 1200, 1);
      const ease = 1 - (1 - p) * (1 - p) * (1 - p);
      el.textContent = Math.round(from + (target - from) * ease).toLocaleString();
      if (p < 1) requestAnimationFrame(anim);
      else el.textContent = target.toLocaleString();
    })(performance.now());
  }

  function buildPopup(count) {
    document.querySelectorAll('.vp-popup,.vp-popup-ovl').forEach(e => e.remove());

    const ovl = document.createElement('div');
    ovl.className = 'vp-popup-ovl';
    document.body.appendChild(ovl);

    const popup = document.createElement('div');
    popup.className = 'vp-popup';
    const display = count > 0 ? count.toLocaleString() : '—';
    popup.innerHTML = `
      <div class="vp-popup-inner">
        <span class="vp-popup-emoji">👀</span>
        <span class="vp-popup-count">${display}</span>
        <span class="vp-popup-label">Total Views</span>
        <span class="vp-popup-msg">You're visit #${display} on this portfolio.<br>Thanks for stopping by!</span>
        <div class="vp-popup-bar"><div class="vp-popup-bar-fill" id="vpBarFill"></div></div>
      </div>`;
    document.body.appendChild(popup);

    let timer;
    const open = () => {
      const fill = $('#vpBarFill');
      if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = 'barDrain 2s linear forwards'; }
      ovl.classList.add('show'); popup.classList.add('show');
      clearTimeout(timer); timer = setTimeout(close, 2000);
    };
    const close = () => { popup.classList.remove('show'); ovl.classList.remove('show'); };
    on($('.visit-pill'), 'click', open);
    on(ovl, 'click', close);
  }

  function applyCount(n) {
    animateCount(pillEl, n, Math.max(0, n - 30));
    animateCount(heroEl, n, Math.max(0, n - 30));
    buildPopup(n);
  }

  const local = getLocal();
  const isNew = isNewSession();
  const newLocal = isNew ? local + 1 : local;
  if (newLocal > 0) { setLocal(newLocal); applyCount(newLocal); }

  const WORKER_URL = 'https://nishit-views.nishitchauhan2408.workers.dev';
  fetch(WORKER_URL, { method: isNew ? 'POST' : 'GET', cache: 'no-store' })
    .then(r => r.json())
    .then(d => {
      const n = d.count || 0;
      if (n > 0) { setLocal(n); applyCount(n); }
    })
    .catch(() => { if (newLocal === 0) applyCount(1); });
})();

/* ─── MOBILE MENU ─── */
(function () {
  const ham = $('#ham');
  const mob = $('#mob');
  const ovl = $('#ovl');
  const cls = $('#mobClose');
  const links = $$('.mob-nl');
  const cta = $('#mobCta');

  const openMenu = () => {
    mob.classList.add('open'); ovl.classList.add('show');
    ham.classList.add('open'); ham.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    links.forEach((l, i) => {
      l.style.opacity = '0'; l.style.transform = 'translateX(-14px)';
      setTimeout(() => {
        l.style.transition = 'opacity .3s ease, transform .3s ease';
        l.style.opacity = '1'; l.style.transform = '';
      }, 80 + i * 45);
    });
  };
  const closeMenu = () => {
    mob.classList.remove('open'); ovl.classList.remove('show');
    ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  on(ham, 'click', () => mob.classList.contains('open') ? closeMenu() : openMenu());
  on(ovl, 'click', closeMenu);
  on(cls, 'click', closeMenu);
  links.forEach(l => on(l, 'click', closeMenu));
  on(cta, 'click', closeMenu);
  on(window, 'resize', () => { if (window.innerWidth > 900) closeMenu(); });
  on(document, 'keydown', e => { if (e.key === 'Escape' && mob.classList.contains('open')) closeMenu(); });
})();

/* ─── PHOTO UPLOAD ─── */
(function () {
  const ava = $('#mobAva');
  const fileIn = $('#mobAvaFile');
  const avaBg = $('#mobAvaBg');
  const avaImg = $('#mobAvaImg');
  const hcIni = $('#hcIni');

  if (!ava || !fileIn) return;

  function applyPhoto(src) {
    if (avaImg) { avaImg.src = src; avaImg.style.display = 'block'; }
    if (avaBg) avaBg.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ''; });
    if (hcIni) hcIni.style.display = 'none';
    const inner = $('.hc-ava-inner');
    if (inner) {
      let img = inner.querySelector('.hc-ava-img');
      if (!img) { img = document.createElement('img'); img.className = 'hc-ava-img'; img.alt = 'Nishit'; inner.appendChild(img); }
      img.src = src; img.style.display = 'block';
    }
  }

  try { const s = localStorage.getItem('nc-photo6'); if (s) applyPhoto(s); } catch (e) { }

  on(ava, 'click', () => fileIn.click());
  on(fileIn, 'change', e => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { showToast('Please select an image.', 'err'); return; }
    if (f.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB.', 'err'); return; }
    const r = new FileReader();
    r.onload = ev => {
      try { localStorage.setItem('nc-photo6', ev.target.result); } catch (e) { }
      applyPhoto(ev.target.result);
      showToast('Photo updated ✓', 'ok');
    };
    r.readAsDataURL(f);
    fileIn.value = '';
  });
})();

/* ─── SMOOTH SCROLL ─── */
$$('a[href^="#"]').forEach(a => {
  on(a, 'click', e => {
    const h = a.getAttribute('href');
    if (h === '#') return;
    const t = $(h);
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 78, behavior: 'smooth' }); }
  });
});

/* ─── TYPEWRITER ─── */
(function () {
  const el = $('#twWord');
  if (!el) return;
  const words = ['Flutter Apps', 'Mobile Apps', 'REST APIs', 'Web Solutions', 'MERN Apps', 'Clean UIs'];
  let wi = 0, ci = 0, del = false;
  (function tick() {
    const w = words[wi];
    if (!del) { el.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(tick, 1800); return; } }
    else { el.textContent = w.slice(0, --ci); if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 350); return; } }
    setTimeout(tick, del ? 48 : 95);
  })();
})();

/* ─── COUNTERS ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const to = +target.dataset.to, t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / 1400, 1);
        const e = 1 - (1 - p) * (1 - p) * (1 - p);
        target.textContent = Math.round(e * to);
        if (p < 1) requestAnimationFrame(step); else target.textContent = to;
      })(performance.now());
      obs.unobserve(target);
    });
  }, { threshold: 0.5 });
  $$('[data-to]').forEach(e => obs.observe(e));
})();

/* ─── SKILL BARS ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      target.style.transform = `scaleX(${parseFloat(target.dataset.w || 0)})`;
      target.classList.add('on');
      obs.unobserve(target);
    });
  }, { threshold: 0.3 });
  $$('.skb-fill').forEach(b => obs.observe(b));
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const i = parseInt(getComputedStyle(target).getPropertyValue('--i') || '0', 10);
      setTimeout(() => target.classList.add('on'), i * 70);
      obs.unobserve(target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
  $$('.rv, .rv-l, .rv-r, .rv-u').forEach(e => obs.observe(e));
})();

/* ─── HERO CARD 3D TILT ─── */
(function () {
  const card = $('#hcard');
  if (!card || window.matchMedia('(pointer:coarse)').matches) return;
  const MAX = 10;
  let raf;
  on(card, 'mousemove', e => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'box-shadow .3s';
      card.style.transform = `perspective(900px) rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg) scale3d(1.03,1.03,1)`;
    });
  }, { passive: true });
  on(card, 'mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .4s';
    card.style.transform = '';
  });
})();

/* ─── MAGNETIC BUTTONS ─── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  $$('.cta-primary, .hire-btn, .pb-link, .cf-sub-btn, .pj-a1').forEach(btn => {
    on(btn, 'mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px,${y}px)`;
    }, { passive: true });
    on(btn, 'mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ─── PARALLAX HERO LINES ─── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const lines = $$('.hero-line');
  if (!lines.length) return;
  let raf, lx = 0.5, ly = 0.5;
  on(document, 'mousemove', e => {
    lx = e.clientX / window.innerWidth;
    ly = e.clientY / window.innerHeight;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const cx = lx - 0.5, cy = ly - 0.5;
      lines.forEach((l, i) => {
        const s = (i + 1) * 8;
        l.style.transform = `translateY(${cy * s}px)`;
        l.style.opacity = String(0.03 + Math.abs(cx) * 0.04);
      });
      raf = null;
    });
  }, { passive: true });
})();

/* ─── BACK TO TOP ─── */
(function () {
  const btn = $('#btt');
  if (!btn) return;
  on(window, 'scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── TOAST ─── */
function showToast(msg, type = 'ok') {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 5000);
}

/* ─── SECTION TITLE FADE-IN ─── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting || target.dataset.animated) return;
      target.dataset.animated = 'y';
      target.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)';
      target.style.opacity = '0';
      target.style.transform = 'translateY(18px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.style.opacity = '1';
          target.style.transform = '';
        });
      });
      obs.unobserve(target);
    });
  }, { threshold: 0.25 });
  $$('.sec-title').forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(18px)';
    obs.observe(t);
  });
})();

/* ─── HOVER SPOTLIGHT CARDS ─── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  $$('.exp-card, .ct-form-box, .hcard, .acard, .sk').forEach(card => {
    on(card, 'mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
})();

/* ─── STAGGERED SECTION CARDS ─── */
(function () {
  const selectors = ['.sk', '.pj', '.cert', '.achip', '.ctlink', '.num', '.act'];
  selectors.forEach(sel => {
    const groups = {};
    $$(sel).forEach(el => {
      const sec = el.closest('section');
      if (!sec) return;
      if (!groups[sec.id]) groups[sec.id] = [];
      groups[sec.id].push(el);
    });
    Object.values(groups).forEach(arr => {
      arr.forEach((el, i) => el.style.setProperty('--i', i));
    });
  });
})();

/* ─── CONFETTI ENGINE ─── */
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cf-confetti';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9995;pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#4ade80', '#facc15', '#f97316', '#60a5fa', '#e879f9', '#fb7185', '#34d399', '#a78bfa', '#fbbf24', '#38bdf8'];
  const SHAPES = ['rect', 'circle', 'ribbon'];
  const count = window.innerWidth < 600 ? 90 : 160;
  let particles = [];

  for (let i = 0; i < count; i++) {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x: canvas.width * 0.5 + (Math.random() - .5) * canvas.width * .4,
      y: canvas.height * 0.55,
      vx: (Math.random() - .5) * 18,
      vy: -(Math.random() * 22 + 10),
      gravity: 0.55 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - .5) * 9,
      w: 7 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: col,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      alpha: 1,
      decay: 0.012 + Math.random() * 0.006,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: .08 + Math.random() * .06
    });
  }

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0.02);
    if (!particles.length) { canvas.remove(); return; }
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.985;
      p.rotation += p.rotSpeed; p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.8; p.alpha -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.beginPath();
        ctx.moveTo(-p.w / 2, -p.h / 2);
        ctx.bezierCurveTo(p.w * .2, -p.h, p.w * .3, p.h, p.w / 2, p.h / 2);
        ctx.bezierCurveTo(p.w * .1, p.h * .8, -p.w * .2, -p.h * .3, -p.w / 2, -p.h / 2);
        ctx.fill();
      } else { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      ctx.restore();
    });
    frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => {
    const burst = window.innerWidth < 600 ? 50 : 80;
    for (let i = 0; i < burst; i++) {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height * 0.4,
        vx: (Math.random() - .5) * 14,
        vy: -(Math.random() * 16 + 6),
        gravity: 0.45 + Math.random() * 0.25,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - .5) * 7,
        w: 6 + Math.random() * 7, h: 3 + Math.random() * 5,
        color: col,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        alpha: 1, decay: 0.01 + Math.random() * 0.007,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: .06 + Math.random() * .05
      });
    }
  }, 280);
  setTimeout(() => { cancelAnimationFrame(frame); canvas.remove(); }, 4500);
}

/* ─── CONTACT FORM ─── */
(function () {
  const form = $('#ctForm');
  const btn = $('#cfBtn');
  if (!form || !btn) return;
  const txt = $('#cfBtnTxt');
  const load = $('#cfBtnLoad');
  const box = form.closest('.ct-form-box');
  let successOvl = null;

  function buildSuccessOvl() {
    if (successOvl) return;
    successOvl = document.createElement('div');
    successOvl.className = 'cf-success-overlay';
    successOvl.innerHTML = `
      <div class="cf-success-rings">
        <div class="cf-success-ico">✓</div>
      </div>
      <div class="cf-success-title">Message Delivered! 🎉</div>
      <div class="cf-success-sub">
        <strong>Awesome, it's on its way!</strong><br>
        I'll read your message and get back<br>to you within 24 hours.
      </div>
      <button class="cf-success-dismiss" id="cfSuccessDismiss">
        <i class="fas fa-arrow-right"></i>
        <span id="cfDismissTxt">Send Another</span>
        <span class="cf-countdown" id="cfCountdown">5</span>
      </button>`;
    if (box) box.appendChild(successOvl);
    on($('#cfSuccessDismiss'), 'click', hideSuccess);
  }

  function showSuccess() {
    buildSuccessOvl();
    requestAnimationFrame(() => successOvl.classList.add('show'));
    let secs = 5;
    const cd = () => document.getElementById('cfCountdown');
    const iv = setInterval(() => {
      secs--;
      if (cd()) cd().textContent = secs;
      if (secs <= 0) { clearInterval(iv); hideSuccess(); }
    }, 1000);
  }
  function hideSuccess() {
    if (successOvl) {
      successOvl.classList.remove('show');
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('ok');
        if (txt) { txt.textContent = 'Send Message'; txt.style.display = 'inline-flex'; }
        if (load) load.style.display = 'none';
      }, 400);
    }
  }

  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { }

  function setFieldError(el, hasError) {
    el.classList.toggle('cf-field-err', hasError);
    if (hasError) {
      el.addEventListener('input', () => setFieldError(el, false), { once: true });
    }
  }

  on(form, 'submit', async e => {
    e.preventDefault();
    const nameEl = form.querySelector('[name="name"]');
    const emailEl = form.querySelector('[name="email"]');
    const subjectEl = form.querySelector('[name="subject"]');
    const messageEl = form.querySelector('[name="message"]');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const subject = subjectEl.value.trim();
    const message = messageEl.value.trim();

    let hasError = false;
    [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
      const empty = !el.value.trim();
      setFieldError(el, empty);
      if (empty) hasError = true;
    });

    const emailInvalid = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (emailInvalid) { setFieldError(emailEl, true); hasError = true; }

    if (hasError) {
      showToast('⚠️  Please fill in all fields first.', 'err');
      const first = form.querySelector('.cf-field-err');
      if (first) first.focus();
      return;
    }

    btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (load) load.style.display = 'inline-flex';

    try {
      const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name, from_email: email, subject, message, reply_to: email
      });
      if (res.status === 200) {
        btn.classList.add('ok');
        if (load) load.style.display = 'none';
        if (txt) { txt.textContent = '✓ Sent!'; txt.style.display = 'inline-flex'; }
        form.reset();
        launchConfetti();
        showToast("🎉 Message sent! I'll reply within 24 hours.", 'ok');
        setTimeout(showSuccess, 300);
      } else throw new Error();
    } catch (err) {
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=nishitchauhan2408%40gmail.com&su=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
      btn.classList.add('err');
      if (load) load.style.display = 'none';
      if (txt) { txt.textContent = '✗ Failed — Open Gmail instead'; txt.style.display = 'inline-flex'; }
      showToast('😔 Send failed — click to try Gmail directly', 'err');
      on($('#toast'), 'click', () => window.open(gmailURL, '_blank'), { once: true });
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('err');
        if (txt) { txt.textContent = 'Send Message'; txt.style.display = 'inline-flex'; }
      }, 5000);
    }
  });
})();
/* ============================================================
   script.js na BILKUL END MA paste karo
   ============================================================ */
/* ════════════════════════════════════════
   RESUME POPUP LOGIC
═══════════════════════════════════════ */
(function () {
  'use strict';
  const PDF_PATH = 'Document/Nishit Resume.pdf';
  const PDF_FILENAME = 'Nishit Resume.pdf';

  const triggerBtn = document.getElementById('resumeIconBtn');
  const popup = document.getElementById('rdp');
  const openBtn = document.getElementById('rdpOpenBtn');
  const dlBtn = document.getElementById('rdpDlBtn');
  const errorPanel = document.getElementById('rdpError');
  const errDlBtn = document.getElementById('rdpErrDl');
  const errBackBtn = document.getElementById('rdpErrBack');
  const successPanel = document.getElementById('rdpSuccess');
  const successDismis = document.getElementById('rdpSuccessDismiss');
  const toast = document.getElementById('rdpToast');
  const toastBar = document.getElementById('rdpToastBar');

  if (!triggerBtn || !popup) return;
  let isOpen = false, errVisible = false, toastTimer = null;

  function hasPdfViewer() {
    return /chrome|firefox|edg\/|safari/.test(navigator.userAgent.toLowerCase());
  }

  function openPopup() {
    errorPanel.classList.remove('show'); successPanel.classList.remove('show'); errVisible = false;
    popup.querySelectorAll('.rdp-action,.rdp-foot').forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
    triggerBtn.classList.add('active'); popup.classList.add('open'); isOpen = true;
  }

  function closePopup() {
    triggerBtn.classList.remove('active'); popup.classList.remove('open'); isOpen = false;
    setTimeout(() => { errorPanel.classList.remove('show'); successPanel.classList.remove('show'); errVisible = false; }, 380);
  }

  function triggerDownload() {
    const a = document.createElement('a'); a.href = PDF_PATH; a.download = PDF_FILENAME;
    a.style.display = 'none'; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 300);
  }

  function launchInnerSparkles() {
    const c = document.getElementById('rdpFireCanvas'); if (!c) return;
    const ctx = c.getContext('2d'); c.width = c.offsetWidth || 310; c.height = c.offsetHeight || 260;
    const W = c.width, H = c.height;
    const COLS = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#eccc68', '#a29bfe', '#fd79a8', '#fff'];
    let pts = [], raf = null;
    for (let i = 0; i < 60; i++) pts.push({ x: Math.random() * W, y: H * (.3 + Math.random() * .5), vx: (Math.random() - .5) * 4, vy: -(Math.random() * 5 + 2), r: 2 + Math.random() * 3, life: 1, dec: .013 + Math.random() * .012, col: COLS[Math.floor(Math.random() * COLS.length)], shape: Math.random() < .3 ? 'sq' : 'dot' });
    function draw() {
      ctx.clearRect(0, 0, W, H); pts = pts.filter(p => p.life > 0);
      if (!pts.length) { cancelAnimationFrame(raf); return; }
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .09; p.vx *= .98; p.life -= p.dec;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.col;
        if (p.shape === 'sq') { ctx.translate(p.x, p.y); ctx.rotate(p.life * 4); ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
  }

  function showSuccess() {
    successPanel.classList.add('show');
    launchInnerSparkles();
    if (window.rdpLaunchFireworks) window.rdpLaunchFireworks();
    setTimeout(() => { successPanel.classList.remove('show'); }, 5500);
  }

  function showToast() {
    toastBar.style.animation = 'none'; void toastBar.offsetWidth;
    toastBar.style.animation = 'rdpBarDrain 3.5s linear forwards';
    toast.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3700);
  }

  triggerBtn.addEventListener('click', e => { e.stopPropagation(); isOpen ? closePopup() : openPopup(); });
  openBtn.addEventListener('click', () => {
    if (hasPdfViewer()) { window.open(PDF_PATH, '_blank', 'noopener,noreferrer'); closePopup(); }
    else { errorPanel.classList.add('show'); errVisible = true; }
  });
  dlBtn.addEventListener('click', () => { triggerDownload(); showSuccess(); setTimeout(showToast, 500); });
  errDlBtn.addEventListener('click', () => { triggerDownload(); errorPanel.classList.remove('show'); showSuccess(); setTimeout(showToast, 500); });
  errBackBtn.addEventListener('click', () => { errorPanel.classList.remove('show'); errVisible = false; });
  successDismis && successDismis.addEventListener('click', () => { successPanel.classList.remove('show'); setTimeout(closePopup, 200); });
  document.addEventListener('click', e => { if (isOpen && !triggerBtn.contains(e.target) && !popup.contains(e.target)) closePopup(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !isOpen) return;
    if (errVisible) { errorPanel.classList.remove('show'); errVisible = false; } else closePopup();
  });
})();