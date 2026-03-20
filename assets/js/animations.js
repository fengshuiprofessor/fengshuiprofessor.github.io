/* Scroll-triggered animations using IntersectionObserver */
(function () {
  'use strict';

  /* --- Randomized ink wash elements --- */
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function buildCraneSvg(x, y, size) {
    var s = size;
    return "<path d='M" + x + "," + y + " Q" + (x + s) + "," + (y - s) + " " + (x + 2 * s) + "," + (y - s / 2) +
      " Q" + (x + 3 * s) + "," + (y - s) + " " + (x + 4 * s) + "," + y + "' fill='none' stroke='white' stroke-width='" +
      (size / 5) + "' opacity='" + (0.08 + Math.random() * 0.08) + "'/>";
  }

  function buildBoatSvg(x, y, size) {
    var w = size;
    var h = size * 0.7;
    return "<path d='M" + x + "," + y + " Q" + (x + w / 2) + "," + (y - h * 0.4) + " " + (x + w) + "," + y + " Z' fill='white' opacity='0.1'/>" +
      "<path d='M" + (x + w / 2) + "," + y + " L" + (x + w / 2) + "," + (y - h) + " L" + (x + w * 0.75) + "," + (y - h * 0.4) + " Z' fill='white' opacity='0.08'/>";
  }

  function randomizeHeroBirds() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var cranes = '';
    var count = rand(2, 4);
    var startX = rand(500, 900);
    for (var i = 0; i < count; i++) {
      var x = startX + rand(-40, 40) + i * rand(30, 60);
      var y = rand(60, 150) + i * rand(10, 25);
      var size = rand(6, 12) - i;
      cranes += buildCraneSvg(x, y, Math.max(size, 4));
    }

    var svg = "data:image/svg+xml," + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='500' viewBox='0 0 1200 500'>" +
      "<defs><radialGradient id='hm1' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='white' stop-opacity='0.12'/><stop offset='100%' stop-color='white' stop-opacity='0'/></radialGradient>" +
      "<radialGradient id='hm2' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='white' stop-opacity='0.08'/><stop offset='100%' stop-color='white' stop-opacity='0'/></radialGradient></defs>" +
      "<ellipse cx='" + rand(80, 250) + "' cy='" + rand(60, 100) + "' rx='" + rand(140, 200) + "' ry='40' fill='url(#hm1)'/>" +
      "<ellipse cx='" + rand(800, 1000) + "' cy='" + rand(50, 90) + "' rx='" + rand(140, 200) + "' ry='35' fill='url(#hm2)'/>" +
      "<path d='M0,440 Q60,350 140,380 Q200,400 280,340 Q360,280 460,320 Q520,345 600,300 Q680,260 780,290 Q860,310 940,270 Q1020,240 1100,280 Q1160,300 1200,275 L1200,500 L0,500 Z' fill='white' opacity='0.04'/>" +
      "<path d='M0,460 Q100,380 200,410 Q300,435 420,370 Q500,330 600,360 Q720,395 820,340 Q920,300 1020,340 Q1100,365 1200,330 L1200,500 L0,500 Z' fill='white' opacity='0.06'/>" +
      cranes +
      "</svg>"
    );

    hero.style.setProperty('--hero-bg', 'url("' + svg + '")');
  }

  function randomizeFooterBoats() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;

    var boats = '';
    var positions = [rand(80, 200), rand(550, 750), rand(900, 1100)];
    var sizes = [rand(35, 45), rand(28, 38), rand(20, 28)];
    for (var i = 0; i < 3; i++) {
      var bx = positions[i];
      var by = rand(125, 140);
      boats += buildBoatSvg(bx, by, sizes[i]);
    }

    var svg = "data:image/svg+xml," + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='180' viewBox='0 0 1440 180' preserveAspectRatio='none'>" +
      "<defs><radialGradient id='ff1' cx='20%' cy='40%' r='30%'><stop offset='0%' stop-color='white' stop-opacity='0.07'/><stop offset='100%' stop-color='white' stop-opacity='0'/></radialGradient>" +
      "<radialGradient id='ff2' cx='75%' cy='35%' r='25%'><stop offset='0%' stop-color='white' stop-opacity='0.05'/><stop offset='100%' stop-color='white' stop-opacity='0'/></radialGradient></defs>" +
      "<path d='M0,130 Q80,75 180,100 Q280,120 400,80 Q500,50 620,75 Q740,100 860,65 Q960,40 1080,70 Q1200,95 1320,60 Q1400,42 1440,55 L1440,180 L0,180 Z' fill='white' opacity='0.03'/>" +
      "<path d='M0,150 Q100,110 220,130 Q350,148 480,115 Q600,88 720,110 Q850,132 980,105 Q1100,82 1220,108 Q1340,128 1440,100 L1440,180 L0,180 Z' fill='white' opacity='0.05'/>" +
      "<ellipse cx='300' cy='110' rx='120' ry='20' fill='url(#ff1)'/>" +
      "<ellipse cx='1050' cy='95' rx='100' ry='18' fill='url(#ff2)'/>" +
      boats +
      "</svg>"
    );

    footer.style.setProperty('--footer-bg', 'url("' + svg + '")');
  }

  /* Apply after includes load (slight delay for footer to be injected) */
  setTimeout(function () {
    randomizeHeroBirds();
    randomizeFooterBoats();
  }, 200);

  /* Auto-tag elements for animation */
  function tagElements() {
    /* Cards */
    document.querySelectorAll('.card, .book-card').forEach(function (el, i) {
      el.classList.add('animate-on-scroll', 'fade-up');
      el.style.animationDelay = (i % 4) * 0.1 + 's';
    });

    /* Section headers */
    document.querySelectorAll('.section-header').forEach(function (el) {
      el.classList.add('animate-on-scroll', 'fade-up');
    });

    /* Info boxes */
    document.querySelectorAll('.info-box').forEach(function (el) {
      el.classList.add('animate-on-scroll', 'fade-up');
    });

    /* CTA sections */
    document.querySelectorAll('.cta-section, .cta-section-alt').forEach(function (el) {
      el.classList.add('animate-on-scroll', 'fade-up');
    });

    /* Numbered items */
    document.querySelectorAll('.numbered-item').forEach(function (el, i) {
      el.classList.add('animate-on-scroll', 'fade-left');
      el.style.animationDelay = i * 0.08 + 's';
    });

    /* Article content paragraphs (first 3 only) */
    document.querySelectorAll('.article-content > p:nth-child(-n+3)').forEach(function (el) {
      el.classList.add('animate-on-scroll', 'fade-up');
    });
  }

  /* Observe and trigger animations */
  function initObserver() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: show everything immediately */
      document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        el.style.opacity = '1';
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Run after DOM + includes are loaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () { tagElements(); initObserver(); }, 100);
    });
  } else {
    setTimeout(function () { tagElements(); initObserver(); }, 100);
  }
})();
