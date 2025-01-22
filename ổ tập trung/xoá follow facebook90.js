/*
    Script của JayremntB, 2023
    Hủy theo dõi tất cả người lạ
    Vui lòng sao chép toàn bộ mã để đảm bảo rằng bạn sẽ không gặp bất kỳ lỗi nào
 */

// Bạn có thể thay đổi thời gian trễ bên dưới hoặc không (tính bằng mili giây, 1 s = 1000 ms)
let delayTime = 0;

// Quy trình, xin đừng chỉnh sửa
let _0x45cf = ['Lấy danh sách đang theo dõi...', 'tách', '971355iPZnaO', 'Script của JayremntB, 2021', 'bao gồm', '67nNRkmj', 'chuỗi hóa', '205917EANPRJ', 'gửi', 'điểm cuối trang', 'Lỗi:', 'Hủy theo dõi tất cả người lạ', 'url', 'dữ liệu', '631261jvsInv', 'trạng thái sẵn sàng', '---------------------------', 'bắt lỗi', 'còn lại... (hồ sơ:', '21374TAQUWb', 'đẩy', 'cho mỗi', 'https://www.facebook.com/api/graphql/', '👉 Đã hủy theo dõi', 'khi tải xong', '1CRuZsk', 'Các mục trang', 'GET', 'còn trang tiếp', 'Bắt đầu...', 'thông tin trang', 'WWW_COMET_PROFILE', 'phân tích', 'cookie', 'Bất cứ khi nào bạn muốn tạm dừng thực thi, nhấp vào tab "Sources" và nhấn F8 hoặc Ctrl + \\ trên bàn phím của bạn.', 'Tải thành công. Bắt đầu hủy theo dõi...', '2153QSKAQd', 'ProfileCometAppCollectionListRendererPaginationQuery', '263GjANvl', '🔄 Đã tải', 'trạng thái', 'phản hồi văn bản', 'HỒ SƠ', 'độ dài', 'c_user', 'nút', 'CometUserUnfollowMutation', 'ghi', 'cảnh báo', ':2356318349:33', 'phụ lục', 'sau đó', '308xBHDXp', 'ứng dụng bộ sưu tập:', 'mở', '3477NjCeOO', 'văn bản', 'RelayModern', 'POST', 'chuỗi', '2272607AgqDvT'];
let _0x11b2 = function(_0x39d11a, _0xe5e815) {
    _0x39d11a = _0x39d11a - 0x188;
    let _0x45cfc5 = _0x45cf[_0x39d11a];
    return _0x45cfc5;
};
let _0x472520 = _0x11b2;
(function(_0xe52078, _0x24edd3) {
    let _0x25873a = _0x11b2;
    while (!![]) {
        try {
            let _0x727b9c = parseInt(_0x25873a(0x1b4)) * -parseInt(_0x25873a(0x188)) + -parseInt(_0x25873a(0x1b2)) * -parseInt(_0x25873a(0x1c2)) + parseInt(_0x25873a(0x193)) * parseInt(_0x25873a(0x1a1)) + parseInt(_0x25873a(0x195)) + -parseInt(_0x25873a(0x1a7)) * -parseInt(_0x25873a(0x19c)) + parseInt(_0x25873a(0x190)) + -parseInt(_0x25873a(0x18d));
            if (_0x727b9c === _0x24edd3) break;
            else _0xe52078['push'](_0xe52078['shift']());
        } catch (_0x217478) {
            _0xe52078['push'](_0xe52078['shift']());
        }
    }
}(_0x45cf, 0xaef71));
let fbDtsg = require('DTSGInitialData')['token'],
    uid = document[_0x472520(0x1af)][_0x472520(0x18f)](';')['find'](_0x40c597 => _0x40c597[_0x472520(0x192)](_0x472520(0x1ba)))[_0x472520(0x18f)]('=')[0x1];
(() => {
    let _0x3cbdf2 = _0x472520;
    console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x19e)), console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x191)), console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x199)), console['log'](_0x3cbdf2(0x19e)), console[_0x3cbdf2(0x1be)](_0x3cbdf2(0x1b0)), console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x1ab)), console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x18e));
    let _0x2c4bb4 = [],
        _0x47100a = ![],
        _0x2b92ee = _0x43864d => {
            let _0x34c4f6 = _0x3cbdf2;
            loadFollowList(uid, _0x43864d)[_0x34c4f6(0x1c1)](_0x5825a7 => {
                let _0x491cf4 = _0x34c4f6;
                let _0x40fa7a = _0x5825a7['edges'],
                    _0x4b73d0 = _0x5825a7[_0x491cf4(0x1ac)];
                _0x40fa7a[_0x491cf4(0x1a3)](_0x5ae8fb => {
                    let _0x1ad90c = _0x491cf4;
                    _0x2c4bb4[_0x1ad90c(0x1a2)]({
                        'isPage': ![],
                        'id': _0x5ae8fb[_0x1ad90c(0x1bb)][_0x1ad90c(0x1bb)]['id'],
                        'name': _0x5ae8fb[_0x1ad90c(0x1bb)]['title'][_0x1ad90c(0x189)],
                        'url': _0x5ae8fb[_0x1ad90c(0x1bb)][_0x1ad90c(0x19a)]
                    });
                }), console['log'](_0x491cf4(0x1b5) + _0x2c4bb4[_0x491cf4(0x1b9)] + ' đang theo dõi. Vẫn đang tải...'), _0x4b73d0[_0x491cf4(0x1aa)] ? _0x2b92ee(_0x4b73d0[_0x491cf4(0x197)]) : (console['log'](_0x491cf4(0x1b1)), (async () => {
                    let _0x26047c = _0x491cf4;
                    let _0x13f22b = 0x1;
                    for (let _0x3420df of _0x2c4bb4) {
                        await unfollowNotFriend(_0x3420df['id']), console[_0x26047c(0x1bd)](_0x26047c(0x1a5) + _0x3420df['name'] + '. ' + (_0x2c4bb4['length'] - _0x13f22b) + _0x26047c(0x1a0) + _0x3420df[_0x26047c(0x19a)] + ')'), _0x13f22b++, await new Promise(_0x4ae519 => {
                            setTimeout(_0x4ae519, delayTime);
                        });
                    }
                    console['log']('👌 ĐÃ XONG!');
                })());
            });
        };
    _0x2b92ee('');
})();

function loadFollowList(_0x451873, _0x583304 = '', _0x4f0425 = 0x8) {
    return new Promise((_0x19457e, _0x17a763) => {
        let _0x40fe68 = _0x11b2;
        request(_0x40fe68(0x18b), _0x40fe68(0x1a4), {
            'fb_api [A](https://github.com/nguyenducde/Scripts-Manipulating-Facebook/tree/90e570b7dd05909a080ad4b35a813842d227426c/Unflow%20Friend%2Funflow%20friend.js?copilot_analytics_metadata=eyJldmVudEluZm9fY2xpY2tEZXN0aW5hdGlvbiI6Imh0dHBzOlwvXC9naXRodWIuY29tXC9uZ3V5ZW5kdWNkZVwvU2NyaXB0cy1NYW5pcHVsYXRpbmctRmFjZWJvb2tcL3RyZWVcLzkwZTU3MGI3ZGQwNTkwOWEwODBhZDRiMzVhODEzODQyZDIyNzQyNmNcL1VuZmxvdyUyMEZyaWVuZCUyRnVuZmxvdyUyMGZyaWVuZC5qcyIsImV2ZW50SW5mb19tZXNzYWdlSWQiOiJpVlQ2N2ZhalFWc2JpTDl0UW5KWUEiLCJldmVudEluZm9fY2xpY2tTb3VyY2UiOiJjaXRhdGlvbkxpbmsiLCJldmVudEluZm9fY29udmVyc2F0aW9uSWQiOiJ3WkJ4cDJYY3hBWTd1YUFuaDU3RkcifQ%3D%3D&citationMarker=9F742443-6C92-4C44-BF58-8F5A7C53B6F1)