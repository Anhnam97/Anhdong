// ==UserScript==
// @name         AdBlock Stronger
// @namespace    anhdong
// @version      1.2
// @description  Mạnh tay xóa quảng cáo WebView, popup, iframe, sponsored...
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function removeAds() {
        const adSelectors = [
            'iframe[src*="ads"]',
            'iframe[src*="doubleclick"]',
            '[class*="ads"]',
            '[id*="ads"]',
            '[class*="banner"]',
            '[id*="banner"]',
            '[class*="popup"]',
            '[id*="popup"]',
            '[class*="sponsored"]',
            '[id*="sponsored"]',
            '[aria-label*="Quảng cáo"]',
            '[aria-label*="Sponsored"]',
            '[data-testid="placementTracking"]',
            '[data-pagelet*="FeedUnit_"]'
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Facebook: Xóa "Được tài trợ"
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.includes('Được tài trợ')) {
                const adEl = node.parentElement?.closest('[data-pagelet]');
                if (adEl) adEl.remove();
            }
        }
    }

    function startBlocking() {
        removeAds();
        const observer = new MutationObserver(removeAds);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startBlocking();
    } else {
        window.addEventListener('DOMContentLoaded', startBlocking);
    }
})();
