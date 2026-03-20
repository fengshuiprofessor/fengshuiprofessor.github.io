/* Scroll-triggered animations using IntersectionObserver */
(function () {
  'use strict';

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
