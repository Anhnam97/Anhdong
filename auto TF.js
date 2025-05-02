!(async () => {
  while (true) {
    try {
      console.log("===== Bắt đầu vòng lặp mới =====");
      let ids = $persistentStore.read("APP_ID");

      if (!ids || ids.trim() === "") {
        console.log("Không còn APP_ID nào để xử lý.");
        $notification.post("TestFlight Script", "Không có APP_ID nào", "");
      } else {
        let idList = ids.split(",").map(x => x.trim()).filter(Boolean);
        console.log("Danh sách APP_ID hiện tại:", idList);

        await Promise.all(idList.map(ID => autoPost(ID))); // xử lý song song
      }

      console.log("===== Hoàn tất vòng lặp. Đợi 15 giây... =====");
      await delay(15000);
    } catch (err) {
      console.error("Lỗi toàn cục:", err);
    }
  }
})();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function autoPost(ID) {
  let Key = $persistentStore.read("key");
  let testurl = `https://testflight.apple.com/v3/accounts/${Key}/ru/`;
  let header = {
    "X-Session-Id": $persistentStore.read("session_id"),
    "X-Session-Digest": $persistentStore.read("session_digest"),
    "X-Request-Id": $persistentStore.read("request_id"),
    "User-Agent": $persistentStore.read("tf_ua"),
  };

  return new Promise(resolve => {
    console.log(`-- Kiểm tra app: ${ID} --`);
    $httpClient.get({ url: testurl + ID, headers: header }, async (error, resp, data) => {
      if (error || !data) {
        console.error(`Lỗi GET ${ID}:`, error);
        return resolve();
      }

      console.log(`Phản hồi GET từ ${ID}:`, data);

      try {
        const jsonData = JSON.parse(data);

        if (!jsonData.data) {
          const msg = jsonData.messages?.[0]?.message || "Không có dữ liệu hợp lệ.";
          console.log(`${ID}: ${msg}`);
          return resolve();
        }

        if (jsonData.data.status === "FULL") {
          const appName = jsonData.data.app?.name || ID;
          const message = jsonData.data.message || "TestFlight đầy";
          console.log(`APP ĐẦY: ${appName} (${ID}) - ${message}`);
          $notification.post(appName, "TestFlight đầy", message);
          return resolve();
        }

        // Nếu app chưa đầy → cố gắng tham gia
        $httpClient.post({ url: testurl + ID + "/accept", headers: header }, async (error, resp, body) => {
          if (error || !body) {
            console.error(`Lỗi POST /accept ${ID}:`, error);
            return resolve();
          }

          console.log(`Phản hồi POST /accept ${ID}:`, body);

          try {
            const jsonBody = JSON.parse(body);
            const appName = jsonBody.data?.name || `App ${ID}`;

            console.log(`THAM GIA THÀNH CÔNG: ${appName} (${ID})`);
            $notification.post(appName, "Đã tham gia TestFlight", "");

            // Cập nhật lại APP_ID (xóa app đã join thành công)
            let currentIds = $persistentStore.read("APP_ID").split(",").map(x => x.trim()).filter(x => x !== ID);
            $persistentStore.write(currentIds.join(","), "APP_ID");
          } catch (e) {
            console.error("Lỗi phân tích JSON sau khi accept:", e);
            console.log("Body không hợp lệ:", body);
          }

          return resolve();
        });

      } catch (e) {
        console.error(`Lỗi phân tích JSON từ GET ${ID}:`, e);
        console.log("Phản hồi thô:", data);
        return resolve();
      }
    });
  });
}
