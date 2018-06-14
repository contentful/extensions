require("dotenv").config();
const axios = require("axios");

exports.handler = function(event, context, callback) {
  const baseUrl = `https://${process.env.MKTO_MUNCHKIN_ID}.mktorest.com`;
  const options = {
    identity: {
      url: "/identity/oauth/token",
      baseURL: baseUrl,
      params: {
        grant_type: "client_credentials",
        client_id: process.env.MKTO_CLIENT_ID,
        client_secret: process.env.MKTO_CLIENT_SECRET
      }
    },
    rest: {
      url: "/rest/asset/v1/forms.json",
      baseURL: baseUrl
    }
  };

  axios(options.identity)
    .then(response => response.data.access_token)
    .then(bearer =>
      axios({
        ...options.rest,
        headers: {
          Authorization: `Bearer ${bearer}`
        }
      })
    )
    .then(response =>
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(response.data.result)
      })
    )
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
