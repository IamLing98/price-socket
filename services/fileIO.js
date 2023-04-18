const fs = require("fs");

function checkDirExists(folderPath) {
  if (fs.existsSync(folderPath)) {
    // Do something
    return folderPath;
  } else {
    fs.mkdirSync(folderPath);
    return folderPath;
  }
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

module.exports = {
  checkDirExists: checkDirExists,
  writeMarkPriceToFile: writeMarkPriceToFile,
};
