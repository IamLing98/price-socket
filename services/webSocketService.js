const WebSocket = require("ws");
const fs = require("fs");
const moment = require("moment");
const logger = require("../utils/logger");
const constants = require("../utils/constants");
const fileIOService = require("./fileIO");

const MarkPrice = require("../models/markPrice");

const kafkaService = require("./kafkaService");

function convertTickerPriceToKSQLRow(tickerPrice) {
  let row = {
    _id: tickerPrice.e + tickerPrice.s,
    event: tickerPrice.e,
    epoch_time: tickerPrice.E,
    symbol: tickerPrice.symbol,
    price: tickerPrice.p,
    nearest_price: tickerPrice.P,
    time: tickerPrice.T,
    i: tickerPrice.i,
    r: tickerPrice.r,
  };
  return JSON.stringify(row);
}

function writeMarkPriceToFile(data) {
  let currentDate = moment().format("DD_MM_YYYY");
  let folderPath = fileIOService.checkDirExists(constants.PRICE_PATH + "/" + currentDate);
  // logger.info(data.toString());
  let object = JSON.parse(data.toString());
  //   console.log(object);
  for (let i = 0; i < object?.length; i++) {
    fs.appendFile(`${folderPath}/${object[i].s}`, JSON.stringify(object[i]) + "\r\n", (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
      // logger.info("wrote to file");
    });
  }
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
  const producer = kafkaService.getProducer({
    cliendId: "mark-price-producers",
    brokers: constants.kafka.HOSTS,
  });

  await producer.connect();
  const markPriceWS = webSocketFactory({
    path: constants.MARK_PRICE,
    onMessage: async function (data) {
      let markPrice = JSON.parse(data);
      for (let i = 0; i < markPrice?.length; i++) {
        let tickerPrice = markPrice[i];
        await MarkPrice.create({
          event_type: tickerPrice["e"],
          event_time: tickerPrice["E"],
          symbol: tickerPrice["s"],
          mark_price: tickerPrice["p"],
          index_price: tickerPrice["i"],
          estimated_settle_price: tickerPrice["P"],
          funding_rate: tickerPrice["r"],
          next_funding_time: tickerPrice["T"],
        })
          .then((res) => {
            console.log(`saved`)
            // console.log(res);
          })
          .catch((error) => {
            console.error("Failed to create a new record : ", error);
          });
        // await producer.send({
        //   topic: constants.kafka.topics.MARK_PRICE,
        //   messages: [
        //     {
        //       value: convertTickerPriceToKSQLRow(tickerPrice),
        //       key: new Date().getTime() + "mark_price" + tickerPrice?.s,
        //     },
        //   ],
        // });
        // if (markPrice[i]?.s === "BTCUSDT") {
        //   console.log(markPrice[i]);
        // }
      }
      // writeMarkPriceToFile(data);
    },
  });
}

module.exports = {
  init: init,
};
