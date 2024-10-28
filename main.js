var lang = require("./lang.js");

function supportLanguages() {
  return lang.allLanguages;
}

function translate(query, completion) {
  let reqText = query.text.trim().replace(/\n\n/g, "\n");
  var api_url = $option.api_url;
  var default_tag = $option.default_tag;
  if (default_tag) {
    reqText = "#" + default_tag + "\n" + reqText;
  }
  $http.request({
    method: "POST",
    url: api_url,
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
}
