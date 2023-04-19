const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const AccountInfo = sequelize.define("account_infos", {
  feeTier: {
    type: DataTypes.BIGINT,
  },
  canTrade: {
    type: DataTypes.BOOLEAN,
  },
  canDeposit: {
    type: DataTypes.BOOLEAN,
  },
  canWithdraw: {
    type: DataTypes.BOOLEAN,
  },
  updateTime: {
    type: DataTypes.BIGINT,
  },
  multiAssetsMargin: {
    type: DataTypes.BOOLEAN,
  },
  totalInitialMargin: {
    type: DataTypes.STRING,
  },
  totalMaintMargin: {
    type: DataTypes.STRING,
  },
  totalWalletBalance: {
    type: DataTypes.STRING,
  },
  totalUnrealizedProfit: {
    type: DataTypes.STRING,
  },
  totalMarginBalance: {
    type: DataTypes.STRING,
  },
  totalPositionInitialMargin: {
    type: DataTypes.STRING,
  },
  totalOpenOrderInitialMargin: {
    type: DataTypes.STRING,
  },
  totalCrossWalletBalance: {
    type: DataTypes.STRING,
  },
  totalCrossUnPnl: {
    type: DataTypes.STRING,
  },
  availableBalance: {
    type: DataTypes.STRING,
  },
  maxWithdrawAmount: {
    type: DataTypes.STRING,
  },
  assets: {
    type: DataTypes.JSON,
  },
  positions: {
    type: DataTypes.JSON,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("AccountInfo table created successfully!");
  })
  .catch((error) => {
    console.error("AccountInfo to create table : ", error);
  });

module.exports = AccountInfo;
