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
      var size = rand(28, 48);
      var opacity = (0.3 + Math.random() * 0.2).toFixed(2);
      var flapSpeed = (0.8 + Math.random() * 0.6).toFixed(2);

      /* Bird wrapper — starts off-screen left, scattered vertically within flock */
      var bird = document.createElement('div');
      var offsetX = rand(-3, 3);
      var delayOffset = rand(0, 5);
      bird.style.cssText =
        'position:absolute;' +
        'left:0;' +
        'top:' + (baseTop + rand(-10, 10)) + '%;' +
        'margin-left:' + (offsetX * size) + 'px;' +
        'width:' + size + 'px; height:' + size + 'px;' +
        'animation: birdFly ' + dur + 's linear infinite;' +
        'animation-delay: -' + delayOffset + 's;';

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
      lw.setAttribute('stroke-width', '2.5');
      lw.setAttribute('stroke-linecap', 'round');
      lw.style.cssText = 'transform-origin: 20px 18px; animation: wingFlap ' + flapSpeed + 's ease-in-out infinite; --wing-up: 8deg; --wing-down: -12deg;';
      svg.appendChild(lw);

      /* Right wing stroke */
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

    var boatConfigs = [
      { size: rand(60, 80), opacity: 0.25, bottom: rand(10, 20), anim: 'boatRight', dur: rand(90, 120), delay: rand(0, 30) },
      { size: rand(45, 65), opacity: 0.20, bottom: rand(18, 30), anim: 'boatLeft',  dur: rand(110, 140), delay: rand(10, 40) },
      { size: rand(35, 50), opacity: 0.15, bottom: rand(25, 40), anim: 'boatRight', dur: rand(130, 160), delay: rand(20, 50) }
    ];

    for (var i = 0; i < boatConfigs.length; i++) {
      var c = boatConfigs[i];
      var s = c.size;
      var waterline = s * 0.15; /* how deep the hull sits in water */

      var boat = document.createElement('div');
      boat.style.cssText =
        'position:absolute;' +
        'bottom:' + c.bottom + 'px;' +
        'width:' + s + 'px; height:' + (s * 1.3) + 'px;' +
        'background: #1d3557;' +
        'z-index:' + (3 - i) + ';' +
        'animation: ' + c.anim + ' ' + c.dur + 's linear infinite;' +
        'animation-delay: -' + c.delay + 's;';

      /* Upper boat (above water) — clipped at waterline */
      var upper = document.createElement('div');
      upper.style.cssText =
        'position:absolute; bottom:' + waterline + 'px; left:0; width:100%; height:' + s + 'px;';

      /* Hull visible part above water */
      var hull = document.createElement('div');
      hull.style.cssText =
        'position:absolute; bottom:0; left:5%; width:90%;' +
        'height:' + (s * 0.18) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.2).toFixed(2) + ');' +
        'border-radius: 0 0 40% 40%;';
      upper.appendChild(hull);

      /* Deck line */
      var deck = document.createElement('div');
      deck.style.cssText =
        'position:absolute; bottom:' + (s * 0.15) + 'px; left:0; width:100%;' +
        'height:' + Math.max(2, s * 0.06) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.2).toFixed(2) + ');' +
        'border-radius: 2px;';
      upper.appendChild(deck);

      /* Mast */
      var mast = document.createElement('div');
      mast.style.cssText =
        'position:absolute; bottom:' + (s * 0.15) + 'px; left:48%;' +
        'width:' + Math.max(1, s * 0.04) + 'px; height:' + (s * 0.65) + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 1.0).toFixed(2) + ');';
      upper.appendChild(mast);

      /* Sail */
      var sail = document.createElement('div');
      var sailColor = 'rgba(255,255,255,' + (c.opacity * 0.7).toFixed(2) + ')';
      if (c.anim === 'boatLeft') {
        sail.style.cssText =
          'position:absolute; bottom:' + (s * 0.25) + 'px; right:50%;' +
          'width:0; height:0;' +
          'border-right:0 solid transparent;' +
          'border-left:' + (s * 0.4) + 'px solid transparent;' +
          'border-bottom:' + (s * 0.5) + 'px solid ' + sailColor + ';';
      } else {
        sail.style.cssText =
          'position:absolute; bottom:' + (s * 0.25) + 'px; left:50%;' +
          'width:0; height:0;' +
          'border-left:0 solid transparent;' +
          'border-right:' + (s * 0.4) + 'px solid transparent;' +
          'border-bottom:' + (s * 0.5) + 'px solid ' + sailColor + ';';
      }
      upper.appendChild(sail);
      boat.appendChild(upper);

      /* Reflection below waterline — faint, flipped */
      var reflection = document.createElement('div');
      reflection.style.cssText =
        'position:absolute; bottom:0; left:5%; width:90%;' +
        'height:' + waterline + 'px;' +
        'background: rgba(255,255,255,' + (c.opacity * 0.3).toFixed(2) + ');' +
        'border-radius: 40% 40% 0 0;' +
        'filter: blur(1px);';
      boat.appendChild(reflection);

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
