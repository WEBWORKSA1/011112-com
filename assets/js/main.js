/* 011112.com — core site script */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var sess = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  window.$011 = { store: store, toast: toast };

  /* Theme */
  var saved = store.get('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', t); store.set('theme', t);
    });
  });

  /* Mobile menu */
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });

  /* Year */
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* Reveal on scroll (content always visible without JS; failsafe reveal after 2.5s) */
  document.documentElement.classList.add('js');
  setTimeout(function () { $$('.reveal').forEach(function (e) { e.classList.add('in'); }); }, 2500);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.reveal').forEach(function (e) { io.observe(e); });
  } else $$('.reveal').forEach(function (e) { e.classList.add('in'); });

  /* Toast */
  function toast(msg) {
    var t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* Back to top */
  var top = $('.to-top');
  if (top) {
    window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 900); }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* Cookie notice (Google's certified CMP from AdSense Privacy & messaging handles EEA/UK consent) */
  var ck = $('.cookie');
  if (ck && !store.get('cookie-ok')) ck.classList.add('show');
  $$('[data-cookie]').forEach(function (b) {
    b.addEventListener('click', function () { store.set('cookie-ok', b.getAttribute('data-cookie')); ck.classList.remove('show'); });
  });

  /* Manual AdSense units (only when slot IDs are configured) */
  var slots = C.AD_SLOTS || {};
  $$('.ad-zone[data-slot]').forEach(function (z) {
    var id = slots[z.getAttribute('data-slot')];
    if (!id) return;
    z.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' +
      C.ADSENSE_CLIENT + '" data-ad-slot="' + id + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  /* Partner links (kept out of visible text) */
  $$('[data-partner]').forEach(function (a) { a.href = C.PARTNER_URL || '#'; a.target = '_blank'; a.rel = 'noopener'; });

  /* YouTube lite facades */
  $$('.video[data-id]').forEach(function (v) {
    var id = v.getAttribute('data-id');
    v.innerHTML = '<img loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="' + (v.getAttribute('data-title') || 'Video') +
      '"><span class="play"><i>▶</i></span>';
    v.setAttribute('role', 'button'); v.setAttribute('tabindex', '0');
    var load = function () {
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' +
        (v.getAttribute('data-title') || 'Video') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    };
    v.addEventListener('click', load);
    v.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } });
  });

  /* Form relay — endpoint is assembled at runtime and never rendered */
  function endpoint() {
    var k = (C.FORM_KEY || '').split('').reverse().join('');
    try { return 'https://formsubmit.co/ajax/' + atob(k); } catch (e) { return ''; }
  }
  $$('form[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = $('.form-msg', f) || (function () { var d = document.createElement('div'); d.className = 'form-msg'; f.appendChild(d); return d; })();
      msg.className = 'form-msg';
      if (f.querySelector('[name="_honey"]') && f.querySelector('[name="_honey"]').value) return;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var data = {};
      new FormData(f).forEach(function (v, k) {
        if (k === '_honey') return;
        data[k] = data[k] ? data[k] + ', ' + v : v;
      });
      data._subject = '[011112.com] ' + (f.getAttribute('data-form') || 'form') + ' — ' + (data.name || data.email || 'new submission');
      data._template = 'table'; data._captcha = 'false';
      data.form_type = f.getAttribute('data-form'); data.page = location.pathname; data.submitted = new Date().toISOString();
      if (data.email) data._replyto = data.email;
      var btn = f.querySelector('[type=submit]'); var old = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      fetch(endpoint(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
        .then(function () {
          msg.className = 'form-msg ok';
          msg.innerHTML = f.getAttribute('data-success') || '✅ Received! We\'ll get back to you within 1–2 business days.';
          f.reset(); resetSteps(f);
          if (window.gtag) window.gtag('event', 'generate_lead', { form: data.form_type });
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'Something went wrong sending your message. Please check your connection and try again in a moment.';
        })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = old; } });
    });
  });

  /* Multi-step forms */
  function showStep(f, n) {
    var steps = $$('.fstep', f); if (!steps.length) return;
    steps.forEach(function (s, i) { s.classList.toggle('on', i === n); });
    $$('.steps-bar span', f).forEach(function (s, i) { s.classList.toggle('on', i <= n); });
    f.setAttribute('data-step', n);
  }
  function resetSteps(f) { if ($('.fstep', f)) showStep(f, 0); }
  $$('form[data-steps]').forEach(function (f) {
    showStep(f, 0);
    $$('[data-next]', f).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = +f.getAttribute('data-step'); var cur = $$('.fstep', f)[n];
        var bad = $$('input,select,textarea', cur).filter(function (i) { return !i.checkValidity(); });
        if (bad.length) { bad[0].reportValidity(); return; }
        showStep(f, n + 1);
      });
    });
    $$('[data-prev]', f).forEach(function (b) {
      b.addEventListener('click', function () { showStep(f, +f.getAttribute('data-step') - 1); });
    });
  });

  /* Prefill selects from query (?tier=builder, ?interest=...) */
  var qs = new URLSearchParams(location.search);
  qs.forEach(function (v, k) { var el = document.querySelector('form [name="' + k + '"]'); if (el && el.tagName === 'SELECT') el.value = v; });

  /* Donation buttons */
  $$('[data-tier]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var t = b.getAttribute('data-tier'); var link = (C.PAY_LINKS || {})[t];
      if (link) { b.href = link; b.target = '_blank'; b.rel = 'noopener'; return; }
      e.preventDefault();
      var sel = document.querySelector('#pledge [name="tier"]'); if (sel) sel.value = t;
      var p = document.getElementById('pledge'); if (p) p.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* Exit-intent lead magnet (desktop, once per session) */
  var modal = $('#leadModal');
  function openModal() { if (!modal || sess.get('lm')) return; sess.set('lm', '1'); modal.classList.add('show'); }
  if (modal) {
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8 && window.innerWidth > 900) openModal(); });
    setTimeout(function () { if (window.scrollY > 1600) openModal(); }, 45000);
    $$('.x,[data-close]', modal).forEach(function (x) { x.addEventListener('click', function () { modal.classList.remove('show'); }); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('show'); });
  }

  /* Copy buttons */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy') || location.href;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('Copied!'); });
    });
  });

  /* Share */
  $$('[data-share]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (navigator.share) navigator.share({ title: document.title, url: location.href }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast('Link copied'); });
    });
  });

  /* Binary rain hero */
  var cv = $('#binary');
  if (cv && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = cv.getContext('2d'), cols, drops, fs = 16, seq = '011112';
    var size = function () { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; cols = Math.floor(cv.width / fs); drops = []; for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50; };
    size(); window.addEventListener('resize', size);
    var tick = function () {
      ctx.fillStyle = 'rgba(10,12,22,0.12)'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = fs + 'px monospace';
      for (var i = 0; i < cols; i++) {
        var ch = seq[(((i + Math.floor(drops[i])) % 6) + 6) % 6];
        ctx.fillStyle = ch === '2' ? '#8b6cff' : ch === '0' ? '#38e1ff' : '#c8ff3d';
        ctx.fillText(ch, i * fs, drops[i] * fs);
        if (drops[i] * fs > cv.height && Math.random() > .975) drops[i] = 0;
        drops[i] += .5;
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* Generic countdowns: <div class="countdown" data-to="ISO"> */
  $$('.countdown[data-to]').forEach(function (c) {
    var to = new Date(c.getAttribute('data-to')).getTime();
    var draw = function () {
      var d = Math.max(0, to - Date.now()), s = Math.floor(d / 1000);
      c.innerHTML = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor(s / 3600) % 24], ['Min', Math.floor(s / 60) % 60], ['Sec', s % 60]]
        .map(function (p) { return '<div><b>' + p[1] + '</b><small>' + p[0] + '</small></div>'; }).join('');
    };
    draw(); setInterval(draw, 1000);
  });

  /* Next contest deadline: last day of current month 23:59 UTC */
  $$('[data-month-end]').forEach(function (c) {
    var n = new Date(); var end = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0, 23, 59, 0));
    c.setAttribute('data-to', end.toISOString());
    var lbl = document.querySelector('[data-month-label]');
    if (lbl) lbl.textContent = end.toLocaleString('en', { month: 'long', year: 'numeric' });
    var to = end.getTime();
    var draw = function () {
      var d = Math.max(0, to - Date.now()), s = Math.floor(d / 1000);
      c.innerHTML = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor(s / 3600) % 24], ['Min', Math.floor(s / 60) % 60], ['Sec', s % 60]]
        .map(function (p) { return '<div><b>' + p[1] + '</b><small>' + p[0] + '</small></div>'; }).join('');
    };
    draw(); setInterval(draw, 1000);
  });

  /* Daily tip (refreshed by GitHub Action into data/daily.json) */
  var tipEl = $('[data-daily-tip]');
  if (tipEl) fetch('/data/daily.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    if (d && d.tip) { tipEl.innerHTML = '<b>' + d.date + ':</b> ' + d.tip; }
  }).catch(function () {});
})();
