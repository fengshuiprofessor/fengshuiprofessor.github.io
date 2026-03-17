/* Birthday → Heavenly Stem / Five Elements Calculator
   Ported from original Weebly site.
   Reference date: 2017-02-06 (甲子日)
   Algorithm: Calculate days difference, then use mod arithmetic
   to determine Heavenly Stem (天干) and Five Element (五行).
*/
(function () {
  'use strict';

  var tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var dizhi   = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var wuxing  = ['木', '火', '土', '金', '水'];
  var yinyang = ['陽', '陰'];

  var REFERENCE_DATE = new Date(2017, 1, 6); // 2017-02-06

  function parseDate(str) {
    var parts = str.split('-');
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return new Date(y, m - 1, d);
  }

  function dayDiff(a, b) {
    var msPerDay = 86400000;
    var utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utcB - utcA) / msPerDay);
  }

  function calculate(birthdayStr) {
    var bday = parseDate(birthdayStr);
    if (!bday) return null;

    var days = dayDiff(REFERENCE_DATE, bday);

    var tgIndex = ((days % 10) + 10) % 10;
    var dzIndex = ((days % 12) + 12) % 12;
    var wxIndex = (tgIndex - tgIndex % 2) / 2;
    var yyIndex = tgIndex % 2;

    return {
      gan: tiangan[tgIndex],
      zhi: dizhi[dzIndex],
      xing: wuxing[wxIndex],
      yy: yinyang[yyIndex],
      wxIndex: wxIndex
    };
  }

  function showResult(result) {
    var resultBox = document.getElementById('resultBox');
    var ganEl = document.getElementById('resultGan');
    var xingEl = document.getElementById('resultXing');
    var descEls = document.querySelectorAll('.wuxing-desc');

    resultBox.classList.add('active');
    ganEl.textContent = result.gan;
    xingEl.textContent = result.yy + result.xing;

    descEls.forEach(function (el) { el.style.display = 'none'; });
    var activeDesc = document.getElementById('wuxing-' + result.wxIndex);
    if (activeDesc) activeDesc.style.display = 'block';
  }

  function clearResult() {
    var resultBox = document.getElementById('resultBox');
    resultBox.classList.remove('active');
    var descEls = document.querySelectorAll('.wuxing-desc');
    descEls.forEach(function (el) { el.style.display = 'none'; });
  }

  /* Bind events after DOM ready */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('bdayForm');
    var input = document.getElementById('bdayInput');
    var btn = document.getElementById('calcBtn');
    var errEl = document.getElementById('inputError');

    if (!form || !input || !btn) return;

    function doCalc() {
      errEl.textContent = '';
      var val = input.value.trim();
      if (!val) {
        errEl.textContent = '請輸入您的出生日期';
        return;
      }
      var result = calculate(val);
      if (!result) {
        errEl.textContent = '日期格式不正確，請使用 yyyy-mm-dd 格式';
        return;
      }
      showResult(result);
    }

    btn.addEventListener('click', doCalc);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      doCalc();
    });
    input.addEventListener('input', function () {
      clearResult();
      errEl.textContent = '';
    });
  });
})();
