// ==UserScript==
// @name         PhimMoi Popup Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động đóng popup, chặn quảng cáo mở tab trên phimmoi.sale
// @match        *://phimmoi.sale/*
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // Vô hiệu hóa window.open (mở tab mới)
  window.open = function() {
    console.log('[Popup Blocked] window.open bị chặn');
    return null;
  };

  // Tự động đóng các iframe hoặc popup thường gặp
  const observer = new MutationObserver(() => {
    document.querySelectorAll('iframe, .adsbox, .popup, [id^="ad"], [class*="ads"]').forEach(el => {
      el.remove();
      console.log('[Ad Removed]', el);
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Ngăn click mở quảng cáo
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && target.href && /ad|qc|click|popup/i.test(target.href)) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Blocked click to ad link]:', target.href);
    }
  }, true);
})();
