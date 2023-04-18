const WebSocket = require("ws");
const fs = require("fs");
const moment = require("moment");
const constants = require("../utils/constants");
const fileIOService = require("./fileIO");

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

function init() {
  const markPriceWS = webSocketFactory({
    path: constants.MARK_PRICE,
    onMessage: function (data) {
      let currentDate = moment().format("DD_MM_YYYY");
      let folderPath = fileIOService.checkDirExists(constants.PRICE_PATH + "/" + currentDate);
      console.log(data.toString());
      let object = JSON.parse(data.toString());
      //   console.log(object);
      for (let i = 0; i < object?.length; i++) {
        fs.appendFile(`${folderPath}/${object[i].s}`, JSON.stringify(object[i]) + "\r\n", (err) => {
          if (err) {
            console.error(err);
          }
          // file written successfully
          console.log("wrote to file");
        });
      }
    },
  });
}

module.exports = {
  init: init,
};
