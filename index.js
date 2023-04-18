require("dotenv").config();

const logger = require('./utils/logger')

const database = require("./config/database");

database
  .authenticate()
  .then(() => {
    logger.info("Database-connection has been established successfully.");
  })
  .catch((error) => {
    logger.info("Unable to connect to the database: ", error);
  });

const webSocketService = require("./services/web_socket.service");

webSocketService.init(); 