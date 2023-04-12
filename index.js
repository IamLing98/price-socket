const WebSocket = require("ws");
const fs = require("fs");
const moment = require("moment");

const pricesPath = "/home/linhdv/Documents/prices";

const ws = new WebSocket("wss://fstream.binance.com/ws/!markPrice@arr");

function checkDirExists(path) {
    let folderPath = pricesPath + "/" + path
  if (fs.existsSync(folderPath)) {
    // Do something
    return folderPath;
  } else {
    fs.mkdirSync(folderPath);
    return folderPath;
  }
}

ws.on("message", function incoming(data) {
  let currentDate = moment().format("DD_MM_YYYY");
  let folderPath = checkDirExists(currentDate)
  // console.log(data.toString());
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
});

ws.on("ping", (e) => {
  console.log("On ping");
  ws.pong(); //send pong frame
});
