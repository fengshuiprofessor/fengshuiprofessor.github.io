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
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';

    var count = rand(8, 14);
    var baseTop = rand(15, 30);
    var clusterLeft = rand(40, 60);
    var dur = rand(25, 40);

    var SVG_NS = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < count; i++) {
      var size = rand(14, 28);
      var opacity = (0.12 + Math.random() * 0.15).toFixed(2);
      var flapSpeed = (0.8 + Math.random() * 0.6).toFixed(2);

      /* Bird wrapper — scattered within cluster, all fly together */
      var bird = document.createElement('div');
      bird.style.cssText =
        'position:absolute;' +
        'left:' + (clusterLeft + rand(-15, 15)) + '%;' +
        'top:' + (baseTop + rand(-8, 8)) + '%;' +
        'width:' + size + 'px; height:' + size + 'px;' +
        'animation: birdFly ' + dur + 's linear infinite;' +
        'animation-delay: -' + rand(0, 10) + 's;';

      /* SVG bird — two curved brush strokes meeting at center bottom */
      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 40 20');
      svg.setAttribute('width', size + 'px');
      svg.setAttribute('height', (size * 0.5) + 'px');
      svg.style.cssText = 'overflow:visible;';

      /* Left wing stroke */
      var lw = document.createElementNS(SVG_NS, 'path');
      lw.setAttribute('d', 'M20,18 C16,10 8,2 1,5');
      lw.setAttribute('fill', 'none');
      lw.setAttribute('stroke', 'rgba(255,255,255,' + opacity + ')');
      lw.setAttribute('stroke-width', '2');
      lw.setAttribute('stroke-linecap', 'round');
      lw.style.cssText = 'transform-origin: 20px 18px; animation: wingFlap ' + flapSpeed + 's ease-in-out infinite; --wing-up: 8deg; --wing-down: -12deg;';
      svg.appendChild(lw);

      /* Right wing stroke */
      var rw = document.createElementNS(SVG_NS, 'path');
      rw.setAttribute('d', 'M20,18 C24,10 32,2 39,5');
      rw.setAttribute('fill', 'none');
      rw.setAttribute('stroke', 'rgba(255,255,255,' + opacity + ')');
      rw.setAttribute('stroke-width', '2');
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

    var boatConfigs = [
      { size: rand(40, 55), opacity: 0.16, bottom: rand(15, 25), anim: 'boatRight', dur: rand(90, 120), delay: rand(0, 30) },
      { size: rand(32, 44), opacity: 0.12, bottom: rand(25, 35), anim: 'boatLeft',  dur: rand(110, 140), delay: rand(10, 40) },
      { size: rand(24, 34), opacity: 0.08, bottom: rand(32, 48), anim: 'boatRight', dur: rand(130, 160), delay: rand(20, 50) }
    ];

    for (var i = 0; i < boatConfigs.length; i++) {
      var c = boatConfigs[i];
      var s = c.size;
      var boat = document.createElement('div');
      boat.style.cssText =
        'position:absolute;' +
        'bottom:' + c.bottom + 'px;' +
        'width:' + s + 'px; height:' + s + 'px;' +
        'animation: ' + c.anim + ' ' + c.dur + 's linear infinite;' +
        'animation-delay: -' + c.delay + 's;';

      /* Hull — solid crescent shape */
      var hull = document.createElement('div');
      hull.style.cssText =
        'position:absolute; bottom:0; left:5%; width:90%;' +
        'height:' + (s * 0.25) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.2).toFixed(2) + ');' +
        'border-radius: 0 0 50% 50%;';
      boat.appendChild(hull);

      /* Hull deck line */
      var deck = document.createElement('div');
      deck.style.cssText =
        'position:absolute; bottom:' + (s * 0.2) + 'px; left:0; width:100%;' +
        'height:' + Math.max(2, s * 0.06) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.2).toFixed(2) + ');' +
        'border-radius: 2px;';
      boat.appendChild(deck);

      /* Mast */
      var mast = document.createElement('div');
      mast.style.cssText =
        'position:absolute; bottom:' + (s * 0.2) + 'px; left:48%;' +
        'width:' + Math.max(1, s * 0.04) + 'px; height:' + (s * 0.65) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.0).toFixed(2) + ');';
      boat.appendChild(mast);

      /* Sail — triangle faces the direction of travel */
      var sail = document.createElement('div');
      var sailColor = 'rgba(255,255,255,' + (c.opacity * 0.7).toFixed(2) + ')';
      if (c.anim === 'boatLeft') {
        /* Sail faces left */
        sail.style.cssText =
          'position:absolute; bottom:' + (s * 0.3) + 'px; right:50%;' +
          'width:0; height:0;' +
          'border-right:0 solid transparent;' +
          'border-left:' + (s * 0.4) + 'px solid transparent;' +
          'border-bottom:' + (s * 0.5) + 'px solid ' + sailColor + ';';
      } else {
        /* Sail faces right */
        sail.style.cssText =
          'position:absolute; bottom:' + (s * 0.3) + 'px; left:50%;' +
          'width:0; height:0;' +
          'border-left:0 solid transparent;' +
          'border-right:' + (s * 0.4) + 'px solid transparent;' +
          'border-bottom:' + (s * 0.5) + 'px solid ' + sailColor + ';';
      }
      boat.appendChild(sail);

      container.appendChild(boat);
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
