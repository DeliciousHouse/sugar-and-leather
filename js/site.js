/* ============================================================
   SUGAR & LEATHER — interactions
   Vanilla JS. Quiet, eased motion. Respects reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noMotion = function () { return document.body.classList.contains('no-motion') || reduce; };
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- icons ---------- */
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  icons();

  /* ---------- split text into words/letters ---------- */
  document.querySelectorAll('.split').forEach(function (el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var html = el.innerHTML;
    // protect inner tagged spans (.hl, .serif-i, <br>) by splitting on spaces at top level only
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var out = '';
    tmp.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (tok.trim() === '') { out += tok; }
          else { out += '<span class="word"><span>' + tok + '</span></span>'; }
        });
      } else if (node.nodeName === 'BR') {
        out += '<br>';
      } else {
        // wrap whole inline element as one animated word, preserving its tag/classes
        var cls = node.getAttribute && node.getAttribute('class') ? ' class="' + node.getAttribute('class') + '"' : '';
        var tag = node.nodeName.toLowerCase();
        out += '<span class="word"><span><' + tag + cls + '>' + node.innerHTML + '</' + tag + '></span></span>';
      }
    });
    el.innerHTML = out;
  });

  /* ---------- reveal + split trigger via IntersectionObserver ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], .split').forEach(function (el) { io.observe(el); });

  /* ---------- NAV scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById('drawer');
  var burger = document.getElementById('burger');
  var drawerClose = document.getElementById('drawerClose');
  if (burger) burger.addEventListener('click', function () { drawer.classList.add('open'); });
  if (drawerClose) drawerClose.addEventListener('click', function () { drawer.classList.remove('open'); });
  document.querySelectorAll('[data-drawer-link]').forEach(function (a) {
    a.addEventListener('click', function () { drawer.classList.remove('open'); });
  });

  /* ---------- smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: noMotion() ? 'auto' : 'smooth' });
        return;
      }
      var t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: noMotion() ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = '0px'; }
      });
      if (open) { item.classList.remove('open'); a.style.maxHeight = '0px'; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- carousels ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.car-track');
    var slides = car.querySelectorAll('.car-slide');
    var dotsWrap = car.querySelector('[data-dots]');
    var i = 0, n = slides.length, timer = null;
    for (var d = 0; d < n; d++) {
      var b = document.createElement('button');
      b.className = 'car-dot' + (d === 0 ? ' on' : '');
      b.setAttribute('aria-label', 'Slide ' + (d + 1));
      (function (idx) { b.addEventListener('click', function () { go(idx); restart(); }); })(d);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.querySelectorAll('.car-dot');
    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      dots.forEach(function (dt, di) { dt.classList.toggle('on', di === i); });
    }
    function restart() { if (timer) clearInterval(timer); if (!noMotion()) timer = setInterval(function () { go(i + 1); }, 3000); }
    car.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); restart(); });
    car.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); restart(); });
    restart();
    car.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    car.addEventListener('mouseleave', restart);
  });

  /* ---------- magnetic buttons ---------- */
  if (fine) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 0.14;
      el.addEventListener('mousemove', function (e) {
        if (noMotion()) return;
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (mx * strength) + 'px,' + (my * strength) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- tilt on eco cards ---------- */
  if (fine) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        if (noMotion()) return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-py * 3) + 'deg) rotateY(' + (px * 3) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- parallax (hero bg, visuals, portrait) ---------- */
  var heroBg = document.getElementById('heroBg');
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  function parallax() {
    if (noMotion()) { if (heroBg) heroBg.style.transform = ''; parallaxEls.forEach(function (el) { el.style.transform = ''; }); return; }
    var y = window.scrollY;
    if (heroBg) heroBg.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0) scale(1.05)';
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var center = r.top + r.height / 2 - window.innerHeight / 2;
      var amt = parseFloat(el.dataset.parallax) || 0.05;
      el.style.transform = 'translate3d(0,' + (-center * amt) + 'px,0)';
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(function () { parallax(); ticking = false; }); ticking = true; }
  }, { passive: true });
  parallax();

  /* ---------- floating hero names — gentle drift + mouse follow ---------- */
  var floats = Array.prototype.slice.call(document.querySelectorAll('[data-float]'));
  var cluster = document.getElementById('cluster');
  floats.forEach(function (f) {
    f._phase = Math.random() * Math.PI * 2;
    f._speed = 0.5 + Math.random() * 0.4;
    f._amp = 7 + Math.random() * 6;
    f._mx = 0; f._my = 0;
  });
  if (cluster && fine) {
    cluster.addEventListener('mousemove', function (e) {
      var r = cluster.getBoundingClientRect();
      var cx = (e.clientX - r.left) / r.width - 0.5;
      var cy = (e.clientY - r.top) / r.height - 0.5;
      floats.forEach(function (f, idx) {
        var depth = (idx + 1) * 6;
        f._mx = cx * depth; f._my = cy * depth;
      });
    });
    cluster.addEventListener('mouseleave', function () {
      floats.forEach(function (f) { f._mx = 0; f._my = 0; });
    });
  }
  var t0 = performance.now();
  function driftLoop(t) {
    if (!noMotion()) {
      var dt = (t - t0) / 1000;
      floats.forEach(function (f) {
        var dy = Math.sin(dt * f._speed + f._phase) * f._amp;
        var dx = Math.cos(dt * f._speed * 0.7 + f._phase) * (f._amp * 0.5);
        f.style.transform = 'translate(' + (dx + f._mx) + 'px,' + (dy + f._my) + 'px)';
      });
    }
    requestAnimationFrame(driftLoop);
  }
  requestAnimationFrame(driftLoop);

  /* ---------- mouse-follow cursor ---------- */
  if (fine && !reduce) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var dx = 0, dy = 0, rx = 0, ry = 0, has = false;
    window.addEventListener('mousemove', function (e) {
      dx = e.clientX; dy = e.clientY;
      if (!has) { has = true; rx = dx; ry = dy; document.body.classList.add('cursor-on'); }
    });
    function cursorLoop() {
      rx += (dx - rx) * 0.16; ry += (dy - ry) * 0.16;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(cursorLoop);
    }
    requestAnimationFrame(cursorLoop);
    document.querySelectorAll('a, button, [data-magnetic], .faq-q, .car-arrow, .float-name').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hot'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hot'); });
    });
  }

  /* ---------- loader ---------- */
  var loader = document.getElementById('loader');
  var fill = document.getElementById('loaderFill');
  var pct = 0;
  var li = setInterval(function () {
    pct = Math.min(100, pct + Math.random() * 26);
    if (fill) fill.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(li);
      setTimeout(function () {
        loader.classList.add('done');
        document.querySelectorAll('.hero [data-reveal], .hero .split').forEach(function (el) { el.classList.add('in'); });
        icons();
      }, 260);
    }
  }, 130);
  window.addEventListener('load', function () { pct = 100; if (fill) fill.style.width = '100%'; });

  /* re-run icons after a tick (lucide replaces <i> nodes) */
  setTimeout(icons, 400);

  /* ---------- expose for tweaks ---------- */
  window.SL = {
    setMotion: function (on) { document.body.classList.toggle('no-motion', !on); if (!on) { document.querySelectorAll('[data-reveal],.split').forEach(function (el) { el.classList.add('in'); }); } },
    setAccent: function (hex) { document.documentElement.style.setProperty('--lavender', hex); },
    setHeadline: function (txt) {
      var h = document.getElementById('heroTitle');
      if (h) { h.classList.remove('split'); h.removeAttribute('data-split'); h.textContent = txt; }
    }
  };
})();
