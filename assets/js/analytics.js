/* Analytics — GA4 + Facebook Pixel */
(function () {
  'use strict';

  /* --- Google Analytics 4 --- */
  /* TODO: Replace G-XXXXXXX with actual GA4 Measurement ID */
  /* The old UA-7870337-1 is deprecated Universal Analytics */
  var GA4_ID = 'G-XXXXXXX';

  if (GA4_ID !== 'G-XXXXXXX') {
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(gs);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  /* --- Facebook Pixel --- */
  var FB_PIXEL_ID = '1665265157049102';

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = [];
    t = b.createElement(e); t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
})();
