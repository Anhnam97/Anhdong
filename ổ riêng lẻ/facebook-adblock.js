// ==UserScript==
// @name         Facebook UI Ad Hider
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ẩn các bài quảng cáo đã lọt qua bộ lọc, đặc biệt là Reels & Stories
// @author       You
// @match        *://*.facebook.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    console.log('Facebook UI Ad Hider is running...');

    // Danh sách các từ khóa tiếng Việt cần tìm và ẩn
    const adKeywordsToHide = [
        'được tài trợ',
        'quảng cáo',
        'sponsored',
        'cài đặt ngay', // Thường xuất hiện trong nút CTA của quảng cáo
        'tải về ngay',
        'tìm hiểu thêm'
    ];

    // Hàm chính để quét và ẩn quảng cáo
    function hideSponsoredPosts() {
        // CÁCH 1: Tìm theo aria-label (phổ biến)
        const adElementsByAriaLabel = document.querySelectorAll('[role="article"]');
        adElementsByAriaLabel.forEach(element => {
            const ariaLabel = element.getAttribute('aria-label') || '';
            const innerText = element.innerText || '';
            const checkText = (ariaLabel + ' ' + innerText).toLowerCase();

            const isAd = adKeywordsToHide.some(keyword => checkText.includes(keyword));
            if (isAd) {
                element.style.display = 'none';
                console.log('Đã ẩn 1 bài viết quảng cáo (qua aria-label/text).');
            }
        });

        // CÁCH 2: Tìm cụ thể trong Reels/Stories
        // Các container có thể chứa Reels
        const reelsContainers = document.querySelectorAll('div[data-pagelet*="Reels"], div[role="feed"] > div > div');
        reelsContainers.forEach(container => {
            const containerText = container.innerText || '';
            if (adKeywordsToHide.some(keyword => containerText.toLowerCase().includes(keyword))) {
                // Thử tìm phần tử cha phù hợp để ẩn
                let parentToHide = container.closest('[role="article"]') || container.closest('div[data-pagelet]') || container;
                parentToHide.style.display = 'none';
                console.log('Đã ẩn 1 Reels/Stories quảng cáo.');
            }
        });

        // CÁCH 3: Tìm các span, div chứa trực tiếp text "Được tài trợ"
        adKeywordsToHide.forEach(keyword => {
            const xpath = `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${keyword}')]`;
            const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < elements.snapshotLength; i++) {
                const adTextElement = elements.snapshotItem(i);
                // Ẩn một vài cấp phần tử cha để chắc chắn
                const articleParent = adTextElement.closest('[role="article"]');
                if (articleParent) {
                    articleParent.style.display = 'none';
                }
            }
        });
    }

    // Chạy lần đầu khi trang tải xong
    setTimeout(hideSponsoredPosts, 3000); // Đợi 3 giây để nội dung tải

    // Theo dõi các thay đổi động của trang (AJAX, cuộn chuột)
    const observer = new MutationObserver(hideSponsoredPosts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cũng có thể chạy định kỳ để "quét lại"
    setInterval(hideSponsoredPosts, 7000);
})();
