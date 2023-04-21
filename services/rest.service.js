const axios = require("axios");
const sha256 = require("sha256");
const crypto = require("crypto");

const constants = require("../utils/constants");

const logger = require("../utils/logger");

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
      logger.info(`Get account info at ${timestamp} done`);
      return response.data;
    })
    .catch((error) => {
      logger.error(`Get account info at ${timestamp} failed`);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
  return data;
}

async function getAccountInfoStart() {
  let serverTime = await getTimestamp(configs.api.KEY); 
  let signature = getSignature(configs.api.SECRET, serverTime); 
  let accountInfo = await getAccountInfo(serverTime, signature);
  return accountInfo;
}

module.exports = {
  getListenKey: getListenKey,
  getAccountInfoStart: getAccountInfoStart,
};
