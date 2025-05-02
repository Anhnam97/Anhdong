!(async () => {
  while (true) {
    try {
      console.log("===== Bắt đầu vòng lặp mới =====");
      let ids = $persistentStore.read("APP_ID");
      if (!ids || ids.trim() === "") {
        console.log("Không có APP_ID nào trong danh sách.");
        break;
      }

      ids = ids.split(",").map(id => id.trim()).filter(Boolean);
      console.log("Danh sách APP_ID hiện tại:", ids);

      for (const ID of ids) {
        console.log(`-- Kiểm tra app: ${ID} --`);
        await autoPost(ID);
      }

      console.log("===== Hoàn tất vòng lặp. Đợi 15 giây... =====\n");
      await delay(15000);
    } catch (e) {
      console.error("Lỗi trong vòng lặp chính:", e);
      await delay(15000);
    }
  }

  $done();
})();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function autoPost(ID) {
  const key = $persistentStore.read("key");
  const session_id = $persistentStore.read("session_id");
  const session_digest = $persistentStore.read("session_digest");
  const request_id = $persistentStore.read("request_id");
  const tf_ua = $persistentStore.read("tf_ua");

  const testurl = `https://testflight.apple.com/v3/accounts/${key}/ru/${ID}`;
  const headers = {
    "X-Session-Id": session_id,
    "X-Session-Digest": session_digest,
    "X-Request-Id": request_id,
    "User-Agent": tf_ua,
  };

  return new Promise(resolve => {
    $httpClient.get({ url: testurl, headers: headers }, function (err, resp, data) {
      if (err) {
        console.error(`--> LỖI khi gửi GET ${ID}:`, err);
        $notification.post("Lỗi GET", `APP: ${ID}`, err);
        return resolve();
      }

      if (!data || data.trim() === "") {
        console.error(`--> PHẢN HỒI RỖNG từ ${ID}`);
        $notification.post(ID, "Phản hồi rỗng từ server", "");
        return resolve();
      }

      if (data.includes("<html")) {
        console.error(`--> PHẢN HỒI HTML lỗi từ ${ID}:\n`, data);
        $notification.post(ID, "Phản hồi HTML lỗi", "Có thể sai session_id hoặc key");
        return resolve();
      }

      try {
        const json = JSON.parse(data);
        if (!json.data) {
          console.log(`--> ${ID}: Không có dữ liệu hợp lệ.`);
          return resolve();
        }

        const status = json.data.status;
        const appName = json.data.app?.name || ID;

        if (status === "FULL") {
          console.log(`--> ${appName} (${ID}): App đã đầy`);
          $notification.post(appName, "TestFlight đầy", json.data.message || "App đã đầy");
          return resolve();
        }

        // Nếu chưa tham gia, gửi POST để tham gia
        const acceptUrl = testurl + "/accept";
        $httpClient.post({ url: acceptUrl, headers: headers }, function (err2, resp2, body2) {
          if (err2) {
            console.error(`--> LỖI POST ${ID}:`, err2);
            $notification.post(appName, "Lỗi khi tham gia TestFlight", err2);
            return resolve();
          }

          try {
            const result = JSON.parse(body2);
            console.log(`--> ${appName} (${ID}): Tham gia thành công`);
            $notification.post(appName, "Tham gia TestFlight thành công", "");

            // Xoá ID khỏi danh sách
            let idList = $persistentStore.read("APP_ID").split(",").map(i => i.trim());
            idList = idList.filter(i => i !== ID);
            $persistentStore.write(idList.join(","), "APP_ID");
            return resolve();
          } catch (e) {
            console.error(`--> LỖI PARSE JSON khi tham gia ${ID}:`, e);
            return resolve();
          }
        });
      } catch (e) {
        console.error(`--> LỖI PARSE JSON khi xử lý GET ${ID}:`, e);
        console.log("Phản hồi thô:", data);
        $notification.post(ID, "Lỗi phân tích JSON", "");
        return resolve();
      }
    });
  });
}
