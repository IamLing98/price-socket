const configs = require("../utils/config.utils");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  configs.database.databaseName,
  configs.database.username,
  configs.database.password,
  {
    host: configs.database.host,
    dialect: "mysql",
  },
);

module.exports = sequelize;
