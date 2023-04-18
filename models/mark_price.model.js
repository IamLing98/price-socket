const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const MarkPrice = sequelize.define("markPrices", {
  event_type: {
    type: DataTypes.STRING,
  },
  event_time: {
    type: DataTypes.STRING,
  },
  symbol: {
    type: DataTypes.STRING,
  },
  mark_price: {
    type: DataTypes.STRING,
  },
  index_price: {
    type: DataTypes.STRING,
  },
  estimated_settle_price: {
    type: DataTypes.STRING,
  },
  funding_rate: {
    type: DataTypes.STRING,
  },
  next_funding_time: {
    type: DataTypes.STRING,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("MarkPrice table created successfully!");
  })
  .catch((error) => {
    console.error("MarkPrice to create table : ", error);
  });

module.exports = MarkPrice;
