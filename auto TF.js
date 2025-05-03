(async () => {
  console.log("===== Bắt đầu vòng kiểm tra TF =====");

  let ids = $persistentStore.read("APP_ID");
  if (!ids || ids.trim() === "") {
    console.log("Không có APP_ID nào để xử lý.");
    $done();
    return;
  }

  ids = ids.split(",").filter(id => id);
  console.log("Danh sách APP_ID:", ids);

  for (const ID of ids) {
    console.log(`-- Kiểm tra app: ${ID} --`);
    await autoPost(ID);
  }

  console.log("===== Kết thúc vòng kiểm tra TF =====");
  $done();
})();

function autoPost(ID) {
  let Key = $persistentStore.read("key");
  let session_id = $persistentStore.read("session_id");
  let session_digest = $persistentStore.read("session_digest");
  let request_id = $persistentStore.read("request_id");
  let ua = $persistentStore.read("tf_ua");

  let testurl = `https://testflight.apple.com/v3/accounts/${Key}/ru/${ID}`;
  let headers = {
    "X-Session-Id": session_id,
    "X-Session-Digest": session_digest,
    "X-Request-Id": request_id,
    "User-Agent": ua,
  };

  return new Promise((resolve) => {
    $httpClient.get({ url: testurl, headers: headers }, (err, resp, data) => {
      if (err) {
        console.log(`Lỗi yêu cầu với ${ID}:`, err);
        resolve();
        return;
      }

      try {
        let jsonData = JSON.parse(data);
        if (resp.status === 404) {
          console.log(`${ID} không tồn tại. Xóa khỏi danh sách.`);
          removeAppId(ID);
        } else if (jsonData?.data?.status === "FULL") {
          console.log(`${jsonData.data.app.name} đã đầy.`);
        } else if (jsonData?.data) {
          let acceptUrl = `https://testflight.apple.com/v3/accounts/${Key}/ru/${ID}/accept`;
          $httpClient.post({ url: acceptUrl, headers: headers }, (e2, r2, b2) => {
            if (!e2) {
              let res = JSON.parse(b2);
              console.log(`Tham gia thành công: ${res.data.name}`);
              removeAppId(ID);
              $notification.post("TF Auto Join", `${res.data.name}`, "Tham gia thành công!");
            } else {
              console.log(`Lỗi khi tham gia ${ID}:`, e2);
            }
            resolve();
          });
        } else {
          console.log(`Không rõ dữ liệu từ ${ID}:`, jsonData);
          resolve();
        }
      } catch (e) {
        console.log("Lỗi phân tích JSON:", e);
        resolve();
      }
    });
  });
}

function removeAppId(ID) {
  let ids = $persistentStore.read("APP_ID").split(",");
  ids = ids.filter(item => item !== ID);
  $persistentStore.write(ids.join(","), "APP_ID");
}
