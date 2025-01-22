/*
Mã nguồn bởi JayremntB, 2023
Hủy theo dõi tất cả người lạ
Vui lòng sao chép toàn bộ mã để đảm bảo không gặp lỗi
*/

// Bạn có thể thay đổi thời gian trễ bên dưới (tính bằng mili giây, 1 giây = 1000 mili giây)
let thoiGianTre = 0;

// Quá trình, vui lòng không thay đổi
let _0x45cf = [
  'Lấy danh sách đang theo dõi...',
  'split',
  '971355iPZnaO',
  'Mã nguồn bởi JayremntB, 2021',
  'includes',
  '67nNRkmj',
  'stringify',
  '205917EANPRJ',
  'send',
  'end_cursor',
  'Lỗi: ',
  'Hủy theo dõi tất cả người lạ',
  'url',
  'data',
  '631261jvsInv',
  'readyState',
  '---------------------------',
  'catch',
  ' còn lại... (hồ sơ: ',
  '21374TAQUWb',
  'push',
  'forEach',
  'https://www.facebook.com/api/graphql/',
  '👉 Đã hủy theo dõi ',
  'onreadystatechange',
  '1CRuZsk',
  'pageItems',
  'GET',
  'has_next_page',
  'Bắt đầu...',
  'page_info',
  'WWW_COMET_PROFILE',
  'parse',
  'cookie',
  'Khi bạn muốn tạm dừng thực thi, hãy nhấn tab "Sources" và nhấn F8 hoặc Ctrl + \ trên bàn phím.',
  'Tải thành công. Bắt đầu hủy theo dõi...',
  '2153QSKAQd',
  'ProfileCometAppCollectionListRendererPaginationQuery',
  '263GjANvl',
  '🔄 Đã tải ',
  'status',
  'responseText',
  'PROFILE',
  'length',
  'c_user',
  'node',
  'CometUserUnfollowMutation',
  'log',
  'warn',
  ':2356318349:33',
  'append',
  'then',
  '308xBHDXp',
  'app_collection:',
  'open',
  '3477NjCeOO',
  'text',
  'RelayModern',
  'POST',
  'string',
  '2272607AgqDvT'
];
let _0x11b2 = function (_0x39d11a, _0xe5e815) {
  _0x39d11a = _0x39d11a - 0x188;
  let _0x45cfc5 = _0x45cf[_0x39d11a];
  return _0x45cfc5;
};
let _0x472520 = _0x11b2;
(function (_0xe52078, _0x24edd3) {
  let _0x25873a = _0x11b2;
  while (!![]) {
    try {
      let _0x727b9c =
        parseInt(_0x25873a(0x1b4)) * -parseInt(_0x25873a(0x188)) +
        -parseInt(_0x25873a(0x1b2)) * -parseInt(_0x25873a(0x1c2)) +
        parseInt(_0x25873a(0x193)) * parseInt(_0x25873a(0x1a1)) +
        parseInt(_0x25873a(0x195)) +
        -parseInt(_0x25873a(0x1a7)) * -parseInt(_0x25873a(0x19c)) +
        parseInt(_0x25873a(0x190)) +
        -parseInt(_0x25873a(0x18d));
      if (_0x727b9c === _0x24edd3) break;
      else _0xe52078["push"](_0xe52078["shift"]());
    } catch (_0x217478) {
      _0xe52078["push"](_0xe52078["shift"]());
    }
  }
})(_0x45cf, 0xaef71);

let fbDtsg = require("DTSGInitialData")["token"],
  uid = document[_0x472520(0x1af)]
    [_0x472520(0x18f)](";")
    ["find"]((_0x40c597) =>
      _0x40c597[_0x472520(0x192)](_0x472520(0x1ba))
    )[_0x472520(0x18f)]("=")[0x1];

(() => {
  let _0x3cbdf2 = _0x472520;
  console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x19e)),
    console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x191)),
    console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x199)),
    console["log"](_0x3cbdf2(0x19e)),
    console[_0x3cbdf2(0x1be)](_0x3cbdf2(0x1b0)),
    console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x1ab)),
    console[_0x3cbdf2(0x1bd)](_0x3cbdf2(0x18e));
  let _0x2c4bb4 = [],
    _0x47100a = ![],
    _0x2b92ee = (_0x43864d) => {
      let _0x34c4f6 = _0x3cbdf2;
      loadFollowList(uid, _0x43864d)
        [_0x34c4f6(0x1c1)]((_0x5825a7) => {
          let _0x491cf4 = _0x34c4f6;
          let _0x40fa7a = _0x5825a7["edges"],
            _0x4b73d0 = _0x5825a7[_0x491cf4(0x1ac)];
          _0x40fa7a[_0x491cf4(0x1a3)]((_0x5ae8fb) => {
            let _0x1ad90c = _0x491cf4;
            _0x2c4bb4[_0x1ad90c(0x1a2)]({
              isPage: ![],
              id: _0x5ae8fb[_0x1ad90c(0x1bb)][_0x1ad90c(0x1bb)]["id"],
              name: _0x5ae8fb[_0x1ad90c(0x1bb)]["title"][_0x1ad90c(0x189)],
              url: _0x5ae8fb[_0x1ad90c(0x1bb)][_0x1ad90c(0x19a)],
            });
          }),
            console["log"](
              _0x491cf4(0x1b5) +
                _0x2c4bb4[_0x491cf4(0x1b9)] +
                " đang theo dõi. Vẫn đang tải..."
            ),
            _0x4b73d0[_0x491cf4(0x1aa)]
              ? _0x2b92ee(_0x4b73d0[_0x491cf4(0x197)])
              : (console["log"](_0x491cf4(0x1b1)),
                (async () => {
                  let _0x26047c = _0x491cf4;
                  let _0x13f22b = 0x1;
                  for (let _0x3420df of _0x2c4bb4) {
                    await unfollowNotFriend(_0x3420df["id"]),
                      console[_0x26047c(0x1bd)](
                        _0x26047c(0x1a5) +
                          _0x3420df["name"] +
                          ". " +
                          (_0x2c4bb4["length"] - _0x13f22b) +
                          _0x26047c(0x1a0) +
                          _0x3420df[_0x26047c(0x19a)] +
                          ")"
                      ),
                      _0x13f22b++,
                      await new Promise((_0x4ae519) => {
                        setTimeout(_0x4ae519, thoiGianTre);
                      });
                  }
                  console["log"]("👌 XONG!");
                })());
        });
    };
  _0x2b92ee("");
})();

function loadFollowList(_0x451873, _0x583304 = "", _0x4f0425 = 0x8) {
  return new Promise((_0x19457e, _0x17a763) => {
    let _0x40fe68 = _0x11b2;
    request(_0x40fe68(0x18b), _0x40fe68(0x1a4), {
      fb_api_caller_class: _0x40fe68(0x18a),
      fb_api_req_friendly_name: _0x40fe68(0x1b3),
      variables: {
        count: _0x4f0425,
        cursor: _0x583304,
        scale: 0x1,
        search: null,
        id: btoa(_0x40fe68(0x1c3) + _0x451873 + _0x40fe68(0x1bf)),
      },
      doc_id: 0xd898ee14f2da4,
      fb_dtsg: fbDtsg,
    })
      [_0x40fe68(0x1c1)]((_0x33ed53) => {
        let _0x4458da = _0x40fe68;
        try {
          let _0x316b91 = JSON[_0x4458da(0x1ae)](_0x33ed53)[_0x4458da(0x19b)];
          _0x19457e(_0x316b91[_0x4458da(0x1bb)][_0x4458da(0x1a8)]);
        } catch (_0x34ecda) {
          _0x17a763(_0x34ecda);
        }
      })
      [_0x40fe68(0x19f)](_0x17a763);
  });
}

function unfollowNotFriend(_0x1d3f08) {
  return new Promise((_0x5b25c4, _0x40b7f7) => {
    let _0x1866a3 = _0x11b2;
    request("POST", "https://www.facebook.com/api/graphql/", {
      fb_dtsg: fbDtsg,
      fb_api_caller_class: _0x1866a3(0x18a),
      fb_api_req_friendly_name: _0x1866a3(0x1bc),
      variables: {
        action_render_location: _0x1866a3(0x1ad),
        input: {
          subscribe_location: _0x1866a3(0x1b8),
          unsubscribee_id: _0x1d3f08,
          actor_id: uid,
          client_mutation_id: "7",
        },
        scale: 0x1,
      },
      doc_id: 0xd1a57d1fa7da0,
    })
      [_0x1866a3(0x1c1)](_0x5b25c4)
      [_0x1866a3(0x19f)](_0x40b7f7);
  });
}

function request(_0x25a5ba, _0x460347, _0x4486f3) {
  let _0x110c54 = _0x472520;
  let _0x55c877 = new FormData();
  if (_0x25a5ba === "POST")
    for (let _0x171cef in _0x4486f3) {
      _0x55c877[_0x110c54(0x1c0)](
        _0x171cef,
        typeof _0x4486f3[_0x171cef] === _0x110c54(0x18c)
          ? _0x4486f3[_0x171cef]
          : JSON[_0x110c54(0x194)](_0x4486f3[_0x171cef])
      );
    }
  else {
    if (_0x25a5ba === _0x110c54(0x1a9) && typeof _0x4486f3 !== "undefined") {
      _0x460347 += "?";
      for (let _0x395ab7 in _0x4486f3) {
        _0x460347 += _0x395ab7 + "=" + encodeURI(_0x4486f3[_0x395ab7]) + "&";
      }
    }
  }
  return new Promise((_0x37f7e6, _0x23519f) => {
    let _0x3dbfc6 = _0x110c54,
      _0x411223 = new XMLHttpRequest();
    _0x411223["responseType"] = _0x3dbfc6(0x189);
    try {
      _0x411223[_0x3dbfc6(0x1c4)](_0x25a5ba, _0x460347),
        _0x411223[_0x3dbfc6(0x196)](_0x55c877),
        (_0x411223[_0x3dbfc6(0x1a6)] = function () {
          let _0x48a9f9 = _0x3dbfc6;
          if (_0x411223[_0x48a9f9(0x19d)] === 0x4) {
            if (_0x411223[_0x48a9f9(0x1b6)] !== 0xc8)
              _0x23519f(_0x48a9f9(0x198) + _0x411223