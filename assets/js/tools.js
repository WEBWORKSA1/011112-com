/* 011112.com — free founder tools (all client-side, no data leaves the browser unless you submit a form) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var num = function (id) { var e = document.getElementById(id); return e ? parseFloat(e.value) || 0 : 0; };
  var money = function (n, cur) { cur = cur || ($('#currency') ? $('#currency').value : 'USD');
    try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); } catch (e) { return '$' + Math.round(n).toLocaleString(); } };
  var fmt = function (n, d) { return (isFinite(n) ? n : 0).toLocaleString('en', { maximumFractionDigits: d == null ? 0 : d }); };
  var store = (window.$011 || {}).store || { get: function () { return null; }, set: function () {} };

  function bindAll(root, fn) { $$('input,select', root).forEach(function (i) { i.addEventListener('input', fn); i.addEventListener('change', fn); }); fn(); }

  /* Line chart on canvas */
  function chart(cv, series, opts) {
    if (!cv) return; opts = opts || {};
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr; var c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, w, h);
    var all = []; series.forEach(function (s) { all = all.concat(s.data); });
    var max = Math.max.apply(null, all.concat([1])), min = Math.min.apply(null, all.concat([0]));
    var pad = 34, n = series[0].data.length;
    var X = function (i) { return pad + (w - pad - 12) * (n > 1 ? i / (n - 1) : 0); };
    var Y = function (v) { return h - 22 - (h - 40) * ((v - min) / ((max - min) || 1)); };
    var css = getComputedStyle(document.documentElement);
    c.strokeStyle = css.getPropertyValue('--line'); c.lineWidth = 1;
    for (var g = 0; g <= 4; g++) { var gy = 18 + (h - 40) * g / 4; c.beginPath(); c.moveTo(pad, gy); c.lineTo(w - 12, gy); c.stroke(); }
    if (min < 0) { c.strokeStyle = '#ff6b6b'; c.beginPath(); c.moveTo(pad, Y(0)); c.lineTo(w - 12, Y(0)); c.stroke(); }
    series.forEach(function (s) {
      c.strokeStyle = s.color; c.lineWidth = 2.5; c.beginPath();
      s.data.forEach(function (v, i) { if (i) c.lineTo(X(i), Y(v)); else c.moveTo(X(i), Y(v)); }); c.stroke();
    });
    c.fillStyle = css.getPropertyValue('--muted'); c.font = '11px sans-serif';
    c.fillText(opts.yLabel ? opts.yLabel + ' ' + fmt(max) : fmt(max), 4, 14);
    c.fillText(opts.xLabel || ('Month ' + (n - 1)), w - 80, h - 6);
  }

  var tool = document.body.getAttribute('data-tool');

  /* 1. Idea Score */
  if (tool === 'idea') {
    var qs = $$('#idea input[type=range]');
    var calc = function () {
      var total = 0;
      qs.forEach(function (q) { var o = q.parentNode.querySelector('output'); if (o) o.textContent = q.value; total += +q.value; });
      var pct = Math.round(total / (qs.length * 10) * 100);
      $('#ideaScore').textContent = pct + '/100'; $('#ideaMeter').style.width = pct + '%';
      var v = pct >= 75 ? ['🚀 Strong signal', 'Build a landing page and pre-sell this week. Your fundamentals are solid — speed is now your edge.']
        : pct >= 55 ? ['🧪 Promising, needs proof', 'Run 10 customer interviews and a smoke-test page before writing code. Fix your weakest two areas first.']
        : pct >= 35 ? ['⚠️ Risky', 'The idea has gaps that usually kill launches. Reframe the customer or the problem, then re-score.']
        : ['🛑 Rethink', 'Keep the insight, change the idea. Talk to users and look for a sharper, more painful problem.'];
      $('#ideaVerdict').textContent = v[0]; $('#ideaAdvice').textContent = v[1];
      var weak = qs.slice().sort(function (a, b) { return a.value - b.value; }).slice(0, 3)
        .map(function (q) { return '<li><b>' + q.getAttribute('data-label') + '</b> (' + q.value + '/10) — ' + q.getAttribute('data-fix') + '</li>'; }).join('');
      $('#ideaWeak').innerHTML = weak;
      var h = $('#ideaHidden'); if (h) h.value = 'Idea: ' + ($('#ideaName').value || '-') + ' | Score ' + pct + '/100 | ' + v[0];
    };
    bindAll($('#idea'), calc);
  }

  /* 2. Business Name Generator */
  if (tool === 'names') {
    var pre = { modern: ['go', 'get', 'try', 'use', 'my', 'hey', 'meta', 'neo', 'zen', 'flow'], tech: ['ai', 'byte', 'data', 'cloud', 'bit', 'quant', 'neural', 'stack', 'code', 'sync'],
      bold: ['max', 'apex', 'titan', 'prime', 'iron', 'peak', 'bold', 'rocket', 'alpha', 'nova'], friendly: ['happy', 'little', 'bright', 'sunny', 'kind', 'cozy', 'buddy', 'simple', 'daily', 'fresh'] };
    var suf = { modern: ['ly', 'ify', 'io', 'hub', 'lab', 'base', 'kit', 'loop', 'nest', 'wise'], tech: ['ai', 'ops', 'logic', 'stack', 'mind', 'bot', 'gen', 'grid', 'labs', 'core'],
      bold: ['force', 'works', 'forge', 'craft', 'empire', 'launch', 'drive', 'hq', 'pro', 'one'], friendly: ['buddy', 'box', 'spot', 'den', 'place', 'pal', 'nook', 'garden', 'corner', 'club'] };
    var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
    var favs = []; try { favs = JSON.parse(store.get('fav-names') || '[]'); } catch (e) { favs = []; }
    var drawFavs = function () { $('#favs').innerHTML = favs.length ? favs.map(function (f) { return '<span class="tag">' + f + '</span>'; }).join('') : '<span class="muted">Tap ☆ to save names you like.</span>'; };
    var gen = function () {
      var kw = ($('#kw').value || 'launch').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().split(/\s+/)[0] || 'launch';
      var st = $('#style').value, maxLen = num('maxlen') || 14, out = {};
      var vowels = kw.replace(/[aeiou]/g, '');
      var cands = [];
      pre[st].forEach(function (p) { cands.push(p + kw); });
      suf[st].forEach(function (s) { cands.push(kw + s); });
      cands.push(kw.slice(0, Math.max(3, kw.length - 1)) + 'r', vowels.length > 2 ? vowels + 'ly' : kw + 'ly', kw + 'o', 'the' + kw, kw + 'ster', kw + 'able', 'be' + kw, kw.split('').reverse().join('').slice(0, 4) + kw.slice(0, 3));
      cands.forEach(function (c) { if (c.length >= 4 && c.length <= maxLen) out[c] = 1; });
      var list = Object.keys(out).sort(function () { return Math.random() - .5; }).slice(0, 24);
      var tld = $('#tld').value;
      $('#names').innerHTML = list.map(function (n) {
        var dom = n + tld;
        return '<div class="nm"><span>' + cap(n) + '<br><small class="muted">' + dom + '</small></span><span><button type="button" data-fav="' + cap(n) + '" title="Save">☆</button>' +
          '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener nofollow" href="https://www.namecheap.com/domains/registration/results/?domain=' + dom + '">Check</a></span></div>';
      }).join('');
      $$('[data-fav]').forEach(function (b) { b.addEventListener('click', function () {
        var n = b.getAttribute('data-fav'); if (favs.indexOf(n) < 0) favs.push(n); store.set('fav-names', JSON.stringify(favs)); drawFavs(); b.textContent = '★'; }); });
    };
    $('#genBtn').addEventListener('click', gen);
    $('#kw').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); gen(); } });
    $('#clearFavs').addEventListener('click', function () { favs = []; store.set('fav-names', '[]'); drawFavs(); });
    drawFavs(); gen();
  }

  /* 3. Startup Cost Calculator */
  if (tool === 'cost') {
    var presets = {
      saas: { domain: 40, legal: 600, design: 1500, dev: 6000, tools: 250, hosting: 80, marketing: 800, ins: 60, misc: 150 },
      ecom: { domain: 40, legal: 500, design: 1200, dev: 2500, tools: 200, hosting: 60, marketing: 1500, ins: 80, misc: 4000 },
      service: { domain: 30, legal: 400, design: 600, dev: 800, tools: 120, hosting: 20, marketing: 500, ins: 90, misc: 300 },
      content: { domain: 30, legal: 150, design: 300, dev: 300, tools: 80, hosting: 15, marketing: 200, ins: 0, misc: 100 },
      ai: { domain: 40, legal: 600, design: 1200, dev: 5000, tools: 300, hosting: 400, marketing: 900, ins: 60, misc: 200 }
    };
    var apply = function () { var p = presets[$('#ptype').value]; Object.keys(p).forEach(function (k) { $('#c_' + k).value = p[k]; }); calc(); };
    var calc = function () {
      var once = num('c_domain') + num('c_legal') + num('c_design') + num('c_dev') + num('c_misc');
      var monthly = num('c_tools') + num('c_hosting') + num('c_marketing') + num('c_ins') + num('c_salary');
      var months = num('c_months') || 12, buffer = num('c_buffer') / 100;
      var need = (once + monthly * months) * (1 + buffer);
      $('#cOnce').textContent = money(once); $('#cMonthly').textContent = money(monthly);
      $('#cTotal').textContent = money(need); $('#cMonths').textContent = months;
      var h = $('#costHidden'); if (h) h.value = 'Type ' + $('#ptype').value + ' | One-time ' + money(once) + ' | Monthly ' + money(monthly) + ' | Total ' + money(need);
    };
    $('#ptype').addEventListener('change', apply);
    bindAll($('#cost'), calc); apply();
  }

  /* 4. Runway & Burn */
  if (tool === 'runway') {
    var calc = function () {
      var cash = num('r_cash'), rev = num('r_rev'), g = num('r_growth') / 100, exp = num('r_exp'), eg = num('r_expg') / 100;
      var bal = cash, months = 0, data = [cash], profitMonth = null, r = rev, x = exp;
      for (var m = 1; m <= 60; m++) {
        var prev = bal; bal += r - x; data.push(bal);
        if (profitMonth === null && r >= x) profitMonth = m;
        if (bal < 0 && months === 0) months = (m - 1) + (prev > 0 ? prev / (x - r) : 0) || 0.01;
        r *= 1 + g; x *= 1 + eg;
      }
      var burn = exp - rev;
      $('#rBurn').textContent = burn > 0 ? money(burn) + '/mo' : 'Cash-flow positive';
      var alive = profitMonth !== null && (months === 0 || profitMonth <= months);
      $('#rRunway').textContent = months === 0 ? '60+ months' : fmt(months, 1) + ' months';
      $('#rAlive').textContent = alive ? '✅ Default alive' : '⚠️ Default dead';
      $('#rAlive').style.color = alive ? 'var(--ok)' : 'var(--bad)';
      $('#rProfit').textContent = profitMonth ? 'Month ' + profitMonth : 'Not within 5 years';
      chart($('#rChart'), [{ data: data.slice(0, 37), color: '#c8ff3d' }], { xLabel: 'Month 36' });
    };
    bindAll($('#runway'), calc);
    window.addEventListener('resize', calc);
  }

  /* 5. Break-even */
  if (tool === 'breakeven') {
    var calc = function () {
      var fixed = num('b_fixed'), price = num('b_price'), vc = num('b_var');
      var margin = price - vc;
      if (margin <= 0) { $('#bUnits').textContent = '∞'; $('#bRev').textContent = '—'; $('#bMargin').textContent = 'Price must exceed variable cost'; return; }
      var units = Math.ceil(fixed / margin);
      $('#bUnits').textContent = fmt(units); $('#bRev').textContent = money(units * price);
      $('#bMargin').textContent = money(margin) + ' (' + fmt(margin / price * 100, 1) + '%)';
      $('#bDaily').textContent = fmt(units / 30, 1) + ' per day';
      var target = num('b_target'); $('#bTarget').textContent = fmt(Math.ceil((fixed + target) / margin)) + ' units';
    };
    bindAll($('#breakeven'), calc);
  }

  /* 6. Valuation */
  if (tool === 'valuation') {
    var calc = function () {
      var arr = num('v_arr'), g = num('v_growth'), gm = num('v_margin'), churn = num('v_churn'), model = $('#v_model').value;
      var base = { saas: 6, ecom: 1.5, marketplace: 3.5, content: 3, ai: 8, service: 1.2 }[model];
      var adj = 1 + Math.max(-.5, Math.min(1.5, (g - 30) / 60)) ;
      adj *= 1 + (gm - 60) / 200; adj *= 1 - Math.min(.5, churn / 20);
      var mid = arr * base * adj;
      $('#vLow').textContent = money(mid * .7); $('#vMid').textContent = money(mid); $('#vHigh').textContent = money(mid * 1.35);
      $('#vMult').textContent = fmt(base * adj, 1) + '× revenue';
      var h = $('#valHidden'); if (h) h.value = 'Model ' + model + ' | ARR ' + money(arr) + ' | Est ' + money(mid);
    };
    bindAll($('#valuation'), calc);
  }

  /* 7. MRR projection */
  if (tool === 'mrr') {
    var calc = function () {
      var cust = num('m_cust'), add = num('m_new'), addg = num('m_newg') / 100, arpu = num('m_arpu'), churn = num('m_churn') / 100, cac = num('m_cac');
      var rows = '', data = [], c = cust, a = add;
      for (var m = 0; m <= 24; m++) {
        data.push(c * arpu);
        if (m % 3 === 0) rows += '<tr><td>' + m + '</td><td>' + fmt(c) + '</td><td>' + money(c * arpu) + '</td><td>' + money(c * arpu * 12) + '</td></tr>';
        c = c * (1 - churn) + a; a *= 1 + addg;
      }
      var ltv = churn > 0 ? arpu / churn : arpu * 60;
      $('#mMrr').textContent = money(data[12]); $('#mArr').textContent = money(data[24] * 12);
      $('#mLtv').textContent = money(ltv); $('#mRatio').textContent = cac > 0 ? fmt(ltv / cac, 1) + ' : 1' : '—';
      $('#mPayback').textContent = cac > 0 && arpu > 0 ? fmt(cac / arpu, 1) + ' months' : '—';
      $('#mTable').innerHTML = rows;
      chart($('#mChart'), [{ data: data, color: '#8b6cff' }], { xLabel: 'Month 24' });
    };
    bindAll($('#mrr'), calc);
    window.addEventListener('resize', calc);
  }

  /* 8. Launch checklist with saved progress */
  if (tool === 'checklist') {
    var boxes = $$('.checklist input');
    var saved = {}; try { saved = JSON.parse(store.get('checklist') || '{}'); } catch (e) { saved = {}; }
    var upd = function () {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      var pct = Math.round(done / boxes.length * 100);
      $('#clPct').textContent = pct + '%'; $('#clMeter').style.width = pct + '%'; $('#clCount').textContent = done + ' / ' + boxes.length;
      var s = {}; boxes.forEach(function (b) { s[b.id] = b.checked; }); store.set('checklist', JSON.stringify(s));
    };
    boxes.forEach(function (b, i) { b.id = b.id || 'cl' + i; if (saved[b.id]) b.checked = true; b.addEventListener('change', upd); });
    $('#clReset').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); upd(); });
    $('#clPrint').addEventListener('click', function () { window.print(); });
    upd();
  }

  /* 9. Commerce launch calendar */
  if (tool === 'calendar') {
    var nthDow = function (y, mo, dow, n) { var d = new Date(y, mo, 1); var off = (dow - d.getDay() + 7) % 7; return new Date(y, mo, 1 + off + (n - 1) * 7); };
    var lastDow = function (y, mo, dow) { var d = new Date(y, mo + 1, 0); return new Date(y, mo, d.getDate() - ((d.getDay() - dow + 7) % 7)); };
    var events = function (y) {
      var tg = nthDow(y, 10, 4, 4); var bf = new Date(y, 10, tg.getDate() + 1); var cm = new Date(y, 10, tg.getDate() + 4);
      return [
        { d: new Date(y, 0, 1), n: 'New Year — "new me" demand', t: 'Fitness, productivity, finance and course launches peak.' },
        { d: new Date(y, 1, 14), n: "Valentine's Day", t: 'Gifts, experiences, dating and self-care offers.' },
        { d: new Date(y, 2, 8), n: "International Women's Day", t: 'Brand storytelling and founder features.' },
        { d: nthDow(y, 4, 0, 2), n: "Mother's Day (US/CA)", t: 'Second Sunday of May — gifts and personalised products.' },
        { d: nthDow(y, 5, 0, 3), n: "Father's Day (US/CA)", t: 'Third Sunday of June — gadgets, tools, experiences.' },
        { d: new Date(y, 6, 15), n: 'Mid-July marketplace sales season', t: 'Major retail marketplaces typically run member sales in July — check exact dates yearly.' },
        { d: new Date(y, 7, 1), n: 'Back-to-school season', t: 'Students, parents, laptops, courses and productivity apps.' },
        { d: new Date(y, 9, 31), n: 'Halloween', t: 'Costumes, décor, themed promos.' },
        { d: new Date(y, 10, 11), n: '11.11 — Singles\' Day / Double 11', t: 'The world\'s biggest online shopping festival; the "1111" in 011112.' },
        { d: bf, n: 'Black Friday', t: 'Day after US Thanksgiving — deepest discounts of the year.' },
        { d: cm, n: 'Cyber Monday', t: 'Software, SaaS and digital-product deals.' },
        { d: new Date(y, 11, 2), n: 'Giving Tuesday (approx.)', t: 'Tuesday after Thanksgiving — donations and cause campaigns.' },
        { d: new Date(y, 11, 12), n: '12.12 — Double 12', t: 'Asia-Pacific year-end sale wave.' },
        { d: new Date(y, 11, 26), n: 'Boxing Day', t: 'UK, Canada, Australia post-holiday sales.' }
      ];
    };
    // Giving Tuesday exact
    var fix = function (list, y) { var tg = nthDow(y, 10, 4, 4); list.forEach(function (e) { if (e.n.indexOf('Giving') === 0) { e.d = new Date(y, 10, tg.getDate() + 5); e.n = 'Giving Tuesday'; } }); return list; };
    var now = new Date(); now.setHours(0, 0, 0, 0); var y = now.getFullYear();
    var list = fix(events(y), y).concat(fix(events(y + 1), y + 1)).filter(function (e) { return e.d >= now; }).sort(function (a, b) { return a.d - b.d; }).slice(0, 14);
    var next = list[0];
    $('#nextName').textContent = next.n; $('#nextDate').textContent = next.d.toDateString();
    var cd = $('#nextCd'); var to = next.d.getTime();
    var draw = function () { var s = Math.max(0, Math.floor((to - Date.now()) / 1000));
      cd.innerHTML = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor(s / 3600) % 24], ['Min', Math.floor(s / 60) % 60], ['Sec', s % 60]].map(function (p) { return '<div><b>' + p[1] + '</b><small>' + p[0] + '</small></div>'; }).join(''); };
    draw(); setInterval(draw, 1000);
    $('#calBody').innerHTML = list.map(function (e) {
      var days = Math.round((e.d - now) / 864e5); var prep = new Date(e.d.getTime() - 42 * 864e5);
      return '<tr><td><b>' + e.d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) + '</b><br><small class="muted">in ' + days + ' days</small></td><td><b>' + e.n + '</b><br><small class="muted">' + e.t + '</small></td><td>' + (prep < now ? '<span class="tag hot">Start now</span>' : prep.toLocaleDateString('en', { month: 'short', day: 'numeric' })) + '</td></tr>';
    }).join('');
  }
})();
