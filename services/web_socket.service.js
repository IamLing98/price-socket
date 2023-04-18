const WebSocket = require("ws");
const fs = require("fs");
const logger = require("../utils/logger");
const constants = require("../utils/constants");

const apiService = require("./rest.service");

const MarkPrice = require("../models/mark_price.model");
const configs = require("../utils/config.utils");

function convertTickerPriceToSQLRow(tickerPrice) {
  let row = {
    event_type: tickerPrice["e"],
    event_time: tickerPrice["E"],
    symbol: tickerPrice["s"],
    mark_price: tickerPrice["p"],
    index_price: tickerPrice["i"],
    estimated_settle_price: tickerPrice["P"],
    funding_rate: tickerPrice["r"],
    next_funding_time: tickerPrice["T"],
  };
  return row;
}

const webSocketFactory = ({ path, onMessage }) => {
  logger.info(`Creating new web socket from path: ${path}`);
  const ws = new WebSocket(path);
  ws.on("message", function (data) {
    onMessage(data);
  });
  ws.on("ping", (e) => {
    logger.info(`On ping to ${path}`);
    ws.pong(); //send pong frame
  });
  ws.on("error", (error) => {
    logger.error(error);
  });
  return ws;
};

async function init() {
  // contract mark price ws
  const markPriceWS = webSocketFactory({
    path: constants.websocket.MARK_PRICE,
    onMessage: async function (data) {
      let markPrice = JSON.parse(data);
      for (let i = 0; i < markPrice?.length; i++) {
        let tickerPrice = markPrice[i];
        let row = convertTickerPriceToSQLRow(tickerPrice);
        await MarkPrice.create(row)
          .then((res) => {
            logger.debug(`Saved row`);
          })
          .catch((error) => {
            logger.error(`Failed to create a new record : ${error}`);
          });
      }
    },
  });

  // contract info
  const contractInfoWs = webSocketFactory({
    path: constants.websocket.CONTRACT_INFO,
    onMessage: async function (data) {
      logger.info(data);
      let markPrice = JSON.parse(data);
      for (let i = 0; i < markPrice?.length; i++) {
        let tickerPrice = markPrice[i];
        let row = convertTickerPriceToSQLRow(tickerPrice);
        // await MarkPrice.create(row)
        //   .then((res) => {
        //     logger.debug(`Saved row`);
        //   })
        //   .catch((error) => {
        //     logger.error(`Failed to create a new record : ${error}`);
        //   });
      }
    },
  });

  // apiService
  let listenKey = await apiService.getListenKey({ apiKey: configs.api.KEY });
  // contract info
  const balanceApi = webSocketFactory({
    path: "wss://fstream-auth.binance.com/ws?stream=!contractInfo&listenKey=" + listenKey,
    onMessage: async function (data) {
      logger.info(data);
      let markPrice = JSON.parse(data);
    },
  });
  // setInterval(async () => {
  //   await apiService.getAccountInfoStart();
  // }, 500);
}

module.exports = {
  init: init,
};
