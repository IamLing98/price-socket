const WebSocket = require("ws");
const fs = require("fs"); 
const logger = require("../utils/logger");
const constants = require("../utils/constants"); 

const MarkPrice = require("../models/markPrice");

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
  const ws = new WebSocket(path);
  ws.on("message", function (data) {
    onMessage(data);
  });
  ws.on("ping", (e) => {
    console.log("On ping");
    ws.pong(); //send pong frame
  });
  return ws;
};

async function init() {
  const markPriceWS = webSocketFactory({
    path: constants.MARK_PRICE,
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
}

module.exports = {
  init: init,
};
