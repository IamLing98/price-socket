const constants = {
  MARK_PRICE: "wss://fstream.binance.com/ws/!markPrice@arr",
  PRICE_PATH: "/home/linhdv/Documents/prices",
  kafka: {
    HOSTS: ["172.16.147.212:9092"],
    topics: {
      MARK_PRICE: "mark_price",
    },
  },
};

module.exports = constants;
