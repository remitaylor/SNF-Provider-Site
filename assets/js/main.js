/* Integrated Health Partners — site interactions */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header shadow ------------------------------------------------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation ---------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.querySelector('.icon-open').style.display = open ? 'none' : '';
      toggle.querySelector('.icon-close').style.display = open ? '' : 'none';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  /* Reveal on scroll, counters, charts ---------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    var start = null, dur = 1400;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function activate(el) {
    el.classList.add('is-visible');
    el.querySelectorAll('[data-count]').forEach(animateCount);
    if (el.hasAttribute('data-count')) animateCount(el);
    el.querySelectorAll('.bar-fill[data-value]').forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-value') + '%';
    });
  }

  var observed = document.querySelectorAll('.reveal, [data-animate]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { activate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    observed.forEach(function (el) { io.observe(el); });
  } else {
    observed.forEach(activate);
  }

  /* Carousels ------------------------------------------------------------ */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var prev = root.querySelector('.carousel-btn--prev');
    var next = root.querySelector('.carousel-btn--next');
    if (!track) return;
    function step() {
      var card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* Interactive services orbit ------------------------------------------ */
  document.querySelectorAll('[data-orbit]').forEach(function (root) {
    var nodes = Array.prototype.slice.call(root.querySelectorAll('.orbit-node'));
    var spokes = root.querySelectorAll('.orbit-spokes line');
    var items = root.querySelectorAll('.orbit-detail__item');
    var current = -1, timer = null, userEngaged = false, paused = false, inView = false;

    function select(i) {
      current = i;
      nodes.forEach(function (n, k) {
        n.classList.toggle('is-active', k === i);
        n.setAttribute('aria-pressed', String(k === i));
      });
      spokes.forEach(function (l) { l.classList.toggle('is-active', +l.getAttribute('data-index') === i); });
      items.forEach(function (it) { it.hidden = +it.getAttribute('data-index') !== i; });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduceMotion || userEngaged || paused || !inView) return;
      timer = setInterval(function () { select((current + 1) % nodes.length); }, 3500);
    }
    function engage(i) { userEngaged = true; stop(); select(i); }

    nodes.forEach(function (node, i) {
      node.addEventListener('click', function () { engage(i); });
      node.addEventListener('focus', function () { engage(i); });
      node.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: hover)').matches) engage(i);
      });
      node.addEventListener('keydown', function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!k) return;
        e.preventDefault();
        nodes[(i + k + nodes.length) % nodes.length].focus();
      });
    });
    root.addEventListener('mouseenter', function () { paused = true; stop(); });
    root.addEventListener('mouseleave', function () { paused = false; start(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView && current === -1 && !reduceMotion) select(0);
        inView ? start() : stop();
      }, { threshold: 0.35 }).observe(root);
    }
  });

  /* Expandable service cards -------------------------------------------- */
  function openSvc(svc, open) {
    var btn = svc.querySelector('.svc-head');
    svc.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  document.querySelectorAll('.svc').forEach(function (svc) {
    svc.querySelector('.svc-head').addEventListener('click', function () {
      openSvc(svc, !svc.classList.contains('is-open'));
    });
  });
  function openFromHash() {
    if (!location.hash) return;
    var target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('svc')) openSvc(target, true);
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* Sub-navigation active state ----------------------------------------- */
  var subLinks = document.querySelectorAll('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          subLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var link = map[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) so.observe(sec);
    });
  }

  /* Contact form --------------------------------------------------------- */
  // Set FORM_ENDPOINT to a form-handling service URL (e.g. Formspree, HubSpot,
  // or an internal API) to enable real submissions. While it is empty the form
  // validates input and shows a preview message without sending anything.
  var FORM_ENDPOINT = '';

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var ok = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        if (field) field.classList.toggle('has-error', !ok);
        if (!ok && valid) { input.focus(); valid = false; }
      });
      if (!valid) return;

      var btn = form.querySelector('[type="submit"]');
      function done(msg, info) {
        status.textContent = msg;
        status.classList.add('is-visible');
        status.classList.toggle('is-info', !!info);
        if (btn) btn.disabled = false;
      }

      if (!FORM_ENDPOINT) {
        done('Thanks! This is a preview site, so your message was not sent. Form submissions will be connected before launch.', true);
        return;
      }
      if (btn) btn.disabled = true;
      fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Request failed');
          form.reset();
          done('Thank you. A member of the IHP team will be in touch shortly.');
        })
        .catch(function () { done('Sorry, something went wrong. Please try again or email us directly.', true); });
    });
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  });

  /* Footer year ---------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
