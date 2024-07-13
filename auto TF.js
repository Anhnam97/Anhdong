/*
Script Author: DecoAri
Fix Author: GGcover
Reference: https://raw.githubusercontent.com/nhutggvn/Config-VPN/main/js/Auto_join_TF.js
Thanks to a great person for adapting this script into Loon version!
*/
!(async () => {
  let ids = $persistentStore.read("APP_ID");
  if (ids == null) {
    $notification.post(
      "TestFlight APP_ID Not Added",
      "Please manually add or use TestFlight link to auto-fetch.",
      ""
    );
  } else if (ids == "") {
    $notification.post(
      "All TestFlight Apps Joined",
      "Please disable this plugin manually.",
      ""
    );
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
          if (resp.status == 404) {
            let ids = $persistentStore.read("APP_ID").split(",");
            ids = ids.filter((ids) => ids !== ID);
            $persistentStore.write(ids.toString(), "APP_ID");
            console.log(
              ID +
                " " +
                "TestFlight does not exist, the APP_ID has been automatically removed."
            );
            $notification.post(
              ID,
              "TestFlight Not Found",
              "The APP_ID has been automatically removed."
            );
            resolve();
          } else {
            let jsonData = JSON.parse(data);
            if (jsonData.data == null) {
              console.log(ID + " " + jsonData.messages[0].message);
              resolve();
            } else if (jsonData.data.status == "FULL") {
              console.log(
                jsonData.data.app.name + " " + ID + " " + jsonData.data.message
              );
              resolve();
            } else {
              $httpClient.post(
                { url: testurl + ID + "/accept", headers: header },
                function (error, resp, body) {
                  let jsonBody = JSON.parse(body);
                  $notification.post(
                    jsonBody.data.name,
                    "TestFlight Joined Successfully",
                    ""
                  );
                  console.log(
                    jsonBody.data.name + " TestFlight Joined Successfully"
                  );
                  let ids = $persistentStore.read("APP_ID").split(",");
                  ids = ids.filter((ids) => ids !== ID);
                  $persistentStore.write(ids.toString(), "APP_ID");
                  resolve();
                }
              );
            }
          }
        } else {
          if (error == "The request timed out.") {
            resolve();
          } else {
            $notification.post("Auto Join TestFlight", error, "");
            console.log(ID + " " + error);
            resolve();
          }
        }
      }
    );
  });
}
