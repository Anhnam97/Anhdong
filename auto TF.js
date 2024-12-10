/*
Tác giả script: DecoAri
Tác giả sửa chữa: xream
Địa chỉ tham khảo: https://raw.githubusercontent.com/DecoAri/JavaScript/main/Surge/Auto_join_TF.js
Cảm ơn một đại ca nào đó đã chuyển đổi thành script phiên bản Loon!
*/
!(async () => {
  ids = $persistentStore.read("APP_ID");
  if (ids == null) {
    $notification.post(
      "Chưa thêm TestFlight APP_ID",
      "Vui lòng thêm thủ công hoặc sử dụng liên kết TestFlight để tự động lấy",
      ""
    );
  } else if (ids == "") {
    $notification.post("Tất cả TestFlight đã được tham gia", "Vui lòng tắt plugin này thủ công", "");
  } else {
    ids = ids.split(",");
    for await (const ID of ids) {
      await autoPost(ID);
    }
  }
  $done();
})();

function autoPost(ID) {
  let Key = $persistentStore.read("key");
  let testurl = "https://testflight.apple.com/v3/accounts/" + Key + "/ru/";
  let header = {
    "X-Session-Id": `${$persistentStore.read("session_id")}`,
    "X-Session-Digest": `${$persistentStore.read("session_digest")}`,
    "X-Request-Id": `${$persistentStore.read("request_id")}`,
    "User-Agent": `${$persistentStore.read("tf_ua")}`,
  };
  return new Promise(function (resolve) {
    $httpClient.get(
      { url: testurl + ID, headers: header },
      function (error, resp, data) {
        if (error == null) {
          console.log("Nhận được phản hồi từ TestFlight cho ID:", ID);
          if (data.startsWith("<")) {
            console.error("Phản hồi là HTML, không phải JSON:", data);
            resolve();
            return;
          }
          let jsonData;
          try {
            jsonData = JSON.parse(data);
          } catch (e) {
            console.error("Lỗi phân tích JSON:", e);
            console.error("Dữ liệu trả về:", data);
            resolve();
            return;
          }
          if (resp.status == 404) {
            ids = $persistentStore.read("APP_ID").split(",");
            ids = ids.filter((ids) => ids !== ID);
            $persistentStore.write(ids.toString(), "APP_ID");
            console.log(ID + " Không tồn tại TestFlight này, đã tự động xóa APP_ID");
            $notification.post(
              ID,
              "Không tồn tại TestFlight này",
              "Đã tự động xóa APP_ID"
            );
          } else if (jsonData.data == null) {
            console.log(ID + " " + jsonData.messages[0].message);
          } else if (jsonData.data.status == "FULL") {
            console.log(
              jsonData.data.app.name + " " + ID + " " + jsonData.data.message
            );
          } else {
            $httpClient.post(
              { url: testurl + ID + "/accept", headers: header },
              function (error, resp, body) {
                let jsonBody;
                try {
                  jsonBody = JSON.parse(body);
                } catch (e) {
                  console.error("Lỗi phân tích JSON:", e);
                  console.error("Dữ liệu trả về:", body);
                  resolve();
                  return;
                }
                $notification.post(
                  jsonBody.data.name,
                  "Tham gia TestFlight thành công",
                  ""
                );
                console.log(jsonBody.data.name + " Tham gia TestFlight thành công");
                ids = $persistentStore.read("APP_ID").split(",");
                ids = ids.filter((ids) => ids !== ID);
                $persistentStore.write(ids.toString(), "APP_ID");
                resolve();
              }
            );
          }
        } else {
          if (error == "The request timed out.") {
            resolve();
          } else {
            $notification.post("Tự động tham gia TestFlight", error, "");
            console.log(ID + " " + error);
            resolve();
          }
        }
      }
    );
  });
}
