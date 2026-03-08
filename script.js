'use strict';

/* ── THEME (navbar + in-menu toggle) ── */
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
    mobLinks.forEach(i => i.classList.toggle('active', i.getAttribute('href') === '#' + cur));
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
    menu.classList.add('open');
    ovl.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // stagger link animation
    links.forEach((l, i) => {
      l.style.opacity = '0';
      l.style.transform = 'translateX(-16px)';
      setTimeout(() => {
        l.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        l.style.opacity = '1';
        l.style.transform = 'translateX(0)';
      }, 100 + i * 50);
    });
  };

  const close = () => {
    menu.classList.remove('open');
    ovl.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  ovl.addEventListener('click', close);
  cls.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));

  // Close menu when CTA (Hire Me) is clicked and scroll to contact
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      close();
    });
  }

  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
})();

/* ── PROFILE PHOTO UPLOAD ── */
(function () {
  const wrap     = document.getElementById('mmAvatarWrap');
  const input    = document.getElementById('mmAvatarInput');
  const img      = document.getElementById('mmAvatarImg');
  const initials = document.getElementById('mmAvatarInitials');

  if (!wrap || !input || !img || !initials) return;

  // Load saved photo from localStorage
  const savedPhoto = localStorage.getItem('nc-profile-photo');
  if (savedPhoto) {
    img.src = savedPhoto;
    img.style.display = 'block';
    initials.style.opacity = '0';
  }

  // Click avatar to trigger file input
  wrap.addEventListener('click', () => input.click());

  // Handle file selection
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'err');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'err');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      img.src = dataUrl;
      img.style.display = 'block';
      initials.style.opacity = '0';

      // Persist to localStorage for future sessions
      try {
        localStorage.setItem('nc-profile-photo', dataUrl);
      } catch (err) {
        // Storage full — still show in session
        console.warn('Could not save photo to localStorage:', err);
      }
      showToast('Profile photo updated! ✓', 'ok');
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    input.value = '';
  });
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const h = this.getAttribute('href');
    if (h === '#') return;
    const t = document.querySelector(h);
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
    }
  });
});

/* ── TYPEWRITER ── */
(function () {
  const el = document.getElementById('twWord');
  if (!el) return;
  const words = ['Flutter Apps', 'Mobile Apps', 'REST APIs', 'Web Apps', 'Full-Stack Apps'];
  let wi = 0, ci = 0, deleting = false, speed = 120;

  function tick() {
    const w = words[wi];
    if (!deleting) {
      el.textContent = w.slice(0, ++ci);
      speed = 120;
      if (ci === w.length) { deleting = true; speed = 2000; }
    } else {
      el.textContent = w.slice(0, --ci);
      speed = 55;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 350; }
    }
    setTimeout(tick, speed);
  }
  tick();
})();

/* ── COUNTERS ── */
(function () {
  const els = document.querySelectorAll('[data-to]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.to;
      const duration = 1400;
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
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
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('ctForm');
  const btn  = document.getElementById('cfSubmit');
  if (!form || !btn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !subject || !message) { showToast('Please fill in all fields.', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address.', 'err'); return; }

    btn.disabled = true;
    btn.querySelector('.cfs-text').style.display = 'none';
    btn.querySelector('.cfs-icon').style.display = 'none';
    btn.querySelector('.cfs-load').style.display = 'inline-flex';

    try {
      await emailjs.send('service_c7r06qu', 'template_phi6soj', { from_name: name, from_email: email, subject, message });
      btn.classList.add('ok');
      btn.querySelector('.cfs-text').textContent = '✓ Sent!';
      btn.querySelector('.cfs-text').style.display = 'inline-flex';
      btn.querySelector('.cfs-load').style.display = 'none';
      showToast("Message sent! I'll get back to you soon 🎉", 'ok');
      form.reset();
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('ok');
        btn.querySelector('.cfs-text').textContent = 'Send Message';
        btn.querySelector('.cfs-icon').style.display = 'inline-flex';
      }, 3200);
    } catch (err) {
      btn.classList.add('err');
      btn.querySelector('.cfs-text').textContent = 'Failed — Try Again';
      btn.querySelector('.cfs-text').style.display = 'inline-flex';
      btn.querySelector('.cfs-load').style.display = 'none';
      showToast('Could not send. Email directly: nishitchauhan2408@gmail.com', 'err');
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('err');
        btn.querySelector('.cfs-text').textContent = 'Send Message';
        btn.querySelector('.cfs-icon').style.display = 'inline-flex';
      }, 3200);
    }
  });
})();