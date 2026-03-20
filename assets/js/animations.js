/* Scroll-triggered animations using IntersectionObserver */
(function () {
  'use strict';

  /* --- Animated ink wash elements (CSS animations) --- */
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  /* Inject CSS keyframes once */
  var styleEl = document.createElement('style');
  styleEl.textContent =
    /* Birds: fly across + wing flap */
    '@keyframes birdFly { 0% { transform: translateX(-100px); } 100% { transform: translateX(calc(100vw + 100px)); } }' +
    '@keyframes wingFlap { 0%,100% { transform: rotate(var(--wing-up)); } 50% { transform: rotate(var(--wing-down)); } }' +
    /* Boats going right: start off-screen left, exit off-screen right, with rocking */
    '@keyframes boatRight { 0% { left: -5%; transform: rotate(0deg); } 5% { transform: rotate(-1.5deg); } 10% { transform: rotate(1.5deg); } 15% { transform: rotate(-1deg); } 20% { transform: rotate(1deg); } 25% { transform: rotate(-1.5deg); } 30% { transform: rotate(1.5deg); } 35% { transform: rotate(-1deg); } 40% { transform: rotate(1deg); } 45% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } 55% { transform: rotate(-1deg); } 60% { transform: rotate(1deg); } 65% { transform: rotate(-1.5deg); } 70% { transform: rotate(1.5deg); } 75% { transform: rotate(-1deg); } 80% { transform: rotate(1deg); } 85% { transform: rotate(-1.5deg); } 90% { transform: rotate(1.5deg); } 95% { transform: rotate(-1deg); } 100% { left: 105%; transform: rotate(0deg); } }' +
    /* Boats going left: start off-screen right, exit off-screen left */
    '@keyframes boatLeft { 0% { left: 105%; transform: rotate(0deg); } 5% { transform: rotate(1.5deg); } 10% { transform: rotate(-1.5deg); } 15% { transform: rotate(1deg); } 20% { transform: rotate(-1deg); } 25% { transform: rotate(1.5deg); } 30% { transform: rotate(-1.5deg); } 35% { transform: rotate(1deg); } 40% { transform: rotate(-1deg); } 45% { transform: rotate(1.5deg); } 50% { transform: rotate(-1.5deg); } 55% { transform: rotate(1deg); } 60% { transform: rotate(-1deg); } 65% { transform: rotate(1.5deg); } 70% { transform: rotate(-1.5deg); } 75% { transform: rotate(1deg); } 80% { transform: rotate(-1deg); } 85% { transform: rotate(1.5deg); } 90% { transform: rotate(-1.5deg); } 95% { transform: rotate(1deg); } 100% { left: -5%; transform: rotate(0deg); } }';
  document.head.appendChild(styleEl);

  function injectHeroBirds() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var container = document.createElement('div');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;';

    var count = rand(8, 10);
    var baseTop = rand(20, 30);
    var dur = rand(30, 45);
    var leaderSize = rand(32, 42);

    var SVG_NS = 'http://www.w3.org/2000/svg';

    /* 人型雁 V-formation: leader at front, two trailing arms */
    for (var i = 0; i < count; i++) {
      /* Position in V: bird 0 is leader, odd birds go up-left, even birds go down-left */
      var rank = Math.ceil(i / 2); /* distance from leader */
      var arm = (i % 2 === 1) ? -1 : 1; /* upper arm or lower arm */
      if (i === 0) { rank = 0; arm = 0; }

      var size = leaderSize - rank * 2; /* farther birds slightly smaller */
      if (size < 18) size = 18;
      var opacity = (0.4 - rank * 0.03).toFixed(2);
      var flapSpeed = (0.8 + Math.random() * 0.4).toFixed(2);

      /* V-formation offsets: each rank is further left and up/down */
      var topOffset = baseTop + arm * rank * 3;
      var delayOffset = rank * 1.2; /* trailing birds slightly behind in time */

      var bird = document.createElement('div');
      bird.style.cssText =
        'position:absolute;' +
        'left:0;' +
        'top:' + topOffset + '%;' +
        'width:' + size + 'px; height:' + (size * 0.5) + 'px;' +
        'animation: birdFly ' + dur + 's linear infinite;' +
        'animation-delay: -' + delayOffset.toFixed(1) + 's;';

      /* SVG bird — two curved brush strokes */
      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 40 20');
      svg.setAttribute('width', size + 'px');
      svg.setAttribute('height', (size * 0.5) + 'px');
      svg.style.cssText = 'overflow:visible;display:block;';

      var lw = document.createElementNS(SVG_NS, 'path');
      lw.setAttribute('d', 'M20,18 C16,10 8,2 1,5');
      lw.setAttribute('fill', 'none');
      lw.setAttribute('stroke', 'rgba(201,162,39,' + opacity + ')');
      lw.setAttribute('stroke-width', '2.5');
      lw.setAttribute('stroke-linecap', 'round');
      lw.style.cssText = 'transform-origin: 20px 18px; animation: wingFlap ' + flapSpeed + 's ease-in-out infinite; --wing-up: 8deg; --wing-down: -12deg;';
      svg.appendChild(lw);

      var rw = document.createElementNS(SVG_NS, 'path');
      rw.setAttribute('d', 'M20,18 C24,10 32,2 39,5');
      rw.setAttribute('fill', 'none');
      rw.setAttribute('stroke', 'rgba(255,255,255,' + opacity + ')');
      rw.setAttribute('stroke-width', '2.5');
      rw.setAttribute('stroke-linecap', 'round');
      rw.style.cssText = 'transform-origin: 20px 18px; animation: wingFlap ' + flapSpeed + 's ease-in-out infinite; --wing-up: -8deg; --wing-down: 12deg; animation-delay: -0.05s;';
      svg.appendChild(rw);

      bird.appendChild(svg);
      container.appendChild(bird);
    }

    hero.appendChild(container);
  }

  function injectFooterBoats() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;

    var container = document.createElement('div');
    container.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:180px;pointer-events:none;overflow:hidden;';

    var baseHullW = rand(45, 55);
    var boatConfigs = [
      { opacity: 0.3, bottom: rand(15, 25), anim: 'boatRight', dur: rand(90, 120), delay: rand(0, 30), hullW: baseHullW + rand(-3, 3) },
      { opacity: 0.25, bottom: rand(22, 32), anim: 'boatLeft',  dur: rand(110, 140), delay: rand(10, 40), hullW: baseHullW + rand(-3, 3) },
      { opacity: 0.2, bottom: rand(30, 42), anim: 'boatRight', dur: rand(130, 160), delay: rand(20, 50), hullW: baseHullW + rand(-3, 3) }
    ];

    for (var i = 0; i < boatConfigs.length; i++) {
      var c = boatConfigs[i];
      var hw = c.hullW;
      var mastH = Math.round(hw * 0.65);
      var sailH = Math.round(mastH * 0.7);
      var sailW = Math.round(hw * 0.35);
      var col = 'rgba(201,162,39,';
      var anim = 'position:absolute;animation:' + c.anim + ' ' + c.dur + 's linear infinite;animation-delay:-' + c.delay + 's;';

      /* Hull — horizontal bar with rounded ends */
      var hull = document.createElement('span');
      hull.style.cssText = anim +
        'bottom:' + c.bottom + 'px;width:' + hw + 'px;height:3px;' +
        'background:' + col + c.opacity.toFixed(2) + ');border-radius:2px;';
      container.appendChild(hull);

      /* Mast — thin vertical bar */
      var mast = document.createElement('span');
      mast.style.cssText = anim +
        'bottom:' + (c.bottom + 1) + 'px;margin-left:' + Math.round(hw * 0.45) + 'px;' +
        'width:2px;height:' + mastH + 'px;' +
        'background:' + col + c.opacity.toFixed(2) + ');';
      container.appendChild(mast);

      /* Sail — CSS triangle via borders */
      var sail = document.createElement('span');
      if (c.anim === 'boatRight') {
        sail.style.cssText = anim +
          'bottom:' + (c.bottom + Math.round(mastH * 0.25)) + 'px;' +
          'margin-left:' + Math.round(hw * 0.47) + 'px;' +
          'width:0;height:0;' +
          'border-left:0;border-right:' + sailW + 'px solid transparent;' +
          'border-bottom:' + sailH + 'px solid ' + col + (c.opacity * 0.5).toFixed(2) + ');';
      } else {
        sail.style.cssText = anim +
          'bottom:' + (c.bottom + Math.round(mastH * 0.25)) + 'px;' +
          'margin-left:' + Math.round(hw * 0.45 - sailW) + 'px;' +
          'width:0;height:0;' +
          'border-right:0;border-left:' + sailW + 'px solid transparent;' +
          'border-bottom:' + sailH + 'px solid ' + col + (c.opacity * 0.5).toFixed(2) + ');';
      }
      container.appendChild(sail);
    }

    footer.appendChild(container);
  }

  /* Apply after includes load */
  setTimeout(function () {
    injectHeroBirds();
    injectFooterBoats();
  }, 300);

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
