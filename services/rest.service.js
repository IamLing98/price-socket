const constants = require("../utils/constants");

const logger = require("../utils/logger");

const axios = require("axios");

const sha256 = require("sha256");
const crypto = require("crypto");
const configs = require("../utils/config.utils");

function getSignature(apiSecret, timestamp) {
  logger.info(`Starting get signature ${apiSecret}, ${timestamp}`);
  let signature = crypto.createHmac("sha256", apiSecret).update(`timestamp=${timestamp}`).digest("hex");
  return signature;
}

async function getListenKey({ apiKey }) {
  console.log(`apiKey`, apiKey);
  let path = constants.api.BASE_URL + constants.api.LISTEN_KEY;
  let data = await axios
    .post(
      path,
      {},
      {
        headers: {
          "X-MBX-APIKEY": apiKey,
          "-m": "3",
        },
      },
    )
    .then(async (response) => {
      let listenKey = response?.data.listenKey;
      return listenKey;
    })
    .catch((error) => {
      logger.error(error);
    });
  return data;
}

async function getTimestamp(apiKey) {
  logger.info(`Starting get timestamp....`);
  let path = constants.api.TIMESTAMP;
  let data = await axios
    .get(path, {
      headers: {
        "X-MBX-APIKEY": apiKey,
        "-m": "3",
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
      let data = { ...response.data };
      let serverTime = data.serverTime;
      return serverTime;
    })
    .catch((error) => {
      logger.error(error);
    });
  return data;
}

async function getAccountInfo(timestamp, signature) {
  let path = constants.api.ACCOUNT_INFO + `?timestamp=${timestamp}&signature=${signature}`;
  let data = await axios
    .get(path, {
      headers: {
        "X-MBX-APIKEY": configs.api.KEY,
        "-m": "3",
        "Content-Type": "application/json",
      },
    })
    .then(async (response) => {
      console.log(`Reponse: `, response.data);
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    });
  return data;
}

async function getAccountInfoStart() {
  let serverTime = await getTimestamp(configs.api.KEY);
  logger.info(`serverTime ${serverTime}`);
  let signature = getSignature(configs.api.SECRET, serverTime);
  logger.info(`signature: ${signature}`);
  getAccountInfo(serverTime, signature);
}

module.exports = {
  getListenKey: getListenKey,
  getAccountInfoStart: getAccountInfoStart,
};
