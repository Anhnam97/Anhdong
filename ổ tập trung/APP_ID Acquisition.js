/*
Tác giả script: DecoAri
Tác giả sửa lỗi: GGcover
Tham khảo: https://raw.githubusercontent.com/nhutggvn/Config-VPN/main/js/TF_keys.js
Hướng dẫn sử dụng cụ thể:
1: Nhập plugin.
2: Bật Mitm qua HTTP2 trên trang Mitm.
3: Khởi động VPN, vào ứng dụng TestFlight, và hiển thị thông báo thông tin đã được lấy thành công.
4: Vào Cấu hình -> Dữ liệu Bền vững -> Nhập Dữ liệu Cụ thể. Điền key là "APP_ID" và value là ID của TF mà bạn muốn tham gia. (ID là chuỗi sau "join" trong liên kết https://testflight.apple.com/join/LPQmtkUs, ví dụ, "LPQmtkUs"). ⚠️: Hỗ trợ số lượng liên kết TF không giới hạn, mỗi liên kết cần được phân cách bằng dấu phẩy (chẳng hạn: LPQmtkUs, Hgun65jg, 8yhJgv)
*/

const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/(.*)/;

if (reg1.test($request.url)) {
    $persistentStore.write(null, 'request_id');
    let url = $request.url;
    let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2');
    let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id'];
    let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest'];
    let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id'];
    let ua = $request.headers['User-Agent'] || $request.headers['user-agent'];

    $persistentStore.write(key, 'key');
    $persistentStore.write(session_id, 'session_id');
    $persistentStore.write(session_digest, 'session_digest');
    $persistentStore.write(request_id, 'request_id');
    $persistentStore.write(ua, 'tf_ua');

    console.log($request.headers);

    if ($persistentStore.read('request_id') !== null) {
        $notification.post('Lấy thông tin TF', 'Lấy thông tin thành công. Vui lòng đóng script!', '');
    } else {
        $notification.post('Lấy thông tin TF', 'Lấy thông tin thất bại. Vui lòng bật Mitm qua HTTP2, và khởi động lại VPN và ứng dụng TestFlight!', '');
    }

    $done({});
}

if (reg2.test($request.url)) {
    let appId = $persistentStore.read("APP_ID");
    if (!appId) {
        appId = "";
    }
    let arr = appId.split(",");
    const id = reg2.exec($request.url)[1];
    arr.push(id);
    arr = unique(arr).filter((a) => a);
    if (arr.length > 0) {
        appId = arr.join(",");
    }
    $persistentStore.write(appId, "APP_ID");
    $notification.post("Tự động tham gia TestFlight", `APP_ID đã được thêm: ${id}`, `Danh sách APP_ID: ${appId}`);
    $done({});
}

function unique(arr) {
    return Array.from(new Set(arr));
}

function handleResponse(error, resp, data) {
    if (error) {
        $notification.post("Lỗi yêu cầu", `Lỗi: ${error}`, '');
        console.log(`Lỗi: ${error}`);
        return;
    }

    if (resp.status !== 200) {
        $notification.post("Lỗi yêu cầu", `Mã trạng thái: ${resp.status}`, '');
        console.log(`Mã trạng thái: ${resp.status}`);
        return;
    }

    // Kiểm tra xem phản hồi có phải là HTML không
    if (data.startsWith('<')) {
        $notification.post("Lỗi phản hồi", "Dữ liệu nhận được là HTML, không phải JSON.", '');
        console.log("Dữ liệu nhận được là HTML:", data);
        return;
    }

    try {
        let jsonData = JSON.parse(data);
        console.log("Dữ liệu JSON nhận được:", jsonData);
    } catch (e) {
        $notification.post("Lỗi phân tích JSON", "Dữ liệu nhận được không phải là JSON.", '');
        console.log("Lỗi phân tích JSON:", e);
    }
}
