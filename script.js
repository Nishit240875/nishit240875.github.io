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

/* ─── VISIT COUNTER + POPUP ─── */
(function () {
  const KEY = 'nc_v6_visits';
  const el = $('#vpNum');
  if (!el) return;
  let v = parseInt(localStorage.getItem(KEY) || '0', 10) + 1;
  try { localStorage.setItem(KEY, v); } catch (e) { }
  const from = Math.max(0, v - Math.min(v, 30));
  const t0 = performance.now();
  (function anim(now) {
    const p = Math.min((now - t0) / 1200, 1);
    const e = 1 - (1 - p) * (1 - p) * (1 - p);
    el.textContent = Math.round(from + (v - from) * e).toLocaleString();
    if (p < 1) requestAnimationFrame(anim);
    else el.textContent = v.toLocaleString();
  })(performance.now());

  // Build popup elements once
  const ovl = document.createElement('div');
  ovl.className = 'vp-popup-ovl';
  document.body.appendChild(ovl);

  const popup = document.createElement('div');
  popup.className = 'vp-popup';
  popup.innerHTML = `
    <div class="vp-popup-inner">
      <span class="vp-popup-emoji">👀</span>
      <span class="vp-popup-count" id="vpPopCount">${v.toLocaleString()}</span>
      <span class="vp-popup-label">Total Views</span>
      <span class="vp-popup-msg">You're visit #${v.toLocaleString()} on this portfolio.<br>Thanks for stopping by!</span>
      <div class="vp-popup-bar"><div class="vp-popup-bar-fill" id="vpBarFill"></div></div>
    </div>`;
  document.body.appendChild(popup);

  let closeTimer;
  const openPopup = () => {
    // refresh count in case anim finished
    const countEl = $('#vpPopCount');
    if (countEl) countEl.textContent = v.toLocaleString();
    // re-trigger bar animation
    const fill = $('#vpBarFill');
    if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = 'barDrain 2s linear forwards'; }

    ovl.classList.add('show');
    popup.classList.add('show');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closePopup, 2000);
  };
  const closePopup = () => {
    popup.classList.remove('show');
    ovl.classList.remove('show');
  };

  const pill = $('.visit-pill');
  on(pill, 'click', openPopup);
  on(ovl, 'click', closePopup);
})();

/* ─── CUSTOM CURSOR — GPU-accelerated via transform ─── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const outer = $('#cOuter'), inner = $('#cInner');
  if (!outer || !inner) return;

  let mx = -300, my = -300, rx = -300, ry = -300;
  // Use transform instead of left/top for GPU compositing
  outer.style.left = '0px'; outer.style.top = '0px';
  inner.style.left = '0px'; inner.style.top = '0px';

  on(document, 'mousemove', e => {
    mx = e.clientX; my = e.clientY;
    inner.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    outer.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  // Remove left/top from elements, use transform instead
  const outerEl = outer.querySelector('.c-outer-el');
  const innerEl = inner.querySelector('.c-inner-el');
  if (outerEl) { outerEl.style.left = ''; outerEl.style.top = ''; }
  if (innerEl) { innerEl.style.left = ''; innerEl.style.top = ''; }

  $$('a, button, .hc-tag, .sk-t, .tag, .act, .soc-btn, .ctlink, .cert, .achip, .num, .tl-c').forEach(el => {
    on(el, 'mouseenter', () => outer.classList.add('hov'));
    on(el, 'mouseleave', () => outer.classList.remove('hov'));
  });
  $$('.cta-primary, .hire-btn, .mob-cta, .pj-a1').forEach(el => {
    on(el, 'mouseenter', () => { outer.classList.remove('hov'); outer.classList.add('link'); });
    on(el, 'mouseleave', () => outer.classList.remove('link'));
  });
})();

/* ─── THEME ─── */
(function () {
  const html = document.documentElement;
  const btn = $('#themeBtn');
  const ico = $('#themeIco');
  const saved = localStorage.getItem('nc-theme6');
  if (saved) html.setAttribute('data-theme', saved);
  const sync = () => { const d = html.dataset.theme === 'dark'; if (ico) ico.textContent = d ? '🌙' : '☀️'; };
  sync();
  on(btn, 'click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('nc-theme6', next);
    sync();
  });
})();

/* ─── NAVBAR — throttled scroll ─── */
(function () {
  const nav = $('#nav');
  const nls = $$('.nl');
  const mls = $$('.mob-nl');
  const secs = $$('section[id]');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      nav.classList.toggle('scrolled', sy > 50);
      let cur = '';
      secs.forEach(s => { if (sy >= s.offsetTop - 140) cur = s.id; });
      nls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
      mls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
      ticking = false;
    });
  };
  on(window, 'scroll', onScroll, { passive: true });
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

/* ─── HERO CARD 3D TILT — GPU optimized ─── */
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

/* ─── PARALLAX HERO LINES — throttled, reduced-motion aware ─── */
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

/* ─── SECTION TITLE FADE-IN (replaced heavy letter-by-letter with smooth fade-up) ─── */
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
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.8;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.beginPath();
        ctx.moveTo(-p.w / 2, -p.h / 2);
        ctx.bezierCurveTo(p.w * .2, -p.h, p.w * .3, p.h, p.w / 2, p.h / 2);
        ctx.bezierCurveTo(p.w * .1, p.h * .8, -p.w * .2, -p.h * .3, -p.w / 2, -p.h / 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    frame = requestAnimationFrame(draw);
  }
  draw();

  /* Burst a second wave after 300ms for layered effect */
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
        w: 6 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        color: col,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        alpha: 1,
        decay: 0.01 + Math.random() * 0.007,
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

  /* Build success overlay dynamically */
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

    /* Countdown 5 → 0 then auto-dismiss */
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
      /* Reset button after overlay fades */
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('ok');
        if (txt) { txt.textContent = 'Send Message'; txt.style.display = 'inline-flex'; }
        if (load) load.style.display = 'none';
      }, 400);
    }
  }

  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { }

  /* Mark a field invalid with red border + shake, clear on input */
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

    /* Mark all empty fields red */
    let hasError = false;
    [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
      const empty = !el.value.trim();
      setFieldError(el, empty);
      if (empty) hasError = true;
    });

    /* Also mark email invalid if format is wrong */
    const emailInvalid = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (emailInvalid) { setFieldError(emailEl, true); hasError = true; }

    if (hasError) {
      showToast('⚠️  Please fill in all fields first.', 'err');
      /* Focus the first errored field */
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
        /* ✅ SUCCESS */
        btn.classList.add('ok');
        if (load) load.style.display = 'none';
        if (txt) { txt.textContent = '✓ Sent!'; txt.style.display = 'inline-flex'; }
        form.reset();

        /* 🎉 Fire confetti */
        launchConfetti();

        /* Show rich toast */
        showToast("🎉 Message sent! I'll reply within 24 hours.", 'ok');

        /* Show in-form success overlay after short delay */
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