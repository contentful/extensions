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
    hostname: `${process.env.MKTO_MUNCHKIN_ID}.mktorest.com`,
    path: `/identity/oauth/token?grant_type=client_credentials&client_id=${
      process.env.MKTO_CLIENT_ID
    }&client_secret=${process.env.MKTO_CLIENT_SECRET}`
  })
    .then(res => res.access_token)
    .then(bearer =>
      request({
        method: "GET",
        hostname: `${process.env.MKTO_MUNCHKIN_ID}.mktorest.com`,
        path: `/rest/asset/v1/forms.json`,
        headers: {
          Authorization: `Bearer ${bearer}`
        }
      })
        .then(res =>
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(res.result)
          })
        )
        .catch(err => {
          console.log(err);
          callback(err);
        })
    )
    .catch(err => {
      callback(err);
    });
};
