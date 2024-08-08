/*
Tác giả script: DecoAri
Tác giả sửa lỗi: GGcover
Tham khảo: https://raw.githubusercontent.com/nhutggvn/Config-VPN/main/js/Auto_join_TF.js
Cảm ơn người đã thích ứng script này thành phiên bản Loon!
*/

!(async () => {
  let ids = $persistentStore.read("APP_ID");
  if (ids == null) {
    $notification.post(
      "APP_ID TestFlight chưa được thêm",
      "Vui lòng thêm thủ công hoặc sử dụng liên kết TestFlight để tự động lấy.",
      ""
    );
  } else if (ids === "") {
    $notification.post(
      "Tất cả các ứng dụng TestFlight đã tham gia",
      "Vui lòng tắt plugin này thủ công.",
      ""
    );
  } else {
    ids = ids.split(",");
    for (const ID of ids) {
      await autoPost(ID);
    }
  }
  $done();
})();

function autoPost(ID) {
  const Key = $persistentStore.read("key");
  const testurl = `https://testflight.apple.com/v3/accounts/${Key}/ru/`;
  const header = {
    "X-Session-Id": $persistentStore.read("session_id"),
    "X-Session-Digest": $persistentStore.read("session_digest"),
    "X-Request-Id": $persistentStore.read("request_id"),
    "User-Agent": $persistentStore.read("tf_ua"),
  };

  return new Promise(function (resolve) {
    $httpClient.get(
      { url: `${testurl}${ID}`, headers: header },
      function (error, resp, data) {
        if (error) {
          if (error === "The request timed out.") {
            $notification.post("Lỗi yêu cầu", "Yêu cầu đã hết thời gian chờ.", "");
          } else {
            $notification.post("Lỗi yêu cầu", error, "");
          }
          console.log(`Lỗi khi thực hiện GET: ${error}`);
          resolve();
          return;
        }

        if (resp.status === 404) {
          let ids = $persistentStore.read("APP_ID").split(",");
          ids = ids.filter((id) => id !== ID);
          $persistentStore.write(ids.toString(), "APP_ID");
          console.log(`${ID} không tồn tại trên TestFlight, APP_ID đã được tự động xóa.`);
          $notification.post(ID, "Không tìm thấy TestFlight", "APP_ID đã được tự động xóa.");
          resolve();
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          if (jsonData.data == null) {
            console.log(`${ID} ${jsonData.messages[0].message}`);
            resolve();
            return;
          }

          if (jsonData.data.status === "FULL") {
            console.log(`${jsonData.data.app.name} ${ID} ${jsonData.data.message}`);
            resolve();
            return;
          }

          $httpClient.post(
            { url: `${testurl}${ID}/accept`, headers: header },
            function (error, resp, body) {
              if (error) {
                $notification.post("Lỗi khi tham gia", error, "");
                console.log(`Lỗi khi thực hiện POST: ${error}`);
                resolve();
                return;
              }

              try {
                const jsonBody = JSON.parse(body);
                $notification.post(
                  jsonBody.data.name,
                  "Tham gia TestFlight thành công",
                  ""
                );
                console.log(`${jsonBody.data.name} đã tham gia TestFlight thành công.`);
                let ids = $persistentStore.read("APP_ID").split(",");
                ids = ids.filter((id) => id !== ID);
                $persistentStore.write(ids.toString(), "APP_ID");
              } catch (e) {
                console.log(`Lỗi khi xử lý phản hồi tham gia: ${e.message}`);
              }

              resolve();
            }
          );
        } catch (e) {
          console.log(`Lỗi khi xử lý phản hồi GET: ${e.message}`);
          resolve();
        }
      }
    );
  });
}
