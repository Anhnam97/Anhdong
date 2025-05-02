!(async () => {
  while (true) {
    try {
      console.log("Bắt đầu script...");
      let ids = $persistentStore.read("APP_ID");
      if (!ids) {
        console.log("Không tìm thấy APP_ID hoặc danh sách trống");
        $notification.post("Không có APP_ID", "Vui lòng thêm thủ công hoặc quét link TestFlight", "");
        await delay(60000);
        continue;
      }

      let idList = ids.split(",").map(x => x.trim()).filter(x => x !== "");

      if (idList.length === 0) {
        console.log("Danh sách APP_ID rỗng");
        await delay(60000);
        continue;
      }

      console.log("Danh sách APP_ID hiện tại:", idList);

      for await (const ID of idList) {
        if (ID) {
          console.log("Đang xử lý ID:", ID);
          await autoPost(ID);
        }
      }

      console.log("Hoàn tất vòng lặp. Đợi 60 giây...");
      await delay(60000);

    } catch (error) {
      console.error("Lỗi trong script:", error);
      await delay(60000);
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
    $httpClient.get({ url: testurl + ID, headers: header }, (error, resp, data) => {
      if (error) {
        console.error("Lỗi HTTP:", error);
        return resolve();
      }

      if (resp.status === 404) {
        console.log(`${ID} không tồn tại, bỏ qua`);
        return resolve();
      }

      try {
        const jsonData = JSON.parse(data);
        const status = jsonData?.data?.status || "";
        const appName = jsonData?.data?.app?.name || ID;
        const message = jsonData?.data?.message || "Không rõ thông báo";

        if (!jsonData.data) {
          console.log(`${ID}: Không có dữ liệu`);
          return resolve();
        }

        if (status === "FULL") {
          console.log(`${appName} (${ID}) đã đầy slot: ${message}`);
          $notification.post(appName, "TestFlight đầy", message);
          return resolve(); // KHÔNG xoá ID khỏi danh sách
        }

        // Nếu còn slot => tham gia
        $httpClient.post({ url: testurl + ID + "/accept", headers: header }, (error, resp, body) => {
          if (error) {
            console.error(`Lỗi khi tham gia ${ID}:`, error);
            return resolve();
          }

          try {
            const jsonBody = JSON.parse(body);
            const joinedAppName = jsonBody?.data?.name || ID;

            $notification.post(joinedAppName, "Tham gia TestFlight thành công", "");
            console.log(`${joinedAppName} (${ID}) tham gia thành công`);

            // Xoá khỏi APP_ID sau khi thành công
            let currentIds = $persistentStore.read("APP_ID").split(",").map(x => x.trim()).filter(x => x !== "");
            currentIds = currentIds.filter(x => x !== ID);
            $persistentStore.write(currentIds.join(","), "APP_ID");

          } catch (e) {
            console.error("Lỗi khi phân tích JSON tham gia:", e);
            console.log("Dữ liệu lỗi body:", body || "Không có dữ liệu");
          }

          return resolve();
        });

      } catch (e) {
        console.error("Lỗi khi phân tích JSON phản hồi:", e);
        console.log("ID gây lỗi:", ID);
        console.log("Dữ liệu lỗi trả về:", data || "Không có dữ liệu");
        return resolve();
      }
    });
  });
}
