
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

module.exports = {
    checkDirExists:checkDirExists
}