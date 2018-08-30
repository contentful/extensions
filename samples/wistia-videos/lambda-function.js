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

exports.handler = function(event, context, callback) {
  request({
    method: "GET",
    hostname: `api.wistia.com`,
    path: `/v1/medias.json?api_password=${process.env.WISTIA_API_KEY}`
  })
    .then(res => callback(res))
    .catch(err => {
      callback(err);
    });
};
