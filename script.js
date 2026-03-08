'use strict';

/* ══════════════════════════════════════════════════════════════════
   ✉  HOW TO ACTIVATE THE CONTACT FORM (5 minutes, completely FREE)
   ──────────────────────────────────────────────────────────────────
   This form uses EmailJS — sends directly to nishitchauhan2408@gmail.com
   with ZERO backend / ZERO server needed.

   STEP 1 — Create free account
     → https://www.emailjs.com  (free plan: 200 emails/month)

   STEP 2 — Add Gmail service
     Dashboard → Email Services → Add New Service
     → Choose Gmail → Connect your nishitchauhan2408@gmail.com
     → Copy the Service ID  (looks like: service_xxxxxxx)
     → Paste it as EMAILJS_SERVICE_ID below

   STEP 3 — Create email template
     Dashboard → Email Templates → Create New Template
     Set template exactly like this:
     ─────────────────────────────────────────────
     Subject:  [Portfolio] {{subject}}
     Body:
       New message from your portfolio website!

       Name:    {{from_name}}
       Email:   {{from_email}}
       Subject: {{subject}}

       Message:
       {{message}}
     ─────────────────────────────────────────────
     Set "To Email" → nishitchauhan2408@gmail.com
     Save → Copy the Template ID  (looks like: template_xxxxxxx)
     → Paste it as EMAILJS_TEMPLATE_ID below

   STEP 4 — Get your Public Key
     Dashboard → Account → General → Public Key
     (looks like: xxxxxxxxxxxxxxxxxxxxxx)
     → Paste it as EMAILJS_PUBLIC_KEY below

   STEP 5 — Done! Test the form.
══════════════════════════════════════════════════════════════════ */

const EMAILJS_SERVICE_ID  = 'service_b0penph';      // ← Your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = 'template_phi6soj';     // ← Your EmailJS Template ID
const EMAILJS_PUBLIC_KEY  = 'U3eMRXs9xU-xLhpat';   // ← Your EmailJS Public Key

/* ── THEME ── */
(function () {
  const html    = document.documentElement;
  const navBtn  = document.getElementById('themeBtn');
  const menuBtn = document.getElementById('mmThemeBtn');
  const saved   = localStorage.getItem('nc-theme');
  if (saved) html.setAttribute('data-theme', saved);
  function toggle() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('nc-theme', next);
  }
  if (navBtn)  navBtn.addEventListener('click', toggle);
  if (menuBtn) menuBtn.addEventListener('click', toggle);
})();

/* ── NAVBAR STUCK + ACTIVE LINK ── */
(function () {
  const nav      = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nl');
  const mobLinks = document.querySelectorAll('.mm-link');
  const secs     = document.querySelectorAll('section[id]');
  const onScroll = () => {
    nav.classList.toggle('stuck', window.scrollY > 40);
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
    navLinks.forEach(i => i.classList.toggle('active', i.getAttribute('href') === '#' + cur));
    mobLinks.forEach(i => i.classList.toggle('active',  i.getAttribute('href') === '#' + cur));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── MOBILE MENU ── */
(function () {
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobMenu');
  const ovl    = document.getElementById('mobOverlay');
  const cls    = document.getElementById('mobClose');
  const links  = document.querySelectorAll('.mm-link');
  const ctaBtn = document.getElementById('mmCtaBtn');

  const open = () => {
    menu.classList.add('open'); ovl.classList.add('show');
    burger.classList.add('open'); burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    links.forEach((l, i) => {
      l.style.opacity = '0'; l.style.transform = 'translateX(-16px)';
      setTimeout(() => {
        l.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        l.style.opacity = '1'; l.style.transform = 'translateX(0)';
      }, 100 + i * 50);
    });
  };
  const close = () => {
    menu.classList.remove('open'); ovl.classList.remove('show');
    burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  if (burger) burger.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  if (ovl)    ovl.addEventListener('click', close);
  if (cls)    cls.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
  if (ctaBtn) ctaBtn.addEventListener('click', close);
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
})();

/* ── PROFILE PHOTO UPLOAD ── */
(function () {
  const wrap = document.getElementById('mmAvatarWrap');
  const input = document.getElementById('mmAvatarInput');
  const img = document.getElementById('mmAvatarImg');
  const initials = document.getElementById('mmAvatarInitials');
  if (!wrap || !input || !img || !initials) return;
  const saved = localStorage.getItem('nc-profile-photo');
  if (saved) { img.src = saved; img.style.display = 'block'; initials.style.opacity = '0'; }
  wrap.addEventListener('click', () => input.click());
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file.', 'err'); return; }
    if (file.size > 5242880) { showToast('Image must be under 5MB.', 'err'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target.result; img.style.display = 'block'; initials.style.opacity = '0';
      try { localStorage.setItem('nc-profile-photo', ev.target.result); } catch (e) {}
      showToast('Profile photo updated ✓', 'ok');
    };
    reader.readAsDataURL(file);
    input.value = '';
  });
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const h = this.getAttribute('href');
    if (h === '#') return;
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' }); }
  });
});

/* ── TYPEWRITER ── */
(function () {
  const el = document.getElementById('twWord');
  if (!el) return;
  const words = ['Flutter Apps', 'Mobile Apps', 'REST APIs', 'Web Apps', 'Full-Stack Apps'];
  let wi = 0, ci = 0, del = false, spd = 120;
  function tick() {
    const w = words[wi];
    if (!del) { el.textContent = w.slice(0, ++ci); spd = 120; if (ci === w.length) { del = true; spd = 2000; } }
    else { el.textContent = w.slice(0, --ci); spd = 55; if (ci === 0) { del = false; wi = (wi + 1) % words.length; spd = 350; } }
    setTimeout(tick, spd);
  }
  tick();
})();

/* ── COUNTERS ── */
(function () {
  const els = document.querySelectorAll('[data-to]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.to, start = performance.now();
      const step = now => { const p = Math.min((now - start) / 1400, 1); el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target); if (p < 1) requestAnimationFrame(step); else el.textContent = target; };
      requestAnimationFrame(step); obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(e => obs.observe(e));
})();

/* ── REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-u, .reveal-l, .reveal-r');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--i') || '0') * 80;
      setTimeout(() => entry.target.classList.add('shown'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  els.forEach(e => obs.observe(e));
})();

/* ── BACK TO TOP ── */
(function () {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 420), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── TOAST ── */
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 5000);
}

/* ══════════════════════════════════════════════════════════════════
   ✉  CONTACT FORM — EmailJS
   Sends directly to nishitchauhan2408@gmail.com
══════════════════════════════════════════════════════════════════ */
(function () {
  const form   = document.getElementById('ctForm');
  const btn    = document.getElementById('cfSubmit');
  if (!form || !btn) return;

  const textEl = btn.querySelector('.cfs-text');
  const iconEl = btn.querySelector('.cfs-icon');
  const loadEl = btn.querySelector('.cfs-load');

  /* Init EmailJS */
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { console.warn('EmailJS init failed:', e); }

  function setLoading() {
    btn.disabled = true;
    textEl.style.display = 'none';
    iconEl.style.display = 'none';
    loadEl.style.display = 'inline-flex';
  }
  function setSuccess() {
    btn.classList.add('ok');
    loadEl.style.display  = 'none';
    textEl.textContent    = '✓ Message Sent!';
    textEl.style.display  = 'inline-flex';
    iconEl.style.display  = 'none';
  }
  function setError(label) {
    btn.classList.add('err');
    loadEl.style.display  = 'none';
    textEl.textContent    = label || '✗ Failed — Try Again';
    textEl.style.display  = 'inline-flex';
  }
  function resetBtn() {
    btn.disabled = false;
    btn.classList.remove('ok', 'err');
    textEl.textContent   = 'Send Message';
    textEl.style.display = 'inline-flex';
    iconEl.style.display = 'inline-flex';
    loadEl.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    /* ── Validate ── */
    if (!name || !email || !subject || !message) {
      showToast('⚠ Please fill in all fields.', 'err'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠ Please enter a valid email address.', 'err'); return;
    }

    setLoading();

    /* ── Template parameters sent to EmailJS ── */
    const templateParams = {
      from_name:  name,
      from_email: email,
      subject:    subject,
      message:    message,
      reply_to:   email,
      to_email:   'nishitchauhan2408@gmail.com',
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSuccess();
        showToast("✅ Message sent! I'll get back to you soon.", 'ok');
        form.reset();
        setTimeout(resetBtn, 3500);
      } else {
        throw new Error('EmailJS status: ' + response.status);
      }

    } catch (err) {
      console.error('EmailJS Error:', err);

      /* ── Smart fallback: open pre-filled Gmail compose ── */
      const gmailURL = 'https://mail.google.com/mail/?view=cm&fs=1' +
        '&to=nishitchauhan2408%40gmail.com' +
        '&su=' + encodeURIComponent('[Portfolio] ' + subject) +
        '&body=' + encodeURIComponent(
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n\n' +
          message
        );

      /* Also build a regular mailto fallback */
      const mailtoURL = 'mailto:nishitchauhan2408@gmail.com' +
        '?subject=' + encodeURIComponent('[Portfolio] ' + subject) +
        '&body='    + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

      setError('✗ Send Failed');
      showToast('Send failed — tap here to email directly', 'err');

      /* Make toast clickable → opens Gmail */
      const toast = document.getElementById('toast');
      if (toast) {
        toast.style.cursor = 'pointer';
        const once = () => {
          /* Try Gmail web first, fallback to mailto */
          const win = window.open(gmailURL, '_blank');
          if (!win) window.location.href = mailtoURL;
          toast.style.cursor = '';
          toast.removeEventListener('click', once);
        };
        toast.addEventListener('click', once);
      }
      setTimeout(resetBtn, 4000);
    }
  });
})();