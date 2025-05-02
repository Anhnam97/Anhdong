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
    $httpClient.get({ url: testurl + ID, headers: header }, async (error, resp, data) => {
      if (error || !data) {
        console.error(`GET ${ID} lỗi:`, error);
        return resolve();
      }

      try {
        const jsonData = JSON.parse(data);

        if (!jsonData.data) {
          console.log(`${ID}: Không có data hợp lệ.`);
          return resolve();
        }

        if (jsonData.data.status === "FULL") {
          const appName = jsonData.data.app?.name || ID;
          const message = jsonData.data.message || "TestFlight đã đầy";

          console.log(`FULL - ${appName} (${ID}): ${message}`);
          $notification.post(appName, "TestFlight đầy", message);
          await delay(1000); // tránh spam thông báo
          return resolve();
        }

        // Có thể tham gia
        $httpClient.post({ url: testurl + ID + "/accept", headers: header }, async (error, resp, body) => {
          if (error || !body) {
            console.error(`POST /accept ${ID} lỗi:`, error);
            return resolve();
          }

          try {
            const jsonBody = JSON.parse(body);
            const appName = jsonBody.data?.name || `App (${ID})`;

            console.log(`ĐÃ THAM GIA: ${appName} (${ID})`);
            $notification.post(appName, "Tham gia TestFlight thành công", "");
            await delay(1000); // tránh spam thông báo

            // Xoá khỏi APP_ID
            let currentIds = $persistentStore.read("APP_ID").split(",").map(x => x.trim()).filter(x => x !== ID);
            $persistentStore.write(currentIds.join(","), "APP_ID");
          } catch (e) {
            console.error("Lỗi parse JSON sau khi accept:", e);
            console.log("Body lỗi:", body);
          }

          return resolve();
        });
      } catch (e) {
        console.error("Lỗi parse JSON phản hồi GET:", e);
        console.log("Data:", data);
        return resolve();
      }
    });
  });
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
