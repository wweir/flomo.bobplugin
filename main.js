var lang = require("./lang.js");

function supportLanguages() {
  return lang.allLanguages;
}

function translate(query, completion) {
  let reqText = query.text.trim().replace(/\n\n/g, "\n");

  let default_tag = $option.default_tag;
  if (default_tag) {
    reqText = "#" + default_tag + "\n" + reqText;
  }

  switch ($option.memo_type) {
    case "flomo":
      $http.request({
        method: "POST",
        url: $option.flomo_api_url,
        header: {
          Accept: "application/json, text/plain, */*",
        },
        body: {
          content: reqText,
        },
        handler: function (res) {
          completion({
            result: {
              toDict: {
                word: res.data.message,
                parts: [
                  {
                    means: [reqText],
                  },
                ],
              },
            },
          });
        },
      });
      return;

    case "memos":
      $http.request({
        method: "POST",
        url: $option.memos_api_url + "/api/v1/memos",
        header: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Cookie: $option.memos_cookie,
        },
        body: {
          content: reqText,
          visibility: "PRIVATE",
        },
        handler: function (res) {
          completion({
            result: {
              toDict: {
                word: res.data.message,
                parts: [
                  {
                    means: [$option.memos_api_url + "/m/" + res.data.uid],
                  },
                ],
              },
            },
          });
        },
      });
      return;
    default:
      break;
  }
}
