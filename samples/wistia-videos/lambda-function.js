const https = require("https");

const request = ({ method, hostname, path, headers }) =>
  new Promise((resolve, reject) => {
    https
      .request({ method, hostname, path, headers }, response => {
        let data = "";
        response.on("data", chunk => (data += chunk));
        response.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", err => reject(err))
      .end();
  });

const cleanup = res =>
  res.map(video => {
    [
      "embedCode",
      "progress",
      "status",
      "assets",
      "type",
      "created",
      "updated"
    ].forEach(e => delete video[e]);

    return {
      ...video,
      thumbnail: video.thumbnail.url.replace(/\?image_crop_resized.*/, "")
    };
  });

exports.handler = function(event, context, callback) {
  request({
    method: "GET",
    hostname: `api.wistia.com`,
    path: `/v1/medias.json?api_password=${process.env.WISTIA_API_KEY}`
  })
    .then(cleanup)
    .then(res =>
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(res)
      })
    )
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
