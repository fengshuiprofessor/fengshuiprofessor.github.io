/* Header/Footer loader & Navigation behavior */
(function () {
  'use strict';

  /* --- Load shared includes using safe DOM parsing --- */
  function loadInclude(id, url) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        while (el.firstChild) { el.removeChild(el.firstChild); }
        var nodes = doc.body.childNodes;
        while (nodes.length > 0) {
          el.appendChild(nodes[0]);
        }
      });
  }

  /* Load header + footer, then initialise nav */
  Promise.all([
    loadInclude('site-header', '/includes/header.html'),
    loadInclude('site-footer', '/includes/footer.html')
  ]).then(initNav);

  /* --- Navigation --- */
  function initNav() {
    var nav = document.getElementById('siteNav');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    var overlay = document.getElementById('mobileOverlay');
    if (!nav || !toggle || !menu) return;

    /* Sticky shadow on scroll */
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    /* Mobile toggle */
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('active');
      toggle.classList.toggle('active', open);
      if (overlay) overlay.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close on overlay click */
    if (overlay) {
      overlay.addEventListener('click', function () {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    /* Mobile dropdown toggle */
    var dropdownParents = nav.querySelectorAll('.has-dropdown');
    dropdownParents.forEach(function (item) {
      var link = item.querySelector('.nav-link');
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    });

    /* Highlight current page */
    var path = window.location.pathname;
    var links = nav.querySelectorAll('.nav-link, .dropdown-link');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '/' && href === '/') || (path.endsWith(href) && href !== '#' && href !== '/')) {
        a.classList.add('active');
      }
    });
  }
})();
