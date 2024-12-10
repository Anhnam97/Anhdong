/*
Tác giả script: DecoAri
Tác giả sửa chữa: xream
Địa chỉ tham khảo: https://raw.githubusercontent.com/DecoAri/JavaScript/main/Surge/Auto_join_TF.js
Cảm ơn một đại ca nào đó đã chuyển đổi thành script phiên bản Loon!
*/
!(async () => {
  console.log("Bắt đầu script...");
  ids = $persistentStore.read("APP_ID");
  if (ids == null) {
    console.log("Không tìm thấy APP_ID");
    $notification.post(
      "Chưa thêm TestFlight APP_ID",
      "Vui lòng thêm thủ công hoặc sử dụng liên kết TestFlight để tự động lấy",
      ""
    );
  } else if (ids == "") {
    console.log("Tất cả TestFlight đã được tham gia");
    $notification.post("Tất cả TestFlight đã được tham gia", "Vui lòng tắt plugin này thủ công", "");
  } else {
    ids = ids.split(",");
    console.log("Danh sách APP_ID ban đầu:", ids);
    for await (const ID of ids) {
      if (ID) {
        console.log("Đang xử lý ID:", ID); // Thông báo ID hiện tại
        await autoPost(ID);
      }
    }
  }
  console.log("Kết thúc script...");
  $done();
})();

function sendMessageToTelegram(message) {
  return new Promise((resolve, reject) => {
    console.log("Gửi tin nhắn Telegram:", message);
    const chat_id = "-1002071368028";
    const telegrambot_token = "6675183376:AAFIHE7oDIHTb1vtOsZMLunu9oEcD0DwPTM";
    const url = `https://api.telegram.org/bot${telegrambot_token}/sendMessage`;
    const body = {
      chat_id: chat_id,
      text: message,
      entities: [{ type: "pre", offset: 0, length: message.length }],
    };
    const options = {
      url: url,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    };

    $httpClient.post(options)
      .then((response) => {
        if (response.statusCode == 200) {
          resolve(response);
        } else {
          reject(new Error(`Yêu cầu API Telegram thất bại với mã trạng thái ${response.statusCode}`));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function autoPost(ID) {
  console.log("Bắt đầu autoPost với ID:", ID);
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
          console.log("Dữ liệu phản hồi:", data);
          if (resp.status == 404) {
            ids = $persistentStore.read("APP_ID").split(",");
            ids = ids.filter((ids) => ids !== ID);
            $persistentStore.write(ids.toString(), "APP_ID");
            console.log("Cập nhật danh sách APP_ID sau khi xóa:", ids); // In ra danh sách APP_ID sau khi cập nhật
            console.log(ID + " Không tồn tại TestFlight này, đã tự động xóa APP_ID");
            $notification.post(
              ID,
              "Không tồn tại TestFlight này",
              "Đã tự động xóa APP_ID"
            );
            resolve();
          } else {
            try {
              let jsonData = JSON.parse(data);
              if (jsonData.data == null) {
                console.log(ID + " " + jsonData.messages[0].message);
                resolve();
              } else if (jsonData.data.status == "FULL") {
                console.log(
                  jsonData.data.app.name + " " + ID + " " + jsonData.data.message
                );
                console.log("TestFlight đã đầy: " + jsonData.data.message);
                $notification.post(
                  jsonData.data.app.name,
                  "TestFlight đầy",
                  jsonData.data.message
                );
                console.log(`ID ${ID} đầy`);
                resolve();
              } else {
                $httpClient.post(
                  { url: testurl + ID + "/accept", headers: header },
                  function (error, resp, body) {
                    let jsonBody = JSON.parse(body);
                    $notification.post(
                      jsonBody.data.name,
                      "Tham gia TestFlight thành công",
                      ""
                    );
                    console.log(jsonBody.data.name + " Tham gia TestFlight thành công");
                    ids = $persistentStore.read("APP_ID").split(",");
                    ids = ids.filter((ids) => ids !== ID);
                    $persistentStore.write(ids.toString(), "APP_ID");
                    console.log("Cập nhật danh sách APP_ID sau khi tham gia:", ids); // In ra danh sách APP_ID sau khi cập nhật
                    sendMessageToTelegram(`${jsonBody.data.name} đã tham gia thành công`);
                    console.log(`ID ${ID} đã hoàn thành`);
                    resolve();
                  }
                );
              }
            } catch (e) {
              console.error("Lỗi phân tích JSON:", e);
              console.error("Dữ liệu trả về:", data);
              resolve();
            }
          }
        } else {
          if (error == "The request timed out.") {
            console.log(`Yêu cầu đã hết thời gian cho ID: ${ID}`);
            resolve();
          } else {
            $notification.post("Tự động tham gia TestFlight", error, "");
            console.log("Lỗi cho ID:", ID, error);
            resolve();
          }
        }
      }
    );
  });
}
