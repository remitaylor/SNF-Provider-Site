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

  /* Services explorer: one service selected at a time ------------------- */
  var explorer = document.querySelector('[data-svc-explorer]');
  var svcTabs = explorer ? Array.prototype.slice.call(explorer.querySelectorAll('.svc-tab')) : [];
  var svcPanes = explorer ? Array.prototype.slice.call(explorer.querySelectorAll('.svc-pane')) : [];
  var selectedSvc = svcPanes.length ? svcPanes[0].id : null;
  function selectSvc(id, focusTab) {
    if (!explorer || !document.getElementById(id)) return;
    selectedSvc = id;
    svcTabs.forEach(function (t) {
      var on = t.getAttribute('data-target') === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) {
        if (focusTab) t.focus();
        // keep the active pill visible in the horizontal row on phones
        var row = t.parentNode;
        if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
    svcPanes.forEach(function (pane) {
      var on = pane.id === id;
      pane.classList.toggle('is-active', on);
      if (on) { pane.removeAttribute('aria-hidden'); pane.removeAttribute('inert'); }
      else { pane.setAttribute('aria-hidden', 'true'); pane.setAttribute('inert', ''); }
    });
    if (typeof setActive === 'function') setActive(id);
  }
  if (explorer) {
    svcTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-target');
        selectSvc(id);
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
      tab.addEventListener('keydown', function (e) {
        var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        var idx = e.key === 'Home' ? 0 : e.key === 'End' ? svcTabs.length - 1 : k ? (i + k + svcTabs.length) % svcTabs.length : -1;
        if (idx < 0) return;
        e.preventDefault();
        var id = svcTabs[idx].getAttribute('data-target');
        selectSvc(id, true);
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });
    explorer.querySelectorAll('.svc-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-target');
        selectSvc(id);
        if (history.replaceState) history.replaceState(null, '', '#' + id);
        // if the panel top has scrolled away (e.g. on phones), bring the explorer back into view
        if (explorer.getBoundingClientRect().top < 0) scrollToTarget(explorer, true);
      });
    });
  }

  /* In-page navigation ---------------------------------------------------
     Every anchor link lands with the section's top just below the sticky
     header (and the sticky section tabs, where a page has them). Service
     cards are opened first, and the scroll waits for the open animation so
     the target doesn't move after landing. */
  var subnav = document.querySelector('.subnav');
  function stickyOffset() {
    var h = header ? header.getBoundingClientRect().height : 0;
    if (subnav) h += subnav.getBoundingClientRect().height;
    return h + 16;
  }
  document.documentElement.style.scrollPaddingTop = stickyOffset() + 'px';
  window.addEventListener('resize', function () {
    document.documentElement.style.scrollPaddingTop = stickyOffset() + 'px';
  });

  function scrollToTarget(target, smooth) {
    // Ignore any in-progress reveal animation offset so we land on the final position
    var shift = 0, t = getComputedStyle(target).transform;
    if (t && t !== 'none') { var m = t.match(/matrix(3d)?\(([^)]+)\)/); if (m) { var v = m[2].split(','); shift = parseFloat(m[1] ? v[13] : v[5]) || 0; } }
    var y = target.getBoundingClientRect().top - shift + window.pageYOffset - stickyOffset();
    window.scrollTo({ top: Math.max(0, y), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
  }
  function goTo(id, smooth, push) {
    var target = id && document.getElementById(id);
    if (!target) return false;
    // A service link selects that service and lands on the top of the explorer
    if (target.classList.contains('svc-pane')) { selectSvc(id); target = explorer; }
    if (push && history.pushState) history.pushState(null, '', '#' + id);
    setActive(id);
    lockActive(id);
    scrollToTarget(target, smooth);
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    if (goTo(decodeURIComponent(url.hash.slice(1)), true, true)) e.preventDefault();
  });
  window.addEventListener('popstate', function () { goTo(location.hash.slice(1), false, false); });

  /* Section tab highlight: the tab for the section whose top has passed
     just below the sticky bars. Locked briefly after a click so it doesn't
     flicker through sections during the smooth scroll. */
  var subLinks = Array.prototype.slice.call(document.querySelectorAll('.subnav a[href^="#"]'));
  var lockUntil = 0;
  var activeId = null;
  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    subLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
    var active = subnav && subnav.querySelector('a.is-active');
    if (active && active.scrollIntoView) {
      var ul = active.parentNode.parentNode;
      ul.scrollTo({ left: active.offsetLeft - ul.clientWidth / 2 + active.offsetWidth / 2, behavior: 'smooth' });
    }
  }
  function lockActive() { lockUntil = Date.now() + 900; }
  var sections = subLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  var paneTabs = sections.length && sections.every(function (sec) { return sec.classList.contains('svc-pane'); });
  function updateActive() {
    // On the Services page the section tabs mirror the selected service
    if (paneTabs) { setActive(selectedSvc); return; }
    if (!sections.length || Date.now() < lockUntil) return;
    var line = stickyOffset() + 8, current = sections[0];
    sections.forEach(function (sec) { if (sec.getBoundingClientRect().top <= line) current = sec; });
    // At the very bottom of the page, the last section counts as current
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
      sections.forEach(function (sec) { if (sec.getBoundingClientRect().top < window.innerHeight) current = sec; });
    }
    if (!current.classList.contains('is-active-section')) {
      sections.forEach(function (s2) { s2.classList.remove('is-active-section'); });
      current.classList.add('is-active-section');
    }
    setActive(current.id);
  }
  if (sections.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; updateActive(); });
    }, { passive: true });
    updateActive();
  }

  /* Land on a section when arriving from another page (e.g. services.html#primary-care) */
  if (location.hash) {
    var initial = location.hash.slice(1);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    goTo(initial, false, false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { goTo(initial, false, false); });
    window.addEventListener('load', function () { goTo(initial, false, false); });
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
